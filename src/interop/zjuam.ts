import { modPow } from 'bigint-mod-arith'
import { getRawUrl, nxFetch } from './fetch'
import { requestCredential } from './credential'
import { z } from 'zod'

/**将字符串用utf-8编码，再将字节序列转为bigint，越靠前的字符处于越高位 */
function encodeAsBigInt(s: string) {
  let res = 0n
  new TextEncoder().encode(s).forEach((byte) => {
    res <<= 8n
    res |= BigInt(byte)
  })
  return res
}

type UpstreamPubKey = {
  /**RSA加密的指数。16进制(不含0x)，一般为"10001" */
  exponent: string
  /**RSA加密的模数。16进制(不含0x) */
  modulus: string
}

/**zjuam入口为https://zjuam.zju.edu.cn/cas/login?service=...的服务 */
type CasParams = { service: string }
/**zjuam入口为https://zjuam.zju.edu.cn/cas/oauth2.0/authorize?client_id=...&redirect_uri=...&response_type=code的服务 */
type Oauth2Params = {
  client_id: string
  redirect_uri: string
  response_type: 'code'
}
/**跟随重定向（记录cookie），其需最后跳转到zjuam地址。
 *
 * 如果最后未跳转到zjuam地址，将视为已登录成功。
 */
type RedirectParams = { follow: string }
type SupportedParams = CasParams | Oauth2Params | RedirectParams
/**对于不同服务，编码参数，获得入口点 */
function getEntryUrl(params: SupportedParams) {
  if ('service' in params)
    return `https://zjuam.zju.edu.cn/cas/login?${new URLSearchParams(params)}`
  else if ('client_id' in params)
    //oauth2会被重定向到https://zjuam.zju.edu.cn/cas/login?service=http%3A%2F%2Fzjuam.zju.edu.cn%2Fcas%2Foauth2.0%2FcallbackAuthorize
    return `https://zjuam.zju.edu.cn/cas/oauth2.0/authorize?${new URLSearchParams(params)}`
  else if ('follow' in params) return params.follow

  throw new Error('不支持的zjuam入口参数')
}

/**一个zjuam服务。是对fetch的包装，登录过期后会自动刷新登录
 *
 * 由于原生层会自动保存cookie，登录一旦完成，对应用的所有HTTP请求都有效。
 */
export class ZjuamService {
  public static readonly ctorSchema = (() => {
    const paramsSchema = z.union([
      z.object({ service: z.string() }),
      z.object({
        client_id: z.string(),
        redirect_uri: z.string(),
        response_type: z.literal('code'),
      }),
      z.object({ follow: z.string() }),
    ])
    return z.union([
      z.tuple([paramsSchema]),
      z.tuple([paramsSchema, z.number()]),
      z.tuple([paramsSchema, z.number(), z.boolean()]),
    ])
  })()
  /**
   * 初始化一个服务，设置参数。调用此构造方法不会进行登录。
   *
   * 如果`refreshInSeconds`不为-1，调用`nxFetch`的方法时，若登录已过期或从未登录，则自动调用`login`登录。这可能导致突发的耗时增加。
   * @param params 服务识别参数
   * @param refreshInSeconds 登录成功后，多久后重新登录。若为-1则始终不会自动登录，需自行调用`login`方法
   * @param preserveTicket 如果为true，则不跟随zjuam登录成功的重定向（即包含ticket的重定向），需自行处理ticket
   */
  public constructor(
    public readonly params: SupportedParams,
    public readonly refreshInSeconds = 60 * 30,
    public readonly preserveTicket = false,
  ) {
    const rawNxFetch = nxFetch
    const extendMethods: Record<string, unknown> = {}
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const thisService = this
    for (const [key, rawMethod] of Object.entries(nxFetch))
      extendMethods[key] = async function (...args: unknown[]) {
        await thisService.loginIfExpired()
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        return rawMethod.apply(this, args)
      }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.nxFetch = Object.assign(
      async (...args: Parameters<typeof nxFetch>) => {
        await this.loginIfExpired()
        return await rawNxFetch(...args)
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      extendMethods as any,
    )
  }
  /**上次登录成功时间 */
  protected lastLoginTime?: Date
  /**由ZjuamService修改的nxFetch，所有方法签名和原始nxFetch一致。
   *
   * 每次发送请求前，如果登录过期（根据`refreshInSeconds`）则重新登录。
   */
  public nxFetch: typeof nxFetch

  public async loginIfExpired(): Promise<string | null> {
    if (
      this.refreshInSeconds !== -1 &&
      (!this.lastLoginTime ||
        Date.now() - this.lastLoginTime.valueOf() >=
          this.refreshInSeconds * 1000)
    )
      return await this.login()
    return null
  }

  public static readonly loginUrlRegex = /https?:\/\/zjuam\.zju\.edu\.cn/

  //如果已经在登录流程中，则等待该流程结果而非重新登录，避免cookie冲突。
  /**同一zjuamService内部登录请求，如发生并行，只尝试登录一次 */
  private curLogin?: Promise<string>
  /**全局锁。如果出现并行登录，则等待 */
  private static globalLogin?: Promise<unknown>
  /**立即重新登录。成功返回最终服务重定向结果url（跟随zjuam登录成功的302），失败异步抛出错误。
   *
   * 如果`preserveTicket`为true，则返回包含ticket的url。
   */
  public login(): Promise<string> {
    if (this.curLogin) return this.curLogin //同一ZjuamService，同时只尝试一次登录
    return (ZjuamService.globalLogin = this.curLogin =
      (async () => {
        await ZjuamService.globalLogin
        const entryResp = await nxFetch.get(getEntryUrl(this.params), {
          redirectChecker: (resp) => {
            if (this.preserveTicket)
              // 停在最后包含ticket的重定向前
              return resp.headers.get('location')?.match(/[?&]ticket=/) === null
            else return true
          },
        })
        /**打开登录页面，zjuam重定向得到的最终地址 */
        const postUrl = getRawUrl(entryResp.url)
        if (
          !postUrl.match(ZjuamService.loginUrlRegex) ||
          postUrl.match(/[?&]ticket=/)
        ) {
          console.log('记住登录生效', this)
          this.lastLoginTime = new Date()
          return postUrl
        }

        const respText = await entryResp.text()
        const execution = respText.match(
          /<input type="hidden" name="execution" value="(?<execution>.+)"/,
        )?.groups?.execution
        if (!execution) throw new Error('获取execution失败')

        // 获取用户名密码
        const { username, password } = await requestCredential(this)

        // 获取公钥
        const { exponent, modulus } = (await (
          await nxFetch.get('https://zjuam.zju.edu.cn/cas/v2/getPubKey')
        ).json()) as UpstreamPubKey
        const exponentBigInt = BigInt('0x' + exponent)
        const modulusBigInt = BigInt('0x' + modulus)
        const rawPassword = encodeAsBigInt(password)
        const encPassword = modPow(rawPassword, exponentBigInt, modulusBigInt)
          .toString(16)
          .padStart(128, '0')

        const loginResp = await nxFetch.postUrlEncoded(postUrl, {
          body: new URLSearchParams({
            username,
            password: encPassword,
            _eventId: 'submit',
            execution,
            authcode: '',
            rememberMe: 'false',
          }),
          preserveMethodInRedirects: false, // 登录后若重定向则不再次发送凭据
          redirectChecker: (resp) => {
            if (this.preserveTicket)
              return Boolean(
                resp.headers.get('location')?.match(ZjuamService.loginUrlRegex),
              )
            else return true
          },
        })
        const loginUrl = getRawUrl(loginResp.url)
        if (!loginUrl.match(ZjuamService.loginUrlRegex)) {
          console.log('登录成功', this)
          this.lastLoginTime = new Date()
          return loginUrl
        }

        const errorHtml = await loginResp.text()
        let error = '未知错误'
        const { allowDate } =
          errorHtml.match(/allowLoginTime\s*=\s*'(?<allowDate>.+)'/)?.groups ??
          {}
        if (allowDate) {
          const allowTimestamp = Date.parse(allowDate + '+0800').valueOf() //(上游)时区为UTC+8
          const waitSeconds = Math.ceil((allowTimestamp - Date.now()) / 1000)
          error = `失败次数太多，请在 ${waitSeconds}s 重试`
        } else
          error =
            errorHtml.match(/<span id="msg">(?<errMsg>.*)<\/span>/)?.groups
              ?.errMsg ?? error
        console.error('登录失败', this, error, loginUrl)
        throw new Error('登录失败: ' + error)
      })().then((v) => {
        this.curLogin = undefined
        return v
      }))
  }
}

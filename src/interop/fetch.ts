import { CapacitorCookies, CapacitorHttp } from '@capacitor/core'
import { appPlatform } from '.'
import { isNode } from './env'
import '../utils/extendHeaders'

let cookieJar: import('tough-cookie').CookieJar | null = null
// node环境不会自动保存cookie，手动跟踪
if (isNode) {
  console.warn('检测到node环境，导入tough-cookie')
  cookieJar = new (await import('tough-cookie')).CookieJar()
}

/**将Headers或URLSearchParams转换为对象字面量。注意：同名header将被覆盖 */
function toLiteral(from: Headers | URLSearchParams) {
  const result: Record<string, string> = {}
  for (const [k, v] of from.entries()) result[k] = v
  return result
}

interface NxFetchInit {
  method?: 'GET' | 'POST'
  headers?: Record<string, string>
  /**对于JSON，请传string并自行设置content-type；
   *
   * 使用FormData将覆盖content-type为multipart/form-data并自动生成boundary；
   *
   * 使用URLSearchParams将覆盖content-type为application/x-www-form-urlencoded。 */
  body?: string | FormData | URLSearchParams
  /**若发生重定向，是否保留请求方法和正文。根据标准除了303外，都应保留；但登录重定向实践中均转为GET */
  preserveMethodInRedirects?: boolean
}
async function nxFetchBase(
  input: string,
  init?: NxFetchInit,
  /**剩余允许的重定向次数。0表示不允许重定向。
   *
   * **此参数仅在capacitor/node上支持**，若超过重定向次数返回最后一次响应，不报错。
   */
  redirectLeft = 10,
): Promise<Response> {
  const {
    method,
    headers: reqHeaders,
    body,
    preserveMethodInRedirects = true,
  } = init ?? {}
  const h = new Headers(reqHeaders)
  //添加默认UA
  h.setDefault(
    'user-agent',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36 Edg/132.0.0.0',
  )
  h.setDefault('accept', '*/*')
  h.setDefault('accept-language', 'zh-CN,zh;q=0.9,en;q=0.8')

  function checkRedirect(resp: Response): Promise<Response> | null {
    if ([301, 302, 303, 307, 308].includes(resp.status) && redirectLeft > 0) {
      redirectLeft--
      const location = resp.headers.get('location')
      if (!location) throw new Error('Redirect without location header')

      if (!preserveMethodInRedirects || resp.status === 303)
        // 转为GET
        return nxFetch(
          location,
          {
            method: 'GET',
            preserveMethodInRedirects,
            headers: toLiteral(h),
          },
          redirectLeft,
        )

      //保留原始请求方法和正文 但移除cookie和authorization
      h.delete('cookie')
      h.delete('authorization')
      return nxFetch(
        location,
        { method, body, preserveMethodInRedirects, headers: toLiteral(h) },
        redirectLeft,
      )
    }
    return null
  }

  if (cookieJar) {
    //node native fetch
    const c = cookieJar.getCookieStringSync(input)
    if (c) h.append('cookie', c)
    const resp = await globalThis.fetch(input, {
      ...init,
      headers: h,
      redirect: 'manual',
    })
    resp.headers
      .getSetCookie()
      .forEach((s) => cookieJar.setCookieSync(s, resp.url))
    const r = checkRedirect(resp)
    if (r) return await r
    return resp
  } else if (appPlatform === 'web') {
    //TODO 用本地开发服务器代理请求
    return await globalThis.fetch(input, init)
  }

  let b: Parameters<(typeof CapacitorHttp)['request']>[0]['data'] = body
  if (body instanceof URLSearchParams) {
    h.set('content-type', 'application/x-www-form-urlencoded')
    b = toLiteral(body)
  } else if (body instanceof FormData) {
    //生成随机分隔符
    const randomArr = new Uint8Array(12)
    crypto.getRandomValues(randomArr)
    const boundary = `----${[...randomArr.values()].map((v) => v.toString(36)).join('')}`
    h.set('content-type', `multipart/form-data;boundary=${boundary}`)

    //capacitor仅支持一种特殊格式的数组
    b = [...body.entries()].map(([key, value]) => {
      if (typeof value === 'string') return { type: 'string', key, value }
      console.error('Unsupported field in FormData', key, value)
      //TODO 支持File (type: 'base64File')
      throw new TypeError('Unsupported field  in FormData')
    })
  } else if (typeof body !== 'string' && body !== undefined)
    throw new TypeError('Unsupported body type')

  const {
    url: respUrl,
    data: respData,
    status,
    headers: respHeaders,
  } = await CapacitorHttp.request({
    url: input,
    method,
    headers: toLiteral(h),
    responseType: 'text',
    data: b,
    dataType: body instanceof FormData ? 'formData' : undefined,
    disableRedirects: true, // 即使设为false也无法自动重定向
  })

  const r = checkRedirect(new Response(null, { headers: respHeaders, status }))
  if (r) return await r //重定向

  let result: Response
  if (typeof respData === 'string')
    result = new Response(respData, { headers: respHeaders, status })
  else if (Reflect.getPrototypeOf(respData) === Object.prototype)
    // json字面量
    result = Response.json(respData, { headers: respHeaders, status })
  else throw new TypeError('Unsupported response data type')

  Reflect.defineProperty(result, 'url', {
    configurable: true,
    enumerable: true,
    value: respUrl,
    writable: false,
  })
  return result
}
const nxFetchExtend = {
  request: CapacitorHttp.request,
  get(url: string, init?: Omit<NxFetchInit, 'method' | 'body'>) {
    return this(url, init)
  },
  postJson(
    url: string,
    init: Omit<NxFetchInit, 'body'> & { body: Record<string, any> },
  ) {
    const { body, headers, ...otherProps } = init
    const h = new Headers(headers)
    /** https://www.iana.org/assignments/media-types/application/json
     *  Note:  No "charset" parameter is defined for this registration.
     *  Adding one really has no effect on compliant recipients. */
    h.set('Content-Type', 'application/json')
    return this(url, {
      method: 'POST',
      headers: toLiteral(h),
      body: JSON.stringify(body),
      ...otherProps,
    })
  },
  /**发送POST请求，Content-Type: application/x-www-form-urlencoded */
  postUrlEncoded(
    url: string,
    init: Omit<NxFetchInit, 'body'> & { body: URLSearchParams },
  ) {
    return this(url, {
      method: 'POST',
      ...init,
    })
  },
  /**发送POST请求，Content-Type: multipart/form-data,boundary=... */
  postFormData(
    url: string,
    init: Omit<NxFetchInit, 'body'> & { body: FormData },
  ) {
    return this(url, {
      method: 'POST',
      ...init,
    })
  },
} as const satisfies ThisType<typeof nxFetchBase>
/**http请求方法集合。有native支持时无视跨域限制。
 *
 * 在所有平台上都会自动记录cookie并按标准附带，无法单独控制。
 */
export const nxFetch: typeof nxFetchBase & typeof nxFetchExtend = Object.assign(
  nxFetchBase,
  nxFetchExtend,
)

export function getRawUrl(interceptedUrl: string) {
  //解析http://192.168.0.100:8100/_capacitor_http_interceptor_?u=https%3A%2F%2Fzjuam.zju.edu.cn%2Fcas%2Flogin%3Fservice%3Dhttp%253A%252F%252Fzdbk.zju.edu.cn%252Fjwglxt%252Fxtgl%252Flogin_ssologin.html
  const url = new URL(interceptedUrl)
  if (url.pathname === '/_capacitor_http_interceptor_')
    return url.searchParams.get('u')!
  return interceptedUrl
}

if (import.meta.env?.DEV) {
  // vite开发环境下，把nxFetch等暴露到全局对象上以便调试
  function getPropertyDescriptor<T>(value: T): PropertyDescriptor {
    return {
      configurable: true,
      enumerable: false,
      value,
    }
  }
  const exposedProperties = {
    nxFetch: getPropertyDescriptor(nxFetch),
    CapacitorCookies: getPropertyDescriptor(CapacitorCookies),
  }
  Object.defineProperties(globalThis, exposedProperties)
  console.warn('DEV mode: properties exposed', exposedProperties)
} else console.log('PROD mode: no properties exposed')

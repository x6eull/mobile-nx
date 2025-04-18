import { CookieJar } from 'tough-cookie'
import { IncomingMessage } from 'http'
import { Plugin } from 'vite'
import { Readable } from 'stream'

async function toBody(req: IncomingMessage): Promise<Buffer> {
  const chunk: Buffer[] = []
  return new Promise((res, rej) => {
    req
      .on('data', (c: Buffer) => chunk.push(c))
      .on('end', () => res(Buffer.concat(chunk)))
      .on('error', (e) => rej(e))
  })
}

export default function devProxy(): Plugin {
  const cookieJar = new CookieJar()
  return {
    name: 'vite-plugin-dev-proxy',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        void (async () => {
          if (req.url?.startsWith('/__vite_dev_proxy__')) {
            const targetUrl = new URL(
              new URL(req.url, 'http://localhost').searchParams.get('url')!,
            )
            console.log('Proxy:', req.method, targetUrl.toString())
            try {
              const proxyResponse = await fetch(targetUrl, {
                method: req.method,
                headers: {
                  ...(req.headers as object),
                  cookie: cookieJar.getCookieStringSync(targetUrl.href),
                },
                redirect: 'manual',
                body: ['POST', 'PUT'].includes(req.method ?? '')
                  ? await toBody(req)
                  : undefined,
              })

              proxyResponse.headers
                .getSetCookie()
                .forEach((cookieStr) =>
                  cookieJar.setCookieSync(cookieStr, targetUrl.href),
                )

              proxyResponse.headers.forEach((v, k) => {
                //TODO 在响应中添加正确的content-length
                if (['content-encoding', 'content-length'].includes(k)) return
                if (k.toLowerCase() === 'location') {
                  res.setHeader(
                    k,
                    new URL(req.url!, 'http://localhost').pathname +
                      '?url=' +
                      encodeURIComponent(v),
                  )
                  return
                }

                res.setHeader(k, v)
              })
              res.writeHead(proxyResponse.status)

              if (proxyResponse.body)
                Readable.fromWeb(
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
                  proxyResponse.body as any,
                ).pipe(res, { end: true })
              else res.end() // 没有响应正文
            } catch (e) {
              console.error('Proxy failed', req.method, targetUrl, e)
            }
          } else next() // 非__vite_dev_proxy__请求
        })()
      })
    },
  }
}

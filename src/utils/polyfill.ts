/**polyfill部分常见的缺失实现。 */
import 'core-js/actual/iterator'

// eslint-disable-next-line @typescript-eslint/unbound-method
Response.json ??= (data, options) => {
  const headers = new Headers(options?.headers)
  headers.set('Content-Type', 'application/json')
  return new Response(JSON.stringify(data), {
    ...options,
    headers,
  })
}

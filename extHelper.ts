/**
 * 供小组件使用的运行时，APP本体不使用此文件。
 */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { WidgetExtensionExposedAPIs } from '@/extension/WidgetExtensionRuntime'
import type { EncodedResponse } from '@/extension/ExtensionRuntime'

function createProxiedObj<T extends object>(
  target: T,
  getFallback: (this: typeof target, target: T, prop: string | symbol) => any,
) {
  return new Proxy(target, {
    get(target, prop) {
      if (prop in target) return target[prop as keyof typeof target]
      if (prop === 'then') return undefined // 防止成为thenable

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return getFallback.call(target, target, prop)
    },
  })
}

function decodeReturn(vToDecode: unknown, extNx: ExtNxType) {
  if (typeof vToDecode !== 'object' || vToDecode === null) return vToDecode
  if ('$borrowedId' in vToDecode) {
    const borrowHandle = vToDecode['$borrowedId'] as number
    const rawHandle = { __borrowedHandleId: borrowHandle }
    return createProxiedObj(rawHandle, (_, prop) =>
      typeof prop === 'string'
        ? (...args: unknown[]) => extNx.applyOnHandle(borrowHandle, prop, args)
        : undefined,
    )
  }
  if ('$response' in vToDecode) {
    const packaged = vToDecode['$response'] as EncodedResponse
    const resp = new Response(packaged.body, {
      headers: packaged.headers,
      status: packaged.status,
    })
    Object.defineProperty(resp, 'url', { value: packaged.url })
    return resp
  }

  return vToDecode
}

const helperVersion = '0.1.0'
const nxObj = { helperVersion } as const
export type ExtNxType = typeof nxObj & WidgetExtensionExposedAPIs
function postParent(data: any) {
  return parent.postMessage(data, '*')
}
let traceId = 0
function newTraceId() {
  return String(++traceId)
}
const traceMap = new Map<
  string,
  { resolve(data: any): void; reject(reason: any): void }
>()

const proxiedNxObj = createProxiedObj(nxObj, (_, prop) =>
  //尝试调用API。如果没有这个API，parent会回传错误
  (...args: unknown[]) => {
    return new Promise((resolve, reject) => {
      const traceId = newTraceId()
      traceMap.set(traceId, { resolve, reject })
      postParent({ traceId, call: prop, args })
    })
  },
) as ExtNxType

self.addEventListener('message', ({ data, source }) => {
  if (!source || source !== parent) return
  const { traceId, return: returnValue, error } = data
  if (typeof traceId !== 'string') return
  if (!traceMap.has(traceId)) throw new Error('traceId not found: ' + traceId)
  const pair = traceMap.get(traceId)!

  if (error !== undefined) pair.reject(error)
  else pair.resolve(decodeReturn(returnValue, proxiedNxObj))

  traceMap.delete(traceId)
})

Reflect.defineProperty(self, 'nx', { value: proxiedNxObj })

export default proxiedNxObj

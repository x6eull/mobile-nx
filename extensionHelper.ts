/**
 * 供小组件使用的运行时，APP本体不使用此文件。
 */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { decodeReturn } from '@/extension/ExtensionIO'
import type { ExtensionAPIs } from '@/extension/ExtensionWidgetCapability'

const version = '0.1.0'
export type ExtNxType = { version: typeof version } & ExtensionAPIs
function postParent(data: any) {
  return parent.postMessage(data, '*')
}
let traceId = 0
function newTraceId() {
  return String(++traceId)
}
const nxObj = { version }
const traceMap = new Map<
  string,
  { resolve(data: any): void; reject(reason: any): void }
>()

const proxyedNxObj = new Proxy(nxObj, {
  get(target, prop) {
    if (prop in target || typeof prop === 'symbol')
      return target[prop as keyof typeof target]
    //尝试调用API。如果没有这个API，parent会回传错误
    return (...args: unknown[]) => {
      return new Promise((resolve, reject) => {
        const traceId = newTraceId()
        traceMap.set(traceId, { resolve, reject })
        postParent({ traceId, call: prop, args })
      })
    }
  },
}) as ExtNxType

self.addEventListener('message', ({ data, source }) => {
  if (!source || source !== parent) return
  const { traceId, return: returnValue, error } = data
  if (typeof traceId !== 'string') return
  if (!traceMap.has(traceId)) throw new Error('traceId not found: ' + traceId)
  const pair = traceMap.get(traceId)!

  if (error !== undefined) pair.reject(error)
  else pair.resolve(decodeReturn(returnValue, proxyedNxObj))

  traceMap.delete(traceId)
})

Reflect.defineProperty(self, 'nx', { value: proxyedNxObj })

export default proxyedNxObj

import type { ExtNxType } from '../../extHelper'
import { BorrowedHandle } from './BorrowManager'

type PackagedResponse = {
  body: string
  headers: HeadersInit
  status: number
  url: string
}
export async function encodeReturn(vToEncode: unknown) {
  if (typeof vToEncode !== 'object' || vToEncode === null) return vToEncode
  if (vToEncode instanceof BorrowedHandle) return { $borrowedId: vToEncode.id }
  if (vToEncode instanceof Response) {
    return {
      $response: {
        body: await vToEncode.text(),
        headers: [...vToEncode.headers],
        status: vToEncode.status,
        url: vToEncode.url,
      } satisfies PackagedResponse,
    }
  }

  return vToEncode
}
export function decodeReturn(vToDecode: unknown, extNx: ExtNxType) {
  if (typeof vToDecode !== 'object' || vToDecode === null) return vToDecode
  if ('$borrowedId' in vToDecode) {
    const borrowHandle = vToDecode['$borrowedId'] as number
    const rawHandle = { __borrowedHandleId: borrowHandle, then: undefined }
    const handle = new Proxy(rawHandle, {
      get(target, prop) {
        if (prop in target || typeof prop === 'symbol')
          return target[prop as keyof typeof target]
        return (...args: unknown[]) =>
          extNx.applyOnHandle(borrowHandle, prop, args)
      },
    })
    return handle
  }
  if ('$response' in vToDecode) {
    const packaged = vToDecode['$response'] as PackagedResponse
    const resp = new Response(packaged.body, {
      headers: packaged.headers,
      status: packaged.status,
    })
    Object.defineProperty(resp, 'url', { value: packaged.url })
    return resp
  }

  return vToDecode
}

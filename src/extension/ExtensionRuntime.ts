import { BorrowedHandle, BorrowManager } from './BorrowManager'
import { Extension } from './Extension'

export type EncodedResponse = {
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
      } satisfies EncodedResponse,
    }
  }

  return vToEncode
}

/**插件运行时基类。 */
export class ExtensionRuntime {
  public constructor(public readonly extension: Extension) {}

  /**@internal */
  public borrowManager = new BorrowManager()
}

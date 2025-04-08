import { z } from 'zod'
import { WidgetExtensionRuntime } from './WidgetExtensionRuntime'
import { ZjuamService } from '../services/ZjuamService'
import { ExtensionRuntime } from './ExtensionRuntime'
import { PromiseAwaited } from '@/utils/func'
import { ResolveHandle } from './BorrowManager'

const apiMetadataKey = Symbol('APIMetadata')
type WithAPIMetadata = { [apiMetadataKey]: APIMetatdata }
type APIMetatdata = { version: string; schema: z.ZodType }

/**标记一个类的方法是暴露的插件API。调用此函数会返回一个stage3装饰器。 */
function exposedAPI<V extends string>(version: V, schema: z.ZodType) {
  return function <
    This,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Value extends (this: This, ...args: any) => unknown,
  >(
    value: Value,
    // context: ClassMethodDecoratorContext<This, Value>,
  ): Value & WithAPIMetadata {
    const checkedFunction = function (...args) {
      const parsedArgs = schema.parse(args) as Parameters<Value>
      return value.apply(this, parsedArgs)
    } as Value
    Object.assign(checkedFunction, { [apiMetadataKey]: { version, schema } })
    return Object.assign(checkedFunction, {
      [apiMetadataKey]: { version, schema },
    })
  }
}
export type ToExposedAPIs<T> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [k in keyof T]: T[k] extends (...args: any) => any
    ? (
        ...args: Parameters<T[k]>
      ) => Promise<ResolveHandle<PromiseAwaited<ReturnType<T[k]>>>>
    : never
}

export class ExtensionAPI {
  constructor(protected runtime: ExtensionRuntime) {}
  /**@internal */
  getExposedAPI(
    key: string,
  ):
    | (((this: typeof this, ...args: unknown[]) => unknown) & WithAPIMetadata)
    | null {
    const value = this[key as keyof this]
    if (typeof value === 'function' && apiMetadataKey in value)
      return value as ((this: this, ...args: unknown[]) => unknown) &
        WithAPIMetadata
    return null
  }

  /**异步返回'pong' */
  @exposedAPI('0.1.0', z.unknown())
  ping() {
    return 'pong' as const
  }

  @exposedAPI('0.1.0', z.tuple([z.string().min(1)]))
  caniuse(identifier: string) {
    const func = this.getExposedAPI(identifier)
    if (!func) return undefined
    const { version } = func[apiMetadataKey]
    return { identifier, version, available: true }
  }

  @exposedAPI('0.1.0', ZjuamService.ctorSchema)
  newZjuamService(...args: ConstructorParameters<typeof ZjuamService>) {
    return this.runtime.borrowManager.borrow(new ZjuamService(...args))
  }

  @exposedAPI(
    '0.1.0',
    z.tuple([z.number(), z.string().optional(), z.array(z.unknown())]),
  )
  applyOnHandle(handleId: number, prop: string, args: unknown[]) {
    const p = prop || null
    return this.runtime.borrowManager.applyOn(handleId, p, undefined, args)
  }
}

export class WidgetExtensionAPI extends ExtensionAPI {
  constructor(protected runtime: WidgetExtensionRuntime) {
    super(runtime)
  }

  @exposedAPI('0.1.0', z.tuple([z.number().min(0).max(500)]))
  setWidgetHeight(height: number) {
    if (!this.runtime.iframeEle) throw new Error('No iframe element found')
    this.runtime.iframeEle.height = height.toString()
  }
}

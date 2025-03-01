/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useEffect, useMemo, useRef } from 'react'
import { WidgetExtension } from './Extension'
import { z } from 'zod'
import { afterDone, PromiseAwaited } from '@/utils/functions'
import { BorrowedHandle, BorrowManager } from './BorrowManager'
import { ZjuamService } from '@/interop/zjuam'
import { encodeReturn } from './ExtensionIO'

type ResolveHandle<H> = H extends BorrowedHandle<infer O> ? O : H
type FuncOnCapability<K extends keyof WidgetExtensionRuntime['exposedAPI']> = (
  ...args: Parameters<WidgetExtensionRuntime['exposedAPI'][K]['f']>
) => Promise<
  ResolveHandle<
    PromiseAwaited<ReturnType<WidgetExtensionRuntime['exposedAPI'][K]['f']>>
  >
>
export type ExtensionAPIs = {
  caniuse: FuncOnCapability<'caniuse'>
  ping: FuncOnCapability<'ping'>
  setWidgetHeight: FuncOnCapability<'setWidgetHeight'>
  newZjuamService: FuncOnCapability<'newZjuamService'>
  applyOnHandle: FuncOnCapability<'applyOnHandle'>
}

/**小组件插件的管理类。允许插件添加一个通过iframe加载的小组件。 */
export class WidgetExtensionRuntime {
  constructor(public readonly extension: WidgetExtension) {}

  /**与此能力实例关联的iframe元素。仅该iframe发送的message会被处理 */
  #iframeEle: HTMLIFrameElement | null = null
  #borrowManager = new BorrowManager()

  static readonly maxWidgetHeight = 500
  static readonly widgetMessageDataBaseSchema = z
    .object({
      traceId: z.string(),
      call: z.string(),
      args: z.array(z.unknown()),
    })
    .passthrough()
  /**向小组件暴露的API方法。如果f返回Promise，将在兑现后将(非Promise)兑现值回传给小组件；否则直接将返回值回传 */
  readonly exposedAPI = {
    caniuse: {
      version: '0.1.0',
      f: (identifier: string) => {
        const descriptor = this.exposedAPI[identifier as never] as any
        if (!descriptor) return undefined
        return { identifier, available: true, version: descriptor.version }
      },
      argsSchema: z.tuple([z.string().min(1)]),
    },
    ping: {
      version: '0.1.0',
      f: () => 'pong',
      argsSchema: z.unknown(),
    },
    setWidgetHeight: {
      version: '0.1.0',
      f: (height: number) => {
        if (!this.#iframeEle) throw new Error('No iframe element found')
        this.#iframeEle.height = height.toString()
      },
      argsSchema: z.tuple([
        z.number().min(0).max(WidgetExtensionRuntime.maxWidgetHeight),
      ]),
    },
    newZjuamService: {
      version: '0.1.0',
      f: (...args: ConstructorParameters<typeof ZjuamService>) => {
        return this.#borrowManager.borrow(new ZjuamService(...args))
      },
      argsSchema: ZjuamService.ctorSchema,
    },
    applyOnHandle: {
      version: '0.1.0',
      f: (handleId: number, prop: string, args: unknown[]) => {
        const p = prop || null
        return this.#borrowManager.applyOn(handleId, p, undefined, args)
      },
      argsSchema: z.tuple([
        z.number(),
        z.string().optional(),
        z.array(z.unknown()),
      ]),
    },
  } as const satisfies Record<
    string,
    {
      version: string
      f: (...args: any[]) => unknown
      argsSchema: z.ZodType
    }
  >

  onMessage({ data, source }: MessageEvent) {
    if (
      !this.#iframeEle ||
      !source ||
      source !== this.#iframeEle?.contentWindow
    )
      return
    const traceId = data.traceId as string
    try {
      const { call, args } =
        WidgetExtensionRuntime.widgetMessageDataBaseSchema.parse(data)
      if (!(call in this.exposedAPI)) throw new Error(`未找到所需调用 ${call}`)

      const { f, argsSchema } =
        this.exposedAPI[call as keyof typeof this.exposedAPI]
      const parsedArgs = argsSchema.parse(args) as any[]

      const result = (f as any)(...parsedArgs)

      afterDone(result, async (data: unknown) =>
        source.postMessage({ traceId, return: await encodeReturn(data) }, '*'),
      )
    } catch (e) {
      source.postMessage({ error: e, traceId: traceId }, '*')
      throw e
    }
  }

  bindRender(iframeEle: HTMLIFrameElement) {
    this.#iframeEle = iframeEle
    iframeEle.height = '0'
    const messageHandler = this.onMessage.bind(this)
    window.addEventListener('message', messageHandler)
    this.#iframeEle.contentWindow?.postMessage({ init: true }, '*')
    return () => window.removeEventListener('message', messageHandler)
  }
}

/**
 * 构建一个插件的小组件。请勿修改props，以避免重绘iframe并丢失状态。
 */
export function ExtensionWidget({ extension }: { extension: WidgetExtension }) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const runtime = useMemo(
    () => new WidgetExtensionRuntime(extension),
    [extension],
  )
  useEffect(() => runtime.bindRender(iframeRef.current!), [runtime])
  return (
    <iframe
      style={{ border: 'none', overflow: 'hidden', width: '100%' }}
      scrolling="no"
      allow={['geolocation'].map((k) => `${k} 'none'`).join('; ')}
      referrerPolicy="origin"
      sandbox="allow-scripts allow-forms allow-same-origin"
      src={extension.widget.entryUrl}
      ref={iframeRef}
    />
  )
}

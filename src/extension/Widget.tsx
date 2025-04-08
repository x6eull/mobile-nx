import { useRef, useMemo, useEffect } from 'react'
import { WidgetExtension } from './Extension'
import { WidgetExtensionRuntime } from './WidgetExtensionRuntime'

/** 渲染一个小组件。请勿修改props，以避免重绘iframe并丢失状态。 */
export function Widget({ extension }: { extension: WidgetExtension }) {
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
      rel="external nofollow"
      sandbox="allow-scripts allow-forms allow-same-origin"
      ref={iframeRef}
    />
  )
}

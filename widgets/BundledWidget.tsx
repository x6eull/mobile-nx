import { newWidgetExtension } from '../src/extension/Extension'
import { Widget } from '@/extension/Widget'

/**渲染一系列内置小组件。
 *
 * 请勿修改此组件的props。
 */
export default function BundledWidget() {
  return (
    <Widget
      extension={newWidgetExtension(
        '/widgets/credit234/',
        'e8d7e50b-4d52-46b3-9b90-f3a155c3d9f1',
        'credit234',
        '',
        '0.1.0',
      )}
    />
  )
}

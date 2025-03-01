/**扩展信息 */
export class Extension {
  public constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly desc: string,
    public readonly version: `${number}.${number}.${number}`,
  ) {}
}

/**表示一个具有[小组件]能力的扩展。 */
export interface WidgetExtension extends Extension {
  widget: {
    entryUrl: string
  }
}
export function newWidgetExtension(
  entryUrl: string,
  ...extCtorArgs: ConstructorParameters<typeof Extension>
): WidgetExtension {
  const ext = new Extension(...extCtorArgs) as WidgetExtension
  ext.widget = { entryUrl }
  return ext
}

/**类型T，或空对象字面量。
 *
 * 示例：{name:string} & Maybe<{startAt:Date,endAt:Date}>，后面的字段要么都不存在，要么都存在。
 *
 * 此为TS类型，仅供开发时使用，无运行时检查/断言功能。
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type Maybe<T extends Record<string, unknown>> = T | {}

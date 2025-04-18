// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface String {
  /**如果cond为true，返回this+sep+value；否则返回this。sep默认为' '(单个空格)。
   *
   * 用于className拼接。
   */
  with(cond: boolean | null | undefined, value: string, sep?: string): string
}

Object.defineProperty(String.prototype, 'with', {
  value(cond, value, sep = ' ') {
    if (cond) return this + sep + value
    return this
  },
} satisfies ThisType<string> & { value: string['with'] })

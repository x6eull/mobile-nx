interface Headers {
  /**如果指定的key已经存在，不做任何操作；否则设置为特定值。 */
  setDefault(key: string, defaultValue: string): void
}

Object.defineProperty(Headers.prototype, 'setDefault', {
  value(key, defaultValue) {
    if (!this.has(key)) this.set(key, defaultValue)
  },
} satisfies ThisType<Headers> & { value: Headers['setDefault'] })

interface Map<K, V> {
  /**如果指定的键存在，向对应的值push一个元素；否则新建一个仅有该元素的数组，并插入Map。 */
  pushValue: V extends (infer E)[] ? (key: K, element: E) => void : never
  /**如果指定的键不存在，调用valueInit，插入新的值；
   * 否则，尝试用已存在的值调用onExists。不使用onExists的返回值。
   *
   * **请注意，如果Map的值是原始值，那么在onExists中修改该值不会影响Map中的值。请使用ensureSet修改原始值。**
   *
   * 返回插入的新值或已存在的值。
   */
  ensure(key: K, valueInit: () => V, onExists?: (v: V) => void): V
  /**类似ensure，但onExists的返回值将被set回Map中(覆盖先前值)。
   *
   * 用于覆盖修改原始值。三个参数都不能为空。
   */
  ensureSet(key: K, valueInit: () => V, onExists: (v: V) => V): V
}

Object.defineProperty(Map.prototype, 'pushValue', {
  value(key, element) {
    if (this.has(key)) this.get(key)!.push(element)
    else this.set(key, [element])
  },
} satisfies ThisType<Map<unknown, unknown[]>> & {
  value: Map<unknown, unknown[]>['pushValue']
})
Object.defineProperties(Map.prototype, {
  ensure: {
    value(key, valueInit, onExists) {
      if (this.has(key)) {
        const prevValue = this.get(key)!
        onExists?.(prevValue)
        return prevValue
      }
      const v = valueInit()
      this.set(key, v)
      return v
    },
  },
  ensureSet: {
    value(key, valueInit, onExists) {
      return this.ensure(key, valueInit, (prev: unknown) =>
        this.set(key, onExists(prev)),
      )
    },
  },
} satisfies ThisType<Map<unknown, unknown>> & {
  ensure: { value: Map<unknown, unknown>['ensure'] }
  ensureSet: { value: Map<unknown, unknown>['ensureSet'] }
})

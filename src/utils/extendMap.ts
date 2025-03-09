type ElementType<A> = A extends (infer E)[] ? E : never

interface Map<K, V> {
  /**如果指定的键存在，向对应的值push一个元素；否则新建一个仅有该元素的数组，并插入Map。 */
  pushValue(key: K, element: ElementType<V>): void
  /**如果指定的键存在，则获取该值，并尝试调用onExists；否则，调用valueInit，插入新的值并返回该新值。 */
  ensure(key: K, valueInit: () => V, onExists?: (v: V) => void): V
}

Object.defineProperty(Map.prototype, 'pushValue', {
  value(key, element) {
    if (this.has(key)) this.get(key)!.push(element)
    else this.set(key, [element])
  },
} satisfies ThisType<Map<unknown, unknown[]>> & {
  value: Map<unknown, unknown[]>['pushValue']
})
Object.defineProperty(Map.prototype, 'ensure', {
  value(key, value, onExists) {
    if (this.has(key)) {
      const prevValue = this.get(key)!
      onExists?.(prevValue)
      return prevValue
    }
    const v = value()
    this.set(key, v)
    return v
  },
} satisfies ThisType<Map<unknown, unknown>> & {
  value: Map<unknown, unknown>['ensure']
})

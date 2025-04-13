interface Array<T> {
  /**
   * 类似find。
   *
   * 找到时(callbackFn返回真值），将找到的元素以及callbackFn的返回值作为数组返回
   */
  findX<R>(
    callbackFn: (
      element: T,
      index: number,
      array: this,
    ) => R | undefined | false | null | 0 | '',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    thisArg?: any,
  ): undefined | [T, R]
}

Object.defineProperty(Array.prototype, 'findX', {
  value(callbackFn, thisArg) {
    let index = 0
    for (const e of this) {
      const r = callbackFn.call(thisArg, e, index++, this)
      if (r) return [e, r]
    }
    return undefined
  },
} satisfies ThisType<Array<unknown>> & { value: Array<unknown>['findX'] })

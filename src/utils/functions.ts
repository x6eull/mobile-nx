/**直接throw首个参数。可用于处理promise */
export function throwF(arg: unknown): never {
  throw arg
}

/**与ts标准库Awaited略有不同，仅等待有效的Promise实例，而非任何有then属性的对象 */
export type PromiseAwaited<T> =
  T extends Promise<infer U> ? PromiseAwaited<U> : T
/**如果值是Promise，则使用兑现值调用f；否则直接调用f。 */
export function afterDone<T>(
  result: T,
  f: (result: PromiseAwaited<T>) => unknown,
  onReject = throwF,
) {
  if (result instanceof Promise) result.then(f, onReject)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
  else f(result as any)
}

/**新建一个函数，该函数始终返回调用ret时的参数 */
export function constF<R>(arg: R): () => R {
  return () => arg
}

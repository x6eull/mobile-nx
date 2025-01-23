export const isNode = typeof globalThis.process === 'object'

/**获取环境变量，支持VITE和node环境，包括vite编译后。请注意，vite只暴露VITE_开头的环境变量。 */
export function env(key: string, autoPrefix = true): string | null {
  const viteKey = autoPrefix && !key.match(/^VITE_/i) ? `VITE_${key}` : key
  let result =
    (import.meta.env?.[key] as string | null) ??
    globalThis.process?.env?.[key] ??
    null
  if (result === null && viteKey !== key)
    result =
      (import.meta.env?.[viteKey] as string | null) ??
      globalThis.process?.env?.[viteKey] ??
      null
  return result
}

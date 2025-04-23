/**可在本地持久化的键值对存储。键和值均为字符串。
 *
 * This API is not *meant* to be used as a local database.
 */

import { Preferences } from '@capacitor/preferences'
import { appPlatform } from '.'

export function scopedKey(key: string) {
  return `nx:${key}`
}

export async function kvSet(key: string, value: string): Promise<void> {
  key = scopedKey(key)
  if (appPlatform === 'web') return localStorage.setItem(key, value)
  return await Preferences.set({ key, value })
}

export async function kvGet(key: string): Promise<string | null> {
  key = scopedKey(key)
  if (appPlatform === 'web') return localStorage.getItem(key)
  return (await Preferences.get({ key })).value
}

export async function kvRemove(key: string): Promise<void> {
  key = scopedKey(key)
  if (appPlatform === 'web') return localStorage.removeItem(key)
  return await Preferences.remove({ key })
}

export async function kvClear(): Promise<void> {
  if (appPlatform === 'web')
    Array.from(new Array({ length: localStorage.length }), (_, i) =>
      localStorage.key(i),
    ).forEach((k) => {
      if (k?.startsWith('nx:')) localStorage.removeItem(k)
    })
  return await Preferences.clear()
}

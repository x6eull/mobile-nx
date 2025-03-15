/**可在本地持久化的、小型、纯文本文件存储，只支持utf-8编码的字符串。
 *
 * 在web上使用localStorage模拟。
 */

import { appPlatform } from '.'
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem'

function fileKey(path: string) {
  return `nx-file:${path}`
}

export async function fileWrite(path: string, content: string): Promise<void> {
  if (appPlatform === 'web') return localStorage.setItem(fileKey(path), content)
  await Filesystem.writeFile({
    path,
    directory: Directory.Data,
    data: content,
    encoding: Encoding.UTF8,
  })
}

export async function fileRead(path: string): Promise<string | null> {
  if (appPlatform === 'web') return localStorage.getItem(fileKey(path))
  const { data } = await Filesystem.readFile({
    path,
    directory: Directory.Data,
    encoding: Encoding.UTF8,
  }).catch(() => ({ data: null }))
  return data as string | null
}

export async function fileRemove(path: string): Promise<void> {
  if (appPlatform === 'web') return localStorage.removeItem(fileKey(path))
  return await Filesystem.deleteFile({
    path,
    directory: Directory.Data,
  }).catch(() => {})
}

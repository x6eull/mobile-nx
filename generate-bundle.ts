/**构建脚本。将dist中所有文件生成清单bundle.json */

import 'dotenv/config'
import { version } from './package.json'
import { stat, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const bundleDest = './dist/bundle.json'
export type BundleManifest = {
  version: string
  dependencies?: Partial<{ '.capa': string }>
  /**所有files的基路径 */
  fileBase: string
  files: { path: string; size: number; type?: 'js' | 'css' }[]
}
const entries = await readdir('./dist', {
  recursive: true,
  withFileTypes: true,
})
const entriesWithSize = (
  await Promise.all(
    entries.map(async (info) => {
      if (!info.isFile()) return null
      const relPath = path.join(info.parentPath, info.name).replace(/\\/g, '/')
      const { size } = await stat(path.resolve('.', relPath), {
        bigint: false,
      })
      return { path: relPath.replace(/^\/?dist\/?/, ''), size }
    }),
  )
).filter((e) => e !== null)
const totalSize = entriesWithSize.reduce((acc, { size }) => acc + size, 0)

await writeFile(
  bundleDest,
  JSON.stringify({
    version,
    fileBase: process.env.VITE_BUNDLE_UPDATE_URL!.replace(
      /bundle.json\/?$/,
      '',
    ),
    files: entriesWithSize,
  } satisfies BundleManifest),
  {
    encoding: 'utf-8',
    flag: 'w',
  },
)

console.log(
  `Bundle generated with ${entriesWithSize.length} files (${(totalSize / 1024 / 1024).toPrecision(2)} MB)`,
)
console.log(`files: ${entriesWithSize.map((e) => e.path).join(', ')}`)
console.log(`Bundle file destination: ${bundleDest}`)

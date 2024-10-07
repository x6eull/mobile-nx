import { convertFileSrc } from '@tauri-apps/api/core'
import {
  BaseDirectory,
  readTextFile,
  writeTextFile,
} from '@tauri-apps/plugin-fs'
import { nxFetch } from './nxFetch'
import type { BundleManifest } from '../../generate-bundle'
import { maxSatisfying, parse, SemVer } from 'semver'

let frontendVersion: SemVer
type FrontendColletion = {
  lastRenderedVersion: string
  versions: {
    [version: string]: {
      /**该前端版本存储的文件夹。此字符串保证不以/结尾。 */
      path: string
    }
  }
}
export async function getFrontendCollection(): Promise<FrontendColletion> {
  try {
    return JSON.parse(
      await readTextFile('frontend-collection.json', {
        baseDir: BaseDirectory.AppLocalData,
      }),
    )
  } catch (e) {
    return {
      lastRenderedVersion: frontendVersion?.toString() ?? '',
      versions: {},
    }
  }
}

const updateUrl = import.meta.env.VITE_BUNDLE_UPDATE_URL as string
/**立即检查更新。如有新版本，立即下载。 */
export async function updateFrontend() {
  //TODO 检查dependencies
  const {
    version: newVersion,
    fileBase,
    files,
  } = (await (await nxFetch(updateUrl)).json()) as BundleManifest
  const semNewVersion = parse(newVersion)!
  if (frontendVersion && semNewVersion.compare(frontendVersion) <= 0) return // no update
  const newFrontendVersionSavePath = `frontend/v${newVersion}`
  const [frontendCollection] = await Promise.all([
    getFrontendCollection(),
    ...files.map(async ({ path: relPath }) => {
      const fileResp = await nxFetch(fileBase + relPath)
      if (!fileResp.ok)
        throw new Error(`Failed to download ${relPath}: ${fileResp.statusText}`)
      const fileText = await fileResp.text()
      writeTextFile(`${newFrontendVersionSavePath}/${relPath}`, fileText, {
        baseDir: BaseDirectory.AppLocalData,
      })
    }),
  ])
  await writeTextFile(
    'frontend-collection.json',
    JSON.stringify({
      ...frontendCollection,
      versions: {
        ...frontendCollection.versions,
        [newVersion]: newFrontendVersionSavePath,
      },
    } as FrontendColletion),
    { baseDir: BaseDirectory.AppLocalData },
  )
}

const loadHandlers = {
  css(src: string) {
    const ele = document.createElement('link')
    ele.rel = 'stylesheet'
    ele.href = src
    document.head.appendChild(ele)
  },
  js(src: string) {
    const ele = document.createElement('script')
    ele.src = src
    document.head.appendChild(ele)
  },
} as const
/**加载前端内容。如果没有任何版本，立即下载一份。 */
export async function importFrontend() {
  const { versions } = await getFrontendCollection()
  const versionEntries = Object.keys(versions)
  if (!versionEntries.length) {
    await updateFrontend()
    await importFrontend()
    return
  }
  const maxVersion = maxSatisfying(
    versionEntries.map((e) => e),
    '>=0',
  )
  if (!maxVersion) throw new Error('No valid frontend version found')
  const dpath = versions[maxVersion].path
  const bundleText = await readTextFile(dpath + '/bundle.json', {
    baseDir: BaseDirectory.AppLocalData,
  })
  const { version, files } = JSON.parse(bundleText) as BundleManifest
  files.forEach(({ path, type }) => {
    if (!type) type = path.split('.').pop() as keyof typeof loadHandlers
    if (!(type in loadHandlers)) throw new Error(`Unknown file type: ${type}`)
    loadHandlers[type](convertFileSrc(`$APPLOCALDATA/${dpath}/${path}`))
  })
  frontendVersion = parse(version)!
  return version
}

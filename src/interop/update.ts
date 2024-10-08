import { convertFileSrc } from '@tauri-apps/api/core'
import {
  BaseDirectory,
  mkdir,
  readTextFile,
  writeTextFile,
} from '@tauri-apps/plugin-fs'
import { nxFetch } from './nxFetch'
import type { BundleManifest } from '../../generate-bundle'
import { maxSatisfying, parse } from 'semver'
import { path } from '@tauri-apps/api'
import { sep } from '@tauri-apps/api/path'

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
      lastRenderedVersion: '',
      versions: {},
    }
  }
}

//TODO 可能在多个Promise中重复mkdir同一个文件夹，待优化
/**在数据目录里新建或覆写一个文件。自动(递归)创建其祖先文件夹 */
export async function outputTextFile(filePath: string, content: string) {
  const lastSlash = filePath.lastIndexOf(sep())
  if (lastSlash > 0) {
    const dirPath = filePath.substring(0, lastSlash)
    try {
      await mkdir(dirPath, {
        baseDir: BaseDirectory.AppLocalData,
        recursive: true,
      })
    } catch {}
  }
  await writeTextFile(filePath, content, {
    baseDir: BaseDirectory.AppLocalData,
    create: true,
  })
}

const updateUrl = import.meta.env.VITE_BUNDLE_UPDATE_URL as string
/**立即检查更新。如有新版本，立即下载。 */
export async function updateFrontend(): Promise<string | null> {
  console.log('check update', updateUrl)
  //TODO 检查dependencies
  const bundleText = await (await nxFetch(updateUrl)).text()
  const {
    version: newVersion,
    fileBase,
    files,
  } = JSON.parse(bundleText) as BundleManifest
  const semNewVersion = parse(newVersion)!
  const frontendCollection = await getFrontendCollection()
  const { lastRenderedVersion: frontendVersion } = frontendCollection
  if (frontendVersion && semNewVersion.compare(frontendVersion) <= 0) {
    console.log('no update available', { frontendVersion, newVersion })
    return null // no update
  }
  const newFrontendVersionSavePath = await path.join(
    'frontend',
    `${newVersion}`,
  )
  await Promise.all([
    outputTextFile(
      await path.join(newFrontendVersionSavePath, 'bundle.json'),
      bundleText,
    ),
    ...files.map(async ({ path: relPath }) => {
      const fileResp = await nxFetch(fileBase + relPath)
      if (!fileResp.ok)
        throw new Error(`Failed to download ${relPath}: ${fileResp.statusText}`)
      const fileText = await fileResp.text()
      await outputTextFile(
        await path.join(newFrontendVersionSavePath, relPath),
        fileText,
      )
    }),
  ])
  await outputTextFile(
    'frontend-collection.json',
    JSON.stringify({
      ...frontendCollection,
      versions: {
        ...frontendCollection.versions,
        [newVersion]: { path: newFrontendVersionSavePath },
      },
    } as FrontendColletion),
  )
  console.warn('downloaded new frontend version:', newVersion)
  return newVersion
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
    ele.type = 'module'
    document.head.appendChild(ele)
  },
  html(src: string) {
    console.log('Ignore importing html', src)
  },
} as const
/**加载前端内容。如果没有任何版本，立即下载一份并加载。 */
export async function importFrontend() {
  const { versions } = await getFrontendCollection()
  const versionEntries = Object.keys(versions)
  if (!versionEntries.length) {
    await updateFrontend()
    await importFrontend()
    return
  }
  const maxVersion = maxSatisfying(versionEntries, '*', {
    includePrerelease: true,
  })
  if (!maxVersion) throw new Error('No valid frontend version found')
  const versionPath =
    typeof versions[maxVersion] === 'string'
      ? versions[maxVersion]
      : versions[maxVersion].path
  const bundleText = await readTextFile(
    await path.join(versionPath, 'bundle.json'),
    { baseDir: BaseDirectory.AppLocalData },
  )
  const { version, files } = JSON.parse(bundleText) as BundleManifest
  await Promise.all(
    files.map(async ({ path: filePath, type: definedType }) => {
      let finalType = definedType as keyof typeof loadHandlers
      if (!finalType)
        finalType = filePath.split('.').pop() as keyof typeof loadHandlers
      if (!(finalType in loadHandlers))
        throw new Error(`Unknown file type: ${definedType}`)
      const src = convertFileSrc(
        await path.join(await path.appLocalDataDir(), versionPath, filePath),
      )
      loadHandlers[finalType](src)
    }),
  )
  return version
}

export async function setLatestRenderedVersion(renderedVersion: string) {
  const collection = await getFrontendCollection()
  collection.lastRenderedVersion = renderedVersion
  await outputTextFile('frontend-collection.json', JSON.stringify(collection))
}

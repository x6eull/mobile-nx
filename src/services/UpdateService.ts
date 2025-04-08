import { appPlatform, appVersion } from '@/interop'
import { nxFetch } from '@/interop/fetch'
import { CapacitorUpdater } from '@capgo/capacitor-updater'
import type { LatestJson } from '../../scripts/build-bundle'
import { SemVer, Range } from 'semver'
import { version } from '@/../package.json'

void CapacitorUpdater.notifyAppReady()
;(self as unknown as Record<string, unknown>).CapacitorUpdater =
  CapacitorUpdater
const curVersion = new SemVer(version),
  curAppVersion = new SemVer(appVersion)

/**检查更新服务。目前只能热更新web资产。 */
export class UpdateService {
  public constructor(
    public readonly updateUrl = import.meta.env.VITE_VERSION_CHECK_URL ?? '',
  ) {
    if (!updateUrl) throw new Error('VITE_VERSION_CHECK_URL not set')
  }

  async checkUpdate(): Promise<null | {
    version: string
    homepage: string
    autoUpdate?: () => Promise<void>
  }> {
    const latestJson = (await (
      await nxFetch.get(this.updateUrl)
    ).json()) as LatestJson
    const platformSpec = latestJson[appPlatform as keyof LatestJson]
    if (!platformSpec) throw new Error('No update for platform ' + appPlatform)

    const { version, web, native, webBundle, homepage } = platformSpec
    const newVersion = new SemVer(version)
    if (newVersion.compare(curVersion) <= 0) return null // No update
    const webRange = new Range(web),
      nativeRange = new Range(native)
    if (webRange.test(curVersion) && nativeRange.test(curAppVersion))
      // can auto update web assets
      return {
        version: newVersion.raw,
        homepage,
        async autoUpdate() {
          await CapacitorUpdater.download({
            version: newVersion.raw,
            url: webBundle,
          })
        },
      }
    // need to manually update
    return { version: newVersion.raw, homepage }
  }
}

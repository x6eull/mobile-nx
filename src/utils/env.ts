import { App, AppInfo } from '@capacitor/app'
import { Device, DeviceInfo } from '@capacitor/device'

// 会在React加载之前初始化，此处忽略初始值
export let deviceInfo: DeviceInfo = {} as DeviceInfo
export let appInfo: AppInfo = {} as AppInfo
export type Platform = 'web' | 'ios' | 'android' | 'nodejs'

export type Env = ImportMetaEnv & {
  PLATFORM: Platform
  IS_MOBILE: boolean
  DEBUG_ZJUID?: string
  DEBUG_PASSWORD?: string
}

export let env: Env = {} as Env

export async function setupEnv() {
  const isNodeJs = typeof globalThis.process === 'object'

  const e: Partial<Env> = {}
  if (isNodeJs) {
    const dotenv = await import('dotenv')
    dotenv.config({
      path: [
        `${process.cwd()}/.env`,
        `${process.cwd()}/.env-test`,
        `${process.cwd()}/.env.local`,
        `${process.cwd()}/.env-test.local`,
      ],
    })
    e.PLATFORM = 'nodejs'
    e.IS_MOBILE = false
  } else {
    deviceInfo = await Device.getInfo()
    e.PLATFORM = deviceInfo.platform
    e.IS_MOBILE = env.PLATFORM === 'ios' || env.PLATFORM === 'android'
    if (e.IS_MOBILE) {
      appInfo = await App.getInfo()
    }
  }

  Object.entries(isNodeJs ? process.env : import.meta.env).forEach(
    ([key, val]) => {
      if (key.startsWith('VITE_') || key.startsWith('NODE_')) {
        key = key.slice(5)
        e[key] = val
      }
    },
  )
  env = e as Env
  console.log('setupEnv', env)
}

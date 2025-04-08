import { App } from '@capacitor/app'
import { Device } from '@capacitor/device'
import { version } from '@/../package.json'

const { platform: appPlatform } = await Device.getInfo()
const { version: appVersion } =
  appPlatform !== 'web' ? await App.getInfo() : { version }
export { appPlatform, appVersion }
console.warn('appPlatform:', appPlatform, 'appVersion:', appVersion)

if (appPlatform === 'android')
  await App.addListener('backButton', (ev) => {
    if (ev.canGoBack) window.history.back()
    else void App.exitApp()
  })

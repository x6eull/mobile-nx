import { App } from '@capacitor/app'
import { Device } from '@capacitor/device'

const info = await Device.getInfo()
export const { platform: appPlatform } = info
console.warn('platform:', appPlatform)

if (info.platform === 'android')
  await App.addListener('backButton', (ev) => {
    if (ev.canGoBack) window.history.back()
    else void App.exitApp()
  })

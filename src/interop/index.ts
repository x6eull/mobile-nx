import { App } from '@capacitor/app'
import { Device } from '@capacitor/device'

export function initCapacitorApp() {
  Device.getInfo().then((info) => {
    if (info.platform === 'web') return

    App.addListener('backButton', (ev) => {
      if (ev.canGoBack) window.history.back()
      else App.exitApp()
    })
  })
}

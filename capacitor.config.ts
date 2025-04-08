import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.zjuqsc.nx',
  appName: 'mobile-nx',
  webDir: 'dist',
  plugins: {
    CapacitorHttp: { enabled: false }, //显式不替换原生fetch
    CapacitorUpdater: { autoUpdate: false, statsUrl: '' },
  },
}

export default config

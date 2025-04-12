import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.zjuqsc.nx',
  appName: 'mobile-nx',
  webDir: 'dist',
  plugins: {
    CapacitorHttp: { enabled: false }, //显式不替换原生fetch
    CapacitorUpdater: {
      // 禁用托管自动更新 避免往第三方发请求
      autoUpdate: false,
      updateUrl: '',
      statsUrl: '',
      channelUrl: '',
    },
  },
}

export default config

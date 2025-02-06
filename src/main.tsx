import 'reflect-metadata'

import { App as NativeApp } from '@capacitor/app'
import { env, setupEnv } from '@/utils/env.ts'
import { setUser } from '@/store/user.ts'
import store from '@/store/store.ts'
import { initNodeCookieJar } from '@/services/base/nxFetch.ts'

export async function initApp() {
  await setupEnv()

  if (env.IS_MOBILE) {
    await NativeApp.addListener('backButton', (ev) => {
      if (ev.canGoBack) window.history.back()
      else NativeApp.exitApp()
    })
  }

  if (env.PLATFORM == 'nodejs') {
    await initNodeCookieJar()
    console.log('正采用env中测试账户')
    store.dispatch(
      setUser({ zjuId: env.DEBUG_ZJUID!, password: env.DEBUG_PASSWORD! }),
    )
  }
}

async function createReactApp() {
  const [React, ReactDOM, { default: RootPage }, ReactRedux] =
    await Promise.all([
      import('react'),
      import('react-dom/client'),
      import('./App'),
      import('react-redux'),
    ])
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ReactRedux.Provider store={store}>
        <RootPage />
      </ReactRedux.Provider>
    </React.StrictMode>,
  )
}

async function main() {
  await initApp()
  if (env.PLATFORM != 'nodejs') {
    await createReactApp()
  }
}

await main()
console.log('App started')

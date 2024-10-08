import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { importFrontend } from './interop/update'

enum Mode {
  // 开发模式(npm run dev)
  development = 'development',
  // npm run build 生成
  // 更新包模式
  production = 'production',
  // npm run tauri build 生成，应用中捆绑前端模式
  tauriFrontend = 'tauri-frontend',
  unknown = 'unknown',
}
try {
  let curMode: Mode = (Object.entries(Mode).find(([, v]) => import.meta.env.MODE.match(new RegExp(v.toString(), 'i')))?.[1] as Mode | undefined) ?? Mode.unknown
  console.log(`import.meta.env.MODE: ${import.meta.env.MODE}, curMode: ${curMode}`)
  switch (curMode) {
    case Mode.development:
    case Mode.production:
      ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
        <React.StrictMode>
          <App />
        </React.StrictMode>,
      )
      break
    case Mode.tauriFrontend:
      await importFrontend()
      break
    case Mode.unknown:
    default:
      alert(`Unknown import.meta.env.MODE: ${import.meta.env.MODE}`)
      break
  }
} catch (e) {
  document.body.innerText = e?.toString() ?? 'unknown error'
}
import './App.scss'
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom'
import Navbar from './Navbar/Navbar'
import Index from './Index/Index'
import { createContext, useEffect, useState } from 'react'
import { setLatestRenderedVersion, updateFrontend } from './interop/update'
import { version } from '../package.json'
import { getVersion, hide } from '@tauri-apps/api/app'
import { getCurrentWindow } from '@tauri-apps/api/window'

const router = createBrowserRouter([
  {
    path: '/',
    children: [
      { index: true, element: <Navigate to='/index' /> },
      { path: 'index', element: <Index /> },
      { path: 'calendar', element: <div>calendar</div> },
      { path: 'setting', element: <div>setting</div> }
    ],
    element: <>
      <main className='main'>
        <Outlet />
      </main>
      <Navbar />
    </>
  }
])

export type VersionParams = { frontend: string, capa: string, newVersion?: string }
export const versionContext = createContext<VersionParams>({ frontend: '?', capa: '?' })

export default function App() {
  const [versionParams, setVersionParams] = useState<VersionParams>({ frontend: version, capa: 'loading' })
  useEffect(() => {
    const eventController = new AbortController()
    window.addEventListener("popstate", (ev) => {
      if (location.pathname.match(/^\/(index|calendar|setting)\/?$/)) {
        getCurrentWindow().close()
      }
    }, { capture: false, once: false, signal: eventController.signal });
    setLatestRenderedVersion(version).then(() => {
      getVersion().then(v => setVersionParams(p => ({ ...p, capa: v })), console.error)
      updateFrontend().then(v => { if (v) { setVersionParams(p => ({ ...p, newVersion: v })) } })
    })
    return () => eventController.abort()
  }, [])
  return <div className='app'>
    <versionContext.Provider value={versionParams}>
      <RouterProvider router={router} />
    </versionContext.Provider>
  </div>
}
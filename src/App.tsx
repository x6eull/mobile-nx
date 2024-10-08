import './App.scss'
import { createHashRouter, Navigate, Outlet, RouterProvider, } from 'react-router-dom'
import Navbar from './Navbar/Navbar'
import Index from './Index/Index'
import { createContext, useEffect, useState } from 'react'
import { setLatestRenderedVersion, updateFrontend } from './interop/update'
import { version } from '../package.json'
import { getVersion } from '@tauri-apps/api/app'

const router = createHashRouter([
  {
    path: '/',
    children: [
      { path: '', index: true, element: <Index />, },
      { path: 'calendar', element: <div>calendar</div> },
      { path: 'setting', element: <div>setting</div> },

    ],
    element: <>
      <main className='main'>
        <Outlet />
      </main>
      <Navbar />
    </>
  }, {
    path: 'detail', children: [{
      path: 'test', element: <div onClick={() => alert(location.href)}>(click to view href)This is /detail/test (subpage)</div>
    }]
  }
])

export type VersionParams = { frontend: string, capa: string, newVersion?: string }
export const versionContext = createContext<VersionParams>({ frontend: '?', capa: '?' })

export default function App() {
  const [versionParams, setVersionParams] = useState<VersionParams>({ frontend: version, capa: 'loading' })
  useEffect(() => {
    setLatestRenderedVersion(version).then(() => {
      getVersion().then(v => setVersionParams(p => ({ ...p, capa: v })), console.error)
      updateFrontend().then(v => { if (v) { setVersionParams(p => ({ ...p, newVersion: v })) } })
    })
  }, [])
  return <div className='app'>
    <versionContext.Provider value={versionParams}>
      <RouterProvider router={router} />
    </versionContext.Provider>
  </div>
}
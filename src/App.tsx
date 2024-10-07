import { useEffect, useState } from 'react'
import './App.css'
import { getTauriVersion } from '@tauri-apps/api/app'
import { invoke } from '@tauri-apps/api/core'
import { updateFrontend } from './interop/update'

function App() {
  const [tauriVersion, setTauriVersion] = useState('-')
  const [capaVersion, setCapaVersion] = useState('-')
  useEffect(() => {
    updateFrontend()
    getTauriVersion().then((v) => setTauriVersion(v), (r) => setTauriVersion('error' + r))
    invoke<string>('get_capa_version').then((v) => setCapaVersion(v), (r) => setCapaVersion('error' + r))
  }, [])
  return <div className='app'>
    This is app loaded.
    <div>tauriVersion:{tauriVersion}</div>
    <div>capaVersion:{capaVersion}</div>
  </div>
}

export default App

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { initCapacitorApp } from './interop'

await initCapacitorApp()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

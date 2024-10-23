import { fetch as tauriFetch } from '@tauri-apps/plugin-http'

export function nxFetch(url: string, init?: RequestInit) {
  return tauriFetch(url, { cache: 'no-cache', ...init })
}

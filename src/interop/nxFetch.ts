export function nxFetch(url: string, init?: RequestInit) {
  return fetch(url, { cache: 'no-cache', ...init })
}

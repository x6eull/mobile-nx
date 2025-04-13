/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />
declare module 'css-has-pseudo/browser' {
  export default function cssHasPseudo(docuemnt: Document): void
}
interface ImportMetaEnv {
  VITE_VERSION_CHECK_URL?: string
}

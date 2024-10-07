import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const host = process.env.TAURI_DEV_HOST

const assetFiles = [] as string[][]
// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'esnext',
    // CSS、JS都构建到一个文件中
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        assetFileNames(info) {
          if (info.names?.length) {
            assetFiles.push(info.names)
            if (assetFiles.length > 1) {
              console.error('assetFiles', assetFiles)
              throw new Error('Multiple asset files are not supported')
            }
          }
          return 'style.css'
        },
        entryFileNames: 'entry.js',
        chunkFileNames() {
          //不支持非entry的js chunk
          throw new Error('Chunk files are not supported')
        },
      },
    },
  },

  plugins: [react()],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: 'ws',
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ['**/src-tauri/**'],
    },
  },
})

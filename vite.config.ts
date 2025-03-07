import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readdirSync } from 'node:fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const widgetEntries: Record<string, string> = {}
readdirSync(resolve(__dirname, 'widgets'), {
  encoding: 'utf-8',
  recursive: false,
  withFileTypes: true,
})
  .filter((d) => d.isDirectory())
  .forEach(
    (dirEntry) =>
      (widgetEntries[dirEntry.name] = resolve(
        __dirname,
        'widgets',
        dirEntry.name,
        'index.html',
      )),
  )
const rollupInput = {
  ...widgetEntries,
  main: resolve(__dirname, 'index.html'),
  __extHelper: resolve(__dirname, 'extHelper.ts'),
}

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      input: rollupInput,
      output: {
        entryFileNames({ name }) {
          if (name === '__extHelper') return 'extHelper.js'
          if (name === 'main') return 'assets/[name]-[hash:8].js'
          return 'widgets/[name]/[name]-[hash:8].js'
        },
      },
      external: ['dotenv'],
    },
  },
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
  },
})

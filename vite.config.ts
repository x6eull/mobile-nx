import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import reactSwc from '@vitejs/plugin-react-swc'
import devProxy from './vitePlugin/vite-plugin-dev-proxy'
import buildWidgets from './vitePlugin/vite-plugin-build-widgets'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  resolve: { alias: { '@': resolve(__dirname, 'src') } },
  build: {
    target: 'es2022',
    rollupOptions: { external: ['dotenv'] },
  },
  plugins: [
    reactSwc({
      useAtYourOwnRisk_mutateSwcOptions(options) {
        options.jsc!.parser!.decorators = true
        options.jsc!.transform!.decoratorVersion = '2022-03'
      },
    }),
    devProxy(), // 开发时跨源代理
    buildWidgets(), // 构建extHelper.{js,.d.ts}以及内置小组件
  ],
  server: {
    port: 5173,
    strictPort: true,
  },
})

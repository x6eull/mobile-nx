import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import reactSwc from '@vitejs/plugin-react-swc'
import devProxy from './vitePlugin/vite-plugin-dev-proxy'
import buildWidgets from './vitePlugin/vite-plugin-build-widgets'
import svgr from 'vite-plugin-svgr'

import postcssNesting from 'postcss-nesting'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  resolve: { alias: { '@': resolve(__dirname, 'src') } },
  css: {
    postcss: {
      plugins:
        mode === 'production'
          ? [
              // https://developer.mozilla.org/en-US/docs/Web/CSS/Nesting_selector#browser_compatibility
              postcssNesting(),
            ]
          : [], // 便于开发时查看nested css
    },
  },
  build: {
    // transform decorators
    target: 'es2022',
    // https://vite.dev/config/build-options#build-csstarget
    cssTarget: 'chrome61',
    rollupOptions: { external: ['dotenv'] },
  },
  plugins: [
    svgr(), // 部分svg改色 要直接放DOM元素
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
}))

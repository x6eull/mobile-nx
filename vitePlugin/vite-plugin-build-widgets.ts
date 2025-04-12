import { Plugin, UserConfig } from 'vite'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readdirSync } from 'node:fs'
import { rollup } from 'rollup'
import rollupPluginDts from 'rollup-plugin-dts'
import rollupPluginAlias from '@rollup/plugin-alias'

const projRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')

/**Vite Plugin，构建extHelper(包括dts)和内置widgets */
export default function buildWidgets(): Plugin {
  let resolveAlias: NonNullable<UserConfig['resolve']>['alias'] | undefined
  return {
    name: 'vite-plugin-build-widgets',
    config(config) {
      resolveAlias = config?.resolve?.alias
      const extHelperKey = '__extHelper'
      const rollupInput: Record<string, string> = {
        main: resolve(projRoot, 'index.html'),
        [extHelperKey]: resolve(projRoot, 'extHelper.ts'),
      }
      readdirSync(resolve(projRoot, 'widgets'), {
        encoding: 'utf-8',
        recursive: false,
        withFileTypes: true,
      })
        .filter((d) => d.isDirectory())
        .forEach(
          ({ name: dirName }) =>
            (rollupInput[`${dirName}`] = resolve(
              projRoot,
              'widgets',
              dirName,
              'index.html',
            )),
        )
      return {
        build: {
          rollupOptions: {
            input: rollupInput,
            output: {
              entryFileNames({ name: entryName }) {
                if (entryName === extHelperKey) return 'extHelper.js'
                if (entryName === 'main') return 'assets/[name]-[hash:8].js'
                return 'widgets/[name]/[name]-[hash:8].js'
              },
            },
          },
        },
      }
    },
    async generateBundle() {
      //TODO use vite's rollup
      console.log('\nBuilding extHelper.d.ts')
      await (
        await rollup({
          input: 'extHelper.ts',
          plugins: [
            rollupPluginAlias({ entries: resolveAlias }),
            rollupPluginDts(),
          ],
        })
      ).write({ dir: 'ship' })
    },
  }
}

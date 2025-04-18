import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'
import pluginReactHooks from 'eslint-plugin-react-hooks'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    name: 'globalIgnore',
    ignores: ['dist/', 'ship/', 'android/', 'eslint.config.js'],
  },
  { name: 'pluginJs.configs.recommended', ...pluginJs.configs.recommended },
  ...tseslint.configs.recommendedTypeChecked,
  {
    name: 'pluginReact.configs.flat.recommended',
    ...pluginReact.configs.flat.recommended,
  },
  {
    name: "pluginReact.configs.flat['jsx-runtime']",
    ...pluginReact.configs.flat['jsx-runtime'],
  },
  {
    name: 'pluginReactHooks',
    plugins: { 'react-hooks': pluginReactHooks },
    rules: pluginReactHooks.configs.recommended.rules,
  },
  {
    name: 'customConfig',
    settings: { react: { version: 'detect' } },
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: { eqeqeq: ['error', 'always'] },
  },
]

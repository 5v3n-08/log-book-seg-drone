// import globals from 'globals'
// import pluginJs from '@eslint/js'
// import tseslint from 'typescript-eslint'
// import pluginVue from 'eslint-plugin-vue'

// export default [
//   { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
//   pluginJs.configs.recommended,
//   ...tseslint.configs.recommended,
//   ...pluginVue.configs['flat/essential'],
// ]
import withNuxt from './.nuxt/eslint.config.mjs'

import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default withNuxt(eslintPluginPrettierRecommended)

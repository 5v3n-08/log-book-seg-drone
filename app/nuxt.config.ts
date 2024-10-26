import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: './src',
  devtools: { enabled: true },
  build: { transpile: ['trpc-nuxt', 'vuetify', '@vuepic/vue-datepicker'] },

  modules: [
    '@nuxt/eslint',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        config.server = {
          ...config.server,
          hmr: { protocol: 'ws', port: 24678 },
        }
        // @ts-expect-error known issue
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],

  runtimeConfig: {
    DATABASE_URL: process.env.DATABASE_URL,
    OPEN_ROUTE_SERVICE_TOKEN: process.env.OPEN_ROUTE_SERVICE_TOKEN,
  },

  vite: {
    vue: { template: { transformAssetUrls } },
  },

  compatibilityDate: '2024-08-31',
})

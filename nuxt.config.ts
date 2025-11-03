import type { LocaleObject } from '@nuxtjs/i18n'

import { fileURLToPath } from 'node:url'

import type { AppLocale } from './shared/types/general.types'

function extendViteConfig(config: import('vite').UserConfig) {
  const plugin = config.plugins?.find((plugin) => isPlugin(plugin, 'nuxt:environments'))
  if (plugin) plugin.enforce = 'pre'
}

function isPlugin(plugin: unknown, name: string): plugin is import('vite').Plugin {
  return !!(plugin && typeof plugin === 'object' && 'name' in plugin && plugin.name === name)
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  alias: { '#server': fileURLToPath(new URL('./server', import.meta.url)) },

  compatibilityDate: '2024-07-11',

  css: ['~/assets/css/main.css'],

  hooks: {
    'vite:extendConfig': extendViteConfig
  },

  i18n: {
    baseUrl: 'https://bibletime.app',
    defaultLocale: 'en',
    detectBrowserLanguage: { cookieKey: 'i18n_locale', useCookie: true },
    langDir: 'locales',
    locales: [
      { code: 'en', dir: 'ltr', file: 'en.json', language: 'en-US', name: 'English' },
      { code: 'nl', dir: 'ltr', file: 'nl.json', language: 'nl-NL', name: 'Nederlands' }
    ] satisfies LocaleObject<AppLocale>[],
    restructureDir: 'app',
    strategy: 'prefix_and_default'
  },

  image: {
    alias: {
      wol: 'https://wol.jw.org'
    },
    domains: ['wol.jw.org']
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxtjs/i18n',
    '@nuxtjs/supabase',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt'
  ],

  routeRules: { '/api/**': { cors: true } },

  runtimeConfig: {
    public: {
      appName: process.env.APP_NAME || 'BibleTime'
    }
  },

  supabase: {
    redirect: false,
    redirectOptions: { callback: '/auth/confirm', include: ['/settings/**'], login: '/auth/login' },
    types: '~~/shared/types/database.types.ts'
  }
})

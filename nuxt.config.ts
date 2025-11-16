import type { LocaleObject } from '@nuxtjs/i18n'

import { fileURLToPath } from 'node:url'
import { defineOrganization } from 'nuxt-schema-org/schema'

import type { AppLocale } from './shared/types/general.types'

import { iconBaseUrl, maskableSizes, transparentSizes } from './app/utils/assets'
import { repository } from './package.json'

const repoUrl = repository.url.replace(/^git\+/, '').replace(/\.git$/, '')
const [repoOwner, repoName] = repository.url.replace(/^https:\/\/github\.com\//, '').split('/')

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  alias: { '#server': fileURLToPath(new URL('./server', import.meta.url)) },
  colorMode: { fallback: 'light', preference: 'system' },
  compatibilityDate: '2024-07-11',
  css: ['~/assets/css/main.css'],
  future: { typescriptBundlerResolution: true },

  i18n: {
    baseUrl: process.env.NUXT_SITE_URL,
    defaultLocale: 'en',
    detectBrowserLanguage: { cookieKey: 'i18n_locale', useCookie: true },
    langDir: 'locales',
    locales: [
      { code: 'en', dir: 'ltr', file: 'en.json', language: 'en-US', name: 'English' },
      { code: 'nl', dir: 'ltr', file: 'nl.json', language: 'nl-NL', name: 'Nederlands' }
    ] satisfies LocaleObject<AppLocale>[],
    restructureDir: 'app',
    strategy: 'prefix'
  },

  modules: [
    '@netlify/nuxt',
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxtjs/i18n',
    '@nuxtjs/seo',
    '@nuxtjs/supabase',
    '@pinia/nuxt',
    '@vite-pwa/nuxt',
    '@vueuse/nuxt',
    'pinia-plugin-persistedstate/nuxt'
  ],

  netlify: { headers: { enabled: true }, redirects: { enabled: true } },

  pwa: {
    devOptions: {
      enabled: true,
      navigateFallback: '/',
      navigateFallbackAllowlist: [/^\/$/],
      type: 'module'
    },
    manifest: {
      description: 'An overview of Biblical people and events.',
      icons: [
        ...transparentSizes.map((size) => ({
          sizes: `${size}x${size}`,
          src: `${iconBaseUrl}/pwa-${size}x${size}.png`,
          type: 'image/png'
        })),
        ...maskableSizes.map((size) => ({
          purpose: 'any maskable',
          sizes: `${size}x${size}`,
          src: `${iconBaseUrl}/pwa-${size}x${size}.png`,
          type: 'image/png'
        }))
      ],
      name: process.env.NUXT_SITE_NAME || 'BibleTime',
      short_name: process.env.NUXT_SITE_NAME || 'BibleTime',
      theme_color: '#1A3D7C'
    },
    registerType: 'autoUpdate',
    registerWebManifestInRouteRules: true
  },

  routeRules: { '/api/**': { cors: true } },

  // nitro: { netlify: { images: { remote_images: ['https://wol.jw.org/*'] } }, preset: 'netlify' },

  runtimeConfig: {
    githubToken: process.env.GITHUB_TOKEN,
    public: {
      repoName,
      repoOwner,
      repoUrl,
      siteName: process.env.NUXT_SITE_NAME,
      siteUrl: process.env.NUXT_SITE_URL
    }
  },

  schemaOrg: { identity: defineOrganization({ name: process.env.NUXT_SITE_NAME || 'BibleTime' }) },

  seo: { fallbackTitle: false },

  sitemap: {
    sources: ['/api/__sitemap__/urls?type=events', '/api/__sitemap__/urls?type=people']
    // sitemaps: {
    //   events: { sources: ['/api/__sitemap__/urls?type=events'] },
    //   pages: { include: ['/**'], includeAppSources: true },
    //   people: { sources: ['/api/__sitemap__/urls?type=people'] }
    // }
  },

  supabase: {
    redirect: false,
    redirectOptions: { callback: '/auth/confirm', include: ['/settings/**'], login: '/auth/login' },
    types: '~~/shared/types/database.types.ts'
  },

  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            supabase: [
              '@supabase/auth-js',
              '@supabase/functions-js',
              '@supabase/postgrest-js',
              '@supabase/realtime-js',
              '@supabase/storage-js',
              '@supabase/supabase-js'
            ]
          }
        }
      }
    }
  }
})

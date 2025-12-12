import type { LocaleObject } from '@nuxtjs/i18n'

import { fileURLToPath } from 'node:url'
import { defineOrganization } from 'nuxt-schema-org/schema'
import mdPlugin, { Mode } from 'vite-plugin-markdown'

import type { AppLocale } from './shared/types/general.types'

import messages from './app/locales/en.json'
import { iconBaseUrl, maskableSizes, transparentSizes } from './app/utils/assets'
import { repository, version } from './package.json'

const repoUrl = repository.url.replace(/^git\+/, '').replace(/\.git$/, '')
const [repoOwner, repoName] = repository.url.replace(/^https:\/\/github\.com\//, '').split('/')

const imageOptimizationDomains: string[] = []

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
    detectBrowserLanguage: { cookieKey: 'i18n_locale', redirectOn: 'root', useCookie: true },
    langDir: 'locales',
    locales: [
      { code: 'en', dir: 'ltr', file: 'en.json', jw: 'E', language: 'en-US', name: 'English' },
      { code: 'nl', dir: 'ltr', file: 'nl.json', jw: 'O', language: 'nl-NL', name: 'Nederlands' }
    ] satisfies LocaleObject<AppLocale>[],
    restructureDir: 'app',
    strategy: 'prefix'
  },

  image: { domains: imageOptimizationDomains, provider: 'none' },

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
    'pinia-plugin-persistedstate/nuxt',
    '@nuxt/test-utils/module'
  ],

  netlify: {
    headers: { enabled: true },
    images: { enabled: true, remoteURLPatterns: imageOptimizationDomains },
    redirects: { enabled: true }
  },

  nitro: { netlify: { images: { remote_images: imageOptimizationDomains } }, preset: 'netlify' },

  pwa: {
    devOptions: {
      enabled: true,
      navigateFallback: '/',
      navigateFallbackAllowlist: [/^\/$/],
      type: 'module'
    },
    manifest: {
      background_color: '#000000',
      categories: ['education'],
      description: messages.nuxtSiteConfig.description,
      display: 'standalone',
      icons: [
        ...transparentSizes.map((size) => ({
          sizes: `${size}x${size}`,
          src: `${iconBaseUrl}/pwa-${size}x${size}.png`,
          type: 'image/png'
        })),
        ...maskableSizes.map((size) => ({
          purpose: 'maskable',
          sizes: `${size}x${size}`,
          src: `${iconBaseUrl}/maskable-icon-${size}x${size}.png`,
          type: 'image/png'
        })),
        {
          sizes: '64x64',
          src: `${iconBaseUrl}/favicon.ico`,
          type: 'image/ico'
        },
        {
          purpose: 'monochrome',
          sizes: 'any',
          src: `${iconBaseUrl}/logo-mono.svg`,
          type: 'image/svg+xml'
        },
        {
          sizes: 'any',
          src: `${iconBaseUrl}/logo.svg`,
          type: 'image/svg+xml'
        }
      ],
      name: process.env.NUXT_SITE_NAME || messages.nuxtSiteConfig.name,
      screenshots: [
        {
          form_factor: 'wide',
          label: 'Desktop view showing some statistics',
          sizes: '1920x1080',
          src: '/screenshots/home-desktop.png',
          type: 'image/png'
        },
        {
          form_factor: 'narrow',
          label: 'Mobile view showing some statistics',
          sizes: '412x915',
          src: '/screenshots/home-mobile.png',
          type: 'image/png'
        },
        {
          form_factor: 'wide',
          label: 'Desktop view showing a timeline of people and events',
          sizes: '1920x1080',
          src: '/screenshots/timeline-desktop.png',
          type: 'image/png'
        },
        {
          form_factor: 'narrow',
          label: 'Mobile view showing a timeline of people and events',
          sizes: '412x915',
          src: '/screenshots/timeline-mobile.png',
          type: 'image/png'
        },
        {
          form_factor: 'wide',
          label: 'Desktop view showing a table overview of people',
          sizes: '1920x1080',
          src: '/screenshots/people-desktop.png',
          type: 'image/png'
        },
        {
          form_factor: 'narrow',
          label: 'Mobile view showing a table overview of people',
          sizes: '412x915',
          src: '/screenshots/people-mobile.png',
          type: 'image/png'
        },
        {
          form_factor: 'wide',
          label: 'Desktop view showing a settings page',
          sizes: '1920x1080',
          src: '/screenshots/settings-desktop.png',
          type: 'image/png'
        },
        {
          form_factor: 'narrow',
          label: 'Mobile view showing a settings page',
          sizes: '412x915',
          src: '/screenshots/settings-mobile.png',
          type: 'image/png'
        }
      ],
      short_name: process.env.NUXT_SITE_NAME || messages.nuxtSiteConfig.name,
      shortcuts: [
        {
          description: messages.timeline.description,
          icons: [{ sizes: 'any', src: `/icons/timeline.svg`, type: 'image/svg+xml' }],
          name: messages.timeline.title,
          url: '/timeline'
        },
        {
          description: messages.people.description,
          icons: [{ sizes: 'any', src: `/icons/people.svg`, type: 'image/svg+xml' }],
          name: messages.people.title,
          url: '/people'
        },
        {
          description: messages.events.description,
          icons: [{ sizes: 'any', src: `/icons/events.svg`, type: 'image/svg+xml' }],
          name: messages.events.title,
          url: '/events'
        },
        {
          description: messages.suggestions.description,
          name: messages.suggestions.title,
          url: '/suggestions'
        }
      ],
      theme_color: '#1A3D7C'
    },
    registerType: 'autoUpdate',
    registerWebManifestInRouteRules: true
  },

  routeRules: { '/api/**': { cors: true } },

  runtimeConfig: {
    githubToken: process.env.GITHUB_TOKEN,
    public: {
      captchaSiteKey: process.env.CAPTCHA_SITE_KEY,
      repoName,
      repoOwner,
      repoUrl,
      siteName: process.env.NUXT_SITE_NAME,
      siteUrl: process.env.NUXT_SITE_URL,
      version
    }
  },

  schemaOrg: {
    identity: defineOrganization({
      name: process.env.NUXT_SITE_NAME || messages.nuxtSiteConfig.name
    })
  },

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
    },
    plugins: [mdPlugin({ mode: [Mode.HTML] })]
  }
})

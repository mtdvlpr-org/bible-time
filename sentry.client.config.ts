import { useRuntimeConfig } from '#imports'
import * as Sentry from '@sentry/nuxt'

Sentry.init({
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
  dsn: useRuntimeConfig().public.sentry.dsn
})

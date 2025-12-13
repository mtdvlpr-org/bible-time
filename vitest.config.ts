import { defineVitestProject } from '@nuxt/test-utils/config'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      await defineVitestProject({
        test: {
          environment: 'nuxt',
          include: ['test/e2e/*.test.ts'],
          name: 'e2e'
        }
      }),
      {
        test: {
          environment: 'happy-dom',
          include: ['test/unit/{app,shared}/*.test.ts'],
          name: 'browser'
        }
      },
      {
        test: {
          environment: 'node',
          include: ['test/unit/{server,shared}/*.test.ts'],
          name: 'server'
        }
      },
      await defineVitestProject({
        test: {
          environment: 'nuxt',
          include: ['test/nuxt/{components,composables,stores}/*.test.ts'],
          name: 'nuxt'
        }
      })
    ]
  }
})

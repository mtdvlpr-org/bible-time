import { defineVitestProject } from '@nuxt/test-utils/config'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          environment: 'node',
          include: ['test/{e2e,unit}/*.{test,spec}.ts'],
          name: 'unit'
        }
      },
      await defineVitestProject({
        test: {
          environment: 'nuxt',
          include: ['test/nuxt/*.{test,spec}.ts'],
          name: 'nuxt'
        }
      })
    ]
  }
})

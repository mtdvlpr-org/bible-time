import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import useProviders from '../../../app/composables/useProviders'

const signInWithOAuthMock = vi.fn()

mockNuxtImport('useRuntimeConfig', () => {
  return () => ({
    public: {
      siteUrl: 'http://localhost:3000'
    }
  })
})

mockNuxtImport('useSupabaseClient', () => {
  return () => ({
    auth: {
      signInWithOAuth: signInWithOAuthMock
    }
  })
})

describe('useProviders', () => {
  beforeEach(() => {
    signInWithOAuthMock.mockClear()
  })

  it('returns providers list', () => {
    const { providers } = useProviders()
    expect(providers).toHaveLength(2)
    expect(providers[0]?.label).toBe('Google')
    expect(providers[1]?.label).toBe('GitHub')
  })

  it('triggers Google sign in', () => {
    const { providers } = useProviders()
    const googleProvider = providers.find((p) => p.label === 'Google')
    googleProvider?.onClick()

    expect(signInWithOAuthMock).toHaveBeenCalledWith({
      options: { redirectTo: 'http://localhost:3000/auth/confirm' },
      provider: 'google'
    })
  })

  it('triggers GitHub sign in', () => {
    const { providers } = useProviders()
    const githubProvider = providers.find((p) => p.label === 'GitHub')
    githubProvider?.onClick()

    expect(signInWithOAuthMock).toHaveBeenCalledWith({
      options: { redirectTo: 'http://localhost:3000/auth/confirm' },
      provider: 'github'
    })
  })
})

import type { JwtPayload, Session } from '@supabase/supabase-js'

import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useUserStore } from '../../../app/stores/user'

const {
  eqMock,
  fromMock,
  getPublicUrlMock,
  navigateToMock,
  selectMock,
  sessionMock,
  signOutMock,
  singleMock,
  storageFromMock,
  userMock
} = vi.hoisted(() => {
  const navigateToMock = vi.fn()
  const userMock: { value: null | Partial<JwtPayload> } = { value: null }
  const sessionMock: { value: null | Partial<Session> } = { value: null }

  const signOutMock = vi.fn()
  const singleMock = vi.fn()
  const eqMock = vi.fn()
  const selectMock = vi.fn()
  const fromMock = vi.fn()
  const getPublicUrlMock = vi.fn()
  const storageFromMock = vi.fn()

  return {
    eqMock,
    fromMock,
    getPublicUrlMock,
    navigateToMock,
    selectMock,
    sessionMock,
    signOutMock,
    singleMock,
    storageFromMock,
    userMock
  }
})

// Mock globals
vi.stubGlobal('piniaPluginPersistedstate', {
  cookies: vi.fn(() => ({ getItem: vi.fn(), setItem: vi.fn() }))
})

mockNuxtImport('useSupabaseClient', () => {
  return () => ({
    auth: { signOut: signOutMock },
    from: fromMock,
    storage: { from: storageFromMock }
  })
})

mockNuxtImport('useSupabaseUser', () => {
  return () => userMock
})

mockNuxtImport('useSupabaseSession', () => {
  return () => sessionMock
})

mockNuxtImport('navigateTo', () => {
  return navigateToMock
})

mockNuxtImport('handleSupabaseError', () => {
  return vi.fn()
})

describe('useUserStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    userMock.value = null
    sessionMock.value = null

    // Setup chain
    selectMock.mockReturnValue({ eq: eqMock })
    eqMock.mockReturnValue({ eq: eqMock, select: selectMock, single: singleMock })
    fromMock.mockReturnValue({ select: selectMock })

    // Setup storage
    getPublicUrlMock.mockReturnValue({ data: { publicUrl: 'http://url' } })
    storageFromMock.mockReturnValue({ getPublicUrl: getPublicUrlMock })
  })

  it('checks permissions (can)', () => {
    const store = useUserStore()
    store.user = { role: 'admin' } as typeof store.user
    store.permissions.admin = ['people.create']

    expect(store.can('people.create')).toBe(true)
    expect(store.can('people.update')).toBe(false)
  })

  it('fetches profile successfully', async () => {
    const store = useUserStore()
    userMock.value = { email: 'test@example.com', sub: 'user-123', user_role: 'admin' }
    sessionMock.value = {}

    // Handle different table calls
    fromMock.mockImplementation((table: string) => {
      if (table === 'profiles') {
        return {
          select: () => ({
            eq: () => ({
              single: singleMock
            })
          })
        }
      }
      if (table === 'role_permissions') {
        return {
          select: () => ({
            eq: async () => ({
              data: [{ permission: 'perm1' }]
            })
          })
        }
      }
      return { select: selectMock }
    })

    singleMock.mockResolvedValue({
      data: { avatar_url: 'avatar.png', display_name: 'Test User', id: 'user-123' },
      error: null
    })

    await store.fetch()

    expect(store.user).toEqual({
      avatar_url: 'http://url',
      display_name: 'Test User',
      email: 'test@example.com',
      id: 'user-123',
      role: 'admin'
    })
    expect(store.permissions.admin).toEqual(['perm1'])
  })

  it('logout clears user and signs out', async () => {
    const store = useUserStore()
    store.user = { id: '123' } as typeof store.user

    await store.logout()

    expect(store.user).toBeNull()
    expect(signOutMock).toHaveBeenCalled()
    expect(navigateToMock).toHaveBeenCalledWith('/auth/login')
  })
})

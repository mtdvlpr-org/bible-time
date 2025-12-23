import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useI18nStore } from '~/stores/i18n'

// Mock Supabase with hoisted variables to avoid hoisting issues
const { eqMock, fromMock, selectMock } = vi.hoisted(() => {
  const selectMock = vi.fn()
  const eqMock = vi.fn()
  const fromMock = vi.fn()
  return { eqMock, fromMock, selectMock }
})

mockNuxtImport('useSupabaseClient', () => {
  return () => ({
    from: fromMock
  })
})

mockNuxtImport('handleSupabaseError', () => {
  return vi.fn()
})

describe('useI18nStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()

    // Setup chain
    fromMock.mockReturnValue({ select: selectMock })
    selectMock.mockReturnValue({ eq: eqMock })
  })

  it('adds translation', () => {
    const store = useI18nStore()
    store.addTranslation('en', 'hello', 'Hello')
    expect(store.translations.en).toEqual({ hello: 'Hello' })
  })

  it('fetches translations successfully', async () => {
    const store = useI18nStore()

    // Mock response
    eqMock.mockResolvedValue({
      data: [{ key: 'welcome', value: 'Welcome' }],
      error: null
    })

    await store.fetch('en')

    expect(fromMock).toHaveBeenCalledWith('translations')
    expect(selectMock).toHaveBeenCalledWith('key, value')
    expect(eqMock).toHaveBeenCalledWith('lang', 'en')
    expect(store.translations.en).toEqual({ welcome: 'Welcome' })
  })

  it('does not fetch if already populated and refresh is false', async () => {
    const store = useI18nStore()
    store.translations.en = { existing: 'Existing' }

    await store.fetch('en')

    expect(fromMock).not.toHaveBeenCalled()
  })

  it('fetches if already populated but refresh is true', async () => {
    const store = useI18nStore()
    store.translations.en = { existing: 'Existing' }

    eqMock.mockResolvedValue({
      data: [{ key: 'new', value: 'New' }],
      error: null
    })

    await store.fetch('en', true)

    expect(fromMock).toHaveBeenCalled()
    expect(store.translations.en).toEqual({ new: 'New' })
  })
})

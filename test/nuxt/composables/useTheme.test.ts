import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'

import useTheme from '../../../app/composables/useTheme'

const appConfigMock = {
  ui: {
    colors: {
      neutral: 'slate',
      primary: 'green'
    }
  }
}

mockNuxtImport('useAppConfig', () => {
  return () => appConfigMock
})

mockNuxtImport('useNuxtApp', () => {
  return () => ({
    $i18n: {
      t: (key: string) => key
    }
  })
})

describe('useTheme', () => {
  it('returns appearanceDropdownItem', () => {
    const { appearanceDropdownItem } = useTheme()
    expect(appearanceDropdownItem.value).toBeDefined()
    expect(appearanceDropdownItem.value.label).toBe('settings.appearance')
    expect(appearanceDropdownItem.value.children).toHaveLength(2) // Primary and Neutral
  })

  it('updates primary color', () => {
    const { appearanceDropdownItem } = useTheme()
    // Find Primary group
    const primaryGroup = appearanceDropdownItem.value.children?.[0]
    // Find 'blue' color item
    const blueItem = primaryGroup?.children?.find((c) => c.chip === 'blue')

    expect(blueItem).toBeDefined()

    // Simulate select
    blueItem?.onSelect?.({ preventDefault: vi.fn() } as unknown as Event)

    expect(appConfigMock.ui.colors.primary).toBe('blue')
  })

  it('updates neutral color', () => {
    const { appearanceDropdownItem } = useTheme()
    // Find Neutral group
    const neutralGroup = appearanceDropdownItem.value.children?.[1]
    // Find 'zinc' color item
    const zincItem = neutralGroup?.children?.find((c) => c.label === 'zinc')

    expect(zincItem).toBeDefined()

    // Simulate select
    zincItem?.onSelect?.({ preventDefault: vi.fn() } as unknown as Event)

    expect(appConfigMock.ui.colors.neutral).toBe('zinc')
  })
})

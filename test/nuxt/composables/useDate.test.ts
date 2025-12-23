import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import useDate from '~/composables/useDate'

mockNuxtImport('useNuxtApp', () => {
  return () => ({
    $i18n: {
      t: (key: string) => key
    }
  })
})

describe('useDate', () => {
  it('formats unknown date', () => {
    const { formatYear } = useDate()
    expect(formatYear(null)).toBe('general.unknown')
  })

  it('formats positive year (CE)', () => {
    const { formatYear } = useDate()
    // "prefix" is empty, yearAbs=2023, suffix="date.ce"
    expect(formatYear(2023)).toBe('2023 date.ce')
  })

  it('formats negative year (BCE)', () => {
    const { formatYear } = useDate()
    // "prefix" is empty, yearAbs=100, suffix="date.bce"
    expect(formatYear(-100)).toBe('100 date.bce')
  })

  it('formats year with "after" precision', () => {
    const { formatYear } = useDate()
    expect(formatYear(2023, 'after')).toBe('date.after 2023 date.ce')
  })

  it('formats year with "before" precision', () => {
    const { formatYear } = useDate()
    expect(formatYear(2023, 'before')).toBe('date.before 2023 date.ce')
  })

  it('formats year with "circa" precision', () => {
    const { formatYear } = useDate()
    expect(formatYear(2023, 'circa')).toBe('date.circa 2023 date.ce')
  })
})

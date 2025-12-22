import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import useTranslations from '../../../app/composables/useTranslations'

const translationsMock = {
  en: {
    'some.key': 'Translated Value'
  }
}

mockNuxtImport('useI18nStore', () => {
  return () => ({
    translations: translationsMock
  })
})

mockNuxtImport('useNuxtApp', () => {
  return () => ({
    $i18n: {
      locale: { value: 'en' },
      localeProperties: { value: { jw: 'E' } },
      t: (key: string) => `t:${key}`
    }
  })
})

describe('useTranslations', () => {
  it('translates dynamic keys', () => {
    const { translate } = useTranslations()
    expect(translate('some.key')).toBe('Translated Value')
    expect(translate('unknown.key')).toBe('unknown.key')
  })

  it('translates suggestion status', () => {
    const { translateSuggestionStatus } = useTranslations()
    expect(translateSuggestionStatus('approved')).toBe('t:suggestion.approved')
  })

  it('translates source type', () => {
    const { translateSourceType } = useTranslations()
    expect(translateSourceType('video')).toBe('t:source.video')
  })

  it('translates source URL (jw.org)', () => {
    const { translateSource } = useTranslations()
    // Normal URL
    expect(translateSource('https://google.com')).toBe('https://google.com')

    // JW URL
    const jwUrl = 'https://www.jw.org/finder?wtlocale=X&docid=123'
    // Should replace wtlocale=X with wtlocale=E (from mock)
    expect(translateSource(jwUrl)).toContain('wtlocale=E')
  })

  it('translates relation', () => {
    const { translateRelation } = useTranslations()
    expect(translateRelation('father')).toBe('t:relation.father')
  })

  it('translates book', () => {
    const { translateBook } = useTranslations()
    expect(translateBook(1)).toBe('t:bible.books.genesis')
    expect(translateBook(1, true)).toBe('t:bible.abbreviations.genesis')
  })

  it('formats bible verse', () => {
    const { formatBibleVerse } = useTranslations()
    const verse: { book: BibleBookNr; chapter: number; start: number } = {
      book: 1,
      chapter: 1,
      start: 1
    }
    // Genesis 1:1
    expect(formatBibleVerse(verse)).toBe('t:bible.books.genesis 1:1')

    const range: {
      book: BibleBookNr
      chapter: number
      end?: number
      start: number
    } = {
      book: 2,
      chapter: 20,
      end: 17,
      start: 1
    }
    // Exodus 20:1-17
    expect(formatBibleVerse(range)).toBe('t:bible.books.exodus 20:1-17')
  })
})

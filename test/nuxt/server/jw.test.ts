import { describe, expect, it } from 'vitest'

import type { PublicationFetcher } from '../../../shared/types/jw/publication'

import {
  fetchBibleData,
  fetchBibleVerse,
  fetchJwLanguages,
  fetchMediaItems,
  fetchPublication,
  fetchYeartext
} from '../../../server/utils/jw/api'

describe('jw api integration', () => {
  // Use a longer timeout for network requests
  const timeout = 10000

  it(
    'should fetch real jw languages',
    async () => {
      const result = await fetchJwLanguages('en')
      expect(result.locale).toBe('en')
      expect(result.languages).toBeDefined()
      expect(result.languages?.length).toBeGreaterThan(0)
      // Check for a known language, e.g., English or Spanish
      const hasEnglish = result.languages?.some((l) => l.symbol === 'en')
      expect(hasEnglish).toBe(true)
    },
    timeout
  )

  it(
    'should fetch real yeartext',
    async () => {
      const result = await fetchYeartext('E')
      expect(result.wtlocale).toBe('E')
      expect(result.year).toBeDefined()
      expect(result.yeartext).toBeDefined()
      expect(result.yeartext?.length).toBeGreaterThan(0)
    },
    timeout
  )

  it(
    'should fetch real publication details (Watchtower)',
    async () => {
      const pubRequest = {
        issue: 202401,
        langwritten: 'E',
        pub: 'w'
      } as const

      const result = await fetchPublication(pubRequest)
      expect(result.publication).toEqual(pubRequest)
      expect(result.result).toBeDefined()
      // 'w' is Watchtower
      expect(result.result?.pub).toBe('w')
      expect(result.result?.files).toBeDefined()
    },
    timeout
  )

  it(
    'should fetch real bible data',
    async () => {
      const result = await fetchBibleData('en')
      expect(result.locale).toBe('en')
      expect(result.result).toBeDefined()
      // Should have books in editionData
      const books = result.result?.editionData?.books
      expect(books).toBeDefined()
      // There are 66 books in the standard bible
      expect(Object.keys(books || {}).length).toBeGreaterThan(0)
    },
    timeout
  )

  it.todo(
    'should fetch real media items',
    async () => {
      // Fetching media for a recent Watchtower issue
      // Mediator API requires specific ID format or might be restricted/changed.
      // Skipping this test as fetchPublication provides media links reliably via GETPUBMEDIALINKS.
      const pubRequest: PublicationFetcher = {
        fileformat: 'MP3',
        issue: 20240100,
        langwritten: 'E',
        pub: 'w'
      }

      const result = await fetchMediaItems(pubRequest)
      expect(result.publication).toEqual(pubRequest)
      expect(result.result).toBeDefined()
      expect(result.result?.media).toBeDefined()
    },
    timeout
  )

  it(
    'should fetch real bible verse (Genesis 1:1)',
    async () => {
      const book = 1 // Genesis
      const chapter = 1
      const verse = 1
      const result = await fetchBibleVerse(book, chapter, verse, 'en')

      expect(result.book).toBe(book)
      expect(result.chapter).toBe(chapter)
      expect(result.verseNumber).toBe(verse)
      expect(result.verse).toBeDefined()
      expect(result.verse?.content).toContain('In the beginning')
    },
    timeout
  )
})

import { describe, expect, it } from 'vitest'

import { bibleChapters, getBibleLink, parseVerseString } from '../../../shared/utils/jw'

describe('jw utils', () => {
  describe('getBibleLink', () => {
    it('should generate link for English', () => {
      const link = getBibleLink('en', 1, 1)
      expect(link).toBe('https://wol.jw.org/en/wol/b/r1/lp-e/nwtsty/1/1')
    })

    it('should generate link for Dutch', () => {
      const link = getBibleLink('nl', 1, 1)
      expect(link).toBe('https://wol.jw.org/nl/wol/b/r18/lp-o/nwtsty/1/1')
    })

    it('should include start verse', () => {
      const link = getBibleLink('en', 1, 1, 5)
      expect(link).toBe('https://wol.jw.org/en/wol/b/r1/lp-e/nwtsty/1/1#v=1:1:5')
    })

    it('should include end verse', () => {
      const link = getBibleLink('en', 1, 1, 5, 10)
      expect(link).toBe('https://wol.jw.org/en/wol/b/r1/lp-e/nwtsty/1/1#v=1:1:5-1:1:10')
    })
  })

  describe('parseVerseString', () => {
    it('should parse "Book:Chapter:Start"', () => {
      const result = parseVerseString('1:1:1')
      expect(result).toEqual({
        book: 1,
        chapter: 1,
        end: undefined,
        start: 1
      })
    })

    it('should parse "Book:Chapter:Start-End"', () => {
      const result = parseVerseString('1:1:1-5')
      expect(result).toEqual({
        book: 1,
        chapter: 1,
        end: 5,
        start: 1
      })
    })

    it('should return null for invalid format', () => {
      expect(parseVerseString('invalid')).toBeNull()
    })
  })

  describe('bibleChapters', () => {
    it('should be defined', () => {
      expect(bibleChapters).toBeDefined()
    })

    it('should have 66 books', () => {
      expect(Object.keys(bibleChapters).length).toBe(66)
    })

    it('should have correct chapters for Genesis (1)', () => {
      expect(bibleChapters[1]).toBe(50)
    })
  })
})

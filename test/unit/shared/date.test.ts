import { describe, expect, it } from 'vitest'

import { hasOverlap, yearToTimestamp } from '../../../shared/utils/date'

describe('date utils', () => {
  describe('yearToTimestamp', () => {
    it('should return correct timestamp for positive year start', () => {
      const year = 2023
      // Jan 1st 2023
      const expected = new Date(2023, 0, 1).getTime()
      expect(yearToTimestamp(year, 'start')).toBe(expected)
    })

    it('should return correct timestamp for positive year end', () => {
      const year = 2023
      // Dec 31st 2023
      const expected = new Date(2023, 11, 31).getTime()
      expect(yearToTimestamp(year, 'end')).toBe(expected)
    })

    it('should return correct timestamp for negative year (BC)', () => {
      const year = -100
      const timestamp = new Date(year, 0, 1).getTime()
      const expected = timestamp + 31539600000

      expect(yearToTimestamp(year, 'start')).toBe(expected)
    })
  })

  describe('hasOverlap', () => {
    it('should return true for overlapping ranges', () => {
      const range1 = { end: 200, start: 100 }
      const range2 = { end: 250, start: 150 }
      expect(hasOverlap(range1, range2)).toBe(true)
    })

    it('should return true for contained ranges', () => {
      const range1 = { end: 300, start: 100 }
      const range2 = { end: 250, start: 150 }
      expect(hasOverlap(range1, range2)).toBe(true)
    })

    it('should return false for non-overlapping ranges (before)', () => {
      const range1 = { end: 200, start: 100 }
      const range2 = { end: 350, start: 250 }
      expect(hasOverlap(range1, range2)).toBe(false)
    })

    it('should return false for non-overlapping ranges (after)', () => {
      const range1 = { end: 400, start: 300 }
      const range2 = { end: 200, start: 100 }
      expect(hasOverlap(range1, range2)).toBe(false)
    })

    it('should handle touching ranges', () => {
      const range1 = { end: 200, start: 100 }
      const range2 = { end: 300, start: 200 }
      expect(hasOverlap(range1, range2)).toBe(true)
    })
  })
})

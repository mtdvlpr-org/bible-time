import { describe, expect, it } from 'vitest'

import { capitalize, deslugify, slugify } from '../../../shared/utils/formatters'

describe('formatters utils', () => {
  describe('capitalize', () => {
    it('should capitalize the first letter', () => {
      expect(capitalize('hello')).toBe('Hello')
    })

    it('should handle empty string', () => {
      expect(capitalize('')).toBe('')
    })

    it('should handle single character', () => {
      expect(capitalize('a')).toBe('A')
    })
  })

  describe('slugify', () => {
    it('should slugify a string', () => {
      expect(slugify('Hello World')).toBe('hello-world')
    })

    it('should handle special characters', () => {
      expect(slugify('Hello & World!')).toBe('hello-world')
    })

    it('should handle leading/trailing dashes if final=true', () => {
      expect(slugify(' - Hello - ')).toBe('hello')
    })

    it('should not strip leading/trailing dashes if final=false', () => {
      expect(slugify(' - Hello - ', false)).toBe('-hello-')
    })

    it('should return empty string for undefined', () => {
      expect(slugify(undefined)).toBe('')
    })
  })

  describe('deslugify', () => {
    it('should deslugify a string', () => {
      expect(deslugify('hello-world')).toBe('Hello World')
    })

    it('should capitalize each word', () => {
      expect(deslugify('hello-beautiful-world')).toBe('Hello Beautiful World')
    })

    it('should return empty string for null', () => {
      expect(deslugify(null)).toBe('')
    })
  })
})

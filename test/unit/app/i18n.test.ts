import { describe, expect, it } from 'vitest'

import { getEmojiFlag, uiLocales } from '../../../app/utils/i18n'

describe('app i18n utils', () => {
  describe('uiLocales', () => {
    it('should have en and nl locales', () => {
      expect(uiLocales).toHaveProperty('en')
      expect(uiLocales).toHaveProperty('nl')
    })
  })

  describe('getEmojiFlag', () => {
    it('should return correct flag for en', () => {
      expect(getEmojiFlag('en')).toBe('🇬🇧')
    })

    it('should return correct flag for nl', () => {
      // Falls back to country code from locale or similar logic
      expect(getEmojiFlag('nl')).toBe('🇳🇱')
    })

    it('should return mapped flag for ar', () => {
      expect(getEmojiFlag('ar')).toBe('🇸🇦')
    })
  })
})

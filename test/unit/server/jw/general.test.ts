import { describe, expect, it, vi } from 'vitest'

import type { MediaItemFile } from '../../../../shared/types/jw/media'
import type { PublicationFetcher } from '../../../../shared/types/jw/publication'

import {
  extractLangCode,
  extractPubId,
  extractResolution,
  findBestMatch,
  generatePubId,
  generateVerseId,
  isJwLangCode,
  isPubId
} from '../../../../server/utils/jw/general'
import { jwLangCodes } from '../../../../shared/types/jw/lang.types'

vi.stubGlobal('jwLangCodes', jwLangCodes)

describe('jw general utils', () => {
  describe('isPubId', () => {
    it('should return true for docid-', () => {
      expect(isPubId('docid-123456')).toBe(true)
    })

    it('should return true for pub-', () => {
      expect(isPubId('pub-jw')).toBe(true)
    })

    it('should return false for other strings', () => {
      expect(isPubId('something-else')).toBe(false)
    })
  })

  describe('generatePubId', () => {
    it('should generate docid format', () => {
      const pub = {
        docid: 123456,
        track: 1
      } as unknown as PublicationFetcher
      expect(generatePubId(pub)).toBe('docid-123456_1')
    })

    it('should generate pub format', () => {
      const pub = {
        issue: 20230100,
        pub: 'w',
        track: 1
      } as unknown as PublicationFetcher
      expect(generatePubId(pub)).toBe('pub-w_202301_1')
    })

    it('should handle file formats', () => {
      const videoPub = {
        docid: 123,
        fileformat: 'MP4'
      } as unknown as PublicationFetcher
      expect(generatePubId(videoPub)).toBe('docid-123_VIDEO')

      const audioPub = {
        docid: 123,
        fileformat: 'MP3'
      } as unknown as PublicationFetcher
      expect(generatePubId(audioPub)).toBe('docid-123_AUDIO')

      const otherPub = {
        docid: 123,
        fileformat: 'PDF'
      } as unknown as PublicationFetcher
      expect(generatePubId(otherPub)).toBe('docid-123')
    })
  })

  describe('isJwLangCode', () => {
    it('should return true for valid codes', () => {
      expect(isJwLangCode('E')).toBe(true)
      expect(isJwLangCode('S')).toBe(true)
    })

    it('should return false for invalid codes', () => {
      expect(isJwLangCode('XYZ')).toBe(false)
    })
  })

  describe('extractLangCode', () => {
    it('should return input if it is a valid code', () => {
      expect(extractLangCode('E')).toBe('E')
    })

    it('should extract from wtlocale param', () => {
      expect(extractLangCode('https://jw.org?wtlocale=E')).toBe('E')
    })

    it('should extract from langwritten param', () => {
      expect(extractLangCode('https://jw.org?langwritten=S')).toBe('S')
    })

    it('should return null if not found', () => {
      expect(extractLangCode('https://jw.org')).toBe(null)
    })

    it('should return null on invalid input', () => {
      expect(extractLangCode('not-a-url')).toBe(null)
    })
  })

  describe('extractPubId', () => {
    it('should return input if it is a valid id', () => {
      expect(extractPubId('pub-jw')).toBe('pub-jw')
    })

    it('should extract from lank param', () => {
      expect(extractPubId('https://jw.org?lank=pub-jw')).toBe('pub-jw')
    })

    it('should extract from docid param', () => {
      expect(extractPubId('https://jw.org?docid=docid-123')).toBe('docid-123')
    })

    it('should extract from path', () => {
      expect(extractPubId('https://jw.org/pub-jw')).toBe('pub-jw')
    })

    it('should return null if not found', () => {
      expect(extractPubId('https://jw.org')).toBe(null)
    })

    it('should return null on invalid input', () => {
      expect(extractPubId('not-a-url')).toBe(null)
    })
  })

  describe('generateVerseId', () => {
    it('should generate correct ID', () => {
      expect(generateVerseId(1, 1, 1)).toBe('1001001')
      expect(generateVerseId(66, 150, 176)).toBe('66150176')
    })
  })

  describe('extractResolution', () => {
    it('should extract resolution from label', () => {
      expect(extractResolution({ label: '720p' } as unknown as MediaItemFile)).toBe(720)
      expect(extractResolution({ label: '480p' } as unknown as MediaItemFile)).toBe(480)
    })

    it('should return 0 if no match', () => {
      expect(extractResolution({ label: 'HD' } as unknown as MediaItemFile)).toBe(0)
    })
  })

  describe('findBestMatch', () => {
    const media = [
      { label: '480p', subtitles: { url: 'sub' } },
      { label: '720p' },
      { label: '360p' }
    ] as unknown as MediaItemFile[]

    it('should return null for empty list', () => {
      expect(findBestMatch([])).toBe(null)
    })

    it('should return single item', () => {
      expect(findBestMatch([media[0]])).toBe(media[0])
    })

    it('should sort by resolution', () => {
      // Should pick 720p as it is the highest resolution
      expect(findBestMatch(media)).toEqual(media[1]) // 720p
    })

    it('should prioritize subtitles if requested', () => {
      expect(findBestMatch(media, true)).toEqual(media[0]) // 480p has subtitles
    })
  })
})

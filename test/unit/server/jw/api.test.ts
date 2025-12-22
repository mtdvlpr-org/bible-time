import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  fetchBibleData,
  fetchBibleVerse,
  fetchJwLanguages,
  fetchMediaItems,
  fetchPublication,
  fetchYeartext
} from '../../../../server/utils/jw/api'
import * as scraperUtils from '../../../../server/utils/jw/scraper'

const $fetch = vi.fn()
vi.stubGlobal('$fetch', $fetch)

vi.mock('../../../../server/utils/jw/scraper', () => ({
  scrapeBibleDataUrl: vi.fn()
}))

describe('jw api utils', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('fetchJwLanguages', () => {
    it('should fetch languages', async () => {
      const mockResult = { languages: [{ code: 'en', name: 'English' }] }
      vi.mocked($fetch).mockResolvedValue(mockResult)

      const result = await fetchJwLanguages('en')
      expect(result).toEqual({ languages: mockResult.languages, locale: 'en' })
      expect($fetch).toHaveBeenCalledWith('https://www.jw.org/en/languages/')
    })
  })

  describe('fetchYeartext', () => {
    it('should fetch yeartext', async () => {
      const mockResult = { content: 'God is love.' }
      vi.mocked($fetch).mockResolvedValue(mockResult)
      const year = 2024

      const result = await fetchYeartext('E', year)

      expect(result).toEqual({ wtlocale: 'E', year: 2024, yeartext: 'God is love.' })
      expect($fetch).toHaveBeenCalledWith(
        'https://wol.jw.org/wol/finder',
        expect.objectContaining({
          query: expect.objectContaining({
            docid: 1102024800,
            wtlocale: 'E'
          })
        })
      )
    })

    it('should default to current year if not provided', async () => {
      const mockResult = { content: 'Text' }
      vi.mocked($fetch).mockResolvedValue(mockResult)

      const result = await fetchYeartext('E')
      const currentYear = new Date().getFullYear()
      expect(result.year).toBe(currentYear)
    })
  })

  describe('fetchPublication', () => {
    it('should fetch publication details', async () => {
      const pubMock = { issue: '202401', langwritten: 'E', pub: 'w' } as const
      const mockApiResult = { pub: 'w', title: 'Watchtower' }
      vi.mocked($fetch).mockResolvedValue(mockApiResult)

      const result = await fetchPublication(pubMock)
      expect(result).toEqual({ publication: pubMock, result: mockApiResult })
      expect($fetch).toHaveBeenCalledWith(
        'https://b.jw-cdn.org/apis/pub-media/GETPUBMEDIALINKS',
        expect.objectContaining({
          query: expect.objectContaining({
            issue: '202401',
            langwritten: 'E',
            pub: 'w'
          })
        })
      )
    })
  })

  describe('fetchMediaItems', () => {
    it('should fetch media items', async () => {
      const pubMock = {
        fileformat: 'MP3',
        issue: '20240100',
        langwritten: 'E',
        pub: 'w',
        track: '1'
      } as const
      const mockApiResult = { media: [] }
      vi.mocked($fetch).mockResolvedValue(mockApiResult)

      const result = await fetchMediaItems(pubMock)

      expect(result).toEqual({ publication: pubMock, result: mockApiResult })

      expect($fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://b.jw-cdn.org/apis/mediator/v1/media-items/E/')
      )
    })
  })

  describe('fetchBibleData', () => {
    it('should fetch bible data', async () => {
      const locale = 'en'
      const mockUrl = 'https://mock-url'
      const mockResult = { books: [] }

      vi.mocked(scraperUtils.scrapeBibleDataUrl).mockResolvedValue(mockUrl)
      vi.mocked($fetch).mockResolvedValue(mockResult)

      const result = await fetchBibleData(locale)

      expect(result).toEqual({ locale, result: mockResult })
      expect(scraperUtils.scrapeBibleDataUrl).toHaveBeenCalledWith(locale)
      expect($fetch).toHaveBeenCalledWith(mockUrl)
    })
  })

  describe('fetchBibleVerse', () => {
    it('should fetch bible verse', async () => {
      const book = 1
      const chapter = 1
      const verseNumber = 1
      const locale = 'en'
      const mockUrl = 'https://mock-url'
      const verseId = '1001001'
      const mockResult = {
        ranges: {
          [verseId]: {
            verses: [{ content: 'In the beginning...' }]
          }
        }
      }

      vi.mocked(scraperUtils.scrapeBibleDataUrl).mockResolvedValue(mockUrl)
      vi.mocked($fetch).mockResolvedValue(mockResult)

      const result = await fetchBibleVerse(book, chapter, verseNumber, locale)

      expect(result.verse).toEqual({ content: 'In the beginning...' })
      expect(result).toEqual({
        book,
        chapter,
        locale,
        verse: { content: 'In the beginning...' },
        verseNumber
      })
      expect($fetch).toHaveBeenCalledWith(`${mockUrl}/${verseId}`)
    })
  })
})

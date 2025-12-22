import { findBestFileMatch, generatePubId, generateVerseId } from './general'
import { scrapeBibleDataUrl } from './scraper'

/**
 * Fetches the jw languages.
 * @param locale The locale to fetch the languages in.
 * @returns The jw languages.
 */
export const fetchJwLanguages = async (locale: JwLangSymbol = 'en') => {
  const result = await $fetch<JwLanguageResult>(`https://www.jw.org/${locale}/languages/`)

  return {
    languages: result?.languages.filter((l) => l.hasWebContent),
    locale
  }
}

interface YeartextResult {
  content: string
  exists: boolean
  jsonUrl: string
  url: string
}

/**
 * Fetches the yeartext.
 * @param wtlocale The yeartext locale.
 * @param year The year to fetch the yeartext for. Defaults to current year.
 * @returns The yeartext.
 */
export const fetchYeartext = async (wtlocale: JwLangCode, year?: number) => {
  const searchYear = year || new Date().getFullYear()
  const result = await $fetch<YeartextResult>(`https://wol.jw.org/wol/finder`, {
    query: {
      docid: `110${searchYear}800`,
      format: 'json',
      snip: 'yes',
      wtlocale
    }
  })

  return { wtlocale, year: searchYear, yeartext: result?.content }
}

/**
 * Fetches the publication details.
 * @param publication The publication to fetch the details for.
 * @returns The publication details.
 */
export const fetchPublication = async (publication: PublicationDocFetcher | PublicationFetcher) => {
  const result = await $fetch<Publication>(`https://b.jw-cdn.org/apis/pub-media/GETPUBMEDIALINKS`, {
    query: {
      ...publication,
      alllangs: '0',
      output: 'json',
      txtCMSLang: 'E'
    }
  })

  return { publication, result }
}

/**
 * Fetches the media items for the given publication.
 * @param publication The publication to fetch the media items for.
 * @returns The media items.
 */
export const fetchMediaItems = async (
  publication: PublicationDocFetcher | PublicationFetcher | { id: PubId; langwritten: JwLangCode }
) => {
  const url = `https://b.jw-cdn.org/apis/mediator/v1/media-items/${publication.langwritten}`

  const id = 'id' in publication ? publication.id : generatePubId(publication)
  const result = await $fetch<MediaItemsMediator>(`${url}/${id}`, { query: { clientType: 'www' } })

  return { publication, result }
}

export const fetchBibleData = async (locale: JwLangSymbol = 'en') => {
  const url = await scrapeBibleDataUrl(locale)
  const result = await $fetch<BibleResultEmpty>(url)

  return { locale, result }
}

export const fetchBibleVerse = async (
  book: BibleBookNr,
  chapter: number,
  verseNumber: number,
  locale: JwLangSymbol = 'en'
) => {
  const url = await scrapeBibleDataUrl(locale)
  const verseId = generateVerseId(book, chapter, verseNumber)
  const result = await $fetch<BibleResultSingle>(`${url}/${verseId}`)

  const verse = result?.ranges?.[verseId]?.verses?.[0]

  return { book, chapter, locale, verse, verseNumber }
}

export const fetchMediaWithSubtitles = async (
  publication: PublicationDocFetcher | PublicationFetcher | { id: PubId; langwritten: JwLangCode }
) => {
  const { result } = await fetchMediaItems(publication)

  const video = result?.media?.[0]
  const bestMatch = findBestFileMatch(video?.files ?? [], true)

  return { bestMatch, publication, video }
}

export const fetchSubtitles = async (
  publication: PublicationDocFetcher | PublicationFetcher | { id: PubId; langwritten: JwLangCode }
) => {
  const { bestMatch, video } = await fetchMediaWithSubtitles(publication)

  if (!bestMatch?.subtitles) return null
  const subtitles = await $fetch<string>(bestMatch.subtitles.url, { responseType: 'text' })

  return { bestMatch, publication, subtitles, video }
}

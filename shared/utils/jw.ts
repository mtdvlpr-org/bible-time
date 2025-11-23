import type { AppLocale } from '#shared/types/general.types'

export const getBibleLink = (
  locale: AppLocale,
  book: number,
  chapter: number,
  startVerse?: number,
  endVerse?: number
): string => {
  const bibleUrl: Record<AppLocale, string> = {
    en: 'https://wol.jw.org/en/wol/b/r1/lp-e/nwtsty',
    nl: 'https://wol.jw.org/nl/wol/b/r18/lp-o/nwtsty'
  }

  let url = `${bibleUrl[locale]}/${book}/${chapter}`

  if (startVerse) url += `#v=${book}:${chapter}:${startVerse}`
  if (endVerse) url += `-${book}:${chapter}:${endVerse}`

  return url
}

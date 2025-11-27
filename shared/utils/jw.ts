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

export const parseVerseString = (
  verse: string
): null | {
  book: keyof typeof bibleChapters
  chapter: number
  end: number | undefined
  start: number
} => {
  const [book, chapter, verses] = verse.split(':')
  const [start, end] = verses?.split('-') ?? []

  if (!book || !chapter || !start) return null

  return {
    book: parseInt(book) as keyof typeof bibleChapters,
    chapter: parseInt(chapter),
    end: end ? parseInt(end) : undefined,
    start: parseInt(start)
  }
}

export const bibleChapters = {
  1: 50,
  2: 40,
  3: 27,
  4: 36,
  5: 34,
  6: 24,
  7: 21,
  8: 4,
  9: 31,
  10: 24,
  11: 22,
  12: 25,
  13: 29,
  14: 36,
  15: 10,
  16: 13,
  17: 10,
  18: 42,
  19: 150,
  20: 31,
  21: 12,
  22: 8,
  23: 66,
  24: 52,
  25: 5,
  26: 48,
  27: 12,
  28: 14,
  29: 3,
  30: 9,
  31: 1,
  32: 4,
  33: 7,
  34: 3,
  35: 3,
  36: 3,
  37: 2,
  38: 14,
  39: 4,
  40: 28,
  41: 16,
  42: 24,
  43: 21,
  44: 28,
  45: 16,
  46: 16,
  47: 13,
  48: 6,
  49: 6,
  50: 4,
  51: 4,
  52: 5,
  53: 3,
  54: 6,
  55: 4,
  56: 3,
  57: 1,
  58: 13,
  59: 5,
  60: 5,
  61: 3,
  62: 5,
  63: 1,
  64: 1,
  65: 1,
  66: 22
} satisfies Record<number, number>

import { z } from 'zod'

export default defineMcpTool({
  annotations: {
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: true,
    readOnlyHint: true
  },
  cache: '4w',
  description: 'Get a Bible verse from JW.org.',
  handler: async ({ book, chapter, symbol, verseNumber }) => {
    const verse = await fetchBibleVerse(book as BibleBookNr, chapter, verseNumber, symbol)

    return {
      content: [
        {
          text: verse?.verse?.content ?? 'No verse found.',
          type: 'text'
        }
      ]
    }
  },
  inputSchema: {
    book: z
      .number()
      .min(1)
      .max(66)
      .describe(
        'The Bible book number (1-66). Can be found in the Bible Books resource. Example: 1 for Genesis, 2 for Exodus, etc.'
      ),
    chapter: z
      .number()
      .min(1)
      .max(150)
      .describe('The Bible chapter number. The number of the chapter in the book.'),
    symbol: z
      .enum(jwLangSymbols)
      .describe(
        'The language of the Bible. Example: en for English, nl for Dutch, es for Spanish. See JW Languages for the full list. Default to English.'
      )
      .optional()
      .default('en'),
    verseNumber: z
      .number()
      .min(1)
      .max(176)
      .describe('The Bible verse number (1-176). The number of the verse in the chapter.')
  }
})

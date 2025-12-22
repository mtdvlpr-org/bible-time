import { z } from 'zod'

export default defineMcpTool({
  annotations: {
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: true,
    readOnlyHint: true
  },
  cache: '4w',
  description: 'Get information about the different books of the Bible.',
  handler: async ({ symbol }) => {
    try {
      const { result } = await fetchBibleData(symbol as JwLangSymbol)
      return mcpService.jsonResourceReference(
        `file:///bible/${symbol}/books.json`,
        result.editionData.books
      )
    } catch (e) {
      return mcpService.toolError(e)
    }
  },
  inputSchema: {
    symbol: z
      .enum(jwLangSymbols)
      .describe(
        'The language for the bible books. Example: en for English, nl for Dutch, es for Spanish. See JW Languages for the full list.'
      )
      .default('en')
  }
})

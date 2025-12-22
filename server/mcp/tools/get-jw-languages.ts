export default defineMcpTool({
  annotations: {
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: true,
    readOnlyHint: true
  },
  cache: '4w',
  description: 'Get the JW Languages resource.',
  handler: async () => {
    try {
      const result = await fetchJwLanguages()
      return mcpService.jsonResourceReference('file:///jw/languages.json', result.languages)
    } catch (e) {
      return mcpService.toolError(e)
    }
  },
  title: 'Get JW Languages'
})

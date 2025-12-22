export default defineMcpResource({
  cache: '4w',
  description: 'Supported languages for JW.org',
  handler: async (uri: URL) => {
    try {
      const { languages } = await fetchJwLanguages()
      return mcpService.jsonResource(uri, languages)
    } catch (e) {
      return mcpService.resourceError(uri, e)
    }
  },
  metadata: { mimeType: 'application/json' },
  title: 'JW Languages',
  uri: 'file:///jw/languages.json'
})

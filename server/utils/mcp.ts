type MimeType = 'application/json' | 'text/markdown' | 'text/plain'

const resource = (uri: URL, text: string, mimeType: MimeType = 'text/plain') => ({
  contents: [{ mimeType, text, uri: uri.toString() }]
})

const resourceReference = (uri: string, text: string, mimeType: MimeType = 'text/plain') => ({
  content: [{ resource: { mimeType, text, uri }, type: 'resource' as const }]
})

export const mcpService = {
  jsonResource: (uri: URL, data: unknown) =>
    resource(uri, JSON.stringify(data, null, 2), 'application/json'),

  jsonResourceReference: (uri: string, data: unknown) =>
    resourceReference(uri, JSON.stringify(data, null, 2), 'application/json'),
  resource,
  resourceError: (uri: URL, e: unknown) => ({
    ...resource(uri, `Error: ${e instanceof Error ? e.message : String(e)}`, 'text/plain'),
    isError: true
  }),
  resourceReference,
  toolError: (e: unknown) => ({
    content: [
      { text: `Error: ${e instanceof Error ? e.message : String(e)}`, type: 'text' as const }
    ],
    isError: true
  })
}

import { z } from 'zod'

export default defineMcpTool({
  annotations: {
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: true,
    readOnlyHint: true
  },
  cache: '4w',
  description: 'Get the transcript of a video from JW.org.',
  handler: async ({ langcode, url }) => {
    const id = extractPubId(url)
    const langwritten = extractLangCode(url)
    if (!id) throw new Error('Invalid JW Video URL')
    const video = await fetchSubtitles({ id, langwritten: langcode || langwritten || 'E' })

    return {
      content: [
        {
          text: video?.subtitles ?? 'No transcript found.',
          type: 'text'
        }
      ],
      structuredContent: {
        subtitles: video?.subtitles ?? 'No transcript found.',
        thumbnail: findBestImage(video?.video.images ?? {}) ?? '',
        title: video?.video.title
      }
    }
  },
  inputSchema: {
    langcode: z
      .enum(jwLangCodes)
      .describe(
        'The language code of the video. Example: E for English, O for Dutch, S for Spanish. See JW Languages for the full list. If not provided, will try to extract it from the video URL. If that fails, will default to English.'
      )
      .optional(),
    url: z
      .url()
      .describe(
        'A JW Video URL. Examples: https://www.jw.org/finder?srcid=share&wtlocale=E&lank=pub-imv_4_VIDEO or https://www.jw.org/en/library/videos/#en/mediaitems/FeaturedLibraryVideos/pub-imv_4_VIDEO'
      )
  },
  outputSchema: {
    subtitles: z.string().describe('The subtitles of the video.'),
    thumbnail: z.string().describe('The thumbnail of the video.'),
    title: z.string().describe('The title of the video.')
  }
})

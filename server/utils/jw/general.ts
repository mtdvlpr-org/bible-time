export const isPubId = (input: string): input is PubId => {
  return input.startsWith('docid-') || input.startsWith('pub-')
}

export const generatePubId = (publication: PublicationDocFetcher | PublicationFetcher): PubId => {
  const audioFormats: Set<PublicationFileFormat> = new Set(['AAC', 'MP3'])
  const videoFormats: Set<PublicationFileFormat> = new Set(['3GP', 'M4V', 'MP4'])

  return [
    publication.docid ? `docid-${publication.docid}` : `pub-${publication.pub}`,
    publication.docid ? null : publication.issue?.toString().replace(/(\d{6})00$/gm, '$1'),
    publication.track,
    publication.fileformat
      ? videoFormats.has(publication.fileformat)
        ? 'VIDEO'
        : audioFormats.has(publication.fileformat)
          ? 'AUDIO'
          : null
      : null
  ]
    .filter((v) => !!v && v !== '0')
    .join('_') as PubId
}

export const isJwLangCode = (input: string): input is JwLangCode => {
  return jwLangCodes.includes(input as JwLangCode)
}

export const extractLangCode = (input: string): JwLangCode | null => {
  if (isJwLangCode(input)) return input

  try {
    const url = new URL(input)

    const wtlocale = url.searchParams.get('wtlocale')
    if (wtlocale && isJwLangCode(wtlocale)) return wtlocale

    const langwritten = url.searchParams.get('langwritten')
    if (langwritten && isJwLangCode(langwritten)) return langwritten

    return null
  } catch {
    return null
  }
}

export const extractPubId = (input: string): null | PubId => {
  if (isPubId(input)) return input

  try {
    const url = new URL(input)

    const lank = url.searchParams.get('lank')
    if (lank && isPubId(lank)) return lank

    const docid = url.searchParams.get('docid')
    if (docid && isPubId(docid)) return docid

    const match = url.pathname.match(/\/((?:pub|docid)-[^/]+)/)
    if (match && isPubId(match[1])) return match[1]

    return null
  } catch {
    return null
  }
}

export const generateVerseId = (
  book: BibleBookNr,
  chapter: number,
  verseNumber: number
): VerseId => {
  return `${book}${chapter.toString().padStart(3, '0')}${verseNumber.toString().padStart(3, '0')}` as VerseId
}

export const extractResolution = (file: MediaItemFile): number => {
  const resolution = file.label.match(/(\d+)p/)?.[1]
  if (!resolution) return 0
  return parseInt(resolution)
}

export const findBestMatch = (
  media: MediaItemFile[],
  withSubtitles = false
): MediaItemFile | null => {
  if (media.length === 0) return null
  if (media.length === 1) return media[0]

  const sorted = [...media].sort((a, b) => extractResolution(b) - extractResolution(a))
  return withSubtitles ? (sorted.find((file) => file.subtitles) ?? sorted[0]) : sorted[0]
}

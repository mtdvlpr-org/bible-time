import type { JwLangCode, JwLangSymbol } from './lang'

export type ImageSize = 'lg' | 'md' | 'sm' | 'xl' | 'xs'
export type ImageType = 'lsr' | 'lss' | 'pnr' | 'sqr' | 'sqs' | 'wsr' | 'wss'

/* eslint-disable perfectionist/sort-interfaces */
export interface MediaItem {
  guid: string
  languageAgnosticNaturalKey: PubId
  naturalKey: string
  type: string
  primaryCategory: string
  title: string
  description: string
  firstPublished: `${number}-${number}-${number}T${number}:${number}:${number}.${number}Z`
  duration: number
  durationFormattedHHMM: `${number}:${number}`
  durationFormattedMinSec: `${number}m ${number}s`
  tags: string[]
  files: MediaItemFile[]
  images: Partial<Record<ImageType, Partial<Record<ImageSize, string>>>>
  availableLanguages: JwLangCode[]
  printReferences: string[]
}
/* eslint-enable perfectionist/sort-interfaces */

/* eslint-disable perfectionist/sort-interfaces */
/* eslint-disable perfectionist/sort-object-types */
export interface MediaItemFile {
  progressiveDownloadURL: string
  checksum: string
  filesize: number
  modifiedDatetime: `${number}-${number}-${number}T${number}:${number}:${number}.${number}Z`
  bitRate: number
  duration: number
  frameHeight: number
  frameWidth: number
  label: `${number}p`
  frameRate: number
  mimetype: `${string}/${string}`
  subtitled: boolean
  subtitles?: {
    url: string
    modifiedDatetime: `${number}-${number}-${number}T${number}:${number}:${number}.${number}Z`
    checksum: string
  }
}
/* eslint-enable perfectionist/sort-interfaces */
/* eslint-enable perfectionist/sort-object-types */

export interface MediaItemsMediator {
  language: {
    direction: 'ltr' | 'rtl'
    isSignLanguage: boolean
    languageCode: JwLangCode
    locale: JwLangSymbol
    script: string
  }
  media: MediaItem[]
}

export type PubId = `docid-${string}` | `pub-${string}`

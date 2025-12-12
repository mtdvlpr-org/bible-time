import type { Enums } from './database.types'

export type AppLocale = Enums<'app_lang'>

export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export type StatKey = 'events' | 'people' | 'suggestions' | 'users'

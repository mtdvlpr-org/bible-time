import type { Locale, Messages } from '@nuxt/ui'

import { en, nl } from '@nuxt/ui/locale'

export const uiLocales = { en, nl } satisfies Record<AppLocale, Locale<Messages>>

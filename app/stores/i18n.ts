type State = {
  keys: Set<string>
  translations: Record<AppLocale, { id: number; key: string; value: string }[]>
}

export const useI18nStore = defineStore('i18n', {
  actions: {
    async fetch(locale: AppLocale, refresh = false) {
      if (this.translations[locale].length > 0 && !refresh) return

      const supabase = useSupabaseClient()
      const {
        data: translations,
        error,
        status,
        statusText
      } = await supabase.from('translations').select('id, key, value').eq('lang', locale)

      if (error) {
        supabaseService.handleError(error, status, statusText)
      } else if (translations) {
        this.translations[locale] = translations
      }
    },
    async fetchKeys(refresh = false) {
      if (this.keys.size > 0 && !refresh) return

      const supabase = useSupabaseClient()

      const [names, titles] = await Promise.all([
        supabase.from('people').select('name'),
        supabase.from('events').select('title')
      ])

      if (names.error) {
        supabaseService.handleError(names.error, names.status, names.statusText)
      } else if (titles.error) {
        supabaseService.handleError(titles.error, titles.status, titles.statusText)
      } else {
        this.keys = new Set([
          ...(names.data?.map((n) => n.name) ?? []),
          ...(titles.data?.map((t) => t.title) ?? [])
        ])
      }
    }
  },
  persist: true,
  state: (): State => ({
    keys: new Set<string>(),
    translations: {
      en: [],
      nl: []
    }
  })
})

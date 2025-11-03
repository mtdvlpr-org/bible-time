type State = {
  translations: Record<AppLocale, { key: string; value: string }[]>
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
      } = await supabase.from('translations').select('key, value').eq('lang', locale)

      if (error) {
        supabaseService.handleError(error, status, statusText)
      } else if (translations) {
        this.translations[locale] = translations
      }
    },
    translate(key: string) {
      const locale = useI18n().locale.value
      const translation = this.translations[locale].find((t) => t.key === key)
      return translation ? translation.value : key
    }
  },
  persist: true,
  state: (): State => ({
    translations: {
      en: [],
      nl: []
    }
  })
})

type State = {
  translations: Record<AppLocale, Record<string, string>>
}

export const useI18nStore = defineStore('i18n', {
  actions: {
    addTranslation(locale: AppLocale, key: string, value: string) {
      this.translations = {
        ...this.translations,
        [locale]: { ...this.translations[locale], [key]: value }
      }
    },
    async fetch(locale: AppLocale, refresh = false) {
      if (Object.keys(this.translations[locale]).length > 0 && !refresh) return

      const supabase = useSupabaseClient()
      const {
        data: translations,
        error,
        status,
        statusText
      } = await supabase.from('translations').select('key, value').eq('lang', locale)

      if (error) {
        handleSupabaseError(error, status, statusText)
      } else if (translations) {
        this.translations[locale] = translations.reduce<Record<string, string>>(
          (acc, { key, value }) => {
            acc[key] = value
            return acc
          },
          {}
        )
      }
    }
  },
  persist: true,
  state: (): State => ({
    translations: {
      en: {},
      nl: {}
    }
  })
})

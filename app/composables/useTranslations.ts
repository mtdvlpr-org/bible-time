export default function () {
  const { locale, t } = useI18n()
  const i18nStore = useI18nStore()

  const translate = (key: string, fallback = true) => {
    const translation = i18nStore.translations[locale.value][key]
    return translation || (fallback ? key : '')
  }

  const translateRelation = (
    relation: 'father' | 'mother' | Enums<'event_relation'> | Enums<'person_relation'>
  ): string => {
    switch (relation) {
      case 'author':
        return t('relation.author')
      case 'contemporary':
        return t('relation.contemporary')
      case 'father':
        return t('relation.father')
      case 'friend':
        return t('relation.friend')
      case 'mother':
        return t('relation.mother')
      case 'other':
        return t('general.other')
      case 'participant':
        return t('relation.participant')
      case 'sibling':
        return t('relation.sibling')
      case 'spouse':
        return t('relation.spouse')
    }
  }

  return { translate, translateRelation }
}

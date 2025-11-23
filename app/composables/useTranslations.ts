export default function () {
  const { locale, t } = useI18n()
  const i18nStore = useI18nStore()

  const translate = (key: string, fallback = true) => {
    const translation = i18nStore.translations[locale.value][key]
    return translation || (fallback ? key : '')
  }

  const translateSuggestionStatus = (status: Enums<'suggestion_status'>): string => {
    switch (status) {
      case 'approved':
        return t('suggestion.approved')
      case 'pending':
        return t('suggestion.pending')
      case 'rejected':
        return t('suggestion.rejected')
    }
  }

  const translateSuggestionType = (type: Enums<'suggestion_type'>): string => {
    switch (type) {
      case 'event.create':
        return t('event.create')
      case 'event.update':
        return t('event.edit')
      case 'person.create':
        return t('person.create')
      case 'person.update':
        return t('person.edit')
      case 'translation.create':
        return t('general.translate')
      case 'translation.update':
        return t('general.translate')
    }
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

  const translateBook = (id: number, short = false) => {
    switch (id) {
      case 1:
        return short ? t('bible.abbreviations.genesis') : t('bible.books.genesis')
      case 2:
        return short ? t('bible.abbreviations.exodus') : t('bible.books.exodus')
      case 3:
        return short ? t('bible.abbreviations.leviticus') : t('bible.books.leviticus')
      case 4:
        return short ? t('bible.abbreviations.numbers') : t('bible.books.numbers')
      case 5:
        return short ? t('bible.abbreviations.deuteronomy') : t('bible.books.deuteronomy')
      case 6:
        return short ? t('bible.abbreviations.joshua') : t('bible.books.joshua')
      case 7:
        return short ? t('bible.abbreviations.judges') : t('bible.books.judges')
      case 8:
        return short ? t('bible.abbreviations.ruth') : t('bible.books.ruth')
      case 9:
        return short ? t('bible.abbreviations.1-samuel') : t('bible.books.1-samuel')
      case 10:
        return short ? t('bible.abbreviations.2-samuel') : t('bible.books.2-samuel')
      case 11:
        return short ? t('bible.abbreviations.1-kings') : t('bible.books.1-kings')
      case 12:
        return short ? t('bible.abbreviations.2-kings') : t('bible.books.2-kings')
      case 13:
        return short ? t('bible.abbreviations.1-chronicles') : t('bible.books.1-chronicles')
      case 14:
        return short ? t('bible.abbreviations.2-chronicles') : t('bible.books.2-chronicles')
      case 15:
        return short ? t('bible.abbreviations.ezra') : t('bible.books.ezra')
      case 16:
        return short ? t('bible.abbreviations.nehemiah') : t('bible.books.nehemiah')
      case 17:
        return short ? t('bible.abbreviations.esther') : t('bible.books.esther')
      case 18:
        return short ? t('bible.abbreviations.job') : t('bible.books.job')
      case 19:
        return short ? t('bible.abbreviations.psalms') : t('bible.books.psalms')
      case 20:
        return short ? t('bible.abbreviations.proverbs') : t('bible.books.proverbs')
      case 21:
        return short ? t('bible.abbreviations.ecclesiastes') : t('bible.books.ecclesiastes')
      case 22:
        return short ? t('bible.abbreviations.song-of-solomon') : t('bible.books.song-of-solomon')
      case 23:
        return short ? t('bible.abbreviations.isaiah') : t('bible.books.isaiah')
      case 24:
        return short ? t('bible.abbreviations.jeremiah') : t('bible.books.jeremiah')
      case 25:
        return short ? t('bible.abbreviations.lamentations') : t('bible.books.lamentations')
      case 26:
        return short ? t('bible.abbreviations.ezekiel') : t('bible.books.ezekiel')
      case 27:
        return short ? t('bible.abbreviations.daniel') : t('bible.books.daniel')
      case 28:
        return short ? t('bible.abbreviations.hosea') : t('bible.books.hosea')
      case 29:
        return short ? t('bible.abbreviations.joel') : t('bible.books.joel')
      case 30:
        return short ? t('bible.abbreviations.amos') : t('bible.books.amos')
      case 31:
        return short ? t('bible.abbreviations.obadiah') : t('bible.books.obadiah')
      case 32:
        return short ? t('bible.abbreviations.jonah') : t('bible.books.jonah')
      case 33:
        return short ? t('bible.abbreviations.micah') : t('bible.books.micah')
      case 34:
        return short ? t('bible.abbreviations.nahum') : t('bible.books.nahum')
      case 35:
        return short ? t('bible.abbreviations.habakkuk') : t('bible.books.habakkuk')
      case 36:
        return short ? t('bible.abbreviations.zephaniah') : t('bible.books.zephaniah')
      case 37:
        return short ? t('bible.abbreviations.haggai') : t('bible.books.haggai')
      case 38:
        return short ? t('bible.abbreviations.zechariah') : t('bible.books.zechariah')
      case 39:
        return short ? t('bible.abbreviations.malachi') : t('bible.books.malachi')
      case 40:
        return short ? t('bible.abbreviations.matthew') : t('bible.books.matthew')
      case 41:
        return short ? t('bible.abbreviations.mark') : t('bible.books.mark')
      case 42:
        return short ? t('bible.abbreviations.luke') : t('bible.books.luke')
      case 43:
        return short ? t('bible.abbreviations.john') : t('bible.books.john')
      case 44:
        return short ? t('bible.abbreviations.acts') : t('bible.books.acts')
      case 45:
        return short ? t('bible.abbreviations.romans') : t('bible.books.romans')
      case 46:
        return short ? t('bible.abbreviations.1-corinthians') : t('bible.books.1-corinthians')
      case 47:
        return short ? t('bible.abbreviations.2-corinthians') : t('bible.books.2-corinthians')
      case 48:
        return short ? t('bible.abbreviations.galatians') : t('bible.books.galatians')
      case 49:
        return short ? t('bible.abbreviations.ephesians') : t('bible.books.ephesians')
      case 50:
        return short ? t('bible.abbreviations.philippians') : t('bible.books.philippians')
      case 51:
        return short ? t('bible.abbreviations.colossians') : t('bible.books.colossians')
      case 52:
        return short ? t('bible.abbreviations.1-thessalonians') : t('bible.books.1-thessalonians')
      case 53:
        return short ? t('bible.abbreviations.2-thessalonians') : t('bible.books.2-thessalonians')
      case 54:
        return short ? t('bible.abbreviations.1-timothy') : t('bible.books.1-timothy')
      case 55:
        return short ? t('bible.abbreviations.2-timothy') : t('bible.books.2-timothy')
      case 56:
        return short ? t('bible.abbreviations.titus') : t('bible.books.titus')
      case 57:
        return short ? t('bible.abbreviations.philemon') : t('bible.books.philemon')
      case 58:
        return short ? t('bible.abbreviations.hebrews') : t('bible.books.hebrews')
      case 59:
        return short ? t('bible.abbreviations.james') : t('bible.books.james')
      case 60:
        return short ? t('bible.abbreviations.1-peter') : t('bible.books.1-peter')
      case 61:
        return short ? t('bible.abbreviations.2-peter') : t('bible.books.2-peter')
      case 62:
        return short ? t('bible.abbreviations.1-john') : t('bible.books.1-john')
      case 63:
        return short ? t('bible.abbreviations.2-john') : t('bible.books.2-john')
      case 64:
        return short ? t('bible.abbreviations.3-john') : t('bible.books.3-john')
      case 65:
        return short ? t('bible.abbreviations.jude') : t('bible.books.jude')
      case 66:
        return short ? t('bible.abbreviations.revelation') : t('bible.books.revelation')
      default:
        return ''
    }
  }

  return {
    translate,
    translateBook,
    translateRelation,
    translateSuggestionStatus,
    translateSuggestionType
  }
}

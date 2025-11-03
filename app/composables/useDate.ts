export default function () {
  const { t } = useI18n()

  const formatYear = (year: null | number, precision?: Enums<'date_precision'> | null) => {
    if (!year) return ''
    let prefix = ''

    switch (precision) {
      case 'after':
        prefix = t('date.after')
        break
      case 'before':
        prefix = t('date.before')
        break
      case 'circa':
        prefix = t('date.circa')
        break
    }

    if (prefix) prefix += ' '

    const yearAbs = Math.abs(year)
    const suffix = year < 0 ? t('date.bce') : t('date.ce')
    return `${prefix}${yearAbs} ${suffix}`
  }

  return { formatYear }
}

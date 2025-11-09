export const capitalize = <S extends string>(str: S): Capitalize<S> => {
  return (str?.[0] ? str[0].toUpperCase() + str.slice(1) : '') as Capitalize<S>
}

export const slugify = (str: string | undefined, final = true): string => {
  if (!str) return ''
  let slug = str.toLowerCase()
  if (final) slug = slug.trim()
  slug = slug.replace(/[\s\W-]+/g, '-')
  if (final) slug = slug.replace(/^-+|-+$/g, '')
  return slug
}

export const deslugify = (slug: null | string): string => {
  if (!slug) return ''
  return slug.replace(/-/g, ' ').replace(/\b\w/g, capitalize)
}

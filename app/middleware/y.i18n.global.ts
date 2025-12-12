export default defineNuxtRouteMiddleware((to, _from) => {
  if (to.path === '/' || to.path.includes('.')) return

  // Check if locale is present in the url
  const routeLocale = to.path.split('/')[1] as AppLocale
  const locales = new Set(Constants.public.Enums.app_lang)
  if (locales.has(routeLocale)) return

  // If not, add locale to path
  const browserLocale = useBrowserLocale() as AppLocale
  const cookieLocale = useCookie('i18n_locale') as Ref<AppLocale>

  const locale = locales.has(cookieLocale.value || browserLocale)
    ? cookieLocale.value || browserLocale
    : 'en'

  return navigateTo({
    hash: to.hash,
    path: `/${locale}${to.fullPath}`,
    query: to.query
  })
})

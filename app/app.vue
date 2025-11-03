<template>
  <UApp :locale="uiLocales[locale]">
    <NuxtLoadingIndicator />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
const { locale } = useI18n()
const head = useLocaleHead()

const colorMode = useColorMode()
const color = computed(() => (colorMode.value === 'dark' ? '#1b1718' : 'white'))

const i18nStore = useI18nStore()
watchImmediate(locale, (newLocale) => {
  i18nStore.fetch(newLocale)
})

useHead({
  htmlAttrs: head.value.htmlAttrs,
  link: [{ href: '/favicon.ico', rel: 'icon' }, ...(head.value.link || [])],
  meta: [
    { charset: 'utf-8' },
    { content: 'width=device-width, initial-scale=1', name: 'viewport' },
    { content: color, key: 'theme-color', name: 'theme-color' },
    ...(head.value.meta || [])
  ],
  titleTemplate: (title) => (title ? `${title} | ${$t('app.title')}` : $t('app.title'))
})

const title = $t('app.title')
const description = $t('app.description')

usePageSeo({
  description,
  image: 'https://ui.nuxt.com/assets/templates/nuxt/dashboard-light.png',
  title
})
</script>

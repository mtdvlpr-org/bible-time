<template>
  <UApp :locale="uiLocales[locale]">
    <NuxtPwaManifest />
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
const color = computed(() => (colorMode.value === 'dark' ? '#1A3D7C' : '#1A3D7C'))

const i18nStore = useI18nStore()
watchImmediate(locale, (newLocale) => {
  i18nStore.fetch(newLocale)
})

const faviconIcons = [128, 96, 32, 16].map((size) => ({
  href: `${iconBaseUrl}/pwa-${size}x${size}.png`,
  rel: 'icon',
  sizes: `${size}x${size}`,
  type: 'image/png'
}))

const appleSplashIcon = (
  width: number,
  height: number,
  ratio: number,
  theme: 'dark' | 'light',
  orientation: 'landscape' | 'portrait'
) => {
  const imgWidth = (orientation === 'portrait' ? width : height) * ratio
  const imgHeight = (orientation === 'portrait' ? height : width) * ratio
  return {
    href: `${iconBaseUrl}/apple-splash-${orientation}-${theme}-${imgWidth}x${imgHeight}.png`,
    media: `screen and ${theme === 'dark' ? '(prefers-color-scheme: dark) and ' : ''}(device-width: ${width}px) and (device-height: ${height}px) and (-webkit-device-pixel-ratio: ${ratio}) and (orientation: ${orientation})`,
    rel: 'apple-touch-startup-image'
  }
}

const appleTouchIcons = appleTouchSizes.map((size) => ({
  href: `${iconBaseUrl}/apple-touch-icon-${size}x${size}.png`,
  rel: 'apple-touch-icon'
}))

const appleSplashIcons: { height: number; ratio: number; width: number }[] = [
  { height: 1366, ratio: 2, width: 1024 },
  { height: 1194, ratio: 2, width: 834 },
  { height: 1024, ratio: 2, width: 768 },
  { height: 1180, ratio: 2, width: 820 },
  { height: 1112, ratio: 2, width: 834 },
  { height: 1080, ratio: 2, width: 810 },
  { height: 1133, ratio: 2, width: 744 },
  { height: 956, ratio: 3, width: 440 },
  { height: 874, ratio: 3, width: 402 },
  { height: 932, ratio: 3, width: 430 },
  { height: 852, ratio: 3, width: 393 },
  { height: 844, ratio: 3, width: 390 },
  { height: 926, ratio: 3, width: 428 },
  { height: 812, ratio: 3, width: 375 },
  { height: 896, ratio: 3, width: 414 },
  { height: 896, ratio: 2, width: 414 },
  { height: 736, ratio: 3, width: 414 },
  { height: 667, ratio: 2, width: 375 },
  { height: 568, ratio: 2, width: 320 }
]

useHead({
  htmlAttrs: head.value.htmlAttrs,
  link: [
    ...(head.value.link || []),

    // Apple Splash Screens
    ...appleSplashIcons.flatMap(({ height, ratio, width }) => [
      appleSplashIcon(width, height, ratio, 'light', 'portrait'),
      appleSplashIcon(width, height, ratio, 'dark', 'portrait'),
      appleSplashIcon(width, height, ratio, 'light', 'landscape'),
      appleSplashIcon(width, height, ratio, 'dark', 'landscape')
    ]),

    // Apple Touch Icons
    ...appleTouchIcons,

    // Safari Pinned Tab
    { color: color.value, href: `${iconBaseUrl}/logo-mono.svg`, rel: 'mask-icon' },

    // Favicons
    ...faviconIcons,
    { href: `${iconBaseUrl}/favicon.ico`, rel: 'icon', type: 'image/ico' },
    { href: `${iconBaseUrl}/logo.svg`, ref: 'icon', type: 'image/svg+xml' }
  ],
  meta: [
    { charset: 'utf-8' },
    ...(head.value.meta || []),
    { content: 'width=device-width, initial-scale=1', name: 'viewport' },
    { content: color.value, key: 'theme-color', name: 'theme-color' },

    // Apple
    { content: 'yes', name: 'apple-mobile-web-app-capable' },

    // Windows Tile
    { content: `${iconBaseUrl}/pwa-icon-150x150.png`, name: 'msapplication-TileImage' },
    { content: color.value, name: 'msapplication-TileColor' }
  ]
})

useSeoMeta({
  description: $t('nuxtSiteConfig.description'),
  titleTemplate: (title) =>
    title ? `${title} | ${$t('nuxtSiteConfig.name')}` : $t('nuxtSiteConfig.name')
})

if (import.meta.server) {
  defineOgImageComponent('Page')
}
</script>

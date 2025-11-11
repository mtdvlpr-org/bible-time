<template>
  <UApp :locale="uiLocales[locale]">
    <UError :error="error" />
  </UApp>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const { locale } = useI18n()
const head = useLocaleHead()

const colorMode = useColorMode()
const color = computed(() => (colorMode.value === 'dark' ? '#1b1718' : 'white'))

useHead({
  htmlAttrs: head.value.htmlAttrs,
  link: [{ href: '/favicon.ico', rel: 'icon' }],
  meta: [
    { charset: 'utf-8' },
    { content: 'width=device-width, initial-scale=1', name: 'viewport' },
    { content: color, key: 'theme-color', name: 'theme-color' }
  ]
})

useSeoMeta({
  description: props.error.statusMessage || props.error.message,
  title: props.error.statusCode
})

defineOgImageComponent('Page', {
  description: props.error.statusMessage || props.error.message,
  title: props.error.statusCode.toString()
})
</script>

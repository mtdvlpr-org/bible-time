<template>
  <UApp>
    <UError :error="error" />
  </UApp>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError
}>()

usePageSeo({
  description: 'We are sorry but this page could not be found.',
  title: 'Page not found'
})

useHead({
  htmlAttrs: {
    lang: 'en'
  }
})
</script>

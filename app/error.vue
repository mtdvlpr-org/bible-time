<template>
  <UApp>
    <UError :error="error" />
  </UApp>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

useSeoMeta({
  description: 'We are sorry but this page could not be found.',
  title: 'Page not found'
})

useHead({
  htmlAttrs: {
    lang: 'en'
  }
})

defineOgImageComponent('NuxtSeo', {
  description: props.error.statusMessage,
  title: props.error.statusCode.toString()
})
</script>

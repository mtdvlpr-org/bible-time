<template>
  <ULocaleSelect :locales="locales" :model-value="locale" @update:model-value="onLocaleSelect" />
</template>

<script setup lang="ts">
const { locale, setLocale } = useI18n()
const locales = Object.values(uiLocales)

function onLocaleSelect(newLocale: string | undefined) {
  if (newLocale) setLocale(newLocale as AppLocale)
}
</script>

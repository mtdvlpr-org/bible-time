<template>
  <AuthPasswordForm
    icon="i-lucide:lock"
    :on-success="onSuccess"
    :title="$t('auth.reset-password')"
    :description="$t('auth.reset-password-description')"
  />
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth' })

const { t } = useI18n()
const localePath = useLocalePath()

async function onSuccess() {
  await navigateTo(localePath('/'))
}

useSeoMeta({
  description: t('auth.reset-password-description'),
  title: t('auth.reset-password')
})
</script>

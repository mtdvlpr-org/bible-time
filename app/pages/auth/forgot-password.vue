<template>
  <UAuthForm
    loading-auto
    :fields="fields"
    :schema="schema"
    icon="i-lucide:lock"
    :title="$t('auth.forgot-password')"
    :description="$t('auth.forgot-password-description')"
    @submit="onSubmit"
  >
    <template #description>
      {{ $t('auth.already-have-account') }}
      <ULink class="text-primary font-medium" :to="$localePath('/auth/login')">
        {{ $t('auth.login') }} </ULink
      >.
    </template>
  </UAuthForm>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'

import { z } from 'zod'

definePageMeta({ layout: 'auth' })

const { t } = useI18n()

const { fields: allFields, rules } = useForm()

const fields = [allFields.email]

const schema = z.object({ email: rules.email })

type Schema = z.output<typeof schema>

const supabase = useSupabaseClient()
const { showError, showSuccess } = useFlash()

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  const { error } = await supabase.auth.resetPasswordForEmail(payload.data.email, {
    redirectTo: window.location.origin + '/auth/reset-password'
  })

  if (error) {
    showError({ description: error.message })
  } else {
    showSuccess({ description: t('auth.check-your-email-for-instructions') })
  }
}

useSeoMeta({
  description: t('auth.forgot-password-description'),
  title: t('auth.forgot-password')
})
</script>

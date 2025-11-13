<template>
  <UAuthForm
    loading-auto
    :fields="fields"
    :schema="schema"
    icon="i-lucide:lock"
    :separator="$t('auth.or')"
    :title="$t('auth.welcome-back')"
    @submit="onSubmit"
  >
    <template #description>
      {{ $t('auth.no-account') }}
      <ULink class="text-primary font-medium" :to="$localePath('/auth/signup')">
        {{ $t('auth.sign-up') }} </ULink
      >.
    </template>

    <template #password-hint>
      <ULink
        tabindex="-1"
        class="text-primary font-medium"
        :to="$localePath('/auth/forgot-password')"
      >
        {{ $t('auth.forgot-password') }}
      </ULink>
    </template>

    <template #footer>
      {{ $t('auth.by-signing-in') }}
      <ULink to="#" class="text-primary font-medium">{{ $t('auth.terms-of-service') }}</ULink
      >.
    </template>
  </UAuthForm>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'

import { z } from 'zod'

definePageMeta({ layout: 'auth' })

const { t } = useI18n()

// Redirect if user is logged in
const user = useSupabaseUser()
const redirectInfo = useSupabaseCookieRedirect()

const localePath = useLocalePath()
watch(user, (val) => {
  if (!val) return

  // Get redirect path, and clear it from the cookie
  const path = redirectInfo.pluck()
  return navigateTo(path || localePath('/'))
})

const { fields: allFields, rules } = useForm()

const fields = [allFields.email, { ...allFields.password, autocomplete: 'current-password' }]

const schema = z.object({
  email: rules.email,
  password: z.string(t('validation.required', { field: t('auth.password') }))
})

type Schema = z.output<typeof schema>

const { showError } = useFlash()
const supabase = useSupabaseClient()

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  const { error } = await supabase.auth.signInWithPassword({
    email: payload.data.email,
    password: payload.data.password
  })

  if (error) {
    showError({ description: error.message })
  }
}

useSeoMeta({
  description: t('auth.login-description'),
  title: t('auth.login')
})
</script>

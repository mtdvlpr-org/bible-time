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

    <template #validation>
      <UFormField required name="human">
        <UCheckbox
          :disabled="!!captchaToken"
          :model-value="!!captchaToken"
          :label="$t('auth.i-am-not-robot')"
          @click="captcha?.execute()"
        />
      </UFormField>
      <VueHcaptcha
        ref="captcha"
        size="invisible"
        :theme="colorMode.value"
        :sitekey="captchaSiteKey"
        @verify="captchaToken = $event"
      />
    </template>

    <template #footer>
      {{ $t('auth.by-signing-in') }}
      <ULink class="text-primary font-medium" :to="$localePath('/legal/terms')">
        {{ $t('legal.terms') }} </ULink
      >.
    </template>
  </UAuthForm>
</template>

<script setup lang="ts">
import type { AuthFormField, FormSubmitEvent } from '@nuxt/ui'

import VueHcaptcha from '@hcaptcha/vue3-hcaptcha'
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

const captchaToken = ref('')
const colorMode = useColorMode()
const captcha = useTemplateRef('captcha')
const { captchaSiteKey } = useRuntimeConfig().public
const fields: AuthFormField[] = [
  { ...allFields.email, autofocus: true },
  { ...allFields.password, autocomplete: 'current-password' }
]

const schema = z
  .object({
    email: rules.email,
    password: z.string(t('validation.required', { field: t('auth.password') }))
  })
  .refine(() => !!captchaToken.value, {
    error: t('auth.confirm-not-robot'),
    path: ['human']
  })

type Schema = z.output<typeof schema>

const { showError } = useFlash()
const supabase = useSupabaseClient()

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  const { error } = await supabase.auth.signInWithPassword({
    email: payload.data.email,
    options: { captchaToken: captchaToken.value },
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

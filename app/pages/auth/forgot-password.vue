<template>
  <UAuthForm
    ref="authForm"
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
        @verify="onCaptchaVerify"
      />
    </template>
  </UAuthForm>
</template>

<script setup lang="ts">
import type { AuthFormField, FormSubmitEvent } from '@nuxt/ui'

import { z } from 'zod'

definePageMeta({ layout: 'auth' })

const { t } = useI18n()

const { fields: allFields, rules } = useForm()

const captchaToken = ref('')
const colorMode = useColorMode()
const captcha = useTemplateRef('captcha')
const authForm = useTemplateRef('authForm')
const { captchaSiteKey } = useRuntimeConfig().public
const fields: AuthFormField[] = [{ ...allFields.email, autofocus: true }]

const schema = z.object({ email: rules.email })

type Schema = z.output<typeof schema>

const supabase = useSupabaseClient()
const { showError, showSuccess } = useFlash()

function onCaptchaVerify(token: string) {
  captchaToken.value = token
  authForm.value?.formRef?.clear('human')
}

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  const { error } = await supabase.auth.resetPasswordForEmail(payload.data.email, {
    captchaToken: captchaToken.value,
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

<template>
  <UAuthForm
    ref="authForm"
    loading-auto
    :fields="fields"
    :schema="schema"
    icon="i-lucide:user-round"
    :separator="$t('auth.or')"
    :title="$t('auth.sign-up')"
    :description="$t('auth.sign-up-description')"
    :submit="{ label: t('auth.create-account') }"
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

    <template #footer>
      {{ $t('auth.by-signing-up') }}
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

const { locale, t } = useI18n()

const { fields: allFields, rules } = useForm()

const captchaToken = ref('')
const colorMode = useColorMode()
const captcha = useTemplateRef('captcha')
const authForm = useTemplateRef('authForm')
const { captchaSiteKey } = useRuntimeConfig().public
const fields = computed((): AuthFormField[] => [
  { ...allFields.name, autofocus: true },
  allFields.email,
  allFields.password
])

const schema = z
  .object({
    email: rules.email,
    human: z.boolean().optional(),
    name: rules.name,
    password: rules.password
  })
  .refine(() => !!captchaToken.value, {
    error: t('auth.confirm-not-robot'),
    path: ['human']
  })

type Schema = z.output<typeof schema>

const supabase = useSupabaseClient()
const { showError, showSuccess } = useFlash()

function onCaptchaVerify(token: string) {
  captchaToken.value = token
  authForm.value?.formRef?.clear('human')
}

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  const { error } = await supabase.auth.signUp({
    email: payload.data.email,
    options: {
      captchaToken: captchaToken.value,
      data: { display_name: payload.data.name, locale: locale.value }
    },
    password: payload.data.password
  })

  if (error) {
    showError({ description: error.message })
  } else {
    showSuccess({ description: t('auth.check-your-email-for-instructions') })
  }
  captchaToken.value = ''
  captcha.value?.reset()
}

useSeoMeta({
  description: t('auth.sign-up-description'),
  title: t('auth.sign-up')
})
</script>

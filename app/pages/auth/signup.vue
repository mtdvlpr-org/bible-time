<template>
  <UAuthForm
    loading-auto
    :providers="[]"
    :fields="fields"
    :schema="schema"
    icon="i-lucide-user"
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

    <template #footer>
      {{ $t('auth.by-signing-up') }}
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

usePageSeo({
  description: t('auth.sign-up-description'),
  title: t('auth.sign-up')
})

const { fields: allFields, rules } = useForm()

const fields = [allFields.name, allFields.email, allFields.password]

const schema = z.object({
  email: rules.email,
  name: rules.name,
  password: rules.password
})

type Schema = z.output<typeof schema>

const supabase = useSupabaseClient()
const { showError, showSuccess } = useFlash()

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  const { error } = await supabase.auth.signUp({
    email: payload.data.email,
    options: { data: { display_name: payload.data.name } },
    password: payload.data.password
  })

  if (error) {
    showError({ description: error.message })
  } else {
    showSuccess({ description: t('auth.check-your-email-for-instructions') })
  }
}
</script>

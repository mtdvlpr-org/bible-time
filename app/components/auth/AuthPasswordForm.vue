<template>
  <UAuthForm
    :icon="icon"
    loading-auto
    :title="title"
    :fields="fields"
    :schema="schema"
    :submit="submit"
    :description="description"
    @submit="onSubmit"
  />
</template>

<script setup lang="ts">
import type { AuthFormField, ButtonProps, FormSubmitEvent } from '@nuxt/ui'
import type { z } from 'zod'

const props = defineProps<{
  autofocus?: boolean
  description?: string
  icon?: string
  onSuccess?: () => Promise<void>
  submit?: ButtonProps
  title?: string
}>()

const { t } = useI18n()

const { fields: allFields, rules } = useForm()

const fields: AuthFormField[] = [
  { ...allFields.password, autofocus: props.autofocus, label: t('auth.new-password') },
  allFields.confirm
]

const schema = rules.changePassword

type Schema = z.output<typeof schema>

const supabase = useSupabaseClient()
const { showError, showSuccess } = useFlash()

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  const { error } = await supabase.auth.updateUser({ password: payload.data.password })
  if (error) {
    showError({ description: error.message })
  } else {
    if (props.onSuccess) await props.onSuccess()
    showSuccess({
      description: t('feedback.saved-successfully', { item: t('auth.password') })
    })
  }
}
</script>

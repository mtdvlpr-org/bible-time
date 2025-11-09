<template>
  <UModal
    v-model:open="open"
    :title="$t('person.translate')"
    :description="$t('validation.provide-in-language', { language: localeProperties.name })"
  >
    <UButton icon="i-lucide:globe" :label="$t('person.translate')" />

    <template #body>
      <UForm :state="state" :schema="schema" class="space-y-4" @submit="onSubmit">
        <UFormField
          required
          name="name"
          :description="name"
          :label="fields.name.label"
          :placeholder="fields.name.placeholder"
        >
          <UInput v-model="state.name" class="w-full" />
        </UFormField>
        <div class="flex justify-end gap-2">
          <UButton
            type="reset"
            color="neutral"
            variant="subtle"
            :label="$t('general.cancel')"
            @click="open = false"
          />
          <UButton
            loading-auto
            type="submit"
            color="primary"
            variant="solid"
            :label="$t('general.translate')"
            :disabled="state.name === translation"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'

import { z } from 'zod'

const props = defineProps<{
  name: string
}>()

const open = ref(false)

const { fields, rules } = useForm()
const { translate } = useTranslations()

const schema = z.object({
  name: rules.name
})

type Schema = z.output<typeof schema>

const translation = ref(translate(props.name, false))

const state = reactive<Partial<Schema>>({
  name: translation.value
})

const { locale, localeProperties, t } = useI18n()
const i18nStore = useI18nStore()
const supabase = useSupabaseClient()

const { showError, showSuccess } = useFlash()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  if (!event.data.name || event.data.name === translation.value) return

  const { error } = await supabase.from('translations').upsert({
    key: props.name,
    lang: locale.value,
    value: event.data.name
  })

  if (error) {
    showError({
      description: t('feedback.could-not-save', { item: event.data.name })
    })
  } else {
    showSuccess({
      description: t('feedback.saved-successfully', { item: event.data.name })
    })
    open.value = false
    translation.value = event.data.name
    i18nStore.addTranslation(locale.value, props.name, event.data.name)
  }
}
</script>

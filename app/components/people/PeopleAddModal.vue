<template>
  <UModal v-model:open="open" :title="$t('person.new')" :description="$t('person.new-description')">
    <UButton icon="i-lucide:plus" :label="$t('person.new')" />

    <template #body>
      <LazyPeopleForm v-if="open" cancelable @submit="onSubmit" @cancel="open = false" />
    </template>
  </UModal>
</template>
<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'

import type { Schema } from './PeopleForm.vue'

const open = ref(false)

const { t } = useI18n()

const supabase = useSupabaseClient()
const { data: people } = useNuxtData<Tables<'people'>[]>('people')

const { showError, showSuccess } = useFlash()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  const { data: created, error } = await supabase
    .from('people')
    .insert(event.data)
    .select()
    .single()

  if (error) {
    showError({
      description: t('feedback.could-not-save', { item: event.data.name })
    })
  } else {
    showSuccess({
      actions: [
        {
          label: t('person.view'),
          to: `/people/${created.slug}`
        }
      ],
      description: t('feedback.saved-successfully', { item: event.data.name })
    })
    open.value = false
    if (created && people.value) people.value = [...people.value, created]
  }
}
</script>

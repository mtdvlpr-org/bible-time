<template>
  <UModal
    v-model:open="open"
    :title="$t('event.new')"
    description="Add a new event to the database"
  >
    <UButton icon="i-lucide:plus" :label="$t('event.new')" />

    <template #body>
      <LazyEventsForm v-if="open" cancelable @submit="onSubmit" @cancel="open = false" />
    </template>
  </UModal>
</template>
<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'

import type { Schema } from './EventsForm.vue'

const open = ref(false)

const { t } = useI18n()

const supabase = useSupabaseClient()

const { showError, showSuccess } = useFlash()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  const { error } = await supabase.from('events').insert(event.data)

  if (error) {
    showError({
      description: t('feedback.could-not-save', { item: event.data.title })
    })
  } else {
    showSuccess({
      description: t('feedback.saved-successfully', { item: event.data.title })
    })
    open.value = false
    refreshNuxtData('events')
  }
}
</script>

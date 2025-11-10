<template>
  <UModal
    v-model:open="open"
    :title="$t('suggestion.new')"
    description="Add a new suggestion to the database"
  >
    <UButton icon="i-lucide:plus" :label="$t('suggestion.new')" />

    <template #body>
      <LazyPeopleForm
        v-if="open && type === 'person.create'"
        cancelable
        @cancel="open = false"
        @submit="onPeopleCreate"
      />
      <LazyEventsForm
        v-else-if="open && type === 'event.create'"
        cancelable
        @cancel="open = false"
        @submit="onEventsCreate"
      />
    </template>
  </UModal>
</template>
<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'

import type { Schema as EventsSchema } from './../events/EventsForm.vue'
import type { Schema as PeopleSchema } from './../people/PeopleForm.vue'

const props = defineProps<{
  type: Enums<'suggestion_type'>
}>()

const open = ref(false)

const { t } = useI18n()

const router = useRouter()
const localePath = useLocalePath()
const supabase = useSupabaseClient()

const { showError, showSuccess } = useFlash()

const onSuccess = () => {
  open.value = false
  router.push(localePath('/suggestions'))
}

async function onEventsCreate(event: FormSubmitEvent<EventsSchema>) {
  const { error } = await supabase
    .from('suggestions')
    .insert({ payload: event.data, type: props.type })

  if (error) {
    showError({
      description: t('feedback.could-not-save', { item: event.data.title })
    })
  } else {
    showSuccess({
      description: t('feedback.saved-successfully', { item: event.data.title })
    })
    onSuccess()
  }
}

async function onPeopleCreate(event: FormSubmitEvent<PeopleSchema>) {
  const { error } = await supabase
    .from('suggestions')
    .insert({ payload: event.data, type: props.type })

  if (error) {
    showError({
      description: t('feedback.could-not-save', { item: event.data.name })
    })
  } else {
    showSuccess({
      description: t('feedback.saved-successfully', { item: event.data.name })
    })
    onSuccess()
  }
}
</script>

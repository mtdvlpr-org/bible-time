<template>
  <LazyUCard v-if="event">
    <div class="flex items-center gap-4">
      <AvatarModal v-model="newAvatar" :edit="edit" type="event" :current="event.cover_url" />

      <div>
        <h2 class="text-lg font-semibold">{{ translate(event.title) }}</h2>
        <div v-if="!edit" class="text-sm text-zinc-500">
          {{ aliases.length ? aliases.join(', ') : '' }}
        </div>
      </div>
    </div>
    <LazyEventsForm
      v-if="edit"
      no-cover
      class="mt-4"
      :event="eventProp"
      :submit="{ label: $t('general.save'), icon: 'i-lucide:save' }"
      @submit="onSubmit"
    />
    <div v-else class="mt-4 space-y-2">
      <div>
        <div class="text-xs text-zinc-500">{{ $t('event.start-year') }}</div>
        <div class="font-medium">
          {{ formatYear(event.start_year, event.start_precision) }}
        </div>
      </div>

      <div>
        <div class="text-xs text-zinc-500">{{ $t('event.end-year') }}</div>
        <div class="font-medium">
          {{ formatYear(event.end_year, event.end_precision) }}
        </div>
      </div>
    </div>
  </LazyUCard>
</template>
<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'

import type { Schema } from './EventsForm.vue'

const props = defineProps<{
  edit?: boolean
  slug: string
}>()

const { data: event } = useNuxtData<Tables<'events'>>(`event-${props.slug}`)

const { t } = useI18n()
const { formatYear } = useDate()
const { translate } = useTranslations()

const eventProp = computed(() => ({
  ...event.value,
  end_precision: event.value?.end_precision ?? undefined,
  start_precision: event.value?.start_precision ?? undefined
}))

const aliases = computed(() => {
  return event.value?.aliases.map((alias) => translate(alias)) ?? []
})

const newAvatar = ref(event.value?.cover_url ?? null)

const { showError, showSuccess } = useFlash()
const supabase = useSupabaseClient()
async function onSubmit(submitEvent: FormSubmitEvent<Schema>) {
  if (!event.value) return

  // Store previous and new data
  const previousData = { ...event.value }
  const newData = {
    ...event.value,
    ...submitEvent.data,
    cover_url: newAvatar.value,
    end_precision: submitEvent.data.end_precision ?? null,
    start_precision: submitEvent.data.start_precision ?? null
  }

  // Optimistic update
  event.value = newData

  // Send update to Supabase
  const { error } = await supabase.from('events').update(submitEvent.data).eq('slug', props.slug)

  if (error) {
    // Revert optimistic update
    event.value = previousData
    showError({ description: error.message })
  } else {
    showSuccess({ description: t('feedback.saved-successfully', { item: t('event.noun') }) })
  }
}
</script>

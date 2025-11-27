<template>
  <UCard>
    <h3 class="text-sm font-semibold mb-2">{{ $t('relation.related-events') }}</h3>
    <div class="space-y-2">
      <div v-if="events.length === 0" class="text-sm text-zinc-500">
        {{ $t('relation.no-related-events') }}
      </div>
      <ul v-else class="space-y-2">
        <li v-for="e in events" :key="e.slug">
          <div class="flex items-center justify-between gap-3">
            <ULink class="w-full" :to="$localePath(`/events/${e.slug}`)">
              <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                  <UAvatar alt="" size="sm" icon="i-lucide-image" :src="e.cover_url ?? undefined" />
                  <div>
                    <div class="text-sm font-medium">
                      {{ translate(e.title) }}
                    </div>
                  </div>
                </div>
                <div>
                  <span class="inline-block text-xs px-2 py-0.5 rounded bg-zinc-100 text-zinc-700">
                    {{ translateRelation(e.relation_kind) }}
                  </span>
                </div>
              </div>
            </ULink>
            <LazyUButton
              v-if="edit"
              size="xs"
              color="error"
              icon="i-lucide:trash-2"
              @click="removeRelatedEvent(e.slug)"
            />
          </div>
        </li>
      </ul>
      <LazyUForm v-if="edit" class="space-y-2" @submit="onSubmit">
        <UFormField :label="$t('relation.related-event')">
          <USelectMenu v-model="selectedEvent" class="w-48" :items="items" :loading="pending" />
        </UFormField>
        <UFormField :label="$t('relation.type')">
          <USelect
            v-model="selectedRelation"
            class="w-48"
            value-key="value"
            :items="relationships"
          />
        </UFormField>
        <div class="mt-4 flex justify-end">
          <UButton
            loading-auto
            type="submit"
            icon="i-lucide:plus"
            :label="$t('general.add')"
            :disabled="!selectedEvent || !selectedRelation"
          />
        </div>
      </LazyUForm>
    </div>
  </UCard>
</template>
<script setup lang="ts">
const props = defineProps<{
  edit?: boolean
  id: number
  slug: string
}>()

const { data: person } = useNuxtData<{
  event_relations: { events: ShortEvent; relation_kind: Enums<'event_relation'> }[]
}>(`person-${props.slug}`)

const events = computed(() => {
  return (
    person.value?.event_relations?.map((rel) => ({
      ...rel.events,
      relation_kind: rel.relation_kind
    })) ?? []
  )
})

const { t } = useI18n()
const { translate, translateRelation } = useTranslations()

const supabase = useSupabaseClient()
const selectedEvent = shallowRef<Omit<Tables<'events'>, 'description'> | undefined>()
const selectedRelation = ref<Enums<'event_relation'> | undefined>()

const items = computed((): Omit<Tables<'events'>, 'description'>[] => {
  return (
    allEvents.value
      ?.filter(
        (e) => e.slug !== props.slug && events.value.findIndex((rel) => rel.slug === e.slug) === -1
      )
      .map((e) => ({ ...e, description: undefined, label: translate(e.title) })) ?? []
  )
})

const relationships = computed((): { label: string; value: Enums<'event_relation'> }[] => {
  return [
    { label: t('relation.participant'), value: 'participant' },
    { label: t('relation.author'), value: 'author' },
    { label: t('general.other'), value: 'other' }
  ]
})

watch(
  () => props.edit,
  (val) => {
    if (val && !allEvents.value?.length) {
      execute()
    }
  }
)

const {
  data: allEvents,
  execute,
  pending
} = await useLazyAsyncData(
  'events',
  async () => {
    const { data } = await supabase.from('events').select('*')
    return data ?? []
  },
  { immediate: false }
)

const { showError, showSuccess } = useFlash()

async function onSubmit() {
  if (!person.value || !selectedEvent.value || !selectedRelation.value) return

  let message = ''

  person.value = {
    ...person.value,
    event_relations: person.value.event_relations.concat({
      events: { ...selectedEvent.value },
      relation_kind: selectedRelation.value
    })
  }
  const { error } = await supabase.from('event_relations').insert({
    event_id: selectedEvent.value.id,
    person_id: props.id,
    relation_kind: selectedRelation.value
  })

  if (error) message = error.message

  if (message) {
    showError({ description: message })
  } else {
    showSuccess({
      description: t('feedback.saved-successfully', { item: t('relation.related-event') })
    })
    selectedEvent.value = selectedRelation.value = undefined
  }
}

async function removeRelatedEvent(slug: string) {
  if (!person.value) return

  const event = allEvents.value?.find((p) => p.slug === slug)
  if (!event) return

  const { error } = await supabase
    .from('event_relations')
    .delete()
    .eq('event_id', event.id)
    .eq('person_id', props.id)

  if (error) {
    showError({ description: error.message })
  } else {
    person.value = {
      ...person.value,
      event_relations: person.value.event_relations.filter((rel) => rel.events.slug !== slug)
    }
    showSuccess({
      description: t('feedback.deleted-successfully', { item: t('relation.related-event') })
    })
  }
}
</script>

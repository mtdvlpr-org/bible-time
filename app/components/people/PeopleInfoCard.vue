<template>
  <LazyUCard v-if="person">
    <div class="flex items-center gap-4">
      <AvatarModal v-model="newAvatar" :edit="edit" type="person" :current="person.avatar_url" />
      <div>
        <h2 class="text-lg font-semibold">{{ translate(person.name) }}</h2>
        <div v-if="!edit" class="text-sm text-zinc-500">
          {{ aliases.length ? aliases.join(', ') : '' }}
        </div>
      </div>
    </div>
    <LazyPeopleForm
      v-if="edit"
      no-avatar
      class="mt-4"
      :person="personProp"
      :submit="{ label: $t('general.save'), icon: 'i-lucide:save' }"
      @submit="onSubmit"
    />
    <div v-else class="mt-4 space-y-2">
      <div>
        <div class="text-xs text-zinc-500">{{ $t('people.born') }}</div>
        <div class="font-medium">
          {{ formatYear(person.birth_year, person.birth_precision) }}
        </div>
      </div>

      <div>
        <div class="text-xs text-zinc-500">{{ $t('people.died') }}</div>
        <div class="font-medium">
          {{ formatYear(person.death_year, person.death_precision) }}
        </div>
      </div>

      <div>
        <div class="text-xs text-zinc-500">{{ $t('person.gender') }}</div>
        <div class="font-medium">
          {{ gender }}
        </div>
      </div>
    </div>
  </LazyUCard>
</template>
<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'

import type { Schema } from './PeopleForm.vue'

const props = defineProps<{
  edit?: boolean
  slug: string
}>()

const { data: person } = useNuxtData<Tables<'people'>>(`person-${props.slug}`)

const { t } = useI18n()
const { translate } = useTranslations()
const { formatYear } = useDate()

const personProp = computed(() => ({
  ...person.value,
  birth_precision: person.value?.birth_precision ?? undefined,
  death_precision: person.value?.death_precision ?? undefined
}))

const gender = computed(() => {
  switch (person.value?.gender) {
    case 'female':
      return t('person.female')
    case 'male':
      return t('person.male')
    default:
      return t('general.unknown')
  }
})

const aliases = computed(() => {
  return person.value?.aliases.map((alias) => translate(alias)) ?? []
})

const newAvatar = ref(person.value?.avatar_url ?? null)

const { showError, showSuccess } = useFlash()
const supabase = useSupabaseClient()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  if (!person.value) return

  // Store previous and new data
  const previousData = { ...person.value }
  const newData = {
    ...person.value,
    ...event.data,
    avatar_url: newAvatar.value,
    birth_precision: event.data.birth_precision ?? null,
    death_precision: event.data.death_precision ?? null
  }

  // Optimistic update
  person.value = newData

  // Send update to Supabase
  const { error } = await supabase.from('people').update(event.data).eq('slug', props.slug)

  if (error) {
    // Revert optimistic update
    person.value = previousData
    showError({ description: error.message })
  } else {
    showSuccess({
      description: t('feedback.saved-successfully', { item: translate(person.value.name) })
    })
  }
}
</script>

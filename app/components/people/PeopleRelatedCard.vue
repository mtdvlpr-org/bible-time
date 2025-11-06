<template>
  <UCard>
    <h3 class="text-sm font-semibold mb-2">{{ $t('relation.related-people') }}</h3>
    <div class="space-y-2">
      <div v-if="people.length === 0" class="text-sm text-zinc-500">
        {{ $t('relation.no-related-people') }}
      </div>
      <ul v-else class="space-y-2">
        <li v-for="p in people" :key="p.slug">
          <div class="flex items-center justify-between gap-3">
            <ULink class="w-full" :to="localePath(`/people/${p.slug}`)">
              <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                  <UAvatar size="sm" :alt="p.name" :src="p.avatar_url ?? undefined" />
                  <div class="text-sm font-medium">
                    {{ translate(p.name) }}
                  </div>
                </div>
                <div>
                  <span class="inline-block text-xs px-2 py-0.5 rounded bg-zinc-100 text-zinc-700">
                    {{ translateRelation(p.relation_kind) }}
                  </span>
                </div>
              </div>
            </ULink>
            <UButton
              v-if="edit"
              size="xs"
              color="error"
              icon="i-lucide:trash-2"
              @click="removeRelatedPerson(p.slug)"
            />
          </div>
        </li>
      </ul>
      <UForm v-if="edit" class="space-y-2" @submit="onSubmit">
        <UFormField :label="$t('relation.related-person')">
          <USelectMenu v-model="selectedPerson" class="w-48" :items="items" :loading="pending" />
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
          <UButton loading-auto type="submit" icon="i-lucide:plus" :label="$t('general.add')" />
        </div>
      </UForm>
    </div>
  </UCard>
</template>
<script setup lang="ts">
interface RelatedPart {
  people: ShortPerson
  relation_kind: RelationKind
}

type RelationKind = 'father' | 'mother' | Enums<'event_relation'> | Enums<'person_relation'>

const props = defineProps<{
  edit?: boolean
  id: number
  slug: string
  type: 'event' | 'person'
}>()

const { data: item } = useNuxtData<{
  father?: ShortPerson
  mother?: ShortPerson
  related_one: RelatedPart[]
  related_two?: RelatedPart[]
}>(`${props.type}-${props.slug}`)

const people = computed(() => {
  const fromRelations =
    item.value?.related_one.concat(item.value.related_two ?? []).map((rel) => ({
      ...rel.people,
      relation_kind: rel.relation_kind
    })) ?? []

  const parents = []
  if (item.value?.father) {
    parents.push({ ...item.value.father, relation_kind: 'father' as const })
  }

  if (item.value?.mother) {
    parents.push({ ...item.value.mother, relation_kind: 'mother' as const })
  }

  // show parents first, then other relations
  return [...parents, ...fromRelations]
})

const { t } = useI18n()
const { translate, translateRelation } = useTranslations()
const localePath = useLocalePath()

const supabase = useSupabaseClient()
const selectedPerson = ref<Omit<Tables<'people'>, 'description'> | undefined>()
const selectedRelation = ref<RelationKind | undefined>()

const items = computed((): Omit<Tables<'people'>, 'description'>[] => {
  return (
    allPeople.value
      ?.filter(
        (p) => p.slug !== props.slug && people.value.findIndex((rel) => rel.slug === p.slug) === -1
      )
      .map((p) => ({
        ...p,
        description: undefined,
        label: translate(p.name)
      })) ?? []
  )
})

const relationships = computed((): { label: string; value: RelationKind }[] => {
  return props.type === 'person'
    ? [
        ...(people.value.some((p) => p.relation_kind === 'father')
          ? []
          : [{ label: t('relation.father'), value: 'father' as const }]),
        ...(people.value.some((p) => p.relation_kind === 'mother')
          ? []
          : [{ label: t('relation.mother'), value: 'mother' as const }]),
        { label: t('relation.spouse'), value: 'spouse' },
        { label: t('relation.sibling'), value: 'sibling' },
        { label: t('relation.friend'), value: 'friend' },
        { label: t('relation.contemporary'), value: 'contemporary' },
        { label: t('general.other'), value: 'other' }
      ]
    : ([
        { label: t('relation.participant'), value: 'participant' },
        { label: t('relation.author'), value: 'author' },
        { label: t('general.other'), value: 'other' }
      ] satisfies { label: string; value: Enums<'event_relation'> }[])
})

watch(
  () => props.edit,
  (val) => {
    if (val && !allPeople.value?.length) {
      execute()
    }
  }
)

const {
  data: allPeople,
  execute,
  pending
} = await useLazyAsyncData(
  'people',
  async () => {
    const { data } = await supabase.from('people').select('*')
    return data ?? []
  },
  { immediate: false }
)

const { showError, showSuccess } = useFlash()

const removeRelatedPerson = async (slug: string) => {
  if (!item.value) return

  const person = allPeople.value?.find((p) => p.slug === slug)
  if (!person) return

  const inOne = item.value.related_one.some((rel) => rel.people.slug === slug)

  const { error } = await supabase
    .from('person_relations')
    .delete()
    .eq('person_one', inOne ? props.id : person.id)
    .eq('person_two', inOne ? person.id : props.id)

  if (error) {
    showError({ description: error.message })
  } else {
    item.value = {
      ...item.value,
      related_one: item.value.related_one.filter((rel) => rel.people.slug !== slug),
      related_two: item.value.related_two?.filter((rel) => rel.people.slug !== slug)
    }
    showSuccess({ description: 'Successfully removed related person.' })
  }
}

const onSubmit = async () => {
  if (!item.value || !selectedPerson.value || !selectedRelation.value) return

  let message = ''

  if (selectedRelation.value === 'father') {
    item.value = { ...item.value, father: selectedPerson.value }
    const { error } = await supabase
      .from('people')
      .update({ father: selectedPerson.value.id })
      .eq('slug', props.slug)

    if (error) message = error.message
  } else if (selectedRelation.value === 'mother') {
    item.value = { ...item.value, mother: selectedPerson.value }
    const { error } = await supabase
      .from('people')
      .update({ mother: selectedPerson.value.id })
      .eq('slug', props.slug)

    if (error) message = error.message
  } else if (props.type === 'person') {
    item.value = {
      ...item.value,
      related_one: item.value.related_one.concat({
        people: { ...selectedPerson.value },
        relation_kind: selectedRelation.value
      })
    }
    const { error } = await supabase.from('person_relations').insert({
      person_one: props.id,
      person_two: selectedPerson.value.id,
      relation_kind: selectedRelation.value as Enums<'person_relation'>
    })

    if (error) message = error.message
  } else if (props.type === 'event') {
    item.value = {
      ...item.value,
      related_one: item.value.related_one.concat({
        people: { ...selectedPerson.value },
        relation_kind: selectedRelation.value
      })
    }
    const { error } = await supabase.from('event_relations').insert({
      event_id: props.id,
      person_id: selectedPerson.value.id,
      relation_kind: selectedRelation.value as Enums<'event_relation'>
    })

    if (error) message = error.message
  }

  if (message) {
    showError({ description: message })
  } else {
    showSuccess({ description: 'Successfully added related person.' })
    selectedPerson.value = undefined
    selectedRelation.value = undefined
  }
}
</script>

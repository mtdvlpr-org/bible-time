<template>
  <UCard>
    <h3 class="text-sm font-semibold mb-2">{{ $t('relation.related-people') }}</h3>
    <div class="space-y-2">
      <div v-if="people.length === 0" class="text-sm text-zinc-500">
        {{ $t('relation.no-related-people') }}
      </div>
      <ul v-else class="space-y-2">
        <li v-for="p in people" :key="p.slug">
          <ULink :to="localePath(`/people/${p.slug}`)">
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <UAvatar size="sm" :alt="p.name" :src="p.avatar_url ?? undefined" />
                <div class="text-sm font-medium">
                  {{ i18nStore.translate(p.name) }}
                </div>
              </div>
              <div>
                <span class="inline-block text-xs px-2 py-0.5 rounded bg-zinc-100 text-zinc-700">
                  {{ translateRelation(p.relation_kind) }}
                </span>
              </div>
            </div>
          </ULink>
        </li>
      </ul>
    </div>
  </UCard>
</template>
<script setup lang="ts">
type RelationKind = 'father' | 'mother' | Enums<'event_relation'> | Enums<'person_relation'>

defineProps<{
  people: (ShortPerson & { relation_kind: RelationKind })[]
}>()

const { t } = useI18n()
const i18nStore = useI18nStore()
const localePath = useLocalePath()

const translateRelation = (relation: RelationKind): string => {
  switch (relation) {
    case 'author':
      return t('relation.author')
    case 'contemporary':
      return t('relation.contemporary')
    case 'father':
      return t('relation.father')
    case 'friend':
      return t('relation.friend')
    case 'mother':
      return t('relation.mother')
    case 'other':
      return t('general.other')
    case 'participant':
      return t('relation.participant')
    case 'sibling':
      return t('relation.sibling')
    case 'spouse':
      return t('relation.spouse')
  }
}
</script>

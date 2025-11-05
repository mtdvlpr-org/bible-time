<template>
  <UCard>
    <h3 class="text-sm font-semibold mb-2">{{ $t('people.related-people') }}</h3>
    <div class="space-y-2">
      <div v-if="people.length === 0" class="text-sm text-zinc-500">
        {{ $t('people.no-related-people') }}
      </div>
      <ul v-else class="space-y-2">
        <li v-for="(p, idx) in people" :key="p?.slug || idx">
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
                  {{ p.relation_kind }}
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
defineProps<{
  people: (ShortPerson & {
    relation_kind: 'father' | 'mother' | Enums<'person_relation'>
  })[]
}>()

const i18nStore = useI18nStore()
const localePath = useLocalePath()
</script>

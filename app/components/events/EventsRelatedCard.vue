<template>
  <UCard>
    <h3 class="text-sm font-semibold mb-2">{{ $t('people.related-events') }}</h3>
    <div class="space-y-2">
      <div v-if="events.length === 0" class="text-sm text-zinc-500">
        {{ $t('people.no-related-events') }}
      </div>
      <ul v-else class="space-y-2">
        <li v-for="(e, idx) in events" :key="e?.slug || idx">
          <ULink :to="localePath(`/events/${e.slug}`)">
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <img
                  v-if="e?.cover_url"
                  alt=""
                  :src="e.cover_url"
                  class="w-12 h-8 rounded object-cover"
                />
                <div>
                  <div class="text-sm font-medium">
                    {{ i18nStore.translate(String(e?.title)) }}
                  </div>
                </div>
              </div>
              <div>
                <span class="inline-block text-xs px-2 py-0.5 rounded bg-zinc-100 text-zinc-700">
                  {{ e.relation_kind }}
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
  events: (Pick<Tables<'events'>, 'cover_url' | 'slug' | 'title'> & {
    relation_kind: Enums<'event_relation'>
  })[]
}>()

const i18nStore = useI18nStore()
const localePath = useLocalePath()
</script>

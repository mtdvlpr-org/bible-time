<template>
  <UCard>
    <h3 class="text-sm font-semibold mb-2">{{ $t('relation.related-events') }}</h3>
    <div class="space-y-2">
      <div v-if="events.length === 0" class="text-sm text-zinc-500">
        {{ $t('relation.no-related-events') }}
      </div>
      <ul v-else class="space-y-2">
        <li v-for="e in events" :key="e.slug">
          <ULink :to="localePath(`/events/${e.slug}`)">
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
        </li>
      </ul>
    </div>
  </UCard>
</template>
<script setup lang="ts">
defineProps<{
  events: (ShortEvent & { relation_kind: Enums<'event_relation'> })[]
}>()

const { translate, translateRelation } = useTranslations()
const localePath = useLocalePath()
</script>

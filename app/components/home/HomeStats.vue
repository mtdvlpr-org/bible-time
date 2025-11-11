<template>
  <UPageGrid class="lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-px">
    <UPageCard
      v-for="table in tables"
      :key="table.key"
      :to="table.to"
      variant="subtle"
      :icon="table.icon"
      :title="table.title"
      class="lg:rounded-none first:rounded-l-lg last:rounded-r-lg hover:z-1"
      :ui="{
        container: 'gap-y-1.5',
        wrapper: 'items-start',
        leading: 'p-2.5 rounded-full bg-primary/10 ring ring-inset ring-primary/25 flex-col',
        title: 'font-normal text-muted text-xs uppercase'
      }"
    >
      <div class="flex items-center gap-2">
        <span class="text-2xl font-semibold text-highlighted">
          <NumberFlow :value="stats[table.key]" />
        </span>
      </div>
    </UPageCard>
  </UPageGrid>
</template>

<script setup lang="ts">
import NumberFlow from '@number-flow/vue'
const { t } = useI18n()
const localePath = useLocalePath()

type Table = {
  icon: string
  key: TableKey
  title: string
  to: string
}

type TableKey = 'events' | 'people' | 'profiles' | 'suggestions'

const tables = computed((): Table[] => [
  {
    icon: 'i-lucide:users',
    key: 'people',
    title: t('people.title'),
    to: localePath('/people')
  },
  {
    icon: 'i-lucide:calendar-range',
    key: 'events',
    title: t('events.title'),
    to: localePath('/events')
  },
  {
    icon: 'i-lucide:lightbulb',
    key: 'suggestions',
    title: t('suggestions.title'),
    to: localePath('/suggestions')
  },
  {
    icon: 'i-lucide:user-check',
    key: 'profiles',
    title: t('general.profiles'),
    to: localePath('/settings/profile')
  }
])

const { data: stats } = await useLazyFetch<Record<TableKey, number>>('/api/stats', {
  default: () => ({ events: 0, people: 0, profiles: 0, suggestions: 0 })
})
</script>

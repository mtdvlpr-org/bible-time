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
          {{ stats[table.key] }}
        </span>
      </div>
    </UPageCard>
  </UPageGrid>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

type Table = {
  icon: string
  key: TableKey
  title: string
  to: string
}

type TableKey = 'events' | 'people'

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
  }
])

const supabase = useSupabaseClient()

const { data: stats } = await useAsyncData(
  'stats',
  async () => {
    const [peopleResult, eventsResult] = await Promise.all([
      supabase.from('people').select('*', { count: 'exact', head: true }),
      supabase.from('events').select('*', { count: 'exact', head: true })
    ])

    const counts: Record<TableKey, number> = {
      events: eventsResult.count ?? 0,
      people: peopleResult.count ?? 0
    }

    return counts
  },
  { default: () => ({ events: 0, people: 0 }) }
)
</script>

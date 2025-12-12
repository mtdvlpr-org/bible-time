<template>
  <UDashboardPanel id="admin-events">
    <template #header>
      <UDashboardNavbar :title="$t('events.title')">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <LazySuggestionsAddModal v-if="can('suggestions.create')" type="event.create" />
          <LazyEventsAddModal v-if="can('events.create')" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <DataTable
        ref="table"
        :data="events"
        :columns="columns"
        :pending="pending"
        :refresh="refresh"
        :on-select="onSelect"
        :empty="$t('events.not-found')"
        :search-label="$t('events.search')"
      />
    </template>
  </UDashboardPanel>
</template>
<script setup lang="ts">
import type { TableColumn, TableRow } from '@nuxt/ui'

const { t } = useI18n()
const { can } = useUserStore()
const supabase = useSupabaseClient()

const {
  data: events,
  pending,
  refresh
} = await useAsyncData('events', async () => {
  const { data } = await supabase
    .from('events')
    .select('*')
    .or('cover_url.is.null,description.is.null,start_year.is.null,end_year.is.null')
  return data ?? []
})

const { formatYear } = useDate()
const { avatarCell, sortableColumn } = useTable()

const localePath = useLocalePath()

function onSelect(e: Event, row: TableRow<Tables<'events'>>) {
  navigateTo(localePath(`/events/${row.original.slug}`))
}

const { translate } = useTranslations()

const columns = computed((): TableColumn<Tables<'events'>>[] => [
  {
    accessorKey: 'title',
    cell: ({ row }) =>
      avatarCell(
        translate(row.original.title),
        row.original.cover_url,
        row.original.aliases.map((a) => translate(a))
      ),
    header: t('event.title')
  },
  {
    accessorKey: 'start_year',
    cell: ({ row }) => formatYear(row.original.start_year, row.original.start_precision),
    header: ({ column }) => sortableColumn(column, t('event.start-year'))
  },
  {
    accessorKey: 'end_year',
    cell: ({ row }) => formatYear(row.original.end_year, row.original.end_precision),
    header: ({ column }) => sortableColumn(column, t('event.end-year'))
  },
  {
    accessorKey: 'description',
    cell: ({ row }) =>
      row.original.description?.en
        ? row.original.description?.en?.slice(0, 15) + '...'
        : t('general.no-description'),
    header: t('general.description')
  }
])

useSeoMeta({
  description: t('events.description'),
  title: t('events.title')
})

useSchemaOrg([defineWebPage({ '@type': 'CollectionPage' })])
</script>

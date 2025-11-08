<template>
  <UDashboardPanel id="events">
    <template #header>
      <UDashboardNavbar :title="$t('events.title')">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
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
        :empty="$t('events.not-found')"
        :search-label="$t('events.search')"
      />
    </template>
  </UDashboardPanel>
</template>
<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

const { t } = useI18n()
const { can } = useUserStore()
const supabase = useSupabaseClient()

const {
  data: events,
  pending,
  refresh
} = await useAsyncData('events', async () => {
  const { data } = await supabase.from('events').select('*')
  return data ?? []
})

const toast = useToast()
const { formatYear } = useDate()
const { actionCell, avatarCell, sortableColumn } = useTable()

const { translate } = useTranslations()

const columns = computed((): TableColumn<Tables<'events'>>[] => [
  {
    accessorKey: 'title',
    cell: ({ row }) => avatarCell(translate(row.original.title), row.original.cover_url),
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
    cell: ({ row }) =>
      actionCell([
        { label: t('general.actions'), type: 'label' },
        { icon: 'i-lucide:list', label: t('event.view'), to: `/events/${row.original.slug}` },
        ...(can('events.delete')
          ? [
              { type: 'separator' as const },
              {
                color: 'error' as const,
                icon: 'i-lucide:trash',
                label: t('event.delete'),
                onSelect() {
                  // TODO: Implement delete functionality
                  toast.add({
                    description: 'The event has been deleted.',
                    title: 'Event deleted'
                  })
                }
              }
            ]
          : [])
      ]),
    id: 'actions'
  }
])

useSeoMeta({
  description: t('events.description'),
  title: t('events.title')
})

useSchemaOrg([defineWebPage({ '@type': 'CollectionPage' })])
</script>

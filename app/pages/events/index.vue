<template>
  <UDashboardPanel id="events">
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
        :empty="$t('events.not-found')"
        :search-label="$t('events.search')"
      />
      <LazyConfirmModal
        v-if="can('events.delete') && deleteEvent"
        v-model="confirmDelete"
        :confirm="{ color: 'error', label: t('event.delete') }"
        :message="$t('feedback.confirm-delete', { item: translate(deleteEvent.title) })"
        @cancel="onCancelDelete"
        @confirm="onConfirmDelete"
      />
    </template>
  </UDashboardPanel>
</template>
<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

const { t } = useI18n()
const { can } = useUserStore()
const localePath = useLocalePath()
const supabase = useSupabaseClient()

const {
  data: events,
  pending,
  refresh
} = await useAsyncData('events', async () => {
  const { data } = await supabase.from('events').select('*')
  return data ?? []
})

const { formatYear } = useDate()
const { showError, showSuccess } = useFlash()
const { actionCell, avatarCell, sortableColumn } = useTable()

const confirmDelete = ref(false)
const deleteEvent = shallowRef<null | Tables<'events'>>(null)

function onCancelDelete() {
  confirmDelete.value = false
  deleteEvent.value = null
}

async function onConfirmDelete() {
  if (!deleteEvent.value) return

  const { error } = await supabase.from('people').delete().eq('id', deleteEvent.value.id)

  if (error) {
    showError({
      description: t('feedback.could-not-delete', { item: translate(deleteEvent.value.title) })
    })
  } else {
    showSuccess({
      description: t('feedback.deleted-successfully', { item: translate(deleteEvent.value.title) })
    })

    confirmDelete.value = false
    deleteEvent.value = null
  }
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
    cell: ({ row }) =>
      actionCell([
        { label: t('general.actions'), type: 'label' },
        {
          icon: 'i-lucide:list',
          label: t('event.view'),
          to: localePath(`/events/${row.original.slug}`)
        },
        ...(can('events.delete')
          ? [
              { type: 'separator' as const },
              {
                color: 'error' as const,
                icon: 'i-lucide:trash',
                label: t('event.delete'),
                onSelect() {
                  deleteEvent.value = row.original
                  confirmDelete.value = true
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

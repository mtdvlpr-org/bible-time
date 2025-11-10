<template>
  <UDashboardPanel id="suggestions">
    <template #header>
      <UDashboardNavbar :title="$t('suggestions.title')">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <!-- <LazySuggestionsAddModal v-if="can('suggestions.create')" /> -->
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <DataTable
        ref="table"
        :columns="columns"
        :pending="pending"
        :refresh="refresh"
        :data="suggestions"
        :empty="$t('suggestions.not-found')"
        :search-label="$t('suggestions.search')"
      >
        <template #filters> </template>
      </DataTable>
    </template>
  </UDashboardPanel>
</template>
<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

const { t } = useI18n()
const supabase = useSupabaseClient()

const {
  data: suggestions,
  pending,
  refresh
} = await useAsyncData('suggestions', async () => {
  const { data } = await supabase.from('suggestions').select('*')
  return data ?? []
})

const toast = useToast()
const { actionCell, sortableColumn } = useTable()

const userStore = useUserStore()

const { translate, translateSuggestionStatus, translateSuggestionType } = useTranslations()

const columns = computed((): TableColumn<Tables<'suggestions'>>[] => [
  {
    accessorKey: 'type',
    cell: ({ row }) => translateSuggestionType(row.original.type),
    header: ({ column }) => sortableColumn(column, t('suggestion.type'))
  },
  {
    accessorKey: 'target_slug',
    cell: ({ row }) => {
      if (row.original.target_slug) {
        return translate(deslugify(row.original.target_slug))
      }
      if (row.original.type === 'person.create') {
        return (row.original.payload as Tables<'people'>).name
      }
      if (row.original.type === 'event.create') {
        return (row.original.payload as Tables<'events'>).title
      }
    },
    header: t('suggestion.target')
  },
  {
    accessorKey: 'status',
    cell: ({ row }) => translateSuggestionStatus(row.original.status),
    header: ({ column }) => sortableColumn(column, t('suggestion.status'))
  },
  {
    cell: ({ row }) =>
      actionCell([
        { label: t('general.actions'), type: 'label' },
        { icon: 'i-lucide:list', label: t('suggestion.view') },
        ...(userStore.can('suggestions.update') && row.original.user_id !== userStore.user?.id
          ? [
              { type: 'separator' as const },
              {
                icon: 'i-lucide:pencil',
                label: t('suggestion.review'),
                onSelect() {
                  // TODO: Implement edit functionality
                  toast.add({
                    description: 'The suggestion has been edited.',
                    title: 'Suggestion edited'
                  })
                }
              }
            ]
          : []),
        ...(row.original.user_id === userStore.user?.id
          ? [
              { type: 'separator' as const },
              {
                color: 'error' as const,
                icon: 'i-lucide:trash',
                label: t('suggestion.delete'),
                onSelect() {
                  // TODO: Implement delete functionality
                  toast.add({
                    description: 'The suggestion has been deleted.',
                    title: 'Suggestion deleted'
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
  description: t('suggestions.description'),
  title: t('suggestions.title')
})

useSchemaOrg([defineWebPage({ '@type': 'CollectionPage' })])
</script>

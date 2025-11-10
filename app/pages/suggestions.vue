<template>
  <UDashboardPanel id="suggestions">
    <template #header>
      <UDashboardNavbar :title="$t('suggestions.title')">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <LazySuggestionsAddModal
            v-if="suggestion && userStore.can('suggestions.update')"
            v-model:open="openSuggestion"
            review
            :event="eventProp"
            :person="personProp"
            :type="suggestion.type"
            :target="`${suggestion.id}`"
          />
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
        :filters="[{ id: 'status', value: 'pending' }]"
      >
        <template #filters>
          <USelect
            class="min-w-28"
            :items="statusFilters"
            :placeholder="$t('suggestions.filter-status')"
            :ui="{
              trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
            }"
            :model-value="
              dataTable?.table?.tableApi
                ?.getColumn('status')
                ?.getFilterValue() as Enums<'suggestion_status'>
            "
            @update:model-value="
              (v) => dataTable?.table?.tableApi?.getColumn('status')?.setFilterValue(v)
            "
          />
        </template>
      </DataTable>
    </template>
  </UDashboardPanel>
</template>
<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

const { t } = useI18n()
const supabase = useSupabaseClient()
const dataTable = useTemplateRef('table')

const {
  data: suggestions,
  pending,
  refresh
} = await useAsyncData('suggestions', async () => {
  const { data } = await supabase.from('suggestions').select('*')
  return data ?? []
})

const openSuggestion = ref(false)
const suggestion = ref<null | Tables<'suggestions'>>(null)

const personProp = computed(() => {
  if (!suggestion.value) return undefined
  const person = suggestion.value.payload as Tables<'people'>
  return {
    ...person,
    birth_precision: person.birth_precision ?? undefined,
    death_precision: person.death_precision ?? undefined
  }
})

const eventProp = computed(() => {
  if (!suggestion.value) return undefined
  const event = suggestion.value.payload as Tables<'events'>
  return {
    ...event,
    end_precision: event.end_precision ?? undefined,
    start_precision: event.start_precision ?? undefined
  }
})

const statusFilters = computed(
  (): { label: string; value: Enums<'suggestion_status'> | undefined }[] => [
    {
      label: t('suggestion.pending'),
      value: 'pending'
    },
    {
      label: t('suggestion.approved'),
      value: 'approved'
    },
    {
      label: t('suggestion.rejected'),
      value: 'rejected'
    },
    { label: t('general.all'), value: undefined }
  ]
)

const toast = useToast()
const userStore = useUserStore()
const { actionCell, sortableColumn } = useTable()

const { translate, translateSuggestionStatus, translateSuggestionType } = useTranslations()

const columns = computed((): TableColumn<Tables<'suggestions'>>[] => [
  {
    accessorKey: 'type',
    cell: ({ row }) => translateSuggestionType(row.original.type),
    filterFn: 'equals',
    header: ({ column }) => sortableColumn(column, t('suggestion.type'))
  },
  {
    accessorKey: 'target_slug',
    cell: ({ row }) => {
      if (row.original.target_slug) {
        return translate(deslugify(row.original.target_slug))
      }
      if (row.original.type === 'person.create') {
        return (row.original.payload as TablesInsert<'people'>).name
      }
      if (row.original.type === 'event.create') {
        return (row.original.payload as TablesInsert<'events'>).title
      }
    },
    header: t('suggestion.target')
  },
  {
    accessorKey: 'status',
    cell: ({ row }) => translateSuggestionStatus(row.original.status),
    filterFn: 'equals',
    header: ({ column }) => sortableColumn(column, t('suggestion.status'))
  },
  {
    cell: ({ row }) =>
      row.original.status === 'pending'
        ? actionCell([
            { label: t('general.actions'), type: 'label' },
            // {
            //   icon: 'i-lucide:list',
            //   label: t('suggestion.view'),
            //   onSelect() {
            //     suggestion.value = row.original
            //     openSuggestion.value = true
            //   }
            // },
            ...(userStore.can('suggestions.update') &&
            row.original.status === 'pending' &&
            row.original.user_id !== userStore.user?.id
              ? [
                  { type: 'separator' as const },
                  {
                    icon: 'i-lucide:pencil',
                    label: t('suggestion.review'),
                    onSelect() {
                      suggestion.value = row.original
                      openSuggestion.value = true
                    }
                  }
                ]
              : []),
            ...(row.original.status === 'pending' && row.original.user_id === userStore.user?.id
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
          ])
        : '',
    id: 'actions'
  }
])

useSeoMeta({
  description: t('suggestions.description'),
  title: t('suggestions.title')
})

useSchemaOrg([defineWebPage({ '@type': 'CollectionPage' })])
</script>

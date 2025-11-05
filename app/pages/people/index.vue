<template>
  <UDashboardPanel id="people">
    <template #header>
      <UDashboardNavbar :title="$t('people.title')">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <LazyPeopleAddModal />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <DataTable
        ref="table"
        :data="people"
        :columns="columns"
        :pending="pending"
        :refresh="refresh"
        :empty="$t('people.not-found')"
        :search-label="$t('people.search')"
      >
        <template #filters>
          <USelect
            class="min-w-28"
            :items="genderFilters"
            :placeholder="$t('people.filter-gender')"
            :ui="{
              trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
            }"
            @update:model-value="
              (v) => dataTable?.table?.tableApi?.getColumn('gender')?.setFilterValue(v)
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
  data: people,
  pending,
  refresh
} = await useAsyncData('people', async () => {
  const { data } = await supabase.from('people').select('*')
  return data ?? []
})

const toast = useToast()
const { fields } = useForm()
const { formatYear } = useDate()
const { actionCell, avatarCell, sortableColumn } = useTable()

const genderFilters = computed((): { label: string; value: Enums<'gender'> | undefined }[] => [
  ...fields.gender.items,
  { label: t('general.all'), value: undefined }
])

const i18nStore = useI18nStore()

const columns = computed((): TableColumn<Tables<'people'>>[] => [
  {
    accessorKey: 'name',
    cell: ({ row }) => avatarCell(i18nStore.translate(row.original.name), row.original.avatar_url),
    header: t('person.name')
  },
  {
    accessorKey: 'gender',
    cell: ({ row }) => {
      switch (row.original.gender) {
        case 'female':
          return t('person.female')
        case 'male':
          return t('person.male')
        case 'unknown':
          return t('general.unknown')
      }
    },
    filterFn: 'equals',
    header: t('person.gender')
  },
  {
    accessorKey: 'birth_year',
    cell: ({ row }) => formatYear(row.original.birth_year, row.original.birth_precision),
    header: ({ column }) => sortableColumn(column, t('people.born'))
  },
  {
    accessorKey: 'death_year',
    cell: ({ row }) => formatYear(row.original.death_year, row.original.death_precision),
    header: ({ column }) => sortableColumn(column, t('people.died'))
  },
  {
    cell: ({ row }) =>
      actionCell([
        { label: t('general.actions'), type: 'label' },
        { icon: 'i-lucide:list', label: t('person.view'), to: `/people/${row.original.slug}` },
        { icon: 'i-lucide:edit', label: t('person.edit') },
        { type: 'separator' },
        {
          color: 'error',
          icon: 'i-lucide:trash',
          label: t('person.delete'),
          onSelect() {
            toast.add({
              description: 'The customer has been deleted.',
              title: 'Customer deleted'
            })
          }
        }
      ]),
    id: 'actions'
  }
])

useSeoMeta({
  description: t('people.description'),
  title: t('people.title')
})

useSchemaOrg([defineWebPage({ '@type': 'CollectionPage' })])
</script>

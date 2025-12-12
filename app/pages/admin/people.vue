<template>
  <UDashboardPanel id="admin-people">
    <template #header>
      <UDashboardNavbar :title="$t('people.title')">
        <template #leading>
          <UDashboardSidebarCollapse />
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
        :on-select="onSelect"
        :empty="$t('people.not-found')"
        :search-label="$t('people.search')"
      >
        <template #filters>
          <USelect
            v-if="dataTable?.table?.tableApi"
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
import type { TableColumn, TableRow } from '@nuxt/ui'

const { t } = useI18n()
const supabase = useSupabaseClient()
const dataTable = useTemplateRef('table')

const {
  data: people,
  pending,
  refresh
} = await useAsyncData('admin-people', async () => {
  const { data } = await supabase
    .from('people')
    .select('*')
    .or(
      'avatar_url.is.null,description.is.null,birth_year.is.null,death_year.is.null,gender.eq.unknown'
    )
  return data ?? []
})

const { fields } = useForm()
const { formatYear } = useDate()
const { avatarCell, sortableColumn } = useTable()

const genderFilters = computed((): { label: string; value: Enums<'gender'> | undefined }[] => [
  ...fields.gender.items,
  { label: t('general.all'), value: undefined }
])

const localePath = useLocalePath()

function onSelect(e: Event, row: TableRow<Tables<'people'>>) {
  navigateTo(localePath(`/people/${row.original.slug}`))
}

const { translate } = useTranslations()

const columns = computed((): TableColumn<Tables<'people'>>[] => [
  {
    accessorKey: 'name',
    cell: ({ row }) =>
      avatarCell(
        translate(row.original.name),
        row.original.avatar_url,
        row.original.aliases.map((a) => translate(a))
      ),
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
    accessorKey: 'description',
    cell: ({ row }) =>
      row.original.description?.en
        ? row.original.description?.en?.slice(0, 15) + '...'
        : t('general.no-description'),
    header: t('general.description')
  }
])

useSeoMeta({
  description: t('people.description'),
  title: t('people.title')
})

useSchemaOrg([defineWebPage({ '@type': 'CollectionPage' })])
</script>

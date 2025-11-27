<template>
  <UDashboardPanel id="people">
    <template #header>
      <UDashboardNavbar :title="$t('people.title')">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <LazySuggestionsAddModal v-if="can('suggestions.create')" type="person.create" />
          <LazyPeopleAddModal v-if="can('people.create')" />
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
    <LazyConfirmModal
      v-if="can('people.delete') && deletePerson"
      v-model="confirmDelete"
      :message="$t('feedback.confirm-delete', { item: translate(deletePerson.name) })"
      @cancel="onCancelDelete"
      @confirm="onConfirmDelete"
    />
  </UDashboardPanel>
</template>
<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

const { t } = useI18n()
const { can } = useUserStore()
const localePath = useLocalePath()
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

const { fields } = useForm()
const { formatYear } = useDate()
const { showError, showSuccess } = useFlash()
const { actionCell, avatarCell, sortableColumn } = useTable()

const genderFilters = computed((): { label: string; value: Enums<'gender'> | undefined }[] => [
  ...fields.gender.items,
  { label: t('general.all'), value: undefined }
])

const confirmDelete = ref(false)
const deletePerson = shallowRef<null | Tables<'people'>>(null)

function onCancelDelete() {
  confirmDelete.value = false
  deletePerson.value = null
}

async function onConfirmDelete() {
  if (!deletePerson.value) return

  const { error } = await supabase.from('people').delete().eq('id', deletePerson.value.id)

  if (error) {
    showError({
      description: t('feedback.could-not-delete', { item: translate(deletePerson.value.name) })
    })
  } else {
    showSuccess({
      description: t('feedback.deleted-successfully', { item: translate(deletePerson.value.name) })
    })

    confirmDelete.value = false
    deletePerson.value = null
  }
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
    cell: ({ row }) =>
      actionCell([
        { label: t('general.actions'), type: 'label' },
        {
          icon: 'i-lucide:list',
          label: t('person.view'),
          to: localePath(`/people/${row.original.slug}`)
        },
        ...(can('people.delete')
          ? [
              { type: 'separator' as const },
              {
                color: 'error' as const,
                icon: 'i-lucide:trash',
                label: t('person.delete'),
                onSelect() {
                  deletePerson.value = row.original
                }
              }
            ]
          : [])
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

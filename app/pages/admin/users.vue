<template>
  <UDashboardPanel id="users">
    <template #header>
      <UDashboardNavbar :title="$t('users.title')">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <DataTable
        ref="table"
        :data="users"
        :columns="columns"
        :pending="pending"
        :refresh="refresh"
        :empty="$t('users.not-found')"
        :search-label="$t('users.search')"
      >
        <template #filters>
          <USelect
            v-if="dataTable?.table?.tableApi"
            class="min-w-28"
            :items="roleFilters"
            :placeholder="$t('users.filter-role')"
            :ui="{
              trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
            }"
            @update:model-value="
              (v) => dataTable?.table?.tableApi?.getColumn('role')?.setFilterValue(v)
            "
          />
        </template>
      </DataTable>
    </template>
  </UDashboardPanel>
</template>
<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

type AppUser = Omit<Tables<'profiles'>, 'created_at'> & {
  user_roles: null | {
    role: Enums<'app_role'>
  }
}

const { t } = useI18n()
const supabase = useSupabaseClient()
const dataTable = useTemplateRef('table')

const {
  data: users,
  pending,
  refresh
} = await useAsyncData('users', async (): Promise<AppUser[]> => {
  const { data } = await supabase
    .from('profiles')
    .select('id, display_name, avatar_url, user_roles(role)')
  return data ?? []
})

const { fields } = useForm()
const { actionCell, avatarCell } = useTable()

const roleFilters = computed((): { label: string; value: Enums<'app_role'> | undefined }[] => [
  ...fields.role.items,
  { label: t('general.all'), value: undefined }
])

const userStore = useUserStore()

const columns = computed((): TableColumn<AppUser>[] => [
  {
    accessorKey: 'display_name',
    cell: ({ row }) =>
      avatarCell(
        userStore.user?.id === row.original.id
          ? `${row.original.display_name} (${t('auth.you')})`
          : row.original.display_name,
        row.original.avatar_url
      ),
    header: t('person.name')
  },
  {
    accessorKey: 'user_roles.role',
    cell: ({ row }) => {
      switch (row.original.user_roles?.role) {
        case 'admin':
          return t('auth.admin')
        case 'moderator':
          return t('auth.moderator')
        case 'translator':
          return t('auth.translator')
        case 'user':
          return t('auth.user')
      }
    },
    filterFn: 'equals',
    header: t('auth.role'),
    id: 'role'
  },
  {
    cell: () => actionCell([{ label: t('general.actions'), type: 'label' }]),
    id: 'actions'
  }
])

useSeoMeta({
  description: t('users.description'),
  title: t('users.title')
})
</script>

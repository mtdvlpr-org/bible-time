<template>
  <UDashboardPanel id="customers">
    <template #header>
      <UDashboardNavbar title="Customers">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <CustomersAddModal />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-wrap items-center justify-between gap-1.5">
        <UInput
          class="max-w-sm"
          icon="i-lucide-search"
          placeholder="Filter emails..."
          :model-value="table?.tableApi?.getColumn('email')?.getFilterValue() as string"
          @update:model-value="table?.tableApi?.getColumn('email')?.setFilterValue($event)"
        />

        <div class="flex flex-wrap items-center gap-1.5">
          <CustomersDeleteModal :count="table?.tableApi?.getFilteredSelectedRowModel().rows.length">
            <UButton
              v-if="table?.tableApi?.getFilteredSelectedRowModel().rows.length"
              color="error"
              label="Delete"
              variant="subtle"
              icon="i-lucide-trash"
            >
              <template #trailing>
                <UKbd>
                  {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length }}
                </UKbd>
              </template>
            </UButton>
          </CustomersDeleteModal>

          <USelect
            v-model="statusFilter"
            class="min-w-28"
            placeholder="Filter status"
            :ui="{
              trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
            }"
            :items="[
              { label: 'All', value: 'all' },
              { label: 'Subscribed', value: 'subscribed' },
              { label: 'Unsubscribed', value: 'unsubscribed' },
              { label: 'Bounced', value: 'bounced' }
            ]"
          />
          <UDropdownMenu
            :content="{ align: 'end' }"
            :items="
              table?.tableApi
                ?.getAllColumns()
                .filter((column: any) => column.getCanHide())
                .map((column: any) => ({
                  label: upperFirst(column.id),
                  type: 'checkbox' as const,
                  checked: column.getIsVisible(),
                  onUpdateChecked(checked: boolean) {
                    table?.tableApi?.getColumn(column.id)?.toggleVisibility(!!checked)
                  },
                  onSelect(e?: Event) {
                    e?.preventDefault()
                  }
                }))
            "
          >
            <UButton
              color="neutral"
              label="Display"
              variant="outline"
              trailing-icon="i-lucide-settings-2"
            />
          </UDropdownMenu>
        </div>
      </div>

      <UTable
        ref="table"
        v-model:pagination="pagination"
        v-model:row-selection="rowSelection"
        v-model:column-filters="columnFilters"
        v-model:column-visibility="columnVisibility"
        :data="data"
        class="shrink-0"
        :columns="columns"
        :loading="status === 'pending'"
        :pagination-options="{
          getPaginationRowModel: getPaginationRowModel()
        }"
        :ui="{
          base: 'table-fixed border-separate border-spacing-0',
          thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
          tbody: '[&>tr]:last:[&>td]:border-b-0',
          th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
          td: 'border-b border-default',
          separator: 'h-0'
        }"
      />

      <div class="flex items-center justify-between gap-3 border-t border-default pt-4 mt-auto">
        <div class="text-sm text-muted">
          {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} of
          {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} row(s) selected.
        </div>

        <div class="flex items-center gap-1.5">
          <UPagination
            :total="table?.tableApi?.getFilteredRowModel().rows.length"
            :items-per-page="table?.tableApi?.getState().pagination.pageSize"
            :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
            @update:page="(p: number) => table?.tableApi?.setPageIndex(p - 1)"
          />
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Row } from '@tanstack/table-core'

import { getPaginationRowModel } from '@tanstack/table-core'
import { upperFirst } from 'scule'

import type { User } from '~/types'

const UAvatar = resolveComponent('UAvatar')
const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UCheckbox = resolveComponent('UCheckbox')

const toast = useToast()
const table = useTemplateRef('table')

const columnFilters = ref([
  {
    id: 'email',
    value: ''
  }
])
const columnVisibility = ref()
const rowSelection = ref({ 1: true })

const { data, status } = await useFetch<User[]>('/api/customers', {
  lazy: true
})

function getRowItems(row: Row<User>) {
  return [
    {
      label: 'Actions',
      type: 'label'
    },
    {
      icon: 'i-lucide-copy',
      label: 'Copy customer ID',
      onSelect() {
        navigator.clipboard.writeText(row.original.id.toString())
        toast.add({
          description: 'Customer ID copied to clipboard',
          title: 'Copied to clipboard'
        })
      }
    },
    {
      type: 'separator'
    },
    {
      icon: 'i-lucide-list',
      label: 'View customer details'
    },
    {
      icon: 'i-lucide-wallet',
      label: 'View customer payments'
    },
    {
      type: 'separator'
    },
    {
      color: 'error',
      icon: 'i-lucide-trash',
      label: 'Delete customer',
      onSelect() {
        toast.add({
          description: 'The customer has been deleted.',
          title: 'Customer deleted'
        })
      }
    }
  ]
}

const columns: TableColumn<User>[] = [
  {
    cell: ({ row }) =>
      h(UCheckbox, {
        ariaLabel: 'Select row',
        modelValue: row.getIsSelected(),
        'onUpdate:modelValue': (value: 'indeterminate' | boolean) => row.toggleSelected(!!value)
      }),
    header: ({ table }) =>
      h(UCheckbox, {
        ariaLabel: 'Select all',
        modelValue: table.getIsSomePageRowsSelected()
          ? 'indeterminate'
          : table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (value: 'indeterminate' | boolean) =>
          table.toggleAllPageRowsSelected(!!value)
      }),
    id: 'select'
  },
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'name',
    cell: ({ row }) => {
      return h('div', { class: 'flex items-center gap-3' }, [
        h(UAvatar, {
          ...row.original.avatar,
          size: 'lg'
        }),
        h('div', undefined, [
          h('p', { class: 'font-medium text-highlighted' }, row.original.name),
          h('p', { class: '' }, `@${row.original.name}`)
        ])
      ])
    },
    header: 'Name'
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        class: '-mx-2.5',
        color: 'neutral',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        label: 'Email',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        variant: 'ghost'
      })
    }
  },
  {
    accessorKey: 'location',
    cell: ({ row }) => row.original.location,
    header: 'Location'
  },
  {
    accessorKey: 'status',
    cell: ({ row }) => {
      const color = {
        bounced: 'warning' as const,
        subscribed: 'success' as const,
        unsubscribed: 'error' as const
      }[row.original.status]

      return h(UBadge, { class: 'capitalize', color, variant: 'subtle' }, () => row.original.status)
    },
    filterFn: 'equals',
    header: 'Status'
  },
  {
    cell: ({ row }) => {
      return h(
        'div',
        { class: 'text-right' },
        h(
          UDropdownMenu,
          {
            content: {
              align: 'end'
            },
            items: getRowItems(row)
          },
          () =>
            h(UButton, {
              class: 'ml-auto',
              color: 'neutral',
              icon: 'i-lucide-ellipsis-vertical',
              variant: 'ghost'
            })
        )
      )
    },
    id: 'actions'
  }
]

const statusFilter = ref('all')

watch(
  () => statusFilter.value,
  (newVal) => {
    if (!table?.value?.tableApi) return

    const statusColumn = table.value.tableApi.getColumn('status')
    if (!statusColumn) return

    if (newVal === 'all') {
      statusColumn.setFilterValue(undefined)
    } else {
      statusColumn.setFilterValue(newVal)
    }
  }
)

const pagination = ref({
  pageIndex: 0,
  pageSize: 10
})
</script>

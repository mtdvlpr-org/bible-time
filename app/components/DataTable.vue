<template>
  <div class="flex flex-wrap items-center justify-between gap-1.5">
    <UInput
      v-model="globalFilter"
      class="max-w-sm"
      icon="i-lucide:search"
      :placeholder="searchLabel ? searchLabel : $t('general.search')"
    />

    <div class="flex flex-wrap items-center gap-1.5">
      <slot name="filters" />
      <UDropdownMenu
        :content="{ align: 'end' }"
        :items="
          table?.tableApi
            ?.getAllColumns()
            .filter((column) => column.getCanHide())
            .map(
              (column): DropdownMenuItem => ({
                label: formatTableId(column.id),
                type: 'checkbox',
                checked: column.getIsVisible(),
                onUpdateChecked(checked) {
                  table?.tableApi?.getColumn(column.id)?.toggleVisibility(!!checked)
                },
                onSelect(e) {
                  e.preventDefault()
                }
              })
            )
        "
      >
        <UButton
          color="neutral"
          variant="outline"
          :label="$t('general.display')"
          trailing-icon="i-lucide:settings-2"
        />
      </UDropdownMenu>
      <UButton
        v-if="refresh"
        color="neutral"
        variant="outline"
        :disabled="pending"
        icon="i-lucide:refresh-ccw"
        @click="refresh"
      />
    </div>
  </div>

  <UTable
    ref="table"
    v-model:pagination="pagination"
    v-model:global-filter="globalFilter"
    v-model:column-visibility="columnVisibility"
    :data="data"
    :empty="empty"
    class="shrink-0"
    :columns="columns"
    :loading="pending"
    :pagination-options="{ getPaginationRowModel: getPaginationRowModel() }"
    :ui="{
      base: 'table-fixed border-separate border-spacing-0',
      thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
      tbody: '[&>tr]:last:[&>td]:border-b-0',
      th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
      td: 'border-b border-default',
      separator: 'h-0'
    }"
  />

  <div class="flex justify-center border-t border-default pt-4 mt-auto">
    <UPagination
      :total="table?.tableApi?.getFilteredRowModel().rows.length"
      :items-per-page="table?.tableApi?.getState().pagination.pageSize"
      :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
      @update:page="(p: number) => table?.tableApi?.setPageIndex(p - 1)"
    />
  </div>
</template>
<script setup lang="ts" generic="T extends TableData">
import type { DropdownMenuItem, TableColumn, TableData } from '@nuxt/ui'

import {
  getPaginationRowModel,
  type PaginationState,
  type VisibilityState
} from '@tanstack/vue-table'
import { upperFirst } from 'scule'

defineProps<{
  columns: TableColumn<T>[]
  data?: T[]
  empty?: string
  pending?: boolean
  refresh?: () => Promise<void>
  searchLabel?: string
}>()

const globalFilter = ref('')
const table = useTemplateRef('table')
const columnVisibility = ref<undefined | VisibilityState>()
const pagination = ref<PaginationState>({ pageIndex: 0, pageSize: 10 })

const formatTableId = (id: string) => upperFirst(id.replaceAll('_', ' '))

defineExpose({ table })
</script>

<template>
  <UTable
    :data="data"
    class="shrink-0"
    :columns="columns"
    :ui="{
      base: 'table-fixed border-separate border-spacing-0',
      thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
      tbody: '[&>tr]:last:[&>td]:border-b-0',
      th: 'first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
      td: 'border-b border-default'
    }"
  />
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

import { h, resolveComponent } from 'vue'

import type { Period, Range, Sale } from '~/types'

const props = defineProps<{
  period: Period
  range: Range
}>()

const UBadge = resolveComponent('UBadge')

const sampleEmails = [
  'james.anderson@example.com',
  'mia.white@example.com',
  'william.brown@example.com',
  'emma.davis@example.com',
  'ethan.harris@example.com'
]

const { data } = await useAsyncData(
  'sales',
  async () => {
    const sales: Sale[] = []
    const currentDate = new Date()

    for (let i = 0; i < 5; i++) {
      const hoursAgo = randomInt(0, 48)
      const date = new Date(currentDate.getTime() - hoursAgo * 3600000)

      sales.push({
        amount: randomInt(100, 1000),
        date: date.toISOString(),
        email: randomFrom(sampleEmails),
        id: (4600 - i).toString(),
        status: randomFrom(['paid', 'failed', 'refunded'])
      })
    }

    return sales.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  },
  {
    default: () => [],
    watch: [() => props.period, () => props.range]
  }
)

const columns: TableColumn<Sale>[] = [
  {
    accessorKey: 'id',
    cell: ({ row }) => `#${row.getValue('id')}`,
    header: 'ID'
  },
  {
    accessorKey: 'date',
    cell: ({ row }) => {
      return new Date(row.getValue('date')).toLocaleString('en-US', {
        day: 'numeric',
        hour: '2-digit',
        hour12: false,
        minute: '2-digit',
        month: 'short'
      })
    },
    header: 'Date'
  },
  {
    accessorKey: 'status',
    cell: ({ row }) => {
      const color = {
        failed: 'error' as const,
        paid: 'success' as const,
        refunded: 'neutral' as const
      }[row.getValue('status') as string]

      return h(UBadge, { class: 'capitalize', color, variant: 'subtle' }, () =>
        row.getValue('status')
      )
    },
    header: 'Status'
  },
  {
    accessorKey: 'email',
    header: 'Email'
  },
  {
    accessorKey: 'amount',
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue('amount'))

      const formatted = new Intl.NumberFormat('en-US', {
        currency: 'EUR',
        style: 'currency'
      }).format(amount)

      return h('div', { class: 'text-right font-medium' }, formatted)
    },
    header: () => h('div', { class: 'text-right' }, 'Amount')
  }
]
</script>

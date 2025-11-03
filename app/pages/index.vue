<template>
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar :ui="{ right: 'gap-3' }" :title="$t('home.title')">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UTooltip :shortcuts="['N']" text="Notifications">
            <UButton
              square
              color="neutral"
              variant="ghost"
              @click="isNotificationsSlideoverOpen = true"
            >
              <UChip inset color="error">
                <UIcon name="i-lucide-bell" class="size-5 shrink-0" />
              </UChip>
            </UButton>
          </UTooltip>

          <UDropdownMenu :items="items">
            <UButton size="md" class="rounded-full" icon="i-lucide-plus" />
          </UDropdownMenu>
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <!-- NOTE: The `-ms-1` class is used to align with the `DashboardSidebarCollapse` button here. -->
          <HomeDateRangePicker v-model="range" class="-ms-1" />

          <HomePeriodSelect v-model="period" :range="range" />
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <HomeStats :range="range" :period="period" />
      <HomeChart :range="range" :period="period" />
      <HomeSales :range="range" :period="period" />
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

import { sub } from 'date-fns'

import type { Period, Range } from '~/types'

const { isNotificationsSlideoverOpen } = useDashboard()

const items = [
  [
    {
      icon: 'i-lucide-send',
      label: 'New mail',
      to: '/inbox'
    },
    {
      icon: 'i-lucide-user-plus',
      label: 'New customer',
      to: '/customers'
    }
  ]
] satisfies DropdownMenuItem[][]

const range = shallowRef<Range>({
  end: new Date(),
  start: sub(new Date(), { days: 14 })
})
const period = ref<Period>('daily')
</script>

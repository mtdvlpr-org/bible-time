<template>
  <UDashboardPanel id="settings" :ui="{ body: 'lg:py-12' }">
    <template #header>
      <UDashboardNavbar :title="$t('settings.title')">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <!-- NOTE: The `-mx-1` class is used to align with the `DashboardSidebarCollapse` button here. -->
        <UNavigationMenu highlight :items="links" class="-mx-1 flex-1" />
      </UDashboardToolbar>
    </template>

    <template #body>
      <div class="flex flex-col gap-4 sm:gap-6 lg:gap-12 w-full lg:max-w-2xl mx-auto">
        <NuxtPage />
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const { t } = useI18n()
const localePath = useLocalePath()

const links = computed((): NavigationMenuItem[][] => [
  [
    {
      exact: true,
      icon: 'i-lucide:settings-2',
      label: t('settings.general'),
      to: localePath('/settings')
    },
    {
      icon: 'i-lucide:user-round',
      label: t('settings.profile'),
      to: localePath('/settings/profile')
    },
    {
      icon: 'i-lucide:shield-user',
      label: t('settings.security'),
      to: localePath('/settings/security')
    }
  ],
  [
    // Links pushed to the right
  ]
])

useSeoMeta({
  description: t('settings.description'),
  title: t('settings.title')
})
</script>

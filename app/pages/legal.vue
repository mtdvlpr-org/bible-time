<template>
  <UDashboardPanel id="legal">
    <template #header>
      <UDashboardNavbar :ui="{ right: 'gap-3' }" :title="$t('legal.title')">
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
      <NuxtPage />
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
      icon: 'i-lucide:file-text',
      label: t('legal.title'),
      to: localePath('/legal')
    },
    {
      icon: 'i-lucide:shield-user',
      label: t('legal.privacy'),
      to: localePath('/legal/privacy')
    },
    {
      icon: 'i-lucide:file-user',
      label: t('legal.terms'),
      to: localePath('/legal/terms')
    },
    {
      icon: 'i-lucide:cookie',
      label: t('legal.cookies'),
      to: localePath('/legal/cookies')
    },
    {
      icon: 'i-lucide:file-clock',
      label: t('legal.retention'),
      to: localePath('/legal/retention')
    },
    {
      icon: 'i-lucide:file-x',
      label: t('legal.deletion'),
      to: localePath('/legal/deletion')
    }
  ],
  [
    // Links pushed to the right
  ]
])

useSeoMeta({
  description: t('legal.description'),
  title: t('legal.title')
})
</script>
<style lang="scss">
.content {
  h2 {
    font-size: 2.25rem;
    line-height: calc(2.5 / 2.25);
  }

  h3 {
    font-size: 1.5rem;
    line-height: calc(2 / 1.5);
  }

  h4 {
    font-size: 1.25rem;
    line-height: calc(1.75 / 1.25);
  }

  h2,
  h3,
  h4,
  p {
    margin-block: 1rem;
  }

  ul {
    list-style: disc inside;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-block: 1rem;

    th,
    td {
      padding: 0.75rem;
      text-align: left;
    }

    th {
      font-weight: 600;
    }
  }
}
</style>

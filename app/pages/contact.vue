<template>
  <UDashboardPanel id="contact">
    <template #header>
      <UDashboardNavbar :ui="{ right: 'gap-3' }" :title="$t('contact.title')">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body> Soon. </template>
  </UDashboardPanel>
</template>
<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  description: t('contact.description'),
  title: t('contact.title')
})
</script>

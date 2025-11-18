<template>
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar :ui="{ right: 'gap-3' }" :title="$t('home.title')">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <ChangelogViewer />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <HomeStats />
    </template>
  </UDashboardPanel>
</template>

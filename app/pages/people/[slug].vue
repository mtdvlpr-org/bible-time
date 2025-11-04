<template>
  <UDashboardPanel id="person">
    <template #header>
      <UDashboardNavbar :title="person?.name">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <LazyPeopleAddModal />
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <div v-if="person">
        {{ person?.description?.[locale] }}
      </div>
      <UError
        v-else
        :error="{
          statusCode: 404,
          statusMessage: 'Page not found',
          message: 'The page you are looking for does not exist.'
        }"
      />
    </template>
  </UDashboardPanel>
</template>
<script setup lang="ts">
import { useRouteParams } from '@vueuse/router'

const { locale } = useI18n()
const i18nStore = useI18nStore()
const supabase = useSupabaseClient()
const slug = useRouteParams<string>('slug')

const { data: person } = await useAsyncData(`person-${slug.value}`, async () => {
  const { data } = await supabase.from('people').select('*').eq('slug', slug.value).single()
  return data
})

useSeoMeta({
  description: person.value?.description?.[locale.value] || undefined,
  title: person.value ? i18nStore.translate(person.value.name) : undefined
})
</script>

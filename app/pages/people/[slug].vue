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

      <UDashboardToolbar>
        <UBreadcrumb :items="breadcrumbs" />
      </UDashboardToolbar>
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

const { locale, t } = useI18n()
const localePath = useLocalePath()
const i18nStore = useI18nStore()
const supabase = useSupabaseClient()
const slug = useRouteParams<string>('slug')

const { data: person } = await useAsyncData(`person-${slug.value}`, async () => {
  const { data } = await supabase.from('people').select('*').eq('slug', slug.value).single()
  return data
})

const name = computed(() =>
  person.value ? i18nStore.translate(person.value.name) : 'Page not found'
)

const breadcrumbs = computed(() => [
  {
    icon: 'i-lucide-home',
    label: t('home.title'),
    to: localePath('/')
  },
  {
    icon: 'i-lucide-users',
    label: t('people.title'),
    to: localePath('/people')
  },
  {
    icon: 'i-lucide-user',
    label: name.value,
    to: localePath(`/people/${slug.value}`)
  }
])

useSchemaOrg([
  defineWebPage({ '@type': 'ItemPage' }),
  defineBreadcrumb({
    itemListElement: breadcrumbs.value.map((b) => ({ item: b.to, name: b.label }))
  })
])

useSeoMeta({
  description: person.value?.description?.[locale.value] || undefined,
  title: name.value
})
</script>

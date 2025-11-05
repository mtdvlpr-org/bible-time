<template>
  <UDashboardPanel id="person">
    <template #header>
      <UDashboardNavbar :title="person?.name">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <LazyPeopleAddModal v-if="person" />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar v-if="person">
        <UBreadcrumb :items="breadcrumbs" />
      </UDashboardToolbar>
    </template>
    <template #body>
      <div v-if="person">
        {{ description }}
      </div>
      <UError
        v-else
        :error="{
          statusCode: 404,
          statusMessage: $t('feedback.page-not-found'),
          message: $t('feedback.page-not-exist')
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

const name = computed(() => (person.value ? i18nStore.translate(person.value.name) : '404'))

const description = computed(() => {
  return person.value?.description?.[locale.value] ?? t('feedback.page-not-found')
})

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

useSeoMeta({
  articleModifiedTime: person.value?.updated_at,
  articlePublishedTime: person.value?.created_at,
  description: description.value,
  ogType: person.value ? 'article' : undefined,
  title: name.value
})

useSchemaOrg(
  person.value
    ? [
        defineWebPage({ '@type': 'ItemPage' }),
        defineBreadcrumb({
          itemListElement: breadcrumbs.value.map((b) => ({ item: b.to, name: b.label }))
        }),
        defineArticle({
          dateModified: person.value.updated_at,
          datePublished: person.value.created_at,
          image: person.value.avatar_url,
          mainEntity: definePerson({
            description: description.value,
            image: person.value.avatar_url,
            name: name.value
          })
        })
      ]
    : []
)
</script>

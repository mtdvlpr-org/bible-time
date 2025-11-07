<template>
  <UDashboardPanel id="event">
    <template #header>
      <UDashboardNavbar :title="title">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UButton
            v-if="event && can('events.update')"
            :icon="edit ? 'i-lucide:pencil-off' : 'i-lucide:edit'"
            :label="edit ? $t('general.stop-editing') : $t('event.edit')"
            @click="edit = !edit"
          />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar v-if="event">
        <UBreadcrumb :items="breadcrumbs" />
      </UDashboardToolbar>
    </template>
    <template #body>
      <div v-if="event" class="prose max-w-none">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Left column: avatar & quick facts -->
          <aside class="md:col-span-1">
            <EventsInfoCard :edit="edit" :slug="event.slug" />
          </aside>

          <!-- Main content: description and related content -->
          <main class="md:col-span-2">
            <DescriptionCard
              :edit="edit"
              type="event"
              :slug="event.slug"
              :description="event.description"
            />

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <PeopleRelatedCard :id="event.id" :edit="edit" type="event" :slug="event.slug" />
            </div>
          </main>
        </div>
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

const edit = ref(false)
const { can } = useUserStore()
const { locale, t } = useI18n()
const localePath = useLocalePath()
const { translate } = useTranslations()
const supabase = useSupabaseClient()
const slug = useRouteParams<string>('slug')

const { data: event } = await useAsyncData(`event-${slug.value}`, async () => {
  const { data } = await supabase
    .from('events')
    .select('*,related_one:event_relations(relation_kind, people(name, slug, avatar_url))')
    .eq('slug', slug.value)
    .single()
  return data
})

const title = computed(() => (event.value ? translate(event.value.title) : '404'))

const breadcrumbs = computed(() => [
  {
    icon: 'i-lucide:home',
    label: t('home.title'),
    to: localePath('/')
  },
  {
    icon: 'i-lucide:calendar-range',
    label: t('events.title'),
    to: localePath('/events')
  },
  {
    icon: 'i-lucide:calendar-fold',
    label: title.value,
    to: localePath(`/events/${slug.value}`)
  }
])

const description = computed(() => {
  return event.value ? event.value.description?.[locale.value] : t('feedback.page-not-found')
})

useSeoMeta({
  articleModifiedTime: event.value?.updated_at,
  articlePublishedTime: event.value?.created_at,
  description: description.value,
  ogType: event.value ? 'article' : undefined,
  title: title.value
})

useSchemaOrg(
  event.value
    ? [
        defineWebPage({ '@type': 'ItemPage' }),
        defineBreadcrumb({
          itemListElement: breadcrumbs.value.map((b) => ({ item: b.to, name: b.label }))
        }),
        defineArticle({
          dateModified: event.value.updated_at,
          datePublished: event.value.created_at,
          image: event.value.cover_url,
          mainEntity: defineEvent({
            description: description.value,
            image: event.value.cover_url,
            name: title.value
          })
        })
      ]
    : []
)
</script>

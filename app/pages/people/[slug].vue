<template>
  <UDashboardPanel id="person">
    <template #header>
      <UDashboardNavbar :title="name">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <TranslateModal
            v-if="person && locale !== 'en' && can('translations.create')"
            type="person"
            :name="person.name"
            :aliases="person.aliases"
          />
          <UButton
            v-if="person && can('people.update')"
            :icon="edit ? 'i-lucide:pencil-off' : 'i-lucide:edit'"
            :label="edit ? $t('general.stop-editing') : $t('person.edit')"
            @click="edit = !edit"
          />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar v-if="person">
        <UBreadcrumb :items="breadcrumbs" />
      </UDashboardToolbar>
    </template>
    <template #body>
      <div v-if="person" class="prose max-w-none">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Left column: avatar & quick facts -->
          <aside class="md:col-span-1">
            <PeopleInfoCard :edit="edit" :slug="person.slug" />
          </aside>

          <!-- Main content: description and related content -->
          <main class="md:col-span-2">
            <DescriptionCard
              :edit="edit"
              type="person"
              :slug="person.slug"
              :description="person.description"
            />

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <EventsRelatedCard :id="person.id" :edit="edit" :slug="person.slug" />
              <PeopleRelatedCard :id="person.id" :edit="edit" type="person" :slug="person.slug" />
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

const { data: person } = await useAsyncData(`person-${slug.value}`, async () => {
  const { data } = await supabase
    .from('people')
    .select(
      `*,
    mother(name, slug, avatar_url),
    father(name, slug, avatar_url),
    event_relations(relation_kind, events(title, slug, cover_url)),
    related_one:person_relations!person_relations_person_one_fkey(relation_kind, people!person_relations_person_two_fkey(name, slug, avatar_url)),
    related_two:person_relations!person_relations_person_two_fkey(relation_kind, people!person_relations_person_one_fkey(name, slug, avatar_url))`
    )
    .eq('slug', slug.value)
    .single()
    .overrideTypes<{ father: ShortPerson; mother: ShortPerson }>()
  return data
})

const name = computed(() => (person.value ? translate(person.value.name) : '404'))

const breadcrumbs = computed(() => [
  {
    icon: 'i-lucide:home',
    label: t('home.title'),
    to: localePath('/')
  },
  {
    icon: 'i-lucide:users',
    label: t('people.title'),
    to: localePath('/people')
  },
  {
    icon: 'i-lucide:user',
    label: name.value,
    to: localePath(`/people/${slug.value}`)
  }
])

const description = computed(() => {
  return person.value ? person.value.description?.[locale.value] : t('feedback.page-not-found')
})

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

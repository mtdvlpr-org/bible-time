<template>
  <UDashboardPanel id="timeline">
    <template #header>
      <UDashboardNavbar :ui="{ right: 'gap-3' }" :title="$t('timeline.title')">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <UInputMenu
            v-model="search"
            value-key="value"
            :items="searchItems"
            :placeholder="$t('general.search')"
          >
            <template v-if="search" #trailing>
              <LazyUButton
                size="sm"
                variant="link"
                color="neutral"
                icon="i-lucide:circle-x"
                :aria-label="$t('general.clear')"
                @click="search = undefined"
              />
            </template>
          </UInputMenu>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <BibleTimeline ref="timeline" :events="events" :people="people" />
    </template>
  </UDashboardPanel>
</template>
<script setup lang="ts">
const { t } = useI18n()
const supabase = useSupabaseClient()

const { data: people } = await useAsyncData('people', async () => {
  const { data } = await supabase.from('people').select('*')
  return data ?? []
})

const { data: events } = await useAsyncData('events', async () => {
  const { data } = await supabase.from('events').select('*')
  return data ?? []
})

const timeline = useTemplateRef('timeline')

const search = ref<undefined | { end: number; start: number }>()
const searchItems = computed((): { label: string; value: { end: number; start: number } }[] => {
  return (
    timeline.value?.items.map(({ end, label, start }) => ({ label, value: { end, start } })) ?? []
  )
})

watch(search, (val) => {
  if (!timeline.value?.timeline) return
  if (val) {
    timeline.value.timeline.setViewport(val.start, val.end)
  } else {
    timeline.value.resetViewport()
  }
})

useSeoMeta({
  description: t('timeline.description'),
  title: t('timeline.title')
})
</script>

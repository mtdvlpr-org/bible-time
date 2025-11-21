<template>
  <Timeline
    v-if="items.length > 0"
    ref="timeline"
    :items="items"
    :groups="groups"
    :viewport-max="viewportMax"
    :viewport-min="viewportMin"
    :min-viewport-duration="100000000000"
    @click="onClick"
  >
    <template #item="{ item }">
      <div class="px-2 py-1 text-sm font-medium text-inverted">
        {{ item.label }}
      </div>
    </template>
  </Timeline>
  <div v-else class="flex flex-col items-center gap-4">
    <div class="flex items-center gap-4 w-full">
      <USkeleton class="h-4 w-1/4" />
      <USkeleton class="h-4 w-1/4" />
      <USkeleton class="h-4 w-1/4" />
      <USkeleton class="h-4 w-1/4" />
    </div>
    <USkeleton class="h-4 w-full" />
    <USkeleton class="h-4 w-full" />
    <USkeleton class="h-4 w-full" />
    <USkeleton class="h-4 w-full" />
  </div>
</template>
<script setup lang="ts">
import {
  Timeline,
  type TimelineGroup,
  type TimelineItemRange,
  type TimelineMarker
} from 'vue-timeline-chart'
import 'vue-timeline-chart/style.css'

type Item = TimelineItemRange & { label: string }

const props = defineProps<{
  events?: TimelineEvent[]
  highlighted?: string
  people?: TimelinePerson[]
}>()

const timeline = useTemplateRef('timeline')

const peopleWithDate = computed(
  () => props.people?.filter((p) => p.birth_year || p.death_year) ?? []
)
const eventsWithDate = computed(() => props.events?.filter((e) => e.start_year || e.end_year) ?? [])

const grouped = ref<Record<number, Item[]>>({})
const groups = computed((): TimelineGroup[] =>
  Object.keys(grouped.value).map((key) => ({ id: `${key}` }))
)

const items = computed(() => {
  const allItems: Item[] = []
  Object.values(grouped.value).forEach((list) => {
    allItems.push(...list)
  })
  return allItems
})

function onClick(value: { event: MouseEvent; item: Item | TimelineMarker; time: number }) {
  if (value.item.type === 'marker') return
  if (value.item.id) navigateTo(`/${value.item.id}`)
}

const { translate } = useTranslations()

function initTimeline() {
  grouped.value = {}
  peopleWithDate.value.forEach((p) => {
    const start = yearToTimestamp(p.birth_year ?? p.death_year ?? 0, 'start')
    const end = yearToTimestamp(p.death_year ?? p.birth_year ?? 0, 'end')
    const color = p.slug === props.highlighted ? 'warning' : 'primary'

    for (let group = 0; group <= Object.keys(grouped.value).length; group++) {
      const list = grouped.value[group] ?? []
      const hasOverlap = list.some((item) => !(start > item.end || end < item.start))

      if (hasOverlap) continue

      list.push({
        cssVariables: { '--item-background': `var(--ui-${color})` },
        end,
        group: group.toString(),
        id: `people/${p.slug}`,
        label: translate(p.name),
        start,
        type: 'range'
      })

      grouped.value[group] = list

      break
    }
  })

  const eventColor = props.people?.length ? 'success' : 'primary'
  eventsWithDate.value.forEach((e) => {
    const start = yearToTimestamp(e.start_year ?? e.end_year ?? 0, 'start')
    const end = yearToTimestamp(e.end_year ?? e.start_year ?? 0, 'end')
    const color = e.slug === props.highlighted ? 'warning' : eventColor

    for (let group = 0; group <= Object.keys(grouped.value).length; group++) {
      const list = grouped.value[group] ?? []
      const hasOverlap = list.some((item) => !(start > item.end || end < item.start))

      if (hasOverlap) continue

      list.push({
        cssVariables: {
          '--item-background': `var(--ui-${color})`
        },
        end,
        group: group.toString(),
        id: `events/${e.slug}`,
        label: translate(e.title),
        start,
        type: 'range'
      })

      grouped.value[group] = list

      break
    }
  })
}

onMounted(() => {
  initTimeline()
})

const viewportMin = computed(() => Math.min(...items.value.map((i) => i.start)))
const viewportMax = computed(() => Math.max(...items.value.map((i) => i.end)))

defineExpose({
  items,
  resetViewport: () => timeline.value?.setViewport(viewportMin.value, viewportMax.value),
  timeline
})
</script>

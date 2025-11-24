<template>
  <UCard>
    <h3 class="text-sm font-semibold mb-2">{{ $t('source.sources') }}</h3>
    <div class="space-y-2">
      <div v-if="sources.length === 0" class="text-sm text-zinc-500">
        {{ $t('source.no-sources') }}
      </div>
      <ul v-else class="space-y-2">
        <li v-for="s in sources" :key="s.to">
          <div class="flex items-center justify-between gap-3">
            <ULink external :to="s.to" class="w-full" target="_blank">
              <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                  <UIcon :name="s.icon" />
                  <div class="text-sm font-medium">
                    {{ s.label }}
                  </div>
                </div>
              </div>
            </ULink>
            <LazyUButton v-if="edit" size="xs" loading-auto color="error" icon="i-lucide:trash-2" />
          </div>
        </li>
      </ul>
    </div>
  </UCard>
</template>
<script setup lang="ts">
const props = defineProps<{
  edit?: boolean
  id: number
  slug: string
  type: 'event' | 'person'
}>()

const { data: item } = useNuxtData<{
  sources: { source_kind: Enums<'source_kind'>; value: string }[]
}>(`${props.type}-${props.slug}`)

const sources = computed(
  () =>
    item.value?.sources.map((s) => {
      if (s.source_kind === 'bible_verse') {
        const [book, chapter, verse] = s.value.split(':')
        const [begin, end] = verse?.split('-') ?? []

        if (!book || !chapter || !begin) {
          return { icon: '', label: s.value, to: '#' }
        }

        return {
          icon: 'i-lucide:book-open-text',
          label: end
            ? translateBook(+book) + ' ' + chapter + ':' + begin + '-' + end
            : translateBook(+book) + ' ' + chapter + ':' + verse,
          to: getBibleLink(locale.value, +book, +chapter, +begin, end ? +end : undefined)
        }
      } else {
        return {
          icon:
            s.source_kind === 'article'
              ? 'i-lucide:newspaper'
              : s.source_kind === 'video'
                ? 'i-lucide:video'
                : 'i-lucide:link',
          label: translateSourceType(s.source_kind),
          to: s.value
        }
      }
    }) ?? []
)

const { locale } = useI18n()
const { translateBook, translateSourceType } = useTranslations()
</script>

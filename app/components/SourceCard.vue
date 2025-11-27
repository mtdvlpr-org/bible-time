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
            <LazyUButton
              v-if="edit"
              size="xs"
              loading-auto
              color="error"
              icon="i-lucide:trash-2"
              @click="removeSource(s.id)"
            />
          </div>
        </li>
      </ul>
      <LazyUForm v-if="edit" :state="state" :schema="schema" class="space-y-2" @submit="onSubmit">
        <UFormField required name="sourceKind" :label="$t('source.type')">
          <USelect v-model="state.sourceKind" class="w-full" :items="sourceTypes" />
        </UFormField>
        <LazyInputVerses v-if="state.sourceKind === 'bible_verse'" v-model="state.sourceValue" />
        <UFormField v-else required name="sourceValue" :label="$t('source.noun')">
          <UInput
            v-model="state.sourceValue"
            type="url"
            class="w-full"
            placeholder="https://example.com"
          />
        </UFormField>
        <div class="mt-4 flex justify-end">
          <UButton
            loading-auto
            type="submit"
            icon="i-lucide:plus"
            :label="$t('general.add')"
            :disabled="!state.sourceValue"
          />
        </div>
      </LazyUForm>
    </div>
  </UCard>
</template>
<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'

import { z } from 'zod'

const props = defineProps<{
  edit?: boolean
  id: number
  slug: string
  type: 'event' | 'person'
}>()

const { data: item } = useNuxtData<{
  sources: Omit<Tables<'person_sources'>, 'person_id'>[]
}>(`${props.type}-${props.slug}`)

const sources = computed(
  () =>
    item.value?.sources.map((s) => {
      if (s.source_kind === 'bible_verse') {
        const verse = parseVerseString(s.value)

        if (!verse) return { icon: '', id: s.id, label: s.value, to: '#' }

        const { book, chapter, end, start } = verse

        return {
          icon: 'i-lucide:book-open-text',
          id: s.id,
          label: formatBibleVerse(verse),
          to: getBibleLink(locale.value, book, chapter, start, end ? end : undefined)
        }
      } else {
        return {
          icon:
            s.source_kind === 'article'
              ? 'i-lucide:newspaper'
              : s.source_kind === 'video'
                ? 'i-lucide:video'
                : 'i-lucide:link',
          id: s.id,
          label: translateSourceType(s.source_kind),
          to: s.value
        }
      }
    }) ?? []
)

const { locale, t } = useI18n()
const { formatBibleVerse, translateSourceType } = useTranslations()

const supabase = useSupabaseClient()
const { showError, showSuccess } = useFlash()

const { rules } = useForm()

const schema = z
  .object({
    sourceKind: rules.sourceKind,
    sourceValue: z.string(t('validation.required', { field: t('source.noun') }))
  })
  .refine((data) => data.sourceKind === 'bible_verse' || data.sourceValue.startsWith('https://'), {
    error: t('validation.invalid', { field: t('source.noun') }),
    path: ['sourceValue']
  })

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({})

watch(
  () => state.sourceKind,
  (newVal, oldVal) => {
    if (newVal === 'bible_verse' || oldVal === 'bible_verse') {
      state.sourceValue = undefined
    }
  }
)

const sourceTypes = computed(() =>
  Constants.public.Enums.source_kind.map((s) => ({
    label: translateSourceType(s),
    value: s
  }))
)

async function onSubmit(event: FormSubmitEvent<Schema>) {
  if (!item.value) return

  const { data: created, error } = await supabase
    .from(`${props.type}_sources`)
    .insert({
      ...(props.type === 'event' ? { event_id: props.id } : { person_id: props.id }),
      source_kind: event.data.sourceKind,
      value: event.data.sourceValue
    })
    .select()
    .single()

  if (error) {
    showError({ description: error.message })
  } else {
    item.value = {
      ...item.value,
      sources: item.value.sources.concat({
        id: created.id,
        source_kind: event.data.sourceKind,
        value: event.data.sourceValue
      })
    }
    showSuccess({
      description: t('feedback.saved-successfully', { item: t('source.noun') })
    })
    state.sourceKind = state.sourceValue = undefined
  }
}

async function removeSource(id: number) {
  if (!item.value) return

  const { error } = await supabase.from(`${props.type}_sources`).delete().eq('id', id)

  if (error) {
    showError({ description: error.message })
  } else {
    item.value = { ...item.value, sources: item.value.sources.filter((s) => s.id !== id) }
    showSuccess({
      description: t('feedback.deleted-successfully', { item: t('source.noun') })
    })
  }
}
</script>

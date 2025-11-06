<template>
  <UCard v-if="event">
    <div class="flex items-center gap-4">
      <UAvatar
        size="xl"
        :alt="event.title"
        class="w-28 h-28 md:w-32 md:h-32"
        :src="event.cover_url ?? undefined"
      />
      <div>
        <h2 class="text-lg font-semibold">{{ translate(event.title) }}</h2>
        <div v-if="!edit" class="text-sm text-zinc-500">
          {{ aliases.length ? aliases.join(', ') : '' }}
        </div>
      </div>
    </div>
    <UForm v-if="edit" :state="state" :schema="schema" class="mt-4 space-y-4" @submit="onSubmit">
      <UFormField
        :label="$t('general.aliases')"
        :description="$t('validation.provide-in-language', { language: 'English' })"
      >
        <UInputTags v-model="state.aliases" />
      </UFormField>
      <UFormField
        name="start_year"
        :label="$t('event.start-year')"
        :description="state.start_year ? undefined : 'A negative number means before Christ'"
      >
        <UInputNumber
          v-model="state.start_year"
          :max="2025"
          :min="-4026"
          class="w-full"
          :decrement="false"
          :increment="false"
        />
      </UFormField>
      <UFormField
        v-if="state.start_year"
        required
        name="start_precision"
        :label="$t('date.precision')"
      >
        <USelect
          v-model="state.start_precision"
          class="w-full"
          :items="fields.datePrecision.items"
        />
      </UFormField>
      <UFormField
        name="end_year"
        :label="$t('event.end-year')"
        :description="state.end_year ? undefined : 'A negative number means before Christ'"
      >
        <UInputNumber
          v-model="state.end_year"
          :max="2025"
          :min="-4026"
          class="w-full"
          :decrement="false"
          :increment="false"
        />
      </UFormField>
      <UFormField v-if="state.end_year" required name="end_precision" :label="$t('date.precision')">
        <USelect v-model="state.end_precision" class="w-full" :items="fields.datePrecision.items" />
      </UFormField>
      <div class="flex justify-end">
        <UButton type="submit" icon="i-lucide:save" :label="$t('general.save')" />
      </div>
    </UForm>
    <div v-else class="mt-4 space-y-2">
      <div>
        <div class="text-xs text-zinc-500">{{ $t('event.start-year') }}</div>
        <div class="font-medium">
          {{ formatYear(event.start_year, event.start_precision) }}
        </div>
      </div>

      <div>
        <div class="text-xs text-zinc-500">{{ $t('event.end-year') }}</div>
        <div class="font-medium">
          {{ formatYear(event.end_year, event.end_precision) }}
        </div>
      </div>
    </div>
  </UCard>
</template>
<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'

import { z } from 'zod'

const props = defineProps<{
  edit?: boolean
  slug: string
}>()

const { data: event } = useNuxtData<Tables<'events'>>(`event-${props.slug}`)

const { t } = useI18n()
const { translate } = useTranslations()
const { formatYear } = useDate()

const aliases = computed(() => {
  return event.value?.aliases.map((alias) => translate(alias)) ?? []
})

const { fields, rules } = useForm()

const schema = z
  .object({
    aliases: z.array(z.string()).optional(),
    end_precision: rules.datePrecision(t('date.precision')).optional(),
    end_year: rules.year(t('event.end-year')).optional(),
    start_precision: rules.datePrecision(t('date.precision')).optional(),
    start_year: rules.year(t('event.start-year')).optional()
  })
  .refine(
    (data) => {
      if (!data.start_year || !data.end_year) return true
      return data.end_year >= data.start_year
    },
    {
      message: t('validation.after-or-equal-to', {
        date: t('event.start-year'),
        field: t('event.end-year')
      }),
      path: ['end_year']
    }
  )
  .refine((data) => !data.start_year || !!data.start_precision, {
    message: t('validation.required', { field: t('date.precision') }),
    path: ['start_precision']
  })
  .refine((data) => !data.end_year || !!data.end_precision, {
    message: t('validation.required', { field: t('date.precision') }),
    path: ['end_precision']
  })

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  aliases: event.value?.aliases ?? [],
  end_precision: event.value?.end_precision ?? undefined,
  end_year: event.value?.end_year ?? undefined,
  start_precision: event.value?.start_precision ?? undefined,
  start_year: event.value?.start_year ?? undefined
})

const { showError, showSuccess } = useFlash()
const supabase = useSupabaseClient()
async function onSubmit(submitEvent: FormSubmitEvent<Schema>) {
  if (!event.value) return

  // Store previous and new data
  const previousData = { ...event.value }
  const newData = {
    ...event.value,
    aliases: submitEvent.data.aliases ?? [],
    end_precision: submitEvent.data.end_precision ?? null,
    end_year: submitEvent.data.end_year ?? null,
    start_precision: submitEvent.data.start_precision ?? null,
    start_year: submitEvent.data.start_year ?? null
  }

  // Optimistic update
  event.value = newData

  // Send update to Supabase
  const { error } = await supabase.from('events').update(submitEvent.data).eq('slug', props.slug)

  if (error) {
    // Revert optimistic update
    event.value = previousData
    showError({ description: error.message })
  } else {
    // TODO: i18n
    showSuccess({ description: 'Event updated successfully.' })
  }
}
</script>

<template>
  <UForm :state="state" :schema="schema" class="space-y-4" :disabled="disabled" @submit="onSubmit">
    <UFormField
      required
      name="title"
      :label="$t('event.title')"
      :placeholder="fields.name.placeholder"
      :description="$t('validation.provide-in-language', { language: $t('i18n.english') })"
    >
      <UInput
        v-model="state.title"
        class="w-full"
        autocapitalize="words"
        :disabled="disabled || !!event"
        :autofocus="!event && !disabled"
        @change="state.slug = slugify(state.title)"
      />
    </UFormField>
    <UFormField
      required
      name="slug"
      :label="$t('general.slug')"
      :description="$t('general.slug-description')"
    >
      <UInput
        v-model="state.slug"
        class="w-full"
        autocapitalize="off"
        :disabled="disabled || !!event"
        @input="normalizeSlug"
      />
    </UFormField>
    <UFormField
      :label="$t('general.aliases')"
      :description="$t('validation.provide-in-language', { language: $t('i18n.english') })"
    >
      <UInputTags v-model="state.aliases" class="w-full" autocapitalize="words" />
    </UFormField>
    <LazyUFormField v-if="!noCover" name="cover_url" :label="$t('event.cover-url')">
      <InputClear
        v-model="state.cover_url"
        type="url"
        class="w-full"
        placeholder="https://example.com/cover.jpg"
        :cover="state.cover_url ? { src: state.cover_url, alt: '' } : undefined"
      />
    </LazyUFormField>
    <UFormField
      class="w-full"
      name="start_year"
      :label="$t('event.start-year')"
      :description="$t('date.negative-description')"
    >
      <UInputNumber
        v-model="state.start_year"
        :max="2025"
        :min="-4026"
        class="w-full"
        inputmode="tel"
        :decrement="false"
        :increment="false"
      />
    </UFormField>
    <LazyUFormField
      v-if="state.start_year"
      required
      class="w-full"
      name="start_precision"
      :label="$t('date.precision')"
    >
      <USelect v-model="state.start_precision" class="w-full" :items="fields.datePrecision.items" />
    </LazyUFormField>
    <UFormField
      class="w-full"
      name="end_year"
      :label="$t('event.end-year')"
      :description="$t('date.negative-description')"
    >
      <UInputNumber
        v-model="state.end_year"
        :max="2025"
        :min="-4026"
        class="w-full"
        inputmode="tel"
        :decrement="false"
        :increment="false"
      />
    </UFormField>
    <LazyUFormField
      v-if="state.end_year"
      required
      class="w-full"
      name="end_precision"
      :label="$t('date.precision')"
    >
      <USelect v-model="state.end_precision" class="w-full" :items="fields.datePrecision.items" />
    </LazyUFormField>
    <div class="flex justify-end gap-2">
      <LazyUButton
        v-if="cancelable"
        type="reset"
        color="neutral"
        variant="subtle"
        :label="$t('general.cancel')"
        v-bind="cancel"
        @click="emit('cancel')"
      />
      <UButton
        loading-auto
        type="submit"
        color="primary"
        variant="solid"
        :label="$t('general.create')"
        v-bind="submit"
      />
    </div>
  </UForm>
</template>
<script setup lang="ts">
import type { ButtonProps, FormSubmitEvent } from '@nuxt/ui'

import { z } from 'zod'

const props = defineProps<{
  cancel?: ButtonProps
  cancelable?: boolean
  disabled?: boolean
  event?: Partial<Schema>
  noCover?: boolean
  onSubmit: (event: FormSubmitEvent<Schema>) => Promise<void>
  submit?: ButtonProps
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
}>()

const { t } = useI18n()
const { fields, rules } = useForm()

const schema = z
  .object({
    aliases: z.array(z.string()).optional(),
    cover_url: rules.url(t('event.cover-url')).nullable().optional(),
    end_precision: rules.datePrecision(t('date.precision')).optional(),
    end_year: rules.year(t('event.end-year')).nullable().optional(),
    slug: rules.slug,
    start_precision: rules.datePrecision(t('date.precision')).optional(),
    start_year: rules.year(t('event.start-year')).nullable().optional(),
    title: rules.name
  })
  .refine(
    (data) => {
      if (!data.start_year || !data.end_year) return true
      return data.end_year >= data.start_year
    },
    {
      error: t('validation.after-or-equal-to', {
        date: t('event.start-year'),
        field: t('event.end-year')
      }),
      path: ['end_year']
    }
  )
  .refine((data) => !data.start_year || !!data.start_precision, {
    error: t('validation.required', { field: t('date.precision') }),
    path: ['start_precision']
  })
  .refine((data) => !data.end_year || !!data.end_precision, {
    error: t('validation.required', { field: t('date.precision') }),
    path: ['end_precision']
  })

export type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  ...(props.event ?? {})
})

function normalizeSlug(e: Event) {
  const input = e.target as HTMLInputElement
  input.value = slugify(input.value, false)
  state.slug = input.value
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="$t('event.new')"
    description="Add a new event to the database"
  >
    <UButton icon="i-lucide:plus" :label="$t('event.new')" />

    <template #body>
      <UForm :state="state" :schema="schema" class="space-y-4" @submit="onSubmit">
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
            @change="state.slug = slugify(state.title)"
          />
        </UFormField>
        <UFormField name="cover_url" :label="$t('event.cover-url')">
          <UInput
            v-model="state.cover_url"
            type="url"
            class="w-full"
            placeholder="https://example.com/cover.jpg"
            :cover="state.cover_url ? { src: state.cover_url, alt: '' } : undefined"
          >
            <template v-if="state.cover_url?.length" #trailing>
              <UButton
                size="sm"
                variant="link"
                color="neutral"
                icon="i-lucide:circle-x"
                :aria-label="$t('general.clear')"
                @click="state.cover_url = undefined"
              />
            </template>
          </UInput>
        </UFormField>
        <UFormField
          required
          name="slug"
          :label="$t('general.slug')"
          description="The unique identifier for this event in the URL."
        >
          <UInput v-model="state.slug" class="w-full" @input="normalizeSlug" />
        </UFormField>
        <fieldset class="flex justify-between">
          <UFormField
            name="start_year"
            :label="$t('event.start-year')"
            :class="state.start_year ? 'w-50' : 'w-full'"
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
            class="w-50"
            name="start_precision"
            :label="$t('date.precision')"
          >
            <USelect
              v-model="state.start_precision"
              class="w-full"
              :items="fields.datePrecision.items"
            />
          </UFormField>
        </fieldset>
        <fieldset class="flex justify-between">
          <UFormField
            name="end_year"
            :label="$t('event.end-year')"
            :class="state.end_year ? 'w-50' : 'w-full'"
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
          <UFormField
            v-if="state.end_year"
            required
            class="w-50"
            name="end_precision"
            :label="$t('date.precision')"
          >
            <USelect
              v-model="state.end_precision"
              class="w-full"
              :items="fields.datePrecision.items"
            />
          </UFormField>
        </fieldset>
        <div class="flex justify-end gap-2">
          <UButton
            type="reset"
            color="neutral"
            variant="subtle"
            :label="$t('general.cancel')"
            @click="open = false"
          />
          <UButton
            loading-auto
            type="submit"
            color="primary"
            variant="solid"
            :label="$t('general.create')"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'

import { z } from 'zod'

const open = ref(false)

const { t } = useI18n()
const { fields, rules } = useForm()

const schema = z
  .object({
    cover_url: rules.url(t('event.cover-url')).optional(),
    end_precision: rules.datePrecision(t('date.precision')).optional(),
    end_year: rules.year(t('event.end-year')).optional(),
    slug: rules.slug,
    start_precision: rules.datePrecision(t('date.precision')).optional(),
    start_year: rules.year(t('event.start-year')).optional(),
    title: rules.name
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

const state = reactive<Partial<Schema>>({})

const resetState = () => {
  state.title = undefined
  state.cover_url = undefined
  state.slug = undefined
  state.start_year = undefined
  state.start_precision = undefined
  state.end_year = undefined
  state.end_precision = undefined
}

const normalizeSlug = (e: Event) => {
  const input = e.target as HTMLInputElement
  input.value = slugify(input.value, false)
  state.slug = input.value
}

const supabase = useSupabaseClient()

const { showError, showSuccess } = useFlash()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  const { error } = await supabase.from('events').insert(event.data)

  if (error) {
    showError({
      description: t('feedback.could-not-save', { item: event.data.title })
    })
  } else {
    showSuccess({
      description: t('feedback.saved-successfully', { item: event.data.title })
    })
    open.value = false
    resetState()
    refreshNuxtData('events')
  }
}
</script>

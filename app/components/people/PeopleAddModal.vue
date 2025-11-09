<template>
  <UModal
    v-model:open="open"
    :title="$t('person.new')"
    description="Add a new person to the database"
  >
    <UButton icon="i-lucide:plus" :label="$t('person.new')" />

    <template #body>
      <UForm :state="state" :schema="schema" class="space-y-4" @submit="onSubmit">
        <UFormField
          required
          name="name"
          :label="fields.name.label"
          :placeholder="fields.name.placeholder"
          :description="$t('validation.provide-in-language', { language: $t('i18n.english') })"
        >
          <UInput v-model="state.name" class="w-full" @change="state.slug = slugify(state.name)" />
        </UFormField>
        <UFormField name="avatar_url" :label="$t('person.avatar-url')">
          <UInput
            v-model="state.avatar_url"
            type="url"
            class="w-full"
            placeholder="https://example.com/avatar.jpg"
            :avatar="state.avatar_url ? { src: state.avatar_url, alt: '' } : undefined"
          >
            <template v-if="state.avatar_url?.length" #trailing>
              <UButton
                size="sm"
                variant="link"
                color="neutral"
                icon="i-lucide:circle-x"
                :aria-label="$t('general.clear')"
                @click="state.avatar_url = undefined"
              />
            </template>
          </UInput>
        </UFormField>
        <UFormField
          required
          name="slug"
          :label="$t('general.slug')"
          description="The unique identifier for this person in the URL."
        >
          <UInput v-model="state.slug" class="w-full" @input="normalizeSlug" />
        </UFormField>
        <UFormField required name="gender" :label="fields.gender.label">
          <USelect v-model="state.gender" class="w-full" :items="fields.gender.items" />
        </UFormField>
        <fieldset class="flex justify-between">
          <UFormField
            name="birth_year"
            :label="$t('person.birth-year')"
            :class="state.birth_year ? 'w-50' : 'w-full'"
            :description="state.birth_year ? undefined : 'A negative number means before Christ'"
          >
            <UInputNumber
              v-model="state.birth_year"
              :max="2025"
              :min="-4026"
              class="w-full"
              :decrement="false"
              :increment="false"
            />
          </UFormField>
          <UFormField
            v-if="state.birth_year"
            required
            class="w-50"
            name="birth_precision"
            :label="$t('date.precision')"
          >
            <USelect
              v-model="state.birth_precision"
              class="w-full"
              :items="fields.datePrecision.items"
            />
          </UFormField>
        </fieldset>
        <fieldset class="flex justify-between">
          <UFormField
            name="death_year"
            :label="$t('person.death-year')"
            :class="state.death_year ? 'w-50' : 'w-full'"
            :description="state.death_year ? undefined : 'A negative number means before Christ'"
          >
            <UInputNumber
              v-model="state.death_year"
              :max="2025"
              :min="-4026"
              class="w-full"
              :decrement="false"
              :increment="false"
            />
          </UFormField>
          <UFormField
            v-if="state.death_year"
            required
            class="w-50"
            name="death_precision"
            :label="$t('date.precision')"
          >
            <USelect
              v-model="state.death_precision"
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
    avatar_url: rules.url(t('person.avatar-url')).optional(),
    birth_precision: rules.datePrecision(t('date.precision')).optional(),
    birth_year: rules.year(t('person.birth-year')).optional(),
    death_precision: rules.datePrecision(t('date.precision')).optional(),
    death_year: rules.year(t('person.death-year')).optional(),
    gender: rules.gender,
    name: rules.name,
    slug: rules.slug
  })
  .refine(
    (data) => {
      if (!data.birth_year || !data.death_year) return true
      return data.death_year >= data.birth_year
    },
    {
      message: t('validation.after-or-equal-to', {
        date: t('person.birth-year'),
        field: t('person.death-year')
      }),
      path: ['death_year']
    }
  )
  .refine((data) => !data.birth_year || !!data.birth_precision, {
    message: t('validation.required', { field: t('date.precision') }),
    path: ['birth_precision']
  })
  .refine((data) => !data.death_year || !!data.death_precision, {
    message: t('validation.required', { field: t('date.precision') }),
    path: ['death_precision']
  })

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  gender: 'unknown'
})

const resetState = () => {
  state.name = undefined
  state.avatar_url = undefined
  state.slug = undefined
  state.gender = 'unknown'
  state.birth_year = undefined
  state.birth_precision = undefined
  state.death_year = undefined
  state.death_precision = undefined
}

const normalizeSlug = (e: Event) => {
  const input = e.target as HTMLInputElement
  input.value = slugify(input.value, false)
  state.slug = input.value
}

const supabase = useSupabaseClient()

const { showError, showSuccess } = useFlash()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  const { error } = await supabase.from('people').insert(event.data)

  if (error) {
    showError({
      description: t('feedback.could-not-save', { item: event.data.name })
    })
  } else {
    showSuccess({
      description: t('feedback.saved-successfully', { item: event.data.name })
    })
    open.value = false
    resetState()
    refreshNuxtData('people')
  }
}
</script>

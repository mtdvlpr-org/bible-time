<template>
  <UForm :state="state" :schema="schema" class="space-y-4" :disabled="disabled" @submit="onSubmit">
    <UFormField
      required
      name="name"
      :label="fields.name.label"
      :placeholder="fields.name.placeholder"
      :description="$t('validation.provide-in-language', { language: $t('i18n.english') })"
    >
      <UInput
        v-model="state.name"
        autocapitalize="words"
        class="w-full"
        :disabled="disabled || !!person"
        :autofocus="!person && !disabled"
        @change="state.slug = slugify(state.name)"
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
        :disabled="disabled || !!person"
        @input="normalizeSlug"
      />
    </UFormField>
    <UFormField
      :label="$t('general.aliases')"
      :description="$t('validation.provide-in-language', { language: $t('i18n.english') })"
    >
      <UInputTags v-model="state.aliases" class="w-full" />
    </UFormField>
    <LazyUFormField v-if="!noAvatar" name="avatar_url" :label="$t('person.avatar-url')">
      <UInput
        v-model="state.avatar_url"
        type="url"
        class="w-full"
        placeholder="https://example.com/avatar.jpg"
        :avatar="state.avatar_url ? { src: state.avatar_url, alt: '' } : undefined"
      >
        <template v-if="state.avatar_url?.length" #trailing>
          <LazyUButton
            size="sm"
            variant="link"
            color="neutral"
            icon="i-lucide:circle-x"
            :aria-label="$t('general.clear')"
            @click="state.avatar_url = undefined"
          />
        </template>
      </UInput>
    </LazyUFormField>
    <UFormField required name="gender" :label="fields.gender.label">
      <USelect v-model="state.gender" class="w-full" :items="fields.gender.items" />
    </UFormField>
    <UFormField
      class="w-full"
      name="birth_year"
      :label="$t('person.birth-year')"
      :description="$t('date.negative-description')"
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
    <LazyUFormField
      v-if="state.birth_year"
      required
      class="w-full"
      name="birth_precision"
      :label="$t('date.precision')"
    >
      <USelect v-model="state.birth_precision" class="w-full" :items="fields.datePrecision.items" />
    </LazyUFormField>
    <UFormField
      class="w-full"
      name="death_year"
      :label="$t('person.death-year')"
      :description="$t('date.negative-description')"
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
    <LazyUFormField
      v-if="state.death_year"
      required
      class="w-full"
      name="death_precision"
      :label="$t('date.precision')"
    >
      <USelect v-model="state.death_precision" class="w-full" :items="fields.datePrecision.items" />
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
  noAvatar?: boolean
  onSubmit: (event: FormSubmitEvent<Schema>) => Promise<void>
  person?: Partial<Schema>
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
    avatar_url: rules.url(t('person.avatar-url')).nullable().optional(),
    birth_precision: rules.datePrecision(t('date.precision')).optional(),
    birth_year: rules.year(t('person.birth-year')).nullable().optional(),
    death_precision: rules.datePrecision(t('date.precision')).optional(),
    death_year: rules.year(t('person.death-year')).nullable().optional(),
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
      error: t('validation.after-or-equal-to', {
        date: t('person.birth-year'),
        field: t('person.death-year')
      }),
      path: ['death_year']
    }
  )
  .refine((data) => !data.birth_year || !!data.birth_precision, {
    error: t('validation.required', { field: t('date.precision') }),
    path: ['birth_precision']
  })
  .refine((data) => !data.death_year || !!data.death_precision, {
    error: t('validation.required', { field: t('date.precision') }),
    path: ['death_precision']
  })

export type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  gender: 'unknown',
  ...(props.person ?? {})
})

function normalizeSlug(e: Event) {
  const input = e.target as HTMLInputElement
  input.value = slugify(input.value, false)
  state.slug = input.value
}
</script>

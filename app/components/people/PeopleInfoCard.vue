<template>
  <UCard v-if="person">
    <div class="flex items-center gap-4">
      <AvatarModal v-model="newAvatar" :edit="edit" type="person" :current="person.avatar_url" />
      <div>
        <h2 class="text-lg font-semibold">{{ translate(person.name) }}</h2>
        <div v-if="!edit" class="text-sm text-zinc-500">
          {{ aliases.length ? aliases.join(', ') : '' }}
        </div>
      </div>
    </div>
    <UForm v-if="edit" :state="state" :schema="schema" class="mt-4 space-y-4" @submit="onSubmit">
      <UFormField
        :label="$t('general.aliases')"
        :description="$t('validation.provide-in-language', { language: $t('i18n.english') })"
      >
        <UInputTags v-model="state.aliases" class="w-full" />
      </UFormField>
      <UFormField
        name="birth_year"
        :label="$t('person.birth-year')"
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
        name="birth_precision"
        :label="$t('date.precision')"
      >
        <USelect
          v-model="state.birth_precision"
          class="w-full"
          :items="fields.datePrecision.items"
        />
      </UFormField>
      <UFormField
        name="death_year"
        :label="$t('person.death-year')"
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
        name="death_precision"
        :label="$t('date.precision')"
      >
        <USelect
          v-model="state.death_precision"
          class="w-full"
          :items="fields.datePrecision.items"
        />
      </UFormField>
      <UFormField required name="gender" :label="fields.gender.label">
        <USelect v-model="state.gender" class="w-full" :items="fields.gender.items" />
      </UFormField>
      <div class="flex justify-end">
        <UButton loading-auto type="submit" icon="i-lucide:save" :label="$t('general.save')" />
      </div>
    </UForm>
    <div v-else class="mt-4 space-y-2">
      <div>
        <div class="text-xs text-zinc-500">{{ $t('people.born') }}</div>
        <div class="font-medium">
          {{ formatYear(person.birth_year, person.birth_precision) }}
        </div>
      </div>

      <div>
        <div class="text-xs text-zinc-500">{{ $t('people.died') }}</div>
        <div class="font-medium">
          {{ formatYear(person.death_year, person.death_precision) }}
        </div>
      </div>

      <div>
        <div class="text-xs text-zinc-500">{{ $t('person.gender') }}</div>
        <div class="font-medium">
          {{ gender }}
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

const { data: person } = useNuxtData<Tables<'people'>>(`person-${props.slug}`)

const { t } = useI18n()
const { translate } = useTranslations()
const { formatYear } = useDate()

const gender = computed(() => {
  switch (person.value?.gender) {
    case 'female':
      return t('person.female')
    case 'male':
      return t('person.male')
    default:
      return t('general.unknown')
  }
})

const aliases = computed(() => {
  return person.value?.aliases.map((alias) => translate(alias)) ?? []
})

const { fields, rules } = useForm()

const newAvatar = ref(person.value?.avatar_url ?? null)

const schema = z
  .object({
    aliases: z.array(z.string()).optional(),
    birth_precision: rules.datePrecision(t('date.precision')).optional(),
    birth_year: rules.year(t('person.birth-year')).optional(),
    death_precision: rules.datePrecision(t('date.precision')).optional(),
    death_year: rules.year(t('person.death-year')).optional(),
    gender: rules.gender
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
  aliases: person.value?.aliases ?? [],
  birth_precision: person.value?.birth_precision ?? undefined,
  birth_year: person.value?.birth_year ?? undefined,
  death_precision: person.value?.death_precision ?? undefined,
  death_year: person.value?.death_year ?? undefined,
  gender: person.value?.gender
})

const { showError, showSuccess } = useFlash()
const supabase = useSupabaseClient()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  if (!person.value) return

  // Store previous and new data
  const previousData = { ...person.value }
  const newData = {
    ...person.value,
    aliases: event.data.aliases ?? [],
    avatar_url: newAvatar.value,
    birth_precision: event.data.birth_precision ?? null,
    birth_year: event.data.birth_year ?? null,
    death_precision: event.data.death_precision ?? null,
    death_year: event.data.death_year ?? null,
    gender: event.data.gender
  }

  // Optimistic update
  person.value = newData

  // Send update to Supabase
  const { error } = await supabase.from('people').update(event.data).eq('slug', props.slug)

  if (error) {
    // Revert optimistic update
    person.value = previousData
    showError({ description: error.message })
  } else {
    // TODO: i18n
    showSuccess({ description: 'Person updated successfully.' })
  }
}
</script>

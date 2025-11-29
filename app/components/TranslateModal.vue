<template>
  <UModal
    v-model:open="open"
    :title="type === 'person' ? $t('person.translate') : $t('event.translate')"
    :description="$t('validation.provide-in-language', { language: localeProperties.name })"
  >
    <UButton
      icon="i-lucide:globe"
      :label="type === 'person' ? $t('person.translate') : $t('event.translate')"
    />

    <template #body>
      <UForm :state="state" :schema="schema" class="space-y-4" @submit="onSubmit">
        <UFormField
          required
          name="name"
          :description="name"
          :placeholder="fields.name.placeholder"
          :label="type === 'person' ? $t('person.name') : $t('event.title')"
        >
          <UInput v-model="state.name" autofocus class="w-full" autocapitalize="words" />
        </UFormField>
        <UFormField
          v-for="alias in aliases"
          :key="alias"
          :description="alias"
          :name="`aliases.${alias}`"
          :label="$t('general.alias')"
        >
          <UInput v-model="state.aliases[alias]" class="w-full" autocapitalize="on" />
        </UFormField>
        <UFormField v-if="description?.en" name="description" :label="$t('general.description')">
          <UTextarea
            disabled
            autoresize
            :maxrows="10"
            class="w-full mb-4"
            :model-value="description?.en"
          />
          <UTextarea v-model="state.description" autoresize :maxrows="10" class="w-full" />
        </UFormField>
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
            :label="$t('general.translate')"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'

import { z } from 'zod'

const props = defineProps<{
  aliases: string[]
  description: Description | null
  name: string
  slug: string
  type: 'event' | 'person'
}>()

const open = ref(false)

const { fields, rules } = useForm()
const { translate } = useTranslations()

const schema = z.object({
  aliases: z.record(z.string(), z.string()),
  description: z.string().optional(),
  name: rules.name
})

type Schema = z.output<typeof schema>

const translation = computed(() => translate(props.name, false))
const translatedAliases = computed(() =>
  props.aliases.reduce<Record<string, string>>((acc, alias) => {
    acc[alias] = translate(alias, false)
    return acc
  }, {})
)

const { locale, localeProperties, t } = useI18n()

const state = reactive<Schema>({
  aliases: translatedAliases.value,
  description: props.description?.[locale.value],
  name: translation.value
})

const i18nStore = useI18nStore()
const supabase = useSupabaseClient()
const { showError, showSuccess } = useFlash()

const { data: item } = useNuxtData<Tables<'events'> | Tables<'people'>>(
  `${props.type}-${props.slug}`
)

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    const promise = $fetch(
      `/api/${props.type === 'person' ? 'people' : 'events'}/${props.slug}/translate`,
      {
        body: { description: event.data.description, locale: locale.value },
        method: 'POST'
      }
    )

    const { error } = await supabase
      .from('translations')
      .upsert([
        ...(event.data.name !== translation.value
          ? [{ key: props.name, lang: locale.value, value: event.data.name }]
          : []),
        ...props.aliases
          .filter((alias) => !!event.data.aliases[alias])
          .map((alias) => ({ key: alias, lang: locale.value, value: event.data.aliases[alias]! }))
      ])

    if (error) {
      showError({
        description: t('feedback.could-not-save', { item: t('general.translation') })
      })
    } else {
      await promise
      showSuccess({
        description: t('feedback.saved-successfully', { item: t('general.translation') })
      })
      open.value = false
      if (item.value) {
        item.value = {
          ...item.value,
          description: { ...item.value.description, [locale.value]: event.data.description }
        }
      }
      i18nStore.addTranslation(locale.value, props.name, event.data.name)
      props.aliases.forEach((alias) => {
        if (event.data.aliases[alias]) {
          i18nStore.addTranslation(locale.value, alias, event.data.aliases[alias]!)
        }
      })
    }
  } catch {
    showError({
      description: t('feedback.could-not-save', { item: t('general.translation') })
    })
  }
}
</script>

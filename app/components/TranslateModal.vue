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
          <UInput v-model="state.name" class="w-full" />
        </UFormField>
        <UFormField
          v-for="alias in aliases"
          :key="alias"
          :description="alias"
          :name="`aliases.${alias}`"
          :label="$t('general.alias')"
        >
          <UInput v-model="state.aliases[alias]" class="w-full" />
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
            :disabled="
              state.name === translation &&
              Object.entries(state.aliases).every(
                ([alias, value]) => value === translatedAliases[alias]
              )
            "
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
  name: string
  type: 'event' | 'person'
}>()

const open = ref(false)

const { fields, rules } = useForm()
const { translate } = useTranslations()

const schema = z.object({
  aliases: z.record(z.string(), z.string()),
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

const state = reactive<Schema>({
  aliases: translatedAliases.value,
  name: translation.value
})

const { locale, localeProperties, t } = useI18n()
const i18nStore = useI18nStore()
const supabase = useSupabaseClient()

const { showError, showSuccess } = useFlash()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  const { error } = await supabase
    .from('translations')
    .upsert([
      ...(event.data.name === translation.value
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
    showSuccess({
      description: t('feedback.saved-successfully', { item: t('general.translation') })
    })
    open.value = false
    i18nStore.addTranslation(locale.value, props.name, event.data.name)
    props.aliases.forEach((alias) => {
      if (event.data.aliases[alias]) {
        i18nStore.addTranslation(locale.value, alias, event.data.aliases[alias]!)
      }
    })
  }
}
</script>

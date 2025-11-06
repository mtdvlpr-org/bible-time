<template>
  <UCard class="p-6">
    <UForm v-if="edit" @submit="onSubmit">
      <UFormField
        :label="$t('general.description')"
        :description="$t('validation.provide-in-language', { language: localeProperties.name })"
      >
        <UTextarea v-model="newDescription" autoresize :maxrows="10" class="w-full" />
      </UFormField>
      <div class="mt-4 flex justify-end">
        <UButton
          loading-auto
          type="submit"
          icon="i-lucide:save"
          :label="$t('general.save')"
          :disabled="localeDescription === newDescription"
        />
      </div>
    </UForm>
    <p v-else-if="localeDescription" class="whitespace-pre-line">
      {{ localeDescription }}
    </p>
    <div v-else class="text-sm text-zinc-500">{{ $t('general.no-description') }}</div>
  </UCard>
</template>
<script setup lang="ts">
const props = defineProps<{
  edit?: boolean
  slug: string
}>()

const { data: person } = useNuxtData<Tables<'people'>>(`person-${props.slug}`)
const { locale, localeProperties } = useI18n()

const localeDescription = computed(() => {
  return person.value?.description?.[locale.value] ?? null
})

const newDescription = ref(localeDescription.value)

const { showError, showSuccess } = useFlash()
const supabase = useSupabaseClient()

const onSubmit = async () => {
  if (!person.value) return

  // Set old and new description
  const previousDescription = person.value.description
  const description = {
    ...(person.value.description ?? {}),
    [locale.value]: newDescription.value ?? ''
  }

  // Update description optimistically
  person.value = { ...person.value, description }

  // Send update to Supabase
  const { error } = await supabase.from('people').update({ description }).eq('slug', props.slug)

  if (error) {
    showError({ description: error.message })

    // Revert description on error
    person.value.description = previousDescription
  } else {
    // TODO: i18n
    showSuccess({ description: 'Description updated successfully.' })
  }
}
</script>

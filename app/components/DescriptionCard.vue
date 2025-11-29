<template>
  <UCard class="p-6">
    <LazyUForm v-if="edit" @submit="onSubmit">
      <UFormField
        :label="$t('general.description')"
        :description="$t('validation.provide-in-language', { language: $t('i18n.english') })"
      >
        <UTextarea v-model="newDescription" autoresize :maxrows="10" class="w-full" />
      </UFormField>
      <div class="mt-4 flex justify-end">
        <UButton
          loading-auto
          type="submit"
          icon="i-lucide:save"
          :label="$t('general.save')"
          :disabled="item?.description?.en === newDescription"
        />
      </div>
    </LazyUForm>
    <template v-else-if="localeDescription || item?.description?.en">
      <p v-if="!localeDescription" class="text-sm text-zinc-500 mb-2">{{ $t('i18n.english') }}</p>
      <p class="whitespace-pre-line">
        {{ localeDescription || item?.description?.en }}
      </p>
    </template>
    <div v-else class="text-sm text-zinc-500">{{ $t('general.no-description') }}</div>
  </UCard>
</template>
<script setup lang="ts">
const props = defineProps<{
  edit?: boolean
  slug: string
  type: 'event' | 'person'
}>()

const { data: item } = useNuxtData<Tables<'events'> | Tables<'people'>>(
  `${props.type}-${props.slug}`
)
const { locale, t } = useI18n()

const localeDescription = computed(() => {
  return item.value?.description?.[locale.value] ?? null
})

const newDescription = ref(item.value?.description?.en)

const { showError, showSuccess } = useFlash()
const supabase = useSupabaseClient()

async function onSubmit() {
  if (!item.value) return

  // Set old and new description
  const previousDescription = item.value.description
  const description = {
    ...(item.value.description ?? {}),
    en: newDescription.value ?? ''
  }

  // Update description optimistically
  item.value = { ...item.value, description }

  // Send update to Supabase
  const { error } = await supabase
    .from(props.type === 'person' ? 'people' : 'events')
    .update({ description })
    .eq('slug', props.slug)

  if (error) {
    showError({ description: error.message })

    // Revert description on error
    item.value.description = previousDescription
  } else {
    showSuccess({
      description: t('feedback.saved-successfully', { item: t('general.description') })
    })
  }
}
</script>

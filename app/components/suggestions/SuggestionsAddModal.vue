<template>
  <UModal
    v-model:open="open"
    :title="$t('suggestion.new')"
    description="Add a new suggestion to the database"
  >
    <UButton v-if="!review" icon="i-lucide:plus" :label="$t('suggestion.new')" />

    <template #body>
      <LazyPeopleForm
        v-if="open && (type === 'person.create' || type === 'person.update')"
        cancelable
        :person="person"
        :disabled="review"
        :submit="review ? { label: $t('suggestion.approve'), icon: 'i-lucide:check' } : undefined"
        :cancel="
          review
            ? { label: $t('suggestion.reject'), icon: 'i-lucide:x', color: 'error' }
            : undefined
        "
        @cancel="onCancel"
        @submit="onPeopleSubmit"
      />
      <LazyEventsForm
        v-else-if="open && (type === 'event.create' || type === 'event.update')"
        cancelable
        :event="event"
        :disabled="review"
        :submit="review ? { label: $t('suggestion.approve'), icon: 'i-lucide:check' } : undefined"
        :cancel="
          review
            ? { label: $t('suggestion.reject'), icon: 'i-lucide:x', color: 'error' }
            : undefined
        "
        @cancel="onCancel"
        @submit="onEventsSubmit"
      />
    </template>
  </UModal>
</template>
<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'

import type { Schema as EventsSchema } from './../events/EventsForm.vue'
import type { Schema as PeopleSchema } from './../people/PeopleForm.vue'

const props = defineProps<{
  event?: Partial<EventsSchema>
  person?: Partial<PeopleSchema>
  review?: boolean
  target?: null | string
  type: Enums<'suggestion_type'>
}>()

const open = defineModel<boolean>('open', { default: false })

const { t } = useI18n()

const router = useRouter()
const userStore = useUserStore()
const localePath = useLocalePath()
const supabase = useSupabaseClient()

const { showError, showSuccess } = useFlash()

const onSuccess = () => {
  open.value = false
  router.push(localePath('/suggestions'))
}

const onCancel = async () => {
  if (props.review && props.target) {
    const { error } = await supabase
      .from('suggestions')
      .update({ reviewed_by: userStore.user?.id, status: 'rejected' })
      .eq('id', parseInt(props.target))

    if (error) {
      showError({
        description: t('feedback.could-not-save', { item: $t('suggestion.noun') })
      })
      return
    } else {
      showSuccess({
        description: t('feedback.saved-successfully', {
          item: $t('suggestion.noun')
        })
      })
      refreshNuxtData('suggestions')
    }
  }

  open.value = false
}

const onApproved = async () => {
  try {
    await $fetch(`/api/suggestions/${props.target}/approve`, { method: 'POST' })
    showSuccess({
      description: t('feedback.saved-successfully', { item: $t('suggestion.noun') })
    })
    open.value = false
    refreshNuxtData('suggestions')
  } catch {
    showError({
      description: t('feedback.could-not-save', { item: $t('suggestion.noun') })
    })
  }
}

async function onEventsSubmit(event: FormSubmitEvent<EventsSchema>) {
  if (props.review) {
    await onApproved()
    return
  }

  const { error } = await supabase
    .from('suggestions')
    .insert({ payload: event.data, target_slug: props.target, type: props.type })

  if (error) {
    showError({
      description: t('feedback.could-not-save', { item: $t('suggestion.noun') })
    })
  } else {
    showSuccess({
      description: t('feedback.saved-successfully', { item: $t('suggestion.noun') })
    })
    onSuccess()
  }
}

async function onPeopleSubmit(event: FormSubmitEvent<PeopleSchema>) {
  if (props.review) {
    await onApproved()
    return
  }

  const { error } = await supabase
    .from('suggestions')
    .insert({ payload: event.data, target_slug: props.target, type: props.type })

  if (error) {
    showError({
      description: t('feedback.could-not-save', { item: $t('suggestion.noun') })
    })
  } else {
    showSuccess({
      description: t('feedback.saved-successfully', { item: $t('suggestion.noun') })
    })
    onSuccess()
  }
}
</script>

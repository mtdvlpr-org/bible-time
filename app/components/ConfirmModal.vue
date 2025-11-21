<template>
  <UModal
    v-model:open="open"
    :ui="{ footer: 'justify-end' }"
    :title="title ?? $t('feedback.confirm-action')"
    :description="description ?? $t('feedback.are-you-sure')"
  >
    <template #body>
      <slot>
        <p v-if="message">{{ message }}</p>
      </slot>
    </template>
    <template #footer>
      <UButton
        v-bind="cancel"
        color="neutral"
        variant="outline"
        :label="$t('general.cancel')"
        @click="onCancel"
      />
      <UButton color="neutral" :label="$t('general.confirm')" v-bind="confirm" @click="onConfirm" />
    </template>
  </UModal>
</template>
<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'

defineProps<{
  cancel?: ButtonProps
  confirm?: ButtonProps
  description?: string
  message?: string
  title?: string
}>()

const emit = defineEmits<{
  (e: 'cancel' | 'confirm'): void
}>()

const open = defineModel<boolean>({ required: true })

function onCancel() {
  emit('cancel')
  open.value = false
}

function onConfirm() {
  emit('confirm')
  open.value = false
}
</script>

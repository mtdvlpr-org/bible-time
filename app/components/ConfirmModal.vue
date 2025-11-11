<template>
  <UModal
    v-model:open="open"
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
      <UButton
        loading-auto
        color="neutral"
        :label="$t('general.confirm')"
        v-bind="confirm"
        @click="onConfirm"
      />
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
  onCancel?: () => void
  onConfirm?: () => void
  title?: string
}>()

const open = defineModel<boolean>({ required: true })
</script>

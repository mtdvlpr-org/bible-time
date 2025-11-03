<template>
  <UModal
    v-model:open="open"
    description="Are you sure, this action cannot be undone."
    :title="`Delete ${count} customer${count > 1 ? 's' : ''}`"
  >
    <slot />

    <template #body>
      <div class="flex justify-end gap-2">
        <UButton label="Cancel" color="neutral" variant="subtle" @click="open = false" />
        <UButton loading-auto color="error" label="Delete" variant="solid" @click="onSubmit" />
      </div>
    </template>
  </UModal>
</template>
<script setup lang="ts">
withDefaults(
  defineProps<{
    count?: number
  }>(),
  {
    count: 0
  }
)

const open = ref(false)

async function onSubmit() {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  open.value = false
}
</script>

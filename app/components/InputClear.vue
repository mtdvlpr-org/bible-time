<template>
  <UInput v-model="model">
    <template v-if="model?.length" #trailing>
      <LazyUButton
        size="sm"
        variant="link"
        color="neutral"
        icon="i-lucide:circle-x"
        :aria-label="$t('general.clear')"
        @click="model = undefined"
      />
    </template>
  </UInput>
</template>
<script setup lang="ts">
const model = defineModel<null | string | undefined>()
</script>

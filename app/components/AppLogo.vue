<template>
  <UButton
    block
    color="neutral"
    variant="ghost"
    :label="appName"
    :square="collapsed"
    :to="$localePath('/')"
    :class="[!collapsed && 'py-2']"
    :avatar="{ src: '', alt: appName }"
  />
</template>
<script setup lang="ts">
defineProps<{ collapsed?: boolean }>()

const { appName } = useRuntimeConfig().public
</script>

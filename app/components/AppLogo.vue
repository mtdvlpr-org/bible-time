<template>
  <UButton
    block
    color="neutral"
    variant="ghost"
    :label="siteName"
    :square="collapsed"
    :to="$localePath('/')"
    :class="[!collapsed && 'py-2']"
    :avatar="{ src: '', alt: siteName }"
  />
</template>
<script setup lang="ts">
defineProps<{ collapsed?: boolean }>()

const { siteName } = useRuntimeConfig().public
</script>

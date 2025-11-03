<template>
  <UButton
    block
    color="neutral"
    variant="ghost"
    :square="collapsed"
    icon="i-lucide:user"
    :label="$t('auth.login')"
    :class="[!collapsed && 'py-2']"
    :to="$localePath('/auth/login')"
    :avatar="{ src: '', alt: $t('auth.login') }"
  />
</template>
<script setup lang="ts">
defineProps<{ collapsed?: boolean }>()
</script>

<!-- eslint-disable vue/no-v-html -->
<template>
  <UModal title="Changelog" :description="`${$t('general.see-whats-new')} (v${version})`">
    <UButton variant="ghost" :label="`${$t('general.see-whats-new')} (v${version})`" />
    <template #body>
      <div class="changelog" v-html="html"></div>
    </template>
  </UModal>
</template>
<script setup lang="ts">
import { html } from '~~/CHANGELOG.md'

const { version } = useRuntimeConfig().public
</script>
<style lang="scss">
.changelog {
  h1,
  h2,
  h3 {
    display: block;
    font-weight: bold;
  }

  h1 {
    font-size: 2em;
    margin: 0.67em 0;
  }

  h2 {
    font-size: 1.5em;
    margin: 0.83em 0;
  }

  h3 {
    font-size: 1.17em;
    margin: 1em 0;
  }

  p {
    display: block;
    margin: 1em 0;
  }

  ul {
    display: block;
    list-style-type: disc;
    margin: 1em 0;
    padding-left: 40px;
  }

  li {
    display: list-item;
  }
}
</style>

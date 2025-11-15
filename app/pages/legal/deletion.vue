<template>
  <div class="content">
    <h2>Data Deletion Instructions</h2>
    <p>Last updated: 14 November 2025</p>
    <p>Users can delete their account directly in the BibleTime app. Upon deletion:</p>
    <ul>
      <li>Profile data (email, display name, avatar) is permanently deleted</li>
      <li>Contributions remain but author information is removed (anonymized)</li>
      <li>Timestamps of contributions are preserved</li>
    </ul>
    <p>
      If you cannot access your account, contact
      <a href="https://github.com/mtdvlpr/bible-time">mtdvlpr</a>.
    </p>
  </div>
</template>
<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({ title: t('legal.deletion') })
</script>

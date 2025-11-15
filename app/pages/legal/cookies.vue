<template>
  <div class="content">
    <h2>Cookie Notice</h2>
    <p>Last updated: 14 November 2025</p>
    <p>BibleTime uses only essential, first-party cookies. No analytics or advertising cookies.</p>
    <h3>Cookies Used</h3>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Purpose</th>
          <th>Type</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>sb-*-auth-token</td>
          <td>Authentication session token (Supabase)</td>
          <td>Essential</td>
        </tr>
        <tr>
          <td>i18n_locale</td>
          <td>App language</td>
          <td>Essential</td>
        </tr>
        <tr>
          <td>dashboard-sidebar-default</td>
          <td>Sidebar state</td>
          <td>Essential</td>
        </tr>
        <tr>
          <td>i18n</td>
          <td>Cache translations</td>
          <td>Essential</td>
        </tr>
        <tr>
          <td>user</td>
          <td>Cached user profile</td>
          <td>Essential</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({ title: t('legal.cookies') })
</script>

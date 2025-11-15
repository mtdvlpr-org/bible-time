<template>
  <div class="content">
    <h2>Data Retention Policy</h2>
    <p>Last updated: 14 November 2025</p>
    <table>
      <thead>
        <tr>
          <th>Data</th>
          <th>Retention</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Account data</td>
          <td>Until deletion</td>
        </tr>
        <tr>
          <td>Avatar images</td>
          <td>Until deletion</td>
        </tr>
        <tr>
          <td>Knowledge base contributions</td>
          <td>Permanent; anonymized on deletion</td>
        </tr>
        <tr>
          <td>Sentry error logs</td>
          <td>30 days</td>
        </tr>
        <tr>
          <td>Netlify logs</td>
          <td>Approx. 30 days</td>
        </tr>
        <tr>
          <td>Cookies</td>
          <td>Session or preference-based</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({ title: t('legal.retention') })
</script>

<template>
  <div class="content">
    <h2>Terms of Use</h2>
    <p>Last updated: 14 November 2025</p>

    <h3>Operator</h3>
    <p>BibleTime is operated by:</p>
    <p>
      Manoah Tervoort<br />Alkmaar, The Netherlands<br />Contact:
      <a href="https://github.com/mtdvlpr/bible-time">mtdvlpr</a>
    </p>

    <h3>Acceptance</h3>
    <p>By using BibleTime you agree to these Terms.</p>

    <h3>Service</h3>
    <p>
      BibleTime is an educational platform providing a knowledge base of Biblical people and events.
      Browsing is free; registered users can contribute content.
    </p>

    <h3>Accounts</h3>
    <p>
      You must provide accurate information. You are responsible for maintaining the confidentiality
      of your login credentials.
    </p>

    <h3>User Content & Licensing</h3>
    <p>
      All contributions are licensed under
      <NuxtLink external to="https://creativecommons.org/publicdomain/zero/1.0/"
        >CC0 1.0 Public Domain Dedication</NuxtLink
      >. Contributions may be edited by others. License survives account deletion.
    </p>

    <h3>Deletion</h3>
    <p>Deleting your account removes personal data; contributions remain anonymized.</p>

    <h3>Prohibited Conduct</h3>
    <p>No illegal content, abuse, or unauthorized access.</p>

    <h3>Availability</h3>
    <p>We do not guarantee uninterrupted service. Maintenance or outages may occur.</p>

    <h3>Liability</h3>
    <p>
      Service provided “as is”; no liability for indirect damages, loss of data, or inaccuracies. To
      the fullest extent permitted by Dutch law.
    </p>

    <h3>Governing Law</h3>
    <p>These Terms are governed by the laws of The Netherlands.</p>
  </div>
</template>
<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({ title: t('legal.terms') })
</script>

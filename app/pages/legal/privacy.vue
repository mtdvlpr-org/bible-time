<template>
  <div class="content">
    <h2>{{ $t('legal.privacy') }}</h2>
    <p>{{ $t('date.last-updated') }}: 14 November 2025</p>

    <h3>Who We Are</h3>
    <p>BibleTime (“we”, “us”, “our”) is operated by:</p>
    <p>Manoah Tervoort<br />Alkmaar, The Netherlands<br /></p>

    <h3>What Data We Collect</h3>

    <h4>Account Information</h4>
    <p>If you create an account, we collect and store:</p>
    <ul>
      <li>Email address</li>
      <li>Password hash (never the plain password)</li>
      <li>Display name</li>
      <li>Avatar image (optional)</li>
      <li>Timestamps (created/updated)</li>
    </ul>

    <h4>Automatically Collected Data</h4>
    <p>Our hosting provider processes:</p>
    <ul>
      <li>IP address</li>
      <li>Browser information</li>
      <li>System information</li>
      <li>Access timestamps</li>
      <li>Request metadata</li>
    </ul>
    <p>These logs are used for security, debugging, and abuse prevention.</p>

    <h4>Error Tracking</h4>
    <p>We use Sentry (EU region) for error tracking. Sentry may receive:</p>
    <ul>
      <li>IP address (anonymized)</li>
      <li>Technical error details</li>
      <li>Stack traces</li>
      <li>Browser and system info</li>
    </ul>

    <h4>Cookies</h4>
    <p>We use only functional cookies, including:</p>
    <ul>
      <li>Authentication session</li>
      <li>Language preference</li>
      <li>UI preferences</li>
      <li>Cached translations</li>
      <li>Cached profile data</li>
    </ul>
    <p>No tracking or analytics cookies are used.</p>

    <h3>Purposes and Legal Bases</h3>
    <table>
      <thead>
        <tr>
          <th>Purpose</th>
          <th>Data</th>
          <th>Legal basis</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Account creation & login</td>
          <td>Email, password hash, display name, avatar</td>
          <td>Contract (Art. 6(1)(b))</td>
        </tr>
        <tr>
          <td>Functionality & preferences</td>
          <td>cookies, locale, preferences</td>
          <td>Legitimate interest (Art. 6(1)(f))</td>
        </tr>
        <tr>
          <td>Security, logs, hosting</td>
          <td>IP, logs</td>
          <td>Legitimate interest</td>
        </tr>
        <tr>
          <td>Error monitoring</td>
          <td>Technical error data</td>
          <td>Legitimate interest</td>
        </tr>
        <tr>
          <td>Content contribution</td>
          <td>User edits</td>
          <td>Contract / Legitimate interest</td>
        </tr>
      </tbody>
    </table>

    <h3>Data Storage</h3>
    <ul>
      <li>Supabase (Germany)</li>
      <li>Sentry (EU)</li>
      <li>Netlify (US) — only IP and minimal metadata</li>
    </ul>

    <h3>Retention</h3>
    <ul>
      <li>Account data: until deletion</li>
      <li>Error logs: 30 days</li>
      <li>Knowledge base contributions: permanent, anonymized on deletion</li>
    </ul>

    <h3>User Rights</h3>
    <p>You have the right to:</p>
    <ul>
      <li>Access your data</li>
      <li>Correct your data</li>
      <li>Delete your account via the UI</li>
      <li>Request data export</li>
      <li>Restrict processing</li>
      <li>Object to processing based on legitimate interests</li>
      <li>File a complaint with the Dutch DPA (Autoriteit Persoonsgegevens)</li>
    </ul>

    <h3>Account Deletion</h3>
    <p>Users can delete their account directly through the BibleTime interface.</p>
    <p>When deleted:</p>
    <ul>
      <li>Email, display name, avatar, and profile details are removed</li>
      <li>Contributions are anonymized</li>
      <li>Timestamps remain</li>
    </ul>

    <h3>Public Storage of Avatars</h3>
    <p>
      Avatar images are stored in a public Supabase bucket. Users should not upload sensitive
      images.
    </p>

    <h3>Contact</h3>
    <p>
      For privacy questions or requests, use the
      <ULink :to="$localePath('/contact')">{{ $t('contact.page') }}</ULink
      >.
    </p>
  </div>
</template>
<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({ title: t('legal.privacy') })
</script>

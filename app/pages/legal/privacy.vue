<template>
  <div class="content">
    <h2>Privacy Policy</h2>
    <p>Last updated: 14 November 2025</p>

    <h3>Who We Are</h3>
    <p>BibleTime (“we”, “us”, “our”) is operated by:</p>
    <p>
      Manoah Tervoort<br />Alkmaar, The Netherlands<br />Contact:
      <a href="https://github.com/mtdvlpr/bible-time">mtdvlpr</a>
    </p>

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

    <h3>Your Rights</h3>
    <p>
      Access, correct, delete, request portability, object. Contact
      <a href="https://github.com/mtdvlpr/bible-time">mtdvlpr</a>
    </p>

    <h3>Deletion</h3>
    <p>Delete account in-app; profile data removed, contributions anonymized.</p>
  </div>
</template>
<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({ title: t('legal.privacy') })
</script>

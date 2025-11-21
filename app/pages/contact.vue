<template>
  <UDashboardPanel id="contact">
    <template #header>
      <UDashboardNavbar :ui="{ right: 'gap-3' }" :title="$t('contact.title')">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <UPageCard class="mx-auto" variant="subtle" :title="$t('contact.us')">
        <UForm :state="state" :schema="schema" class="space-y-4" @submit="onSubmit">
          <UFormField
            required
            name="name"
            :label="fields.name.label"
            :placeholder="fields.name.placeholder"
          >
            <UInput v-model="state.name" class="w-full" />
          </UFormField>
          <UFormField
            required
            name="email"
            :label="fields.email.label"
            :placeholder="fields.email.placeholder"
          >
            <UInput v-model="state.email" type="email" class="w-full" />
          </UFormField>
          <UFormField required name="subject" :label="$t('contact.subject')">
            <UInput v-model="state.subject" class="w-full" />
          </UFormField>
          <UFormField
            required
            name="message"
            :label="$t('contact.message')"
            :description="$t('contact.message-public')"
          >
            <UTextarea v-model="state.message" :rows="5" autoresize :maxrows="10" class="w-full" />
          </UFormField>
          <div class="flex justify-end gap-2">
            <UButton
              loading-auto
              type="submit"
              color="primary"
              variant="solid"
              :label="$t('general.send')"
            />
          </div>
          <UAlert
            v-if="previewUrl"
            variant="soft"
            color="success"
            :title="$t('contact.ticket-created')"
            :actions="[{ label: $t('contact.open-ticket'), to: previewUrl, color: 'success' }]"
          />
        </UForm>
      </UPageCard>
    </template>
  </UDashboardPanel>
</template>
<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'

import { z } from 'zod'

const { t } = useI18n()
const { fields, rules } = useForm()
const userStore = useUserStore()

const schema = z.object({
  email: rules.email,
  message: z
    .string(t('validation.required', { field: t('contact.message') }))
    .min(3, t('validation.min-length', { field: t('contact.message'), length: 3 })),
  name: rules.name,
  subject: z
    .string(t('validation.required', { field: t('contact.subject') }))
    .min(3, t('validation.min-length', { field: t('contact.subject'), length: 3 }))
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  email: userStore.user?.email,
  name: userStore.user?.display_name
})

const previewUrl = ref('')
const { showError } = useFlash()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    const res = await $fetch('/api/contact', {
      body: event.data,
      method: 'POST',
      onResponseError: (ctx) => {
        showError({ description: ctx.error?.message || ctx.response._data?.message })
      }
    })

    previewUrl.value = res.url
  } catch {
    // Handled in onResponseError
  }
}

useSeoMeta({
  description: t('contact.description'),
  title: t('contact.title')
})
</script>

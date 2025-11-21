<template>
  <div class="flex flex-col gap-4 sm:gap-6 lg:gap-12 w-full lg:max-w-2xl mx-auto">
    <UPageCard variant="subtle" :title="$t('auth.email')" :description="$t('auth.change-email')">
      <UForm
        :state="email"
        :schema="emailSchema"
        class="flex flex-col gap-4 max-w-xs"
        @submit="onSubmit"
      >
        <UFormField required name="new" :label="fields.email.label">
          <UInput
            v-model="email.new"
            class="w-full"
            :type="fields.email.type"
            :placeholder="fields.email.placeholder"
          />
        </UFormField>

        <UButton
          loading-auto
          class="w-fit"
          type="submit"
          :label="$t('general.update')"
          :disabled="email.new === userStore.user?.email"
        />
      </UForm>
    </UPageCard>

    <UPageCard
      variant="subtle"
      :title="$t('auth.password')"
      :description="$t('auth.change-password')"
    >
      <AuthPasswordForm
        class="max-w-xs"
        :submit="{ class: 'w-fit', label: $t('general.update') }"
      />
    </UPageCard>

    <UPageCard
      :title="$t('auth.account')"
      :description="$t('auth.delete-account-description')"
      class="bg-linear-to-tl from-error/10 from-5% to-default"
    >
      <template #footer>
        <UButton color="error" :label="$t('general.delete')" @click="confirmDeletion = true" />
      </template>
    </UPageCard>

    <ConfirmModal
      v-model="confirmDeletion"
      :message="$t('auth.delete-account-description')"
      :confirm="{ color: 'error', label: $t('general.delete') }"
      @confirm="onConfirmDeletion"
    />
  </div>
</template>
<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'

import { z } from 'zod'

const userStore = useUserStore()
const { fields, rules } = useForm()

const emailSchema = z.object({
  new: rules.email
})

type EmailSchema = z.output<typeof emailSchema>

const email = reactive<Partial<EmailSchema>>({
  new: userStore.user?.email
})

const { t } = useI18n()
const { showError, showSuccess } = useFlash()
const supabase = useSupabaseClient()

async function onSubmit(event: FormSubmitEvent<EmailSchema>) {
  const { error } = await supabase.auth.updateUser({
    email: event.data.new
  })

  if (error) {
    showError({ description: error.message })
  } else {
    showSuccess({
      description: t('auth.check-your-email-for-instructions')
    })
  }
}

const confirmDeletion = ref(false)

async function onConfirmDeletion() {
  try {
    await $fetch('/api/auth/account', {
      method: 'DELETE',
      onResponseError: (ctx) => {
        showError({ description: ctx.error?.message || ctx.response._data?.message })
      }
    })

    await userStore.logout()
  } catch {
    // Handled in onResponseError
  }
}

useSeoMeta({ title: t('settings.security') })
</script>

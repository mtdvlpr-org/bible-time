<template>
  <div class="flex flex-col gap-4 sm:gap-6 lg:gap-12 w-full lg:max-w-2xl mx-auto">
    <UPageCard
      variant="subtle"
      :title="$t('auth.email')"
      description="Change the email address associated with your account."
    >
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

    <UPageCard variant="subtle" :title="$t('auth.password')" description="Change your password.">
      <AuthPasswordForm
        class="max-w-xs"
        :submit="{ class: 'w-fit', label: $t('general.update') }"
      />
    </UPageCard>

    <UPageCard
      :title="$t('auth.account')"
      class="bg-linear-to-tl from-error/10 from-5% to-default"
      description="No longer want to use our service? You can delete your account here. This action is not reversible. All information related to this account will be deleted permanently."
    >
      <template #footer>
        <UButton color="error" :label="$t('general.delete')" />
      </template>
    </UPageCard>
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

const onSubmit = async (event: FormSubmitEvent<EmailSchema>) => {
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
</script>

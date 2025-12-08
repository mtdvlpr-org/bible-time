<template>
  <UModal v-model:open="open" :title="user.display_name" :description="$t('users.edit-role')">
    <template #body>
      <UForm :state="state" :schema="schema" class="space-y-4" @submit="onSubmit">
        <UFormField name="role" :label="$t('auth.role')">
          <USelect v-model="state.role" :items="fields.role.items" />
        </UFormField>
        <div class="flex justify-end gap-2">
          <LazyUButton
            type="reset"
            color="neutral"
            variant="subtle"
            :label="$t('general.cancel')"
            @click="open = false"
          />
          <UButton
            loading-auto
            type="submit"
            color="primary"
            variant="solid"
            :label="$t('general.save')"
            :disabled="state.role === user.user_roles?.role"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'

import { z } from 'zod'
const props = defineProps<{
  user: AppUser
}>()

const open = defineModel<boolean>({ required: true })

const { fields, rules } = useForm()

const schema = z.object({
  role: rules.role
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  role: props.user.user_roles?.role ?? 'user'
})

const { t } = useI18n()
const supabase = useSupabaseClient()
const { showError, showSuccess } = useFlash()
const { data: users } = useNuxtData<AppUser[]>('users')

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const { error } = await supabase
    .from('user_roles')
    .update({ role: event.data.role })
    .eq('user_id', props.user.id)

  if (error) {
    showError({ description: error.message })
  } else {
    showSuccess({ description: t('feedback.saved-successfully', { item: t('auth.role') }) })
    if (users.value) {
      users.value = users.value.map((user) =>
        user.id === props.user.id ? { ...user, user_roles: { role: event.data.role } } : user
      )
    }
    open.value = false
  }
}
</script>

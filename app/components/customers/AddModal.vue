<template>
  <UModal v-model:open="open" title="New customer" description="Add a new customer to the database">
    <UButton icon="i-lucide:plus" label="New customer" />

    <template #body>
      <UForm :state="state" :schema="schema" class="space-y-4" @submit="onSubmit">
        <UFormField name="name" label="Name" placeholder="John Doe">
          <UInput v-model="state.name" class="w-full" />
        </UFormField>
        <UFormField name="email" label="Email" placeholder="john.doe@example.com">
          <UInput v-model="state.email" class="w-full" />
        </UFormField>
        <div class="flex justify-end gap-2">
          <UButton label="Cancel" color="neutral" variant="subtle" @click="open = false" />
          <UButton type="submit" label="Create" color="primary" variant="solid" />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'

import { z } from 'zod'

const schema = z.object({
  email: z.email('Invalid email'),
  name: z.string().min(2, 'Too short')
})
const open = ref(false)

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  email: undefined,
  name: undefined
})

const toast = useToast()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({
    color: 'success',
    description: `New customer ${event.data.name} added`,
    title: 'Success'
  })
  open.value = false
}
</script>

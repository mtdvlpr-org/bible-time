<template>
  <UDashboardPanel id="inbox-2">
    <UDashboardNavbar :toggle="false" :title="mail.subject">
      <template #leading>
        <UButton
          class="-ms-1.5"
          color="neutral"
          variant="ghost"
          icon="i-lucide:x"
          @click="emit('close')"
        />
      </template>

      <template #right>
        <UTooltip text="Archive">
          <UButton color="neutral" variant="ghost" icon="i-lucide:inbox" />
        </UTooltip>

        <UTooltip text="Reply">
          <UButton color="neutral" variant="ghost" icon="i-lucide:reply" />
        </UTooltip>

        <UDropdownMenu :items="dropdownItems">
          <UButton color="neutral" variant="ghost" icon="i-lucide:ellipsis-vertical" />
        </UDropdownMenu>
      </template>
    </UDashboardNavbar>

    <div
      class="flex flex-col sm:flex-row justify-between gap-1 p-4 sm:px-6 border-b border-default"
    >
      <div class="flex items-start gap-4 sm:my-1.5">
        <UAvatar v-bind="mail.from.avatar" size="3xl" :alt="mail.from.name" />

        <div class="min-w-0">
          <p class="font-semibold text-highlighted">
            {{ mail.from.name }}
          </p>
          <p class="text-muted">
            {{ mail.from.email }}
          </p>
        </div>
      </div>

      <p class="max-sm:pl-16 text-muted text-sm sm:mt-2">
        {{ format(new Date(mail.date), 'dd MMM HH:mm') }}
      </p>
    </div>

    <div class="flex-1 p-4 sm:p-6 overflow-y-auto">
      <p class="whitespace-pre-wrap">
        {{ mail.body }}
      </p>
    </div>

    <div class="pb-4 px-4 sm:px-6 shrink-0">
      <UCard
        class="mt-auto"
        variant="subtle"
        :ui="{ header: 'flex items-center gap-1.5 text-dimmed' }"
      >
        <template #header>
          <UIcon class="size-5" name="i-lucide:reply" />

          <span class="text-sm truncate">
            Reply to {{ mail.from.name }} ({{ mail.from.email }})
          </span>
        </template>

        <form @submit.prevent="onSubmit">
          <UTextarea
            v-model="reply"
            required
            :rows="4"
            autoresize
            class="w-full"
            variant="none"
            color="neutral"
            :disabled="loading"
            placeholder="Write your reply..."
            :ui="{ base: 'p-0 resize-none' }"
          />

          <div class="flex items-center justify-between">
            <UTooltip text="Attach file">
              <UButton color="neutral" variant="ghost" icon="i-lucide:paperclip" />
            </UTooltip>

            <div class="flex items-center justify-end gap-2">
              <UButton color="neutral" variant="ghost" label="Save draft" />
              <UButton
                label="Send"
                type="submit"
                color="neutral"
                :loading="loading"
                icon="i-lucide:send"
              />
            </div>
          </div>
        </form>
      </UCard>
    </div>
  </UDashboardPanel>
</template>
<script setup lang="ts">
import { format } from 'date-fns'

import type { Mail } from '~/types'

defineProps<{
  mail: Mail
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const dropdownItems = [
  [
    {
      icon: 'i-lucide:check-circle',
      label: 'Mark as unread'
    },
    {
      icon: 'i-lucide:triangle-alert',
      label: 'Mark as important'
    }
  ],
  [
    {
      icon: 'i-lucide:star',
      label: 'Star thread'
    },
    {
      icon: 'i-lucide:circle-pause',
      label: 'Mute thread'
    }
  ]
]

const toast = useToast()

const reply = ref('')
const loading = ref(false)

function onSubmit() {
  loading.value = true

  setTimeout(() => {
    reply.value = ''

    toast.add({
      color: 'success',
      description: 'Your email has been sent successfully',
      icon: 'i-lucide:check-circle',
      title: 'Email sent'
    })

    loading.value = false
  }, 1000)
}
</script>

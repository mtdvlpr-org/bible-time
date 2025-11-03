<template>
  <div>
    <UPageCard
      class="mb-4"
      title="Members"
      variant="naked"
      orientation="horizontal"
      description="Invite new members by email address."
    >
      <UButton color="neutral" label="Invite people" class="w-fit lg:ms-auto" />
    </UPageCard>

    <UPageCard
      variant="subtle"
      :ui="{
        container: 'p-0 sm:p-0 gap-y-0',
        wrapper: 'items-stretch',
        header: 'p-4 mb-0 border-b border-default'
      }"
    >
      <template #header>
        <UInput
          v-model="q"
          autofocus
          class="w-full"
          icon="i-lucide-search"
          placeholder="Search members"
        />
      </template>

      <SettingsMembersList :members="filteredMembers" />
    </UPageCard>
  </div>
</template>
<script setup lang="ts">
import type { Member } from '~/types'

const { data: members } = await useFetch<Member[]>('/api/members', { default: () => [] })

const q = ref('')

const filteredMembers = computed(() => {
  return members.value.filter((member) => {
    return (
      member.name.search(new RegExp(q.value, 'i')) !== -1 ||
      member.username.search(new RegExp(q.value, 'i')) !== -1
    )
  })
})
</script>

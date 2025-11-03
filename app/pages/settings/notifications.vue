<template>
  <div v-for="(section, index) in sections" :key="index">
    <UPageCard
      class="mb-4"
      variant="naked"
      :title="section.title"
      :description="section.description"
    />

    <UPageCard variant="subtle" :ui="{ container: 'divide-y divide-default' }">
      <UFormField
        v-for="field in section.fields"
        :key="field.name"
        :name="field.name"
        :label="field.label"
        :description="field.description"
        class="flex items-center justify-between not-last:pb-4 gap-2"
      >
        <USwitch v-model="state[field.name]" @update:model-value="onChange" />
      </UFormField>
    </UPageCard>
  </div>
</template>
<script setup lang="ts">
const state = reactive<{ [key: string]: boolean }>({
  desktop: false,
  email: true,
  important_updates: true,
  product_updates: true,
  weekly_digest: false
})

const sections = [
  {
    description: 'Where can we notify you?',
    fields: [
      {
        description: 'Receive a daily email digest.',
        label: 'Email',
        name: 'email'
      },
      {
        description: 'Receive desktop notifications.',
        label: 'Desktop',
        name: 'desktop'
      }
    ],
    title: 'Notification channels'
  },
  {
    description: 'Receive updates about Nuxt UI.',
    fields: [
      {
        description: 'Receive a weekly digest of news.',
        label: 'Weekly digest',
        name: 'weekly_digest'
      },
      {
        description: 'Receive a monthly email with all new features and updates.',
        label: 'Product updates',
        name: 'product_updates'
      },
      {
        description:
          'Receive emails about important updates like security fixes, maintenance, etc.',
        label: 'Important updates',
        name: 'important_updates'
      }
    ],
    title: 'Account updates'
  }
]

async function onChange() {
  // Do something with data
  console.log(state)
}
</script>

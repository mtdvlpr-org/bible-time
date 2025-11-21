<template>
  <UModal v-model:open="open" :title="type === 'person' ? $t('person.avatar') : $t('event.cover')">
    <UAvatar
      alt=""
      size="xl"
      icon="i-lucide-image"
      :src="url ?? undefined"
      class="w-28 h-28 md:w-32 md:h-32"
      :class="{ 'pointer-events-none': !edit, 'cursor-pointer': edit }"
    />

    <template #body>
      <div class="flex gap-4 justify-around mb-4">
        <UAvatar
          alt=""
          size="xl"
          icon="i-lucide-image"
          :src="current ?? undefined"
          class="w-28 h-28 md:w-32 md:h-32"
        />
        <LazyUAvatar
          v-if="state.url && state.url !== current"
          alt=""
          size="xl"
          :src="state.url"
          icon="i-lucide-image"
          class="w-28 h-28 md:w-32 md:h-32"
        />
      </div>
      <UForm :state="state" :schema="schema" class="space-y-4" @submit="onSubmit">
        <UFormField
          name="url"
          :label="type === 'person' ? $t('person.avatar-url') : $t('event.cover-url')"
        >
          <UInput
            v-model="state.url"
            type="url"
            class="w-full"
            placeholder="https://example.com/avatar.jpg"
          >
            <template v-if="state.url?.length" #trailing>
              <LazyUButton
                size="sm"
                variant="link"
                color="neutral"
                icon="i-lucide:circle-x"
                :aria-label="$t('general.clear')"
                @click="state.url = undefined"
              />
            </template>
          </UInput>
        </UFormField>
        <div class="flex justify-end gap-2">
          <UButton
            type="reset"
            color="neutral"
            variant="subtle"
            :label="$t('general.reset')"
            @click="reset"
          />
          <UButton
            loading-auto
            type="submit"
            color="primary"
            variant="solid"
            :label="$t('general.confirm')"
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
  current: null | string
  edit?: boolean
  type: 'event' | 'person'
}>()

const url = defineModel<null | string>({ required: true })

const open = ref(false)

const { t } = useI18n()
const { rules } = useForm()

const schema = z.object({
  url: rules.url(props.type === 'person' ? t('person.avatar-url') : t('event.cover-url')).optional()
})

watch(
  () => props.edit,
  (val) => {
    if (!val) url.value = props.current
  }
)

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({ url: url.value ?? undefined })

async function onSubmit(event: FormSubmitEvent<Schema>) {
  url.value = event.data.url ?? null
  open.value = false
}

function reset() {
  url.value = props.current
  state.url = props.current ?? undefined
  open.value = false
}
</script>

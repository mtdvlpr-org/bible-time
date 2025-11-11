<template>
  <UForm id="profile" :state="profile" :schema="profileSchema" @submit="onSubmit">
    <UPageCard
      class="mb-4"
      variant="naked"
      orientation="horizontal"
      :title="$t('settings.profile')"
    >
      <UButton
        loading-auto
        type="submit"
        color="neutral"
        class="w-fit lg:ms-auto"
        :label="$t('general.save')"
        :disabled="
          userStore.user?.display_name === profile.display_name &&
          !avatarFile &&
          !(userStore.user?.avatar_url && !avatarPreview)
        "
      />
    </UPageCard>

    <UPageCard variant="subtle">
      <UFormField
        required
        name="display_name"
        :label="$t('person.name')"
        :description="$t('auth.name-description')"
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <UInput v-model="profile.display_name" autocomplete="off" />
      </UFormField>
      <USeparator />
      <UFormField
        name="avatar"
        :label="$t('person.avatar')"
        description="JPG, GIF or PNG. Max 10MB."
        class="flex max-sm:flex-col justify-between sm:items-center gap-4"
      >
        <div class="flex flex-wrap items-center gap-3">
          <UAvatar size="lg" :src="avatarPreview" :alt="profile.display_name" />
          <LazyUButton
            v-if="!avatarFile"
            color="primary"
            :label="$t('general.choose')"
            @click="onFileClick"
          />
          <LazyUButton
            v-if="avatarFile || (userStore.user?.avatar_url && !avatarPreview)"
            color="neutral"
            :label="$t('general.cancel')"
            @click="resetAvatar"
          />
          <LazyUButton
            v-if="!avatarFile && userStore.user?.avatar_url && avatarPreview"
            color="error"
            :label="$t('general.delete')"
            @click="avatarPreview = ''"
          />
          <input
            ref="fileRef"
            type="file"
            class="hidden"
            accept=".jpg, .jpeg, .png, .gif"
            @change="onFileChange"
          />
        </div>
      </UFormField>
    </UPageCard>
  </UForm>
</template>
<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'

import { z } from 'zod'

const { t } = useI18n()
const userStore = useUserStore()
const supabase = useSupabaseClient()

const profile = reactive<Partial<ProfileSchema>>({
  display_name: userStore.user?.display_name
})

const { rules } = useForm()

const profileSchema = z.object({
  display_name: rules.name
})

type ProfileSchema = z.output<typeof profileSchema>

const avatarFile = ref<File | null>(null)
const fileInput = useTemplateRef('fileRef')
const avatarPreview = ref(userStore.user?.avatar_url ?? '')

const onFileClick = () => {
  fileInput.value?.click()
}

const onFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement

  if (!input.files?.length) return

  avatarFile.value = input.files[0]!
  avatarPreview.value = URL.createObjectURL(input.files[0]!)
}

const { showError, showSuccess } = useFlash()

const resetAvatar = () => {
  avatarFile.value = null
  avatarPreview.value = userStore.user?.avatar_url ?? ''
}

const onSubmit = async (event: FormSubmitEvent<ProfileSchema>) => {
  if (!userStore.user) return

  const newProfile: TablesUpdate<'profiles'> = event.data

  if (avatarFile.value) {
    const fileName = `${userStore.user.id}/${avatarFile.value.name}`
    const { data, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, avatarFile.value, { upsert: true })

    if (uploadError) {
      showError({ description: uploadError.message })
      return
    }

    if (data?.path) {
      newProfile.avatar_url = data.path
      userStore.user.avatar_url = data.fullPath
    }
  } else if (!avatarPreview.value) {
    newProfile.avatar_url = null
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(newProfile)
    .eq('id', userStore.user.id)
    .select()
    .single()

  if (error) {
    showError({ description: error.message })
  } else {
    if (data) userStore.updateProfile(data)
    showSuccess({
      description: t('feedback.saved-successfully', { item: t('settings.profile') })
    })
  }
}

useSeoMeta({
  title: t('settings.profile')
})
</script>

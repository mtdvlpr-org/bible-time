<template>
  <div>
    <UPageCard
      class="mb-4"
      variant="naked"
      orientation="horizontal"
      :title="$t('settings.general')"
      :description="$t('settings.description')"
    />

    <UPageCard variant="subtle">
      <UFormField
        :label="$t('settings.language')"
        :description="$t('settings.language-description')"
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <LocaleSelect />
      </UFormField>
      <UFormField
        :label="$t('settings.appearance')"
        :description="$t('settings.appearance-description')"
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <UDropdownMenu
          :ui="{ content: 'min-w-fit' }"
          :items="appearanceDropdownItem.children[0]?.children"
        >
          <UButton
            color="neutral"
            variant="outline"
            :label="appearanceDropdownItem.children[0]?.label"
          >
            <template #leading>
              <div class="inline-flex items-center justify-center shrink-0 size-5">
                <span
                  class="rounded-full ring ring-bg bg-(--chip-light) dark:bg-(--chip-dark) size-2"
                  :style="{
                    '--chip-light': `var(--color-${appConfig.ui.colors.primary}-500)`,
                    '--chip-dark': `var(--color-${appConfig.ui.colors.primary}-400)`
                  }"
                />
              </div>
            </template>
          </UButton>
          <template #chip-leading="{ item }">
            <div class="inline-flex items-center justify-center shrink-0 size-5">
              <span
                class="rounded-full ring ring-bg bg-(--chip-light) dark:bg-(--chip-dark) size-2"
                :style="{
                  '--chip-light': `var(--color-${(item as any).chip}-500)`,
                  '--chip-dark': `var(--color-${(item as any).chip}-400)`
                }"
              />
            </div>
          </template>
        </UDropdownMenu>
        <UDropdownMenu
          class="ml-2"
          :ui="{ content: 'min-w-fit' }"
          :items="appearanceDropdownItem.children[1]?.children"
        >
          <UButton
            color="neutral"
            variant="outline"
            :label="appearanceDropdownItem.children[1]?.label"
          >
            <template #leading>
              <div class="inline-flex items-center justify-center shrink-0 size-5">
                <span
                  class="rounded-full ring ring-bg bg-(--chip-light) dark:bg-(--chip-dark) size-2"
                  :style="{
                    '--chip-light': `var(--color-${
                      appConfig.ui.colors.neutral === 'neutral'
                        ? 'old-neutral'
                        : appConfig.ui.colors.neutral
                    }-500)`,
                    '--chip-dark': `var(--color-${
                      appConfig.ui.colors.neutral === 'neutral'
                        ? 'old-neutral'
                        : appConfig.ui.colors.neutral
                    }-400)`
                  }"
                />
              </div>
            </template>
          </UButton>
          <template #chip-leading="{ item }">
            <div class="inline-flex items-center justify-center shrink-0 size-5">
              <span
                class="rounded-full ring ring-bg bg-(--chip-light) dark:bg-(--chip-dark) size-2"
                :style="{
                  '--chip-light': `var(--color-${(item as any).chip}-500)`,
                  '--chip-dark': `var(--color-${(item as any).chip}-400)`
                }"
              />
            </div>
          </template>
        </UDropdownMenu>
      </UFormField>
      <UFormField
        :label="$t('settings.theme')"
        :description="$t('settings.theme-description')"
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <UColorModeSelect />
      </UFormField>
    </UPageCard>
  </div>
</template>
<script setup lang="ts">
const appConfig = useAppConfig()
const { appearanceDropdownItem } = useTheme()
</script>

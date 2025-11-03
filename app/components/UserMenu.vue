<template>
  <UDropdownMenu
    :items="items"
    :content="{ align: 'center', collisionPadding: 12 }"
    :ui="{ content: collapsed ? 'w-48' : 'w-(--reka-dropdown-menu-trigger-width)' }"
  >
    <UButton
      block
      color="neutral"
      variant="ghost"
      :avatar="avatar"
      :square="collapsed"
      class="data-[state=open]:bg-elevated"
      :ui="{ trailingIcon: 'text-dimmed' }"
      :label="collapsed ? undefined : user.display_name"
      :trailing-icon="collapsed ? undefined : 'i-lucide-chevrons-up-down'"
    />

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
    <template #flag-leading="{ item }">
      <span class="size-5 text-center">
        {{ getEmojiFlag((item as any).code) }}
      </span>
    </template>
  </UDropdownMenu>
</template>
<script setup lang="ts">
import type { AvatarProps, DropdownMenuItem } from '@nuxt/ui'

const props = defineProps<{
  collapsed?: boolean
  user: { avatar_url: null | string; display_name: string }
}>()

const userStore = useUserStore()
const colorMode = useColorMode()

// i18n
const localePath = useLocalePath()
const { locale, locales, setLocale, t } = useI18n()

const avatar = computed(
  (): AvatarProps => ({
    alt: props.user.display_name,
    src: props.user.avatar_url ?? ''
  })
)

const { appearanceDropdownItem } = useTheme()

const items = computed<DropdownMenuItem[][]>(() => [
  [
    {
      avatar: avatar.value,
      label: props.user.display_name,
      type: 'label'
    }
  ],
  [
    {
      icon: 'i-lucide-user',
      label: t('settings.profile'),
      to: localePath('/settings/profile')
    },
    {
      exact: true,
      icon: 'i-lucide-settings',
      label: t('settings.title'),
      to: localePath('/settings')
    }
  ],
  [
    {
      children: locales.value.map((l) => ({
        checked: locale.value === l.code,
        code: l.code,
        label: l.name,
        onSelect(e) {
          e.preventDefault()
          setLocale(l.code)
        },
        slot: 'flag',
        type: 'checkbox'
      })),
      icon: 'i-lucide-globe',
      label: t('settings.language')
    },
    appearanceDropdownItem.value,
    {
      children: [
        { icon: 'i-lucide-monitor', key: 'system', label: t('settings.system') },
        { icon: 'i-lucide-sun', key: 'light', label: t('settings.light') },
        { icon: 'i-lucide-moon', key: 'dark', label: t('settings.dark') }
      ].map((item) => ({
        checked: colorMode.preference === item.key,
        icon: item.icon,
        label: item.label,
        onSelect(e: Event) {
          e.preventDefault()
          colorMode.preference = item.key
        },
        type: 'checkbox'
      })),
      icon: 'i-lucide-sun-moon',
      label: t('settings.theme')
    }
  ],
  [
    {
      icon: 'i-lucide-log-out',
      label: t('settings.log-out'),
      onSelect: () => {
        userStore.signOut()
      }
    }
  ]
])
</script>

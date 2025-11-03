<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="default"
      v-model:open="open"
      resizable
      collapsible
      class="bg-elevated/25"
      :ui="{ footer: 'lg:border-t lg:border-default' }"
    >
      <template #header="{ collapsed }">
        <TeamsMenu :collapsed="collapsed" />
      </template>

      <template #default="{ collapsed }">
        <UDashboardSearchButton :collapsed="collapsed" class="bg-transparent ring-default" />

        <UNavigationMenu
          popover
          tooltip
          :items="links[0]"
          :collapsed="collapsed"
          orientation="vertical"
        />

        <UNavigationMenu
          tooltip
          class="mt-auto"
          :items="links[1]"
          :collapsed="collapsed"
          orientation="vertical"
        />
      </template>

      <template #footer="{ collapsed }">
        <UserMenu v-if="userStore.user" :collapsed="collapsed" :user="userStore.user" />
        <LoginButton v-else :collapsed="collapsed" />
      </template>
    </UDashboardSidebar>

    <UDashboardSearch :groups="groups">
      <template #flag-leading="{ item }">
        <span class="size-5 text-center">
          {{ getEmojiFlag((item as any).code) }}
        </span>
      </template>
      <template #chip-leading="{ item }">
        <div class="inline-flex items-center justify-center shrink-0 size-5">
          <span
            class="rounded-full ring ring-bg bg-(--chip-light) dark:bg-(--chip-dark) size-2"
            :style="{
              '--chip-light': `var(--color-${(item as any).color}-500)`,
              '--chip-dark': `var(--color-${(item as any).color}-400)`
            }"
          />
        </div>
      </template>
    </UDashboardSearch>

    <slot />

    <NotificationsSlideover />
  </UDashboardGroup>
</template>

<script setup lang="ts">
import type { CommandPaletteGroup, NavigationMenuItem } from '@nuxt/ui'

// i18n
const localePath = useLocalePath()
const { locale, locales, setLocale, t } = useI18n()

// Auth
const user = useSupabaseUser()
const userStore = useUserStore()
await callOnce(user.value?.sub || 'profile', userStore.fetch, { mode: 'navigation' })

const open = ref(false)

const links = computed((): NavigationMenuItem[][] => [
  [
    {
      icon: 'i-lucide-house',
      label: t('home.title'),
      onSelect: () => {
        open.value = false
      },
      to: localePath('/')
    },
    {
      icon: 'i-lucide-users',
      label: t('people.title'),
      onSelect: () => {
        open.value = false
      },
      to: localePath('/people')
    },
    {
      children: [
        {
          exact: true,
          label: t('settings.general'),
          onSelect: () => {
            open.value = false
          },
          to: localePath('/settings')
        },
        {
          label: t('settings.profile'),
          onSelect: () => {
            open.value = false
          },
          to: localePath('/settings/profile')
        },
        {
          label: t('settings.security'),
          onSelect: () => {
            open.value = false
          },
          to: localePath('/settings/security')
        }
      ],
      defaultOpen: true,
      icon: 'i-lucide-settings',
      label: t('settings.title'),
      type: 'trigger'
    }
  ],
  [
    // Links pushed to the bottom
  ]
])

const { appearanceDropdownItem } = useTheme()

const groups = computed((): CommandPaletteGroup[] => [
  {
    id: 'links',
    items: links.value.flat(),
    label: t('search.go-to')
  },
  {
    id: 'locale',
    items: locales.value.map((l) => ({
      active: locale.value === l.code,
      code: l.code,
      label: l.name,
      onSelect: () => {
        setLocale(l.code)
      },
      slot: 'flag'
    })),
    label: t('settings.language')
  },
  {
    id: 'appearance',
    items: appearanceDropdownItem.value.children.map((item) => ({
      children: item.children.map((child) => ({
        active: child.checked,
        color: child.chip,
        label: child.label,
        onSelect: child.onSelect,
        slot: 'chip'
      })),
      color: item.chip,
      label: item.label,
      slot: 'chip'
    })),
    label: t('settings.appearance')
  }
])

const toast = useToast()
const cookie = useCookie('cookie-consent')

onMounted(() => {
  if (cookie.value === 'accepted') return

  toast.add({
    actions: [
      {
        color: 'neutral',
        label: 'Accept',
        onClick: () => {
          cookie.value = 'accepted'
        },
        variant: 'outline'
      },
      {
        color: 'neutral',
        label: 'Opt out',
        variant: 'ghost'
      }
    ],
    close: false,
    duration: 0,
    title: 'We use first-party cookies to enhance your experience on our website.'
  })
})
</script>

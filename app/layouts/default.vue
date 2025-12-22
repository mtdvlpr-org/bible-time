<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="default"
      resizable
      collapsible
      class="bg-elevated/25"
      :ui="{ footer: 'lg:border-t lg:border-default' }"
    >
      <template #header="{ collapsed }">
        <LazyAppIcon v-if="collapsed" />
        <LazyAppLogo v-else style="height: 90%" />
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
        <LazyUserMenu v-if="userStore.user" :collapsed="collapsed" :user="userStore.user" />
        <LazyUButton
          v-else
          block
          color="neutral"
          variant="ghost"
          :square="collapsed"
          icon="i-lucide:user"
          :label="$t('auth.login')"
          :class="[!collapsed && 'py-2']"
          :to="$localePath('/auth/login')"
        />
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

const { $pwa } = useNuxtApp()
const { repoUrl } = useRuntimeConfig().public

const links = computed((): NavigationMenuItem[][] => [
  [
    {
      icon: 'i-lucide:house',
      label: t('home.title'),
      to: localePath('/')
    },
    {
      icon: 'i-lucide:chart-gantt',
      label: t('timeline.title'),
      to: localePath('/timeline')
    },
    {
      icon: 'i-lucide:users',
      label: t('people.title'),
      to: localePath('/people')
    },
    {
      icon: 'i-lucide:calendar-range',
      label: t('events.title'),
      to: localePath('/events')
    },
    {
      icon: 'i-lucide:lightbulb',
      label: t('suggestions.title'),
      to: localePath('/suggestions')
    },
    ...(userStore.user?.role === 'admin'
      ? [
          {
            children: [
              {
                icon: 'i-lucide:users',
                label: t('people.title'),
                to: localePath('/admin/people')
              },
              {
                icon: 'i-lucide:calendar-range',
                label: t('events.title'),
                to: localePath('/admin/events')
              },
              ...(userStore.can('users.manage')
                ? [
                    {
                      icon: 'i-lucide:users-round',
                      label: t('users.title'),
                      to: localePath('/admin/users')
                    }
                  ]
                : [])
            ],
            defaultOpen: true,
            icon: 'i-lucide:shield',
            label: t('auth.admin'),
            type: 'trigger' as const
          }
        ]
      : []),
    {
      children: [
        {
          exact: true,
          icon: 'i-lucide:settings-2',
          label: t('settings.general'),
          to: localePath('/settings')
        },
        {
          icon: 'i-lucide:user-round',
          label: t('settings.profile'),
          to: localePath('/settings/profile')
        },
        {
          icon: 'i-lucide:shield-user',
          label: t('settings.security'),
          to: localePath('/settings/security')
        }
      ],
      defaultOpen: true,
      icon: 'i-lucide:settings',
      label: t('settings.title'),
      type: 'trigger'
    }
  ],
  [
    {
      icon: 'i-lucide:mail',
      label: t('contact.title'),
      to: localePath('/contact')
    },
    {
      icon: 'i-lucide:file-text',
      label: t('legal.title'),
      to: localePath('/legal')
    },
    ...($pwa?.showInstallPrompt && !$pwa?.isPWAInstalled
      ? [
          {
            icon: 'i-lucide:download',
            label: t('feedback.install-app'),
            onClick: () => {
              $pwa.install()
            }
          }
        ]
      : []),
    {
      external: true,
      icon: 'i-lucide-info',
      label: t('general.help-and-support'),
      target: '_blank',
      to: repoUrl + '#readme'
    }
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

const { show } = useFlash()
const cookie = useCookie('cookie-consent')

onMounted(() => {
  if (cookie.value === 'accepted') return

  show({
    actions: [
      {
        color: 'neutral',
        label: t('general.accept'),
        onClick: () => {
          cookie.value = 'accepted'
        },
        variant: 'outline'
      },
      {
        color: 'neutral',
        label: t('legal.cookies'),
        onClick: () => {
          navigateTo(localePath('/legal/cookies'))
        },
        variant: 'ghost'
      }
    ],
    close: false,
    duration: 0,
    id: 'cookie-consent',
    title: t('general.cookie-description')
  })
})
</script>

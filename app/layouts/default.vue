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

const open = ref(false)
const { repoUrl } = useRuntimeConfig().public

const links = computed((): NavigationMenuItem[][] => [
  [
    {
      icon: 'i-lucide:house',
      label: t('home.title'),
      onSelect: () => {
        open.value = false
      },
      to: localePath('/')
    },
    {
      icon: 'i-lucide:chart-gantt',
      label: t('timeline.title'),
      onSelect: () => {
        open.value = false
      },
      to: localePath('/timeline')
    },
    {
      icon: 'i-lucide:users',
      label: t('people.title'),
      onSelect: () => {
        open.value = false
      },
      to: localePath('/people')
    },
    {
      icon: 'i-lucide:calendar-range',
      label: t('events.title'),
      onSelect: () => {
        open.value = false
      },
      to: localePath('/events')
    },
    {
      icon: 'i-lucide:lightbulb',
      label: t('suggestions.title'),
      onSelect: () => {
        open.value = false
      },
      to: localePath('/suggestions')
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
    {
      external: true,
      icon: 'i-lucide-info',
      label: t('general.help-and-support'),
      target: '_blank',
      to: repoUrl
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

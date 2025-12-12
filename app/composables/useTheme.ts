import type { DropdownMenuItem } from '@nuxt/ui'

const colors = [
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose'
]

const neutrals = ['slate', 'gray', 'zinc', 'neutral', 'stone']

export default function () {
  const { t } = useNuxtApp().$i18n
  const appConfig = useAppConfig()

  const setPrimaryColor = (color: string) => {
    appConfig.ui.colors.primary = color
    if (import.meta.client) {
      localStorage.setItem('nuxt-ui-primary', color)
    }
  }

  const setNeutralColor = (color: string) => {
    appConfig.ui.colors.neutral = color
    if (import.meta.client) {
      localStorage.setItem('nuxt-ui-neutral', color)
    }
  }

  const appearanceDropdownItem = computed(
    () =>
      ({
        children: [
          {
            children: colors.map((color) => ({
              checked: appConfig.ui.colors.primary === color,
              chip: color,
              label: color,
              onSelect: (e) => {
                e.preventDefault()
                setPrimaryColor(color)
              },
              slot: 'chip',
              type: 'checkbox'
            })),
            chip: appConfig.ui.colors.primary,
            content: { align: 'center', collisionPadding: 16 },
            label: 'Primary',
            slot: 'chip'
          },
          {
            children: neutrals.map((color) => ({
              checked: appConfig.ui.colors.neutral === color,
              chip: color === 'neutral' ? 'old-neutral' : color,
              label: color,
              onSelect: (e) => {
                e.preventDefault()
                setNeutralColor(color)
              },
              slot: 'chip',
              type: 'checkbox'
            })),
            chip:
              appConfig.ui.colors.neutral === 'neutral'
                ? 'old-neutral'
                : appConfig.ui.colors.neutral,
            content: { align: 'end', collisionPadding: 16 },
            label: 'Neutral',
            slot: 'chip'
          }
        ],
        icon: 'i-lucide:palette',
        label: t('settings.appearance')
      }) satisfies DropdownMenuItem
  )

  return {
    appearanceDropdownItem
  }
}

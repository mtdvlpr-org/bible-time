import type { DropdownMenuItem } from '@nuxt/ui'
import type { Column, RowData } from '@tanstack/table-core'

import { UAvatar, UButton, UDropdownMenu } from '#components'

export default function () {
  const sortableColumn = <TData extends RowData, TValue = unknown>(
    column: Column<TData, TValue>,
    label: string
  ) => {
    const isSorted = column.getIsSorted()

    return h(UButton, {
      class: '-mx-2.5',
      color: 'neutral',
      icon: isSorted
        ? isSorted === 'asc'
          ? 'i-lucide:arrow-up-narrow-wide'
          : 'i-lucide:arrow-down-wide-narrow'
        : 'i-lucide:arrow-up-down',
      label,
      onClick: () => column.toggleSorting(),
      variant: 'ghost'
    })
  }

  const avatarCell = (label: string, avatar: null | string, aliases?: string[]) => {
    return h('div', { class: 'flex items-center gap-3' }, [
      h(UAvatar, { alt: '', icon: 'i-lucide-image', size: 'lg', src: avatar ?? undefined }),
      h('div', undefined, [
        h('p', { class: 'font-medium text-highlighted' }, label),
        ...(aliases?.length ? [h('p', { class: '' }, `${aliases.join(', ')}`)] : [])
      ])
    ])
  }

  const actionCell = (items: DropdownMenuItem[]) => {
    return h(
      'div',
      { class: 'text-right' },
      h(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        UDropdownMenu as unknown as any,
        { content: { align: 'end' }, items },
        () =>
          h(UButton, {
            class: 'ml-auto',
            color: 'neutral',
            icon: 'i-lucide:ellipsis-vertical',
            variant: 'ghost'
          })
      )
    )
  }

  return { actionCell, avatarCell, sortableColumn }
}

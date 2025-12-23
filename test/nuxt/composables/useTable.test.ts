import type { DropdownMenuItem } from '@nuxt/ui'
import type { Column } from '@tanstack/table-core'

import { describe, expect, it, vi } from 'vitest'
import { isVNode } from 'vue'

import useTable from '~/composables/useTable'

vi.mock('#components', () => ({
  UAvatar: { name: 'UAvatar' },
  UButton: { name: 'UButton' },
  UDropdownMenu: { name: 'UDropdownMenu' }
}))

describe('useTable', () => {
  it('sortableColumn returns a VNode', () => {
    const { sortableColumn } = useTable()
    const columnMock = {
      getIsSorted: vi.fn().mockReturnValue('asc'),
      toggleSorting: vi.fn()
    }
    const vNode = sortableColumn(columnMock as unknown as Column<unknown, unknown>, 'Label')

    expect(isVNode(vNode)).toBe(true)
  })

  it('avatarCell returns a VNode', () => {
    const { avatarCell } = useTable()
    const vNode = avatarCell('John Doe', 'avatar.png', ['Johnny'])

    expect(isVNode(vNode)).toBe(true)
  })

  it('actionCell returns a VNode', () => {
    const { actionCell } = useTable()
    const items: DropdownMenuItem[] = [{ label: 'Edit' }]
    const vNode = actionCell(items)

    expect(isVNode(vNode)).toBe(true)
  })
})

import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import useFlash from '../../../app/composables/useFlash'

const toastAddMock = vi.fn()
const toastsMock: { value: { id: string }[] } = { value: [] }

mockNuxtImport('useNuxtApp', () => {
  return () => ({
    $i18n: {
      t: (key: string) => key
    }
  })
})

mockNuxtImport('useToast', () => {
  return () => ({
    add: toastAddMock,
    toasts: toastsMock
  })
})

describe('useFlash', () => {
  beforeEach(() => {
    toastAddMock.mockClear()
    toastsMock.value = []
  })

  it('shows a basic toast', () => {
    const { show } = useFlash()
    show({ title: 'Test' })
    expect(toastAddMock).toHaveBeenCalledWith({ title: 'Test' })
  })

  it('prevents duplicate toasts', () => {
    const { show } = useFlash()
    toastsMock.value = [{ id: 'test-id' }]
    show({ id: 'test-id', title: 'Test' })
    expect(toastAddMock).not.toHaveBeenCalled()
  })

  it('allows non-duplicate toasts', () => {
    const { show } = useFlash()
    toastsMock.value = [{ id: 'other-id' }]
    show({ id: 'test-id', title: 'Test' })
    expect(toastAddMock).toHaveBeenCalledWith({ id: 'test-id', title: 'Test' })
  })

  it('shows error toast with defaults', () => {
    const { showError } = useFlash()
    showError({ description: 'Error occurred' })
    expect(toastAddMock).toHaveBeenCalledWith({
      color: 'error',
      description: 'Error occurred',
      icon: 'i-lucide:circle-alert',
      title: 'feedback.something-went-wrong'
    })
  })

  it('shows info toast with defaults', () => {
    const { showInfo } = useFlash()
    showInfo({ description: 'Info message' })
    expect(toastAddMock).toHaveBeenCalledWith({
      color: 'info',
      description: 'Info message',
      icon: 'i-lucide:info',
      title: 'feedback.info'
    })
  })

  it('shows warning toast with defaults', () => {
    const { showWarning } = useFlash()
    showWarning({ description: 'Warning message' })
    expect(toastAddMock).toHaveBeenCalledWith({
      color: 'warning',
      description: 'Warning message',
      icon: 'i-lucide:triangle-alert',
      title: 'feedback.warning'
    })
  })

  it('shows success toast with defaults', () => {
    const { showSuccess } = useFlash()
    showSuccess({ description: 'Success message' })
    expect(toastAddMock).toHaveBeenCalledWith({
      color: 'success',
      description: 'Success message',
      icon: 'i-lucide:circle-check',
      title: 'feedback.success'
    })
  })
})

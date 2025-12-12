import type { Toast } from '@nuxt/ui/runtime/composables/useToast.js'

export default function () {
  const { t } = useNuxtApp().$i18n
  const toast = useToast()

  const show = (options: Partial<Toast>) => {
    // Prevent duplicate toasts with the same ID
    if (options.id && toast.toasts.value.some((toast) => toast.id === options.id)) return
    toast.add(options)
  }

  const showError = (options: Partial<Toast>) => {
    show({
      color: 'error',
      icon: 'i-lucide:circle-alert',
      title: t('feedback.something-went-wrong'),
      ...options
    })
  }

  const showInfo = (options: Partial<Toast>) => {
    show({
      color: 'info',
      icon: 'i-lucide:info',
      title: t('feedback.info'),
      ...options
    })
  }

  const showWarning = (options: Partial<Toast>) => {
    show({
      color: 'warning',
      icon: 'i-lucide:triangle-alert',
      title: t('feedback.warning'),
      ...options
    })
  }

  const showSuccess = (options: Partial<Toast>) => {
    show({
      color: 'success',
      icon: 'i-lucide:circle-check',
      title: t('feedback.success'),
      ...options
    })
  }

  return {
    show,
    showError,
    showInfo,
    showSuccess,
    showWarning
  }
}

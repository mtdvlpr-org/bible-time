import type { Toast } from '@nuxt/ui/runtime/composables/useToast.js'

export default function () {
  const { t } = useI18n()
  const toast = useToast()

  const showError = (options: Partial<Toast>) => {
    toast.add({
      color: 'error',
      icon: 'i-lucide:circle-alert',
      title: t('feedback.something-went-wrong'),
      ...options
    })
  }

  const showInfo = (options: Partial<Toast>) => {
    toast.add({
      color: 'info',
      icon: 'i-lucide:info',
      title: t('feedback.info'),
      ...options
    })
  }

  const showWarning = (options: Partial<Toast>) => {
    toast.add({
      color: 'warning',
      icon: 'i-lucide:triangle-alert',
      title: t('feedback.warning'),
      ...options
    })
  }

  const showSuccess = (options: Partial<Toast>) => {
    toast.add({
      color: 'success',
      icon: 'i-lucide:circle-check',
      title: t('feedback.success'),
      ...options
    })
  }

  return {
    showError,
    showInfo,
    showSuccess,
    showWarning
  }
}

import type { InputProps, SelectMenuItem } from '@nuxt/ui'

export type DynamicFormField = Partial<InputProps> & {
  autocapitalize?: 'off' | 'on' | 'words'
  items?: ((SelectMenuItem & { value: string }) | string)[]
  label: string
  name: string
  type: 'checkbox' | 'email' | 'number' | 'otp' | 'password' | 'select' | 'text'
}

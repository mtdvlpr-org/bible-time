import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'

import useForm from '../../../app/composables/useForm'

// Mock Constants globally
const ConstantsMock = {
  public: {
    Enums: {
      app_role: ['admin', 'moderator', 'translator', 'user'],
      date_precision: ['exact', 'circa', 'before', 'after'],
      event_relation: ['contemporary', 'other'],
      gender: ['male', 'female', 'unknown'],
      person_relation: ['parent', 'child', 'spouse', 'other'],
      source_kind: ['bible_verse', 'article', 'video', 'website', 'other']
    }
  }
}

vi.stubGlobal('Constants', ConstantsMock)

mockNuxtImport('useNuxtApp', () => {
  return () => ({
    $i18n: {
      t: (key: string, params?: Record<string, string>) =>
        params ? `${key} ${JSON.stringify(params)}` : key
    }
  })
})

describe('useForm', () => {
  it('returns fields configuration', () => {
    const { fields } = useForm()
    expect(fields).toHaveProperty('email')
    expect(fields.email.type).toBe('email')
    expect(fields.email.required).toBe(true)
  })

  it('returns validation rules', () => {
    const { rules } = useForm()
    expect(rules).toHaveProperty('email')
    expect(rules).toHaveProperty('password')
  })

  it('validates email correctly', () => {
    const { rules } = useForm()
    const emailSchema = rules.email
    expect(emailSchema.safeParse('test@example.com').success).toBe(true)
    expect(emailSchema.safeParse('invalid-email').success).toBe(false)
  })

  it('validates password correctly', () => {
    const { rules } = useForm()
    const passwordSchema = rules.password

    // Valid password
    expect(passwordSchema.safeParse('Secure123!').success).toBe(true)

    // Too short
    expect(passwordSchema.safeParse('Sec1!').success).toBe(false)

    // No number
    expect(passwordSchema.safeParse('Secure!abc').success).toBe(false)

    // No special char
    expect(passwordSchema.safeParse('Secure123').success).toBe(false)
  })
})

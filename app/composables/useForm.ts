import { z } from 'zod'

export default function () {
  const { t } = useI18n()

  const fields = {
    confirm: {
      autocomplete: 'new-password',
      label: t('auth.confirm-password'),
      name: 'confirm',
      placeholder: 'VerySecure123!',
      required: true,
      type: 'password'
    },
    datePrecision: {
      items: [
        { label: t('date.exact'), value: 'exact' },
        { label: t('date.circa'), value: 'circa' },
        { label: t('date.before'), value: 'before' },
        { label: t('date.after'), value: 'after' }
      ] satisfies { label: string; value: Enums<'date_precision'> }[],
      label: t('date.precision'),
      name: 'datePrecision',
      type: 'select'
    },
    email: {
      autocomplete: 'username',
      label: t('auth.email'),
      name: 'email',
      placeholder: 'user@example.com',
      required: true,
      type: 'email'
    },
    gender: {
      items: [
        { label: t('person.female'), value: 'female' },
        { label: t('person.male'), value: 'male' },
        { label: t('general.unknown'), value: 'unknown' }
      ] satisfies { label: string; value: Enums<'gender'> }[],
      label: t('person.gender'),
      name: 'gender',
      type: 'select'
    },
    name: {
      autocomplete: 'name',
      label: t('person.name'),
      name: 'name',
      placeholder: 'John Doe',
      required: true,
      type: 'text'
    },
    password: {
      autocomplete: 'new-password',
      label: t('auth.password'),
      name: 'password',
      placeholder: 'VerySecure123!',
      required: true,
      type: 'password'
    },
    rememberMe: {
      label: t('auth.remember-me'),
      name: 'remember',
      type: 'checkbox'
    }
  } satisfies Record<string, DynamicFormField>

  const password = z
    .string(t('validation.required', { field: t('auth.password') }))
    .min(8, t('validation.min-length', { field: t('auth.password'), length: 8 }))
    .refine(
      (val) => /[a-z]/.test(val),
      t('validation.contains-lowercase', { field: t('auth.password') })
    )
    .refine(
      (val) => /[A-Z]/.test(val),
      t('validation.contains-uppercase', { field: t('auth.password') })
    )
    .refine(
      (val) => /[0-9]/.test(val),
      t('validation.contains-number', { field: t('auth.password') })
    )
    .refine(
      (val) => /[-._!"`'#%&,:;<>=@{}~$()*+/\\?[\]^|]+/.test(val),
      t('validation.contains-special', { field: t('auth.password') })
    )

  const rules = {
    changePassword: z
      .object({
        confirm: z.string(t('validation.required', { field: t('auth.confirm-password') })),
        password
      })
      .refine((data) => data.password === data.confirm, {
        message: t('validation.passwords-do-not-match'),
        path: ['confirm']
      }),
    datePrecision: (field: string) =>
      z.enum(
        Constants.public.Enums.date_precision,
        t('validation.enum', {
          field,
          values: Constants.public.Enums.date_precision.join(', ')
        })
      ),
    email: z.email(t('validation.invalid', { field: t('auth.email') })),
    eventRelation: z.enum(
      Constants.public.Enums.event_relation,
      t('validation.enum', {
        field: t('relation.type'),
        values: Constants.public.Enums.event_relation.join(', ')
      })
    ),
    gender: z.enum(
      Constants.public.Enums.gender,
      t('validation.enum', {
        field: t('person.gender'),
        values: Constants.public.Enums.gender.join(', ')
      })
    ),
    name: z
      .string(t('validation.required', { field: t('person.name') }))
      .min(2, t('validation.min-length', { field: t('person.name'), length: 2 })),
    password,
    personRelation: z.enum(
      Constants.public.Enums.person_relation,
      t('validation.enum', {
        field: t('relation.type'),
        values: Constants.public.Enums.person_relation.join(', ')
      })
    ),
    slug: z
      .string(t('validation.required', { field: t('general.slug') }))
      .min(2, t('validation.min-length', { field: t('general.slug'), length: 2 })),
    sourceKind: z.enum(
      Constants.public.Enums.source_kind,
      t('validation.enum', {
        field: t('source.type'),
        values: Constants.public.Enums.source_kind.join(', ')
      })
    ),
    url: (field: string) => z.url(t('validation.invalid', { field })),
    year: (field: string) =>
      z
        .int(t('validation.invalid', { field }))
        .min(-4026, t('validation.min', { field, size: -4026 }))
        .max(2025, t('validation.max', { field, size: 2025 }))
        .refine((v) => v !== 0, t('validation.not-zero', { field }))
  } as const

  return { fields, rules }
}

import type { PostgrestError } from '@supabase/supabase-js'

export const handleSupabaseError = (
  error: PostgrestError,
  statusCode: number,
  statusText: string
) => {
  throw createError({
    data: error,
    message: error.message,
    statusCode,
    statusText
  })
}

import type { PostgrestError } from '@supabase/supabase-js'

export const handleSupabaseError = (error: PostgrestError, status: number, statusText: string) => {
  throw createError({
    data: error,
    message: error.message,
    status,
    statusText
  })
}

import type { PostgrestError } from '@supabase/supabase-js'

export const supabaseService = {
  handleError: (error: PostgrestError, status: number, statusText: string) => {
    throw createError({
      message: error.message,
      status,
      statusText
    })
  }
}

import type { PostgrestError } from '@supabase/supabase-js'

export const supabaseService = {
  handleError: (error: PostgrestError, status: number, statusText: string) => {
    throw createError({
      data: error,
      message: error.message,
      statusCode: status,
      statusText
    })
  }
}

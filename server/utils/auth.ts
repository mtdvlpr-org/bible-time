import type { H3Event } from 'h3'

import { serverSupabaseUser } from '#supabase/server'

export const authService = {
  getUser: async (event: H3Event) => {
    const user = await serverSupabaseUser(event)
    if (!user) {
      throw createError({
        message: 'No user session found.',
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }

    return user
  }
}

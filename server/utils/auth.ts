import type { H3Event } from 'h3'

import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export const authService = {
  can: async (event: H3Event, requested_permission: Enums<'app_permission'>) => {
    const client = await serverSupabaseClient(event)

    const { data, error, status, statusText } = await client.rpc('authorize', {
      requested_permission
    })

    if (error) {
      throw createError({ message: error.message, status, statusText })
    } else if (!data) {
      throw createError({
        message: `You do not have permission to perform this action.`,
        status: 403,
        statusText: 'Forbidden'
      })
    }
  },
  getUser: async (event: H3Event) => {
    const user = await serverSupabaseUser(event)
    if (!user) {
      throw createError({
        message: 'No user session found.',
        status: 401,
        statusText: 'Unauthorized'
      })
    }

    return user
  }
}

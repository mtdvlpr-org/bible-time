import { serverSupabaseServiceRole } from '#supabase/server'
export default defineEventHandler(async (event) => {
  const user = await authService.getUser(event)

  const client = serverSupabaseServiceRole(event)

  const { error } = await client.auth.admin.deleteUser(user.sub, false)

  if (error) {
    throw createError({
      message: error.message,
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  setResponseStatus(event, 204)
})

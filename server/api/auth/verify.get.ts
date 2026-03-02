import { serverSupabaseClient } from '#supabase/server'
import { z } from 'zod'

const querySchema = z.object({
  redirect_to: z.url().optional(),
  token_hash: z.string().nonempty(),
  type: z.enum(['invite', 'recovery', 'email_change', 'email'])
})

/**
 * Verify OTP token for various authentication flows
 */
export default defineEventHandler(async (event) => {
  const [{ redirect_to, token_hash, type }, client] = await Promise.all([
    getValidatedQuery(event, querySchema.parse),
    serverSupabaseClient(event)
  ])

  const { error } = await client.auth.verifyOtp({ token_hash, type })

  if (error) {
    throw createError({
      message: error.message,
      status: 401,
      statusText: 'Unauthorized'
    })
  }

  const query = new URLSearchParams({ type }).toString()
  return sendRedirect(event, (redirect_to || '/') + `?${query}`)
})

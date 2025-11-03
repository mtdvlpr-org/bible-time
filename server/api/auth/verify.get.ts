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
  const { redirect_to, token_hash, type } = await getValidatedQuery(event, querySchema.parse)

  const client = await serverSupabaseClient(event)

  const { error } = await client.auth.verifyOtp({
    token_hash,
    type
  })

  if (error) {
    throw createError({
      message: error.message,
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const query = new URLSearchParams({ type }).toString()
  return sendRedirect(event, (redirect_to || '/') + `?${query}`)
})

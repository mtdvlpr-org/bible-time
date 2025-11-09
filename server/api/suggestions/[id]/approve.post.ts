import { serverSupabaseClient } from '#supabase/server'
import { z } from 'zod'

const routeSchema = z.object({
  id: z.number()
})

/**
 * Approve a requested suggestion
 */
export default defineEventHandler(async (event) => {
  await authService.can(event, 'suggestions.update')

  const [{ id }, user, client] = await Promise.all([
    getValidatedRouterParams(event, routeSchema.parse),
    authService.getUser(event),
    serverSupabaseClient(event)
  ])

  const {
    data: suggestion,
    error: fetchError,
    status: fetchStatus,
    statusText: fetchText
  } = await client
    .from('suggestions')
    .update({ reviewed_by: user.sub, status: 'approved' })
    .select('type, target_id, payload, status')
    .eq('id', id)
    .single()

  if (fetchError) supabaseService.handleError(fetchError, fetchStatus, fetchText)

  if (!suggestion) {
    throw createError({
      message: `Suggestion with ID '${id}' not found.`,
      statusCode: 404,
      statusText: 'Not Found'
    })
  }

  // TODO: Apply the suggestion's payload to the target item based on its type

  setResponseStatus(event, 204)
})

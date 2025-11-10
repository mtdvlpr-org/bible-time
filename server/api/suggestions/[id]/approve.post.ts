import type { PostgrestError } from '@supabase/supabase-js'

import { serverSupabaseClient, serverSupabaseServiceRole } from '#supabase/server'
import { z } from 'zod'

const routeSchema = z.object({
  id: z.string()
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

  const parsedId = parseInt(id)
  if (isNaN(parsedId)) {
    throw createError({
      message: `Invalid suggestion ID '${id}'.`,
      statusCode: 400,
      statusText: 'Bad Request'
    })
  }

  const {
    data: suggestion,
    error: fetchError,
    status: fetchStatus,
    statusText: fetchText
  } = await client
    .from('suggestions')
    .update({ reviewed_by: user.sub, status: 'approved' })
    .select('type, target_slug, payload, status')
    .eq('id', parsedId)
    .single()

  if (fetchError) supabaseService.handleError(fetchError, fetchStatus, fetchText)

  if (!suggestion) {
    throw createError({
      message: `Suggestion with ID '${id}' not found.`,
      statusCode: 404,
      statusText: 'Not Found'
    })
  }

  if (suggestion.type.includes('.update') && !suggestion.target_slug) {
    throw createError({
      message: `Suggestion with ID '${id}' is missing a target slug.`,
      statusCode: 400,
      statusText: 'Bad Request'
    })
  }

  let applyError: null | { error: PostgrestError; status: number; statusText: string } = null
  const serviceRole = serverSupabaseServiceRole(event)

  if (suggestion.type === 'event.create') {
    const { error, status, statusText } = await serviceRole
      .from('events')
      .insert(suggestion.payload as TablesInsert<'events'>)
    if (error) applyError = { error, status, statusText }
  } else if (suggestion.type === 'person.create') {
    const { error, status, statusText } = await serviceRole
      .from('people')
      .insert(suggestion.payload as TablesInsert<'people'>)

    if (error) applyError = { error, status, statusText }
  } else if (suggestion.type === 'event.update' && suggestion.target_slug) {
    const { error, status, statusText } = await serviceRole
      .from('events')
      .update(suggestion.payload as TablesUpdate<'events'>)
      .eq('slug', suggestion.target_slug)

    if (error) applyError = { error, status, statusText }
  } else if (suggestion.type === 'person.update' && suggestion.target_slug) {
    const { error, status, statusText } = await serviceRole
      .from('people')
      .update(suggestion.payload as TablesUpdate<'people'>)
      .eq('slug', suggestion.target_slug)

    if (error) applyError = { error, status, statusText }
  }

  if (applyError) {
    supabaseService.handleError(applyError.error, applyError.status, applyError.statusText)
  }

  setResponseStatus(event, 204)
})

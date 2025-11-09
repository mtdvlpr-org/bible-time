import { serverSupabaseServiceRole } from '#supabase/server'
import { z } from 'zod'

const routeSchema = z.object({
  slug: z.string().min(2),
  type: z.enum(['people', 'events'])
})

const bodySchema = z.object({
  description: z.string().min(2),
  locale: z.enum(Constants.public.Enums.app_lang.filter((l) => l !== 'en'))
})

/**
 * Translate an item's information
 */
export default defineEventHandler(async (event) => {
  await authService.can(event, 'translations.create')
  const { slug, type } = await getValidatedRouterParams(event, routeSchema.parse)
  const { description, locale } = await readValidatedBody(event, bodySchema.parse)

  const client = serverSupabaseServiceRole(event)

  const {
    data: item,
    error: fetchError,
    status: fetchStatus,
    statusText: fetchText
  } = await client.from(type).select('description').eq('slug', slug).single()

  if (fetchError) supabaseService.handleError(fetchError, fetchStatus, fetchText)

  if (!item) {
    throw createError({
      message: `Item with slug '${slug}' not found.`,
      statusCode: 404,
      statusText: 'Not Found'
    })
  }

  const { error, status, statusText } = await client
    .from(type)
    .update({ description: { ...(item.description ?? {}), [locale]: description } })
    .eq('slug', slug)

  if (error) supabaseService.handleError(error, status, statusText)

  setResponseStatus(event, 204)
})

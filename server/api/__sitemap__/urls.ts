import type { SitemapUrl } from '#sitemap/types'

import { serverSupabaseServiceRole } from '#supabase/server'
import { z } from 'zod'

const types = ['people', 'events'] as const

const querySchema = z.object({
  type: z.enum(types).optional()
})

/**
 * Generate sitemap URLs for items
 */
export default defineSitemapEventHandler(async (event) => {
  const { type } = await getValidatedQuery(event, querySchema.parse)

  const serviceClient = serverSupabaseServiceRole(event)

  const fetchType = async (table: (typeof types)[number]) => {
    const { data } = await serviceClient.from(table).select('slug, updated_at')
    return { data, type: table }
  }

  const apiqueries = type ? [fetchType(type)] : types.map((t) => fetchType(t))

  const results = await Promise.all(apiqueries)

  return results.flatMap(
    (result) =>
      result.data?.map(
        (item): SitemapUrl => ({
          _i18nTransform: true,
          lastmod: item.updated_at,
          loc: `/${result.type}/${item.slug}`
        })
      ) ?? []
  )
})

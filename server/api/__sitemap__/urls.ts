import type { SitemapUrl } from '#sitemap/types'

import { serverSupabaseClient } from '#supabase/server'
import { z } from 'zod'

const types = ['people', 'events'] as const

const querySchema = z.object({
  type: z.enum(types).optional()
})

export default defineSitemapEventHandler(async (event) => {
  const { type } = await getValidatedQuery(event, querySchema.parse)

  const client = await serverSupabaseClient(event)

  const fetchType = async (table: (typeof types)[number]) => {
    const { data } = await client.from(table).select('slug, updated_at')
    return { data, type: table }
  }

  const apiqueries = type ? [fetchType(type)] : [fetchType('people'), fetchType('events')]

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

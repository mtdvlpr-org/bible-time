import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const supabase = serverSupabaseServiceRole(event)

  const [profilesResult, peopleResult, eventsResult, suggestionsResult] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('people').select('*', { count: 'exact', head: true }),
    supabase.from('events').select('*', { count: 'exact', head: true }),
    supabase.from('suggestions').select('*', { count: 'exact', head: true })
  ])

  return {
    events: eventsResult.count ?? 0,
    people: peopleResult.count ?? 0,
    suggestions: suggestionsResult.count ?? 0,
    users: profilesResult.count ?? 0
  } satisfies Record<StatKey, number>
})

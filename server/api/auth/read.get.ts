export default defineEventHandler(async (event) => {
  await authService.can(event, 'users.manage')

  const config = useRuntimeConfig()
  return {
    sc: config.supabase.secretKey,
    sv: config.supabase.serviceKey
  }
})

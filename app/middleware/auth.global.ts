export default defineNuxtRouteMiddleware((to, _from) => {
  const guestRoutes = ['/auth/login', '/auth/signup', '/auth/forgot-password']
  const protectedRoutes = ['/settings/profile', '/settings/security']

  const isGuestRoute = guestRoutes.some((route) => to.path.includes(route))
  const isProtectedRoute = protectedRoutes.some((route) => to.path.includes(route))

  const session = useSupabaseSession()

  if (!session.value && isProtectedRoute) {
    // Save the intended path for redirect after login
    const redirectInfo = useSupabaseCookieRedirect()
    redirectInfo.path.value = to.fullPath

    // Redirect to login
    const localePath = useLocalePath()
    return navigateTo(localePath('/auth/login'))
  }
  // Redirect logged-in users away from guest routes
  else if (session.value && isGuestRoute) {
    const localePath = useLocalePath()
    return navigateTo(localePath('/'))
  }
})

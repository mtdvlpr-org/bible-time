import type { ButtonProps } from '@nuxt/ui'
import type { Provider } from '@supabase/supabase-js'

export default function () {
  const config = useRuntimeConfig()
  const supabase = useSupabaseClient()

  const signIn = (provider: Provider) => {
    supabase.auth.signInWithOAuth({
      options: { redirectTo: config.public.siteUrl + '/auth/confirm' },
      provider
    })
  }

  const providers = [
    {
      icon: 'i-simple-icons:google',
      label: 'Google',
      onClick: () => {
        signIn('google')
      }
    },
    {
      icon: 'i-simple-icons:github',
      label: 'GitHub',
      onClick: () => {
        signIn('github')
      }
    }
  ] satisfies ButtonProps[]

  return { providers }
}

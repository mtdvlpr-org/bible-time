type State = {
  user: null | {
    avatar_url: null | string
    display_name: string
    email: string
    id: string
  }
}

export const useUserStore = defineStore('user', {
  actions: {
    async fetch() {
      const user = useSupabaseUser()
      if (!user.value || user.value.sub === this.user?.id) return
      const supabase = useSupabaseClient()
      const {
        data: profile,
        error,
        status,
        statusText
      } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url')
        .eq('id', user.value.sub)
        .single()

      if (error) {
        supabaseService.handleError(error, status, statusText)
      } else if (profile) {
        this.user = {
          avatar_url: profile.avatar_url
            ? supabase.storage.from('avatars').getPublicUrl(profile.avatar_url).data.publicUrl
            : null,
          display_name: profile.display_name,
          email: user.value.email,
          id: profile.id
        }
      }
    },
    async signOut() {
      this.$reset()
      await useSupabaseClient().auth.signOut()
      navigateTo('/auth/login')
    },
    updateProfile(profile: Tables<'profiles'>) {
      if (!this.user) return
      this.user = {
        ...this.user,
        ...profile,
        avatar_url: profile.avatar_url
          ? useSupabaseClient().storage.from('avatars').getPublicUrl(profile.avatar_url).data
              .publicUrl +
            '?' +
            new Date().getTime()
          : null
      }
    }
  },
  persist: true,
  state: (): State => ({
    user: null
  })
})

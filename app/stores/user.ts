type State = {
  permissions: Record<Enums<'app_role'>, Enums<'app_permission'>[]>
  user: null | {
    avatar_url: null | string
    display_name: string
    email: string
    id: string
    role: Enums<'app_role'>
  }
}

export const useUserStore = defineStore('user', {
  actions: {
    can(permission: Enums<'app_permission'>) {
      if (!this.user) return false
      return this.permissions[this.user.role].includes(permission)
    },
    async fetch() {
      const user = useSupabaseUser()
      const session = useSupabaseSession()
      this.fetchPermissions(user.value?.user_role ?? 'user')
      if (!user.value || !session.value || user.value.sub === this.user?.id) return

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
        handleSupabaseError(error, status, statusText)
      } else if (profile) {
        this.user = {
          avatar_url: profile.avatar_url
            ? supabase.storage.from('avatars').getPublicUrl(profile.avatar_url).data.publicUrl
            : null,
          display_name: profile.display_name,
          email: user.value.email,
          id: profile.id,
          role: user.value.user_role ?? 'user'
        }
      }
    },
    async fetchPermissions(role: Enums<'app_role'>, refresh = false) {
      if (!refresh && this.permissions[role].length) return

      const supabase = useSupabaseClient()
      const { data } = await supabase.from('role_permissions').select('permission').eq('role', role)
      if (!data) return

      this.permissions[role] = data.map((d) => d.permission)
    },
    async signOut() {
      this.user = null
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
    permissions: {
      admin: [],
      moderator: [],
      translator: [],
      user: []
    },
    user: null
  })
})

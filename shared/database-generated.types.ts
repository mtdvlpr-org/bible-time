export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '13.0.5'
  }
  public: {
    CompositeTypes: {
      [_ in never]: never
    }
    Enums: {
      app_lang: 'en' | 'nl'
      app_permission:
        | 'events.create'
        | 'events.delete'
        | 'events.update'
        | 'people.create'
        | 'people.delete'
        | 'people.update'
        | 'suggestions.create'
        | 'suggestions.update'
        | 'users.manage'
      app_role: 'admin' | 'moderator' | 'user'
      date_precision: 'after' | 'before' | 'circa' | 'exact'
      event_relation: 'author' | 'other' | 'participant'
      gender: 'female' | 'male' | 'unknown'
      person_relation: 'contemporary' | 'other' | 'parent' | 'sibling' | 'spouse'
      source_kind: 'article' | 'book' | 'other' | 'video' | 'website'
      suggestion_status: 'approved' | 'pending' | 'rejected'
      suggestion_type:
        | 'event.create'
        | 'event.update'
        | 'person.create'
        | 'person.update'
        | 'translation.create'
        | 'translation.update'
    }
    Functions: {
      authorize: {
        Args: {
          requested_permission: Database['public']['Enums']['app_permission']
        }
        Returns: boolean
      }
      custom_access_token_hook: { Args: { event: Json }; Returns: Json }
    }
    Tables: {
      event_relations: {
        Insert: {
          created_at?: string
          event_id: number
          person_id: number
          relation_kind: Database['public']['Enums']['event_relation']
        }
        Relationships: [
          {
            columns: ['event_id']
            foreignKeyName: 'event_relations_event_id_fkey'
            isOneToOne: false
            referencedColumns: ['id']
            referencedRelation: 'events'
          },
          {
            columns: ['person_id']
            foreignKeyName: 'event_relations_person_id_fkey'
            isOneToOne: false
            referencedColumns: ['id']
            referencedRelation: 'people'
          }
        ]
        Row: {
          created_at: string
          event_id: number
          person_id: number
          relation_kind: Database['public']['Enums']['event_relation']
        }
        Update: {
          created_at?: string
          event_id?: number
          person_id?: number
          relation_kind?: Database['public']['Enums']['event_relation']
        }
      }
      events: {
        Insert: {
          aliases?: string[]
          cover_url?: null | string
          created_at?: string
          description?: Json | null
          end_precision?: Database['public']['Enums']['date_precision'] | null
          end_year?: null | number
          id?: number
          slug: string
          start_precision?: Database['public']['Enums']['date_precision'] | null
          start_year?: null | number
          title: string
          updated_at?: string
        }
        Relationships: []
        Row: {
          aliases: string[]
          cover_url: null | string
          created_at: string
          description: Json | null
          end_precision: Database['public']['Enums']['date_precision'] | null
          end_year: null | number
          id: number
          slug: string
          start_precision: Database['public']['Enums']['date_precision'] | null
          start_year: null | number
          title: string
          updated_at: string
        }
        Update: {
          aliases?: string[]
          cover_url?: null | string
          created_at?: string
          description?: Json | null
          end_precision?: Database['public']['Enums']['date_precision'] | null
          end_year?: null | number
          id?: number
          slug?: string
          start_precision?: Database['public']['Enums']['date_precision'] | null
          start_year?: null | number
          title?: string
          updated_at?: string
        }
      }
      people: {
        Insert: {
          aliases?: string[]
          avatar_url?: null | string
          birth_precision?: Database['public']['Enums']['date_precision'] | null
          birth_year?: null | number
          created_at?: string
          death_precision?: Database['public']['Enums']['date_precision'] | null
          death_year?: null | number
          description?: Json | null
          gender?: Database['public']['Enums']['gender']
          id?: number
          name: string
          slug: string
          updated_at?: string
        }
        Relationships: []
        Row: {
          aliases: string[]
          avatar_url: null | string
          birth_precision: Database['public']['Enums']['date_precision'] | null
          birth_year: null | number
          created_at: string
          death_precision: Database['public']['Enums']['date_precision'] | null
          death_year: null | number
          description: Json | null
          gender: Database['public']['Enums']['gender']
          id: number
          name: string
          slug: string
          updated_at: string
        }
        Update: {
          aliases?: string[]
          avatar_url?: null | string
          birth_precision?: Database['public']['Enums']['date_precision'] | null
          birth_year?: null | number
          created_at?: string
          death_precision?: Database['public']['Enums']['date_precision'] | null
          death_year?: null | number
          description?: Json | null
          gender?: Database['public']['Enums']['gender']
          id?: number
          name?: string
          slug?: string
          updated_at?: string
        }
      }
      person_relations: {
        Insert: {
          created_at?: string
          person_one: number
          person_two: number
          relation_kind: Database['public']['Enums']['person_relation']
        }
        Relationships: [
          {
            columns: ['person_one']
            foreignKeyName: 'person_relations_person_one_fkey'
            isOneToOne: false
            referencedColumns: ['id']
            referencedRelation: 'people'
          },
          {
            columns: ['person_two']
            foreignKeyName: 'person_relations_person_two_fkey'
            isOneToOne: false
            referencedColumns: ['id']
            referencedRelation: 'people'
          }
        ]
        Row: {
          created_at: string
          person_one: number
          person_two: number
          relation_kind: Database['public']['Enums']['person_relation']
        }
        Update: {
          created_at?: string
          person_one?: number
          person_two?: number
          relation_kind?: Database['public']['Enums']['person_relation']
        }
      }
      profiles: {
        Insert: {
          avatar_url?: null | string
          created_at?: string
          display_name: string
          id: string
        }
        Relationships: []
        Row: {
          avatar_url: null | string
          created_at: string
          display_name: string
          id: string
        }
        Update: {
          avatar_url?: null | string
          created_at?: string
          display_name?: string
          id?: string
        }
      }
      role_permissions: {
        Insert: {
          id?: number
          permission: Database['public']['Enums']['app_permission']
          role: Database['public']['Enums']['app_role']
        }
        Relationships: []
        Row: {
          id: number
          permission: Database['public']['Enums']['app_permission']
          role: Database['public']['Enums']['app_role']
        }
        Update: {
          id?: number
          permission?: Database['public']['Enums']['app_permission']
          role?: Database['public']['Enums']['app_role']
        }
      }
      suggestions: {
        Insert: {
          created_at?: string
          id?: number
          payload: Json
          reviewed_by?: null | string
          status?: Database['public']['Enums']['suggestion_status']
          target_id?: null | number
          type: Database['public']['Enums']['suggestion_type']
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            columns: ['reviewed_by']
            foreignKeyName: 'suggestions_reviewed_by_fkey'
            isOneToOne: false
            referencedColumns: ['id']
            referencedRelation: 'profiles'
          },
          {
            columns: ['user_id']
            foreignKeyName: 'suggestions_user_id_fkey'
            isOneToOne: false
            referencedColumns: ['id']
            referencedRelation: 'profiles'
          }
        ]
        Row: {
          created_at: string
          id: number
          payload: Json
          reviewed_by: null | string
          status: Database['public']['Enums']['suggestion_status']
          target_id: null | number
          type: Database['public']['Enums']['suggestion_type']
          updated_at: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          payload?: Json
          reviewed_by?: null | string
          status?: Database['public']['Enums']['suggestion_status']
          target_id?: null | number
          type?: Database['public']['Enums']['suggestion_type']
          updated_at?: string
          user_id?: string
        }
      }
      translations: {
        Insert: {
          id?: number
          key: string
          lang: Database['public']['Enums']['app_lang']
          value: string
        }
        Relationships: []
        Row: {
          id: number
          key: string
          lang: Database['public']['Enums']['app_lang']
          value: string
        }
        Update: {
          id?: number
          key?: string
          lang?: Database['public']['Enums']['app_lang']
          value?: string
        }
      }
      user_roles: {
        Insert: {
          id?: number
          role: Database['public']['Enums']['app_role']
          user_id: string
        }
        Relationships: []
        Row: {
          id: number
          role: Database['public']['Enums']['app_role']
          user_id: string
        }
        Update: {
          id?: number
          role?: Database['public']['Enums']['app_role']
          user_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
  }
}

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type Json = boolean | Json[] | null | number | string | { [key: string]: Json | undefined }

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export const Constants = {
  public: {
    Enums: {
      app_lang: ['en', 'nl'],
      app_permission: [
        'people.create',
        'people.update',
        'people.delete',
        'events.create',
        'events.update',
        'events.delete',
        'suggestions.create',
        'suggestions.update',
        'users.manage'
      ],
      app_role: ['admin', 'moderator', 'user'],
      date_precision: ['after', 'before', 'circa', 'exact'],
      event_relation: ['participant', 'author', 'other'],
      gender: ['male', 'female', 'unknown'],
      person_relation: ['parent', 'spouse', 'contemporary', 'other', 'sibling'],
      source_kind: ['book', 'article', 'website', 'video', 'other'],
      suggestion_status: ['pending', 'approved', 'rejected'],
      suggestion_type: [
        'person.create',
        'person.update',
        'event.create',
        'event.update',
        'translation.create',
        'translation.update'
      ]
    }
  }
} as const

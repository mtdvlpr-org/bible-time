export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      event_relations: {
        Row: {
          event_id: number
          person_id: number
          relation_kind: Database["public"]["Enums"]["event_relation"]
        }
        Insert: {
          event_id: number
          person_id: number
          relation_kind: Database["public"]["Enums"]["event_relation"]
        }
        Update: {
          event_id?: number
          person_id?: number
          relation_kind?: Database["public"]["Enums"]["event_relation"]
        }
        Relationships: [
          {
            foreignKeyName: "event_relations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_relations_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          aliases: string[]
          cover_url: string | null
          created_at: string
          description: Json | null
          end_precision: Database["public"]["Enums"]["date_precision"] | null
          end_year: number | null
          id: number
          slug: string
          start_precision: Database["public"]["Enums"]["date_precision"] | null
          start_year: number | null
          title: string
          updated_at: string
        }
        Insert: {
          aliases?: string[]
          cover_url?: string | null
          created_at?: string
          description?: Json | null
          end_precision?: Database["public"]["Enums"]["date_precision"] | null
          end_year?: number | null
          id?: number
          slug: string
          start_precision?: Database["public"]["Enums"]["date_precision"] | null
          start_year?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          aliases?: string[]
          cover_url?: string | null
          created_at?: string
          description?: Json | null
          end_precision?: Database["public"]["Enums"]["date_precision"] | null
          end_year?: number | null
          id?: number
          slug?: string
          start_precision?: Database["public"]["Enums"]["date_precision"] | null
          start_year?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      people: {
        Row: {
          aliases: string[]
          avatar_url: string | null
          birth_precision: Database["public"]["Enums"]["date_precision"] | null
          birth_year: number | null
          created_at: string
          death_precision: Database["public"]["Enums"]["date_precision"] | null
          death_year: number | null
          description: Json | null
          father: number | null
          gender: Database["public"]["Enums"]["gender"]
          id: number
          mother: number | null
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          aliases?: string[]
          avatar_url?: string | null
          birth_precision?: Database["public"]["Enums"]["date_precision"] | null
          birth_year?: number | null
          created_at?: string
          death_precision?: Database["public"]["Enums"]["date_precision"] | null
          death_year?: number | null
          description?: Json | null
          father?: number | null
          gender?: Database["public"]["Enums"]["gender"]
          id?: number
          mother?: number | null
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          aliases?: string[]
          avatar_url?: string | null
          birth_precision?: Database["public"]["Enums"]["date_precision"] | null
          birth_year?: number | null
          created_at?: string
          death_precision?: Database["public"]["Enums"]["date_precision"] | null
          death_year?: number | null
          description?: Json | null
          father?: number | null
          gender?: Database["public"]["Enums"]["gender"]
          id?: number
          mother?: number | null
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "people_father_fkey"
            columns: ["father"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "people_mother_fkey"
            columns: ["mother"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      person_relations: {
        Row: {
          person_one: number
          person_two: number
          relation_kind: Database["public"]["Enums"]["person_relation"]
        }
        Insert: {
          person_one: number
          person_two: number
          relation_kind: Database["public"]["Enums"]["person_relation"]
        }
        Update: {
          person_one?: number
          person_two?: number
          relation_kind?: Database["public"]["Enums"]["person_relation"]
        }
        Relationships: [
          {
            foreignKeyName: "person_relations_person_one_fkey"
            columns: ["person_one"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "person_relations_person_two_fkey"
            columns: ["person_two"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string
          id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name: string
          id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          id?: string
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          id: number
          permission: Database["public"]["Enums"]["app_permission"]
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          id?: number
          permission: Database["public"]["Enums"]["app_permission"]
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          id?: number
          permission?: Database["public"]["Enums"]["app_permission"]
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      suggestions: {
        Row: {
          created_at: string
          id: number
          payload: Json
          reviewed_by: string | null
          status: Database["public"]["Enums"]["suggestion_status"]
          target_id: number | null
          type: Database["public"]["Enums"]["suggestion_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          payload: Json
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["suggestion_status"]
          target_id?: number | null
          type: Database["public"]["Enums"]["suggestion_type"]
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: number
          payload?: Json
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["suggestion_status"]
          target_id?: number | null
          type?: Database["public"]["Enums"]["suggestion_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "suggestions_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suggestions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      translations: {
        Row: {
          id: number
          key: string
          lang: Database["public"]["Enums"]["app_lang"]
          value: string
        }
        Insert: {
          id?: number
          key: string
          lang: Database["public"]["Enums"]["app_lang"]
          value: string
        }
        Update: {
          id?: number
          key?: string
          lang?: Database["public"]["Enums"]["app_lang"]
          value?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: number
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: number
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: number
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      authorize: {
        Args: {
          requested_permission: Database["public"]["Enums"]["app_permission"]
        }
        Returns: boolean
      }
      custom_access_token_hook: { Args: { event: Json }; Returns: Json }
    }
    Enums: {
      app_lang: "en" | "nl"
      app_permission:
        | "people.create"
        | "people.update"
        | "people.delete"
        | "events.create"
        | "events.update"
        | "events.delete"
        | "suggestions.create"
        | "suggestions.update"
        | "users.manage"
      app_role: "admin" | "moderator" | "user"
      date_precision: "after" | "before" | "circa" | "exact"
      event_relation: "participant" | "author" | "other"
      gender: "male" | "female" | "unknown"
      person_relation:
        | "friend"
        | "spouse"
        | "contemporary"
        | "other"
        | "sibling"
      source_kind: "book" | "article" | "website" | "video" | "other"
      suggestion_status: "pending" | "approved" | "rejected"
      suggestion_type:
        | "person.create"
        | "person.update"
        | "event.create"
        | "event.update"
        | "translation.create"
        | "translation.update"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_lang: ["en", "nl"],
      app_permission: [
        "people.create",
        "people.update",
        "people.delete",
        "events.create",
        "events.update",
        "events.delete",
        "suggestions.create",
        "suggestions.update",
        "users.manage",
      ],
      app_role: ["admin", "moderator", "user"],
      date_precision: ["after", "before", "circa", "exact"],
      event_relation: ["participant", "author", "other"],
      gender: ["male", "female", "unknown"],
      person_relation: ["friend", "spouse", "contemporary", "other", "sibling"],
      source_kind: ["book", "article", "website", "video", "other"],
      suggestion_status: ["pending", "approved", "rejected"],
      suggestion_type: [
        "person.create",
        "person.update",
        "event.create",
        "event.update",
        "translation.create",
        "translation.update",
      ],
    },
  },
} as const

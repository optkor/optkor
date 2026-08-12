// Auto-generated from the live Supabase schema via `generate_typescript_types`.
// Regenerate after any migration: see SUPABASE_SETUP.md.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          user_id?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          budget_range: string | null
          company: string | null
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          project_type: string | null
          status: string
          subject: string | null
          timeline: string | null
        }
        Insert: {
          budget_range?: string | null
          company?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          project_type?: string | null
          status?: string
          subject?: string | null
          timeline?: string | null
        }
        Update: {
          budget_range?: string | null
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          project_type?: string | null
          status?: string
          subject?: string | null
          timeline?: string | null
        }
        Relationships: []
      }
      project_media: {
        Row: {
          alt: string | null
          caption: string | null
          created_at: string
          id: string
          project_id: string
          sort_order: number
          type: string
          url: string
        }
        Insert: {
          alt?: string | null
          caption?: string | null
          created_at?: string
          id?: string
          project_id: string
          sort_order?: number
          type: string
          url: string
        }
        Update: {
          alt?: string | null
          caption?: string | null
          created_at?: string
          id?: string
          project_id?: string
          sort_order?: number
          type?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_media_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          category: string | null
          client: string | null
          cover_image: string | null
          created_at: string
          description: string | null
          featured: boolean
          id: string
          published: boolean
          short_description: string | null
          slug: string
          sort_order: number
          title: string
          updated_at: string
          year: number | null
        }
        Insert: {
          category?: string | null
          client?: string | null
          cover_image?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean
          id?: string
          published?: boolean
          short_description?: string | null
          slug: string
          sort_order?: number
          title: string
          updated_at?: string
          year?: number | null
        }
        Update: {
          category?: string | null
          client?: string | null
          cover_image?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean
          id?: string
          published?: boolean
          short_description?: string | null
          slug?: string
          sort_order?: number
          title?: string
          updated_at?: string
          year?: number | null
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          description: string | null
          featured: boolean
          icon: string | null
          id: string
          published: boolean
          short_description: string | null
          slug: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          featured?: boolean
          icon?: string | null
          id?: string
          published?: boolean
          short_description?: string | null
          slug: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          featured?: boolean
          icon?: string | null
          id?: string
          published?: boolean
          short_description?: string | null
          slug?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          address: string | null
          company_name: string
          contact_email: string | null
          contact_phone: string | null
          homepage_config: Json
          id: boolean
          og_image: string | null
          seo_description: string | null
          seo_title: string | null
          social_links: Json
          tagline: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          company_name?: string
          contact_email?: string | null
          contact_phone?: string | null
          homepage_config?: Json
          id?: boolean
          og_image?: string | null
          seo_description?: string | null
          seo_title?: string | null
          social_links?: Json
          tagline?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          company_name?: string
          contact_email?: string | null
          contact_phone?: string | null
          homepage_config?: Json
          id?: boolean
          og_image?: string | null
          seo_description?: string | null
          seo_title?: string | null
          social_links?: Json
          tagline?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">
type DefaultSchema = DatabaseWithoutInternals["public"]

export type Tables<
  T extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"]),
> = (DefaultSchema["Tables"] & DefaultSchema["Views"])[T] extends {
  Row: infer R
}
  ? R
  : never

export type TablesInsert<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T] extends { Insert: infer I } ? I : never

export type TablesUpdate<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T] extends { Update: infer U } ? U : never

// Domain-friendly aliases used throughout the app.
export type Project = Tables<"projects">
export type ProjectInsert = TablesInsert<"projects">
export type ProjectUpdate = TablesUpdate<"projects">

export type ProjectMedia = Tables<"project_media">
export type ProjectMediaInsert = TablesInsert<"project_media">
export type ProjectMediaUpdate = TablesUpdate<"project_media">

export type Service = Tables<"services">
export type ServiceInsert = TablesInsert<"services">
export type ServiceUpdate = TablesUpdate<"services">

export type ContactMessage = Tables<"contact_messages">
export type ContactMessageInsert = TablesInsert<"contact_messages">
export type ContactMessageUpdate = TablesUpdate<"contact_messages">

export type SiteSettings = Tables<"site_settings">
export type SiteSettingsUpdate = TablesUpdate<"site_settings">

export type ProjectWithMedia = Project & { project_media: ProjectMedia[] }

export type MessageStatus = "new" | "read" | "archived"
export type MediaType = "image" | "video"

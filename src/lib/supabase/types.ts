// Generated from the live DB schema via Supabase MCP (generate_typescript_types).
// Regenerate after any schema change. Convenience row aliases live at the bottom.

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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      events: {
        Row: {
          cover_image: string | null
          created_at: string
          description: string | null
          event_date: string | null
          id: string
          location: string | null
          published: boolean
          slug: string
          sort_order: number
          title: string
          type: Database["public"]["Enums"]["event_type"]
        }
        Insert: {
          cover_image?: string | null
          created_at?: string
          description?: string | null
          event_date?: string | null
          id?: string
          location?: string | null
          published?: boolean
          slug: string
          sort_order?: number
          title: string
          type: Database["public"]["Enums"]["event_type"]
        }
        Update: {
          cover_image?: string | null
          created_at?: string
          description?: string | null
          event_date?: string | null
          id?: string
          location?: string | null
          published?: boolean
          slug?: string
          sort_order?: number
          title?: string
          type?: Database["public"]["Enums"]["event_type"]
        }
        Relationships: []
      }
      inquiries: {
        Row: {
          company: string | null
          created_at: string
          email: string
          estimated_dates: string | null
          id: string
          message: string
          model_id: string | null
          name: string
          phone: string | null
          status: Database["public"]["Enums"]["inquiry_status"]
          subject: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          estimated_dates?: string | null
          id?: string
          message: string
          model_id?: string | null
          name: string
          phone?: string | null
          status?: Database["public"]["Enums"]["inquiry_status"]
          subject?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          estimated_dates?: string | null
          id?: string
          message?: string
          model_id?: string | null
          name?: string
          phone?: string | null
          status?: Database["public"]["Enums"]["inquiry_status"]
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inquiries_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
        ]
      }
      model_applications: {
        Row: {
          age: number | null
          bust: string | null
          created_at: string
          email: string
          eyes: string | null
          gender: Database["public"]["Enums"]["application_gender"]
          hair: string | null
          height: string | null
          hips: string | null
          id: string
          instagram: string | null
          location: string | null
          message: string | null
          name: string
          phone: string
          photo_paths: Json
          shoes: string | null
          status: Database["public"]["Enums"]["application_status"]
          waist: string | null
        }
        Insert: {
          age?: number | null
          bust?: string | null
          created_at?: string
          email: string
          eyes?: string | null
          gender: Database["public"]["Enums"]["application_gender"]
          hair?: string | null
          height?: string | null
          hips?: string | null
          id?: string
          instagram?: string | null
          location?: string | null
          message?: string | null
          name: string
          phone: string
          photo_paths?: Json
          shoes?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          waist?: string | null
        }
        Update: {
          age?: number | null
          bust?: string | null
          created_at?: string
          email?: string
          eyes?: string | null
          gender?: Database["public"]["Enums"]["application_gender"]
          hair?: string | null
          height?: string | null
          hips?: string | null
          id?: string
          instagram?: string | null
          location?: string | null
          message?: string | null
          name?: string
          phone?: string
          photo_paths?: Json
          shoes?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          waist?: string | null
        }
        Relationships: []
      }
      model_gallery: {
        Row: {
          created_at: string
          id: string
          image_path: string
          model_id: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          image_path: string
          model_id: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          image_path?: string
          model_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "model_gallery_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
        ]
      }
      models: {
        Row: {
          board: string | null
          bust: string | null
          cover_image: string | null
          created_at: string
          eyes: string | null
          featured: boolean
          gender: Database["public"]["Enums"]["model_gender"]
          hair: string | null
          height: string | null
          hips: string | null
          id: string
          location: string | null
          name: string
          published: boolean
          shoes: string | null
          slug: string
          sort_order: number
          waist: string | null
        }
        Insert: {
          board?: string | null
          bust?: string | null
          cover_image?: string | null
          created_at?: string
          eyes?: string | null
          featured?: boolean
          gender: Database["public"]["Enums"]["model_gender"]
          hair?: string | null
          height?: string | null
          hips?: string | null
          id?: string
          location?: string | null
          name: string
          published?: boolean
          shoes?: string | null
          slug: string
          sort_order?: number
          waist?: string | null
        }
        Update: {
          board?: string | null
          bust?: string | null
          cover_image?: string | null
          created_at?: string
          eyes?: string | null
          featured?: boolean
          gender?: Database["public"]["Enums"]["model_gender"]
          hair?: string | null
          height?: string | null
          hips?: string | null
          id?: string
          location?: string | null
          name?: string
          published?: boolean
          shoes?: string | null
          slug?: string
          sort_order?: number
          waist?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      models_bucket_usage: {
        Args: Record<PropertyKey, never>
        Returns: { total_bytes: number; object_count: number }[]
      }
    }
    Enums: {
      application_gender: "female" | "male" | "other"
      application_status: "new" | "reviewing" | "shortlisted" | "archived"
      event_type: "flagship" | "property"
      inquiry_status: "new" | "read" | "contacted"
      model_gender: "female" | "male"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

/* ───────── Convenience aliases (hand-added) ───────── */
export type ModelRow = Database["public"]["Tables"]["models"]["Row"]
export type ModelInsert = Database["public"]["Tables"]["models"]["Insert"]
export type ModelUpdate = Database["public"]["Tables"]["models"]["Update"]
export type ModelGalleryRow = Database["public"]["Tables"]["model_gallery"]["Row"]
export type EventRow = Database["public"]["Tables"]["events"]["Row"]
export type EventInsert = Database["public"]["Tables"]["events"]["Insert"]
export type EventUpdate = Database["public"]["Tables"]["events"]["Update"]
export type InquiryRow = Database["public"]["Tables"]["inquiries"]["Row"]
export type InquiryInsert = Database["public"]["Tables"]["inquiries"]["Insert"]
export type ApplicationRow = Database["public"]["Tables"]["model_applications"]["Row"]
export type ApplicationInsert = Database["public"]["Tables"]["model_applications"]["Insert"]
export type SiteSettingRow = Database["public"]["Tables"]["site_settings"]["Row"]

export type ModelGender = Database["public"]["Enums"]["model_gender"]
export type EventType = Database["public"]["Enums"]["event_type"]
export type InquiryStatus = Database["public"]["Enums"]["inquiry_status"]
export type ApplicationStatus = Database["public"]["Enums"]["application_status"]
export type ApplicationGender = Database["public"]["Enums"]["application_gender"]

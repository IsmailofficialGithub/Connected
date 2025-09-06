// types/supabase.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      transfers: {
        Row: {
          id: string
          sender_id: string
          receiver_id: string | null
          type: 'text' | 'code' | 'file' | 'video' | 'image'
          content: string | null
          file_url: string | null
          file_name: string | null
          file_size: number | null
          status: 'pending' | 'completed' | 'failed' | 'expired'
          expires_at: string | null
          created_at: string
          updated_at: string
          session_key: string | null
          is_public: boolean
          metadata: Json | null
        }
        Insert: {
          id?: string
          sender_id: string
          receiver_id?: string | null
          type: 'text' | 'code' | 'file' | 'video' | 'image'
          content?: string | null
          file_url?: string | null
          file_name?: string | null
          file_size?: number | null
          status?: 'pending' | 'completed' | 'failed' | 'expired'
          expires_at?: string | null
          created_at?: string
          updated_at?: string
          session_key?: string | null
          is_public?: boolean
          metadata?: Json | null
        }
        Update: {
          id?: string
          sender_id?: string
          receiver_id?: string | null
          type?: 'text' | 'code' | 'file' | 'video' | 'image'
          content?: string | null
          file_url?: string | null
          file_name?: string | null
          file_size?: number | null
          status?: 'pending' | 'completed' | 'failed' | 'expired'
          expires_at?: string | null
          created_at?: string
          updated_at?: string
          session_key?: string | null
          is_public?: boolean
          metadata?: Json | null
        }
      }
      user_sessions: {
        Row: {
          id: string
          user_id: string
          session_key: string
          device_info: Json | null
          last_active: string
          created_at: string
          expires_at: string
        }
        Insert: {
          id?: string
          user_id: string
          session_key: string
          device_info?: Json | null
          last_active?: string
          created_at?: string
          expires_at: string
        }
        Update: {
          id?: string
          user_id?: string
          session_key?: string
          device_info?: Json | null
          last_active?: string
          created_at?: string
          expires_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
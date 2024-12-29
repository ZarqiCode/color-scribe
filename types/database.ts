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
      notes: {
        Row: {
          id: number
          user_id: string
          title: string
          content: string | null
          color: string
          starred: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          title: string
          content?: string | null
          color: string
          starred?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          title?: string
          content?: string | null
          color?: string
          starred?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
} 
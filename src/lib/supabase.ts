import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Client component client
export const createSupabaseClient = () => createClientComponentClient()

// Server component client
export const createSupabaseServerClient = () => createServerComponentClient({ cookies })

// Types
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          website: string | null
          location: string | null
          social_links: any
          role: 'superadmin' | 'admin' | 'author' | 'contributor' | 'editor' | 'legaleditor' | 'moderator' | 'user'
          is_active: boolean
          email_verified: boolean
          last_login: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
          location?: string | null
          social_links?: any
          role?: 'superadmin' | 'admin' | 'author' | 'contributor' | 'editor' | 'legaleditor' | 'moderator' | 'user'
          is_active?: boolean
          email_verified?: boolean
          last_login?: string | null
        }
        Update: {
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
          location?: string | null
          social_links?: any
          role?: 'superadmin' | 'admin' | 'author' | 'contributor' | 'editor' | 'legaleditor' | 'moderator' | 'user'
          is_active?: boolean
          email_verified?: boolean
          last_login?: string | null
        }
      }
      articles: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          excerpt: string | null
          featured_image: string | null
          meta_title: string | null
          meta_description: string | null
          author_id: string
          category_id: string | null
          status: 'draft' | 'pending' | 'underreview' | 'rejected' | 'approved' | 'published' | 'archived'
          is_featured: boolean
          is_trending: boolean
          is_editors_choice: boolean
          view_count: number
          like_count: number
          comment_count: number
          reading_time: number
          published_at: string | null
          approved_by: string | null
          approved_at: string | null
          rejected_by: string | null
          rejected_at: string | null
          rejection_reason: string | null
          version: number
          created_at: string
          updated_at: string
        }
      }
      journals: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          excerpt: string | null
          featured_image: string | null
          meta_title: string | null
          meta_description: string | null
          journal_type: 'blog' | 'opinion' | 'interview' | 'tips' | 'poem' | 'other'
          author_id: string
          category_id: string | null
          status: 'draft' | 'pending' | 'underreview' | 'rejected' | 'approved' | 'published' | 'archived'
          is_featured: boolean
          view_count: number
          like_count: number
          comment_count: number
          reading_time: number
          published_at: string | null
          approved_by: string | null
          approved_at: string | null
          rejected_by: string | null
          rejected_at: string | null
          rejection_reason: string | null
          version: number
          created_at: string
          updated_at: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          color: string
          icon: string | null
          parent_id: string | null
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
      }
    }
  }
}
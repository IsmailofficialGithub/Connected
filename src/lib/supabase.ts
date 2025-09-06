// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ubakfcwbswahkkzzwcnl.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVicGFrY2Z3YnN3YWhra3p6d2NubCIiLCJhY3QiOiJwdW5kaWFudCIsInJhdCI6MTczNTkzMjU4MH0.Z0S-jPxZ4VnIEeWCf0zKi5qZP4XszG-z84wDhxBUs4M"

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

export const supabaseClient = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// For server-side operations
export const supabaseAdmin = createClient<Database>(
  supabaseUrl || "https://ubakfcwbswahkkzzwcnl.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVicGFrY2Z3YnN3YWhra3p6d2NubCIiLCJhY3QiOiJzZXJ2aWNlX3JvbGUiLCJ0eXAiOiJhY2Nlc3MiLCJpYXQiOjE3MzU5MzI1ODAsIm5hbWUiOiJTdXBhYmFzZSBTRVJWSUNFIFIQidgNcnZ_yh6OEd5B9mxlKiORUQe"
  ,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)
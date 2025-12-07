import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

let supabaseClient: SupabaseClient | null = null

// Create a client-only Supabase client to avoid SSR issues
export function getSupabaseClient(): SupabaseClient {
  // Prevent creation during SSR
  if (typeof window === 'undefined') {
    throw new Error('Supabase client can only be used on the client side')
  }

  if (!supabaseClient) {
    console.log('🔧 Supabase Client Initialization (Client-side):');
    console.log('URL:', supabaseUrl);
    console.log('Key present:', !!supabaseAnonKey);

    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })

    // Test connection (only on client)
    supabaseClient.from('properties').select('count').limit(1).then(result => {
      console.log('🔗 Supabase connection test:', result.error ? 'FAILED' : 'SUCCESS');
      if (result.error) {
        console.error('Supabase error:', result.error);
      }
    })
  }

  return supabaseClient
}

// Export for server-side usage (API routes, server components)
// This is safe because it's only used in server environments
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

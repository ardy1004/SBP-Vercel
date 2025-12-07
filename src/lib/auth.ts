import type { User, Session } from '@supabase/supabase-js'

export interface AuthUser {
  id: string
  email: string
  role?: string
}

class AuthService {
  private currentUser: AuthUser | null = null
  private currentSession: Session | null = null

  // Initialize auth state
  async init() {
    // Only initialize on client side
    if (typeof window === 'undefined') {
      return null
    }

    const { getSupabaseClient } = await import('./supabase')
    const supabase = getSupabaseClient()

    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      this.currentSession = session
      this.currentUser = {
        id: session.user.id,
        email: session.user.email || '',
        role: session.user.user_metadata?.role || 'user'
      }
    }
    return this.currentUser
  }

  // Sign in with email and password
  async signIn(email: string, password: string) {
    if (typeof window === 'undefined') {
      throw new Error('Auth operations can only be performed on the client side')
    }

    const { getSupabaseClient } = await import('./supabase')
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    if (data.session && data.user) {
      this.currentSession = data.session
      this.currentUser = {
        id: data.user.id,
        email: data.user.email || '',
        role: data.user.user_metadata?.role || 'user'
      }
    }

    return this.currentUser
  }

  // Sign out
  async signOut() {
    if (typeof window === 'undefined') {
      throw new Error('Auth operations can only be performed on the client side')
    }

    const { getSupabaseClient } = await import('./supabase')
    const supabase = getSupabaseClient()

    const { error } = await supabase.auth.signOut()
    if (error) throw error

    this.currentUser = null
    this.currentSession = null
  }

  // Get current user
  getCurrentUser(): AuthUser | null {
    return this.currentUser
  }

  // Get current session
  getCurrentSession(): Session | null {
    return this.currentSession
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.currentUser && !!this.currentSession
  }

  // Check if user is admin
  isAdmin(): boolean {
    return this.currentUser?.role === 'admin'
  }

  // Listen to auth changes
  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    if (typeof window === 'undefined') {
      return // No-op on server
    }

    import('./supabase').then(({ getSupabaseClient }) => {
      const supabase = getSupabaseClient()
      supabase.auth.onAuthStateChange(async (event: any, session: Session | null) => {
        if (session?.user) {
          this.currentSession = session
          this.currentUser = {
            id: session.user.id,
            email: session.user.email || '',
            role: session.user.user_metadata?.role || 'user'
          }
        } else {
          this.currentUser = null
          this.currentSession = null
        }
        callback(this.currentUser)
      })
    })
  }
}

export const authService = new AuthService()

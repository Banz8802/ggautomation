import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const PROJECT_MEDIA_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'project-media';

/**
 * Checks whether Supabase environment variables are configured.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && (supabaseServiceRoleKey || supabaseAnonKey));
}

let serverClientInstance: SupabaseClient | null = null;

/**
 * Server-only Supabase client with elevated service privileges.
 * NEVER call or expose this client on the client-side.
 */
export function getServerSupabase(): SupabaseClient | null {
  if (!supabaseUrl) return null;

  const key = supabaseServiceRoleKey || supabaseAnonKey;
  if (!key) return null;

  if (!serverClientInstance) {
    serverClientInstance = createClient(supabaseUrl, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return serverClientInstance;
}

let publicClientInstance: SupabaseClient | null = null;

/**
 * Public Supabase client using anon key.
 */
export function getPublicSupabase(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) return null;

  if (!publicClientInstance) {
    publicClientInstance = createClient(supabaseUrl, supabaseAnonKey);
  }

  return publicClientInstance;
}

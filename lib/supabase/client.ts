import { createBrowserClient } from "@supabase/ssr";
import { readSupabaseEnv } from "@/lib/supabase/env";

/**
 * Browser Supabase client. Returns null when the public env vars are missing
 * so the site can render without a project configured.
 */
export function createClient() {
  const env = readSupabaseEnv();
  if (!env) {
    return null;
  }

  return createBrowserClient(env.url, env.anonKey);
}

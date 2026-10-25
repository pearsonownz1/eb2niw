import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { readSupabaseEnv } from "@/lib/supabase/env";

/**
 * Server Supabase client for Server Actions and Server Components.
 * Returns null when the public env vars are missing.
 */
export async function createClient() {
  const env = readSupabaseEnv();
  if (!env) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Components cannot set cookies. The waitlist insert does not
          // depend on an auth session, so a failed cookie write is safe to ignore.
        }
      },
    },
  });
}

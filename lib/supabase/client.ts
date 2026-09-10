import { createBrowserClient } from "@supabase/ssr";

/**
 * True only when both public environment variables are present.
 * The site is still able to render without them, which means a fresh Vercel
 * deployment shows a setup notice instead of a crash.
 */
export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

const FALLBACK_URL = "https://placeholder.supabase.co";
const FALLBACK_KEY = "placeholder-anon-key";

/** Browser client. Uses the public anon key only, never the service role key. */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? FALLBACK_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? FALLBACK_KEY,
  );
}

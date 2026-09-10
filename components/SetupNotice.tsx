import { isSupabaseConfigured } from "@/lib/supabase/client";

/**
 * Shown only before the two environment variables have been added in Vercel.
 * It disappears on its own once the project is connected.
 */
export function SetupNotice() {
  if (isSupabaseConfigured) return null;

  return (
    <div className="border-b border-services-ink/25 bg-services-wash">
      <p className="mx-auto max-w-wall px-4 py-2.5 text-[13.5px] leading-relaxed text-services-ink sm:px-6">
        UniShare is not connected to a database yet. Add{" "}
        <code className="font-semibold">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
        <code className="font-semibold">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in
        Vercel, then redeploy.
      </p>
    </div>
  );
}

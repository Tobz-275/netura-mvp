import { createClient } from "@supabase/supabase-js";

// Create the client ONLY when this function is called (lazy).
export function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Clear error message that tells us what is missing.
  if (!url) throw new Error("Missing env: NEXT_PUBLIC_SUPABASE_URL");
  if (!key) throw new Error("Missing env: NEXT_PUBLIC_SUPABASE_ANON_KEY");

  return createClient(url, key);
}

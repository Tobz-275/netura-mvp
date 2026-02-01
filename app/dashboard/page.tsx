"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "../../lib/supabase/client";

export default function DashboardPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    // On page load, check if there's a logged-in user
    const supabase = getSupabaseClient();

    supabase.auth.getUser().then(({ data, error }) => {
      if (error || !data.user) {
        router.push("/login");
        return;
      }
      setEmail(data.user.email ?? null);
    });
  }, [router]);

  async function logout() {
    setMsg(null);
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      setMsg(error.message);
      return;
    }

    router.push("/login");
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>Dashboard</h1>
      <p>Logged in as: {email ?? "..."}</p>

      <button onClick={logout} style={{ marginTop: 12 }}>
        Log out
      </button>

      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
    </main>
  );
}

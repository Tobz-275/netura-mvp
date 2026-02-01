"use client";
// ↑ This tells Next.js: “this file runs in the browser, not on the server”
// We need this because forms, clicks, state, and Supabase auth
// all require browser-side JavaScript.

import { useState } from "react";
// ↑ React hook for storing and updating local state (email, password, etc.)

import { useRouter } from "next/navigation";
// ↑ Next.js hook for programmatic navigation (redirecting users)

import { getSupabaseClient } from "../../lib/supabase/client";
// ↑ Our single, central Supabase client
// This already knows the project URL + anon key via env vars

export default function SignupPage() {
  // This function IS the page component for /signup

  const router = useRouter();
  // ↑ Gives us access to router.push("/somewhere")

  // -----------------------
  // FORM STATE
  // -----------------------

  const [email, setEmail] = useState("");
  // ↑ Stores whatever the user types into the email input

  const [password, setPassword] = useState("");
  // ↑ Stores whatever the user types into the password input

  const [msg, setMsg] = useState<string | null>(null);
  // ↑ Message shown to the user (errors or success)
  // null = nothing shown

  const [loading, setLoading] = useState(false);
  // ↑ Used to disable the button + show "Creating..."
  // Prevents double submissions

  // -----------------------
  // FORM SUBMIT HANDLER
  // -----------------------

  async function onSubmit(e: React.FormEvent) {
    // This runs when the form is submitted

    e.preventDefault();
    // ↑ Stops the browser doing a full page refresh

    setMsg(null);
    // ↑ Clear any old messages

    setLoading(true);
    // ↑ Disable button + show loading text

    // Call Supabase Auth to create a new user
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);
    // ↑ Re-enable the button

    if (error) {
      // If Supabase rejected the signup
      setMsg(error.message);
      return;
    }

    // If signup succeeded
    setMsg(
      "Signup ok. If email confirmation is enabled, check your inbox."
    );

    // Redirect user to the login page
    router.push("/login");
  }

  // -----------------------
  // JSX (UI)
  // -----------------------

  return (
    <main style={{ padding: 40, maxWidth: 420 }}>
      <h1>Signup</h1>

      {/* HTML form element */}
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        {/* EMAIL INPUT */}
        <input
          type="email"
          placeholder="email"
          value={email}
          // ↑ Controlled input: value comes from React state
          onChange={(e) => setEmail(e.target.value)}
          // ↑ Every keystroke updates state
          required
        />

        {/* PASSWORD INPUT */}
        <input
          type="password"
          placeholder="password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />

        {/* SUBMIT BUTTON */}
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>

      {/* MESSAGE AREA */}
      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
      {/* ↑ Only renders if msg is not null */}
    </main>
  );
}
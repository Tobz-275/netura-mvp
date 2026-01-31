'use client'
// ↑ Tells Next.js this file runs in the browser, not on the server.
// Required because we use React hooks (useState) and browser events (onClick).

import { useState } from 'react'
// ↑ React hook for storing local, temporary state (email, password, messages).

import { createClient } from '@supabase/supabase-js'
// ↑ Supabase client factory.
// This lets the browser talk to Supabase over HTTPS.

// Create a Supabase client instance
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  // ↑ URL of your Supabase project
  // Comes from environment variables (not hard-coded)

  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  // ↑ Public (anon) API key
  // Safe to use in the browser because RLS protects the data
)

// This is the page component.
// In Next.js, exporting a default function like this = a route/page.
export default function Page() {

  // Local state for the email input field
  const [email, setEmail] = useState('')
  // email → current value
  // setEmail → function to update it

  // Local state for the password input field
  const [password, setPassword] = useState('')

  // Local state for feedback messages (success or error)
  const [message, setMessage] = useState('')

  // Function that runs when the user clicks "Sign up"
  const signUp = async () => {

    // Call Supabase Auth API to create a new user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    // ↑ This sends a request from the browser → Supabase
    // Supabase handles:
    // - password hashing
    // - user creation
    // - validation
    // - returning success or error

    if (error) {
      // If Supabase rejects the signup (e.g. weak password, email exists)
      setMessage(error.message)
    } else {
      // If Supabase accepts the signup
      setMessage('User created!')
    }
  }

  // JSX returned here is what gets rendered to the browser
  return (
    <main>
      <h1>Sign up</h1>

      {/* Email input field */}
      <input
        placeholder="email"
        value={email}
        // ↑ Controlled input: value comes from React state
        onChange={(e) => setEmail(e.target.value)}
        // ↑ Update state whenever the user types
      />

      {/* Password input field */}
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* Button that triggers the signup function */}
      <button onClick={signUp}>
        Sign up
      </button>

      {/* Feedback message shown to the user */}
      <p>{message}</p>
    </main>
  )
}

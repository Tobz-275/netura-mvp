'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// Supabase client (browser-side)
// These values come from .env.local locally, and Vercel env vars in production.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Page() {
  // State = values that change as the user types / as we show messages
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  // Runs when the button is clicked
  const signUp = async () => {
    setMessage('Creating user...')

    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage(`User created: ${data.user?.id ?? 'ok'}`)
    }
  }

  // JSX = what renders on the page
  return (
    <main style={{ padding: 40 }}>
      <h1>Sign up</h1>

      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={signUp}>Sign up</button>

      <p>{message}</p>
    </main>
  )
}

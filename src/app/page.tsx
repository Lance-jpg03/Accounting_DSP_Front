'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setCookie } from "cookies-next";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:4000';

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  

  const formDisabled = loading || !username.trim() || !password.trim();

  async function handleLogin() {
    if (formDisabled) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error('Invalid username or password');
      }

      setCookie("roleFlag", String(data.roleFlag), { path: "/" });

      router.push('/dsp');
    } catch (err: any) {
      setError(err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

   return (
    <main className="login-container">
      <div className="login-box">
        <h1 className="login-title">DSP Login</h1>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="login-input"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (error) setError(null);
            }}
          />

          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError(null);
            }}
          />

          <button
            onClick={handleLogin}
            disabled={formDisabled}
            className={`login-button ${formDisabled ? 'opacity-70 cursor-not-allowed' : ''}`}
            
          >
            {loading ? 'Signing in…' : 'Login'}
          </button>

          {error && <p className="login-error">{error}</p>}
        </div>
      </div>
    </main>
  );
}
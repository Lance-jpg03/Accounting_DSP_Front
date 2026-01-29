"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000";

export default function ProjectFlashLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!username || !password || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.message || "Access Denied");
      setCookie("roleFlag", String(data.roleFlag), { path: "/" });
      router.push("/dsp");
    } catch (err: any) {
      setError(err?.message ?? "Connection Error");
    } finally {
      setLoading(false);
    }
  }

 return (
  <div className="login-page-wrapper">
    {/* Background GIFs */}
    <div
      className={`absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-700 ${
        isInitialized ? "opacity-0" : "opacity-100"
      }`}
      style={{ backgroundImage: "url('/Project Flash Login Screen.gif')" }}
    />
    <div
      className={`absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-1000 ${
        isInitialized ? "opacity-100" : "opacity-0"
      }`}
      style={{ backgroundImage: "url('/LOGIN FORM (4).gif')" }}
    />

    {/* Right Side Content */}
    <div
      className={`content-sidebar w-full md:w-[55%] ${
        isInitialized ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
      }`}
    >
      <div className="flex-grow flex items-center justify-center">
        <form onSubmit={handleLogin} className="login-form">
          
          <div className="title-container">
            <h1 className={`${poppins.className} h1-main`}>
              Project <span className="text-[#f0bb0e]">Flash</span>
            </h1>
            <p className={`${poppins.className} p-credentials`}>
              Please enter your credentials
            </p>
          </div>

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="USERNAME"
            className="form"
            disabled={loading}
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="PASSWORD"
            className="form"
            disabled={loading}
          />

          {error && <p className="text-red-500 text-[10px] text-center uppercase">{error}</p>}

          <button type="submit" className="submit" disabled={loading || !username || !password}>
            {loading ? "..." : "SIGN IN"}
          </button>
        </form>
      </div>

      <footer className="footer-copyright">
        <p className={poppins.className}>
          © 2024 Omni Play | <span className="text-gray-300">Digital Service Provider</span>
        </p>
      </footer>
    </div>

    {/* The Scanline Effect from your CSS */}
    <div className="scanline-overlay" />
  </div>
);
}
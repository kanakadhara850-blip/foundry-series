"use client";
// src/components/AdminLoginForm.jsx
import { useState } from "react";
import { loginAdmin } from "@/lib/auth";
import GlassCard from "./GlassCard";
import NeonButton from "./NeonButton";

export default function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await loginAdmin(email, password);
    } catch (err) {
      setError("Access denied. Check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <GlassCard className="w-full max-w-sm">
        <p className="font-mono text-xs uppercase tracking-widest text-neon mb-1">
          Restricted Access
        </p>
        <h1 className="font-display text-2xl text-white mb-6">Control Room Login</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field
            label="Admin Email"
            type="email"
            value={email}
            onChange={setEmail}
            autoComplete="username"
          />
          <Field
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
          />
          {error && <p className="text-danger text-xs font-mono">{error}</p>}
          <NeonButton type="submit" disabled={loading} className="w-full">
            {loading ? "Authenticating…" : "Enter Control Room"}
          </NeonButton>
        </form>
      </GlassCard>
    </main>
  );
}

function Field({ label, type, value, onChange, autoComplete }) {
  return (
    <label className="block">
      <span className="block font-mono text-[11px] uppercase tracking-widest text-white/50 mb-1.5">
        {label}
      </span>
      <input
        type={type}
        required
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-black/40 border border-white/15 focus:border-neon rounded-md px-3 py-2 text-white text-sm outline-none transition-colors"
      />
    </label>
  );
}

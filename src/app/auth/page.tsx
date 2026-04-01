"use client";

import Link from "next/link";
import { FormEvent, Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";

function AuthPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo = useMemo(() => {
    const raw = searchParams.get("redirect");
    if (!raw) return "/dashboard";
    if (!raw.startsWith("/")) return "/dashboard";
    return raw;
  }, [searchParams]);

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    try {
      if (mode === "signup") {
        if (!name.trim()) {
          throw new Error("Please enter a name or username.");
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: name.trim(),
            },
          },
        });

        if (error) throw error;

        setInfo("Sign up successful. You can now log in.");
        setMode("login");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        if (!data.session) {
          throw new Error("Login failed. Please try again.");
        }

        router.push(redirectTo);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
        <div className="text-center mb-6">
          <Link href="/" className="inline-block hover:opacity-90 transition">
            <h1 className="text-xl font-semibold text-white mb-2">
              CertificationData
            </h1>
            <p className="text-xs text-slate-400">
              Certify Your Digital Work. Because Digital Creations Deserve
              Protection.
            </p>
          </Link>
        </div>

        <div className="flex mb-4 text-sm">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 py-2 rounded-l-md border border-slate-700 ${
              mode === "login"
                ? "bg-emerald-500 text-slate-950"
                : "bg-slate-900 text-slate-300"
            }`}
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`flex-1 py-2 rounded-r-md border border-slate-700 border-l-0 ${
              mode === "signup"
                ? "bg-emerald-500 text-slate-950"
                : "bg-slate-900 text-slate-300"
            }`}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div className="text-left">
              <label className="block text-xs text-slate-300 mb-1">
                Name / Username
              </label>
              <input
                type="text"
                required={mode === "signup"}
                className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jack, Jack S., or a Nickname"
              />
            </div>
          )}

          <div className="text-left">
            <label className="block text-xs text-slate-300 mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="text-left">
            <label className="block text-xs text-slate-300 mb-1">Password</label>
            <input
              type="password"
              required
              minLength={6}
              className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-950/40 border border-red-900 rounded-md px-2 py-1">
              {error}
            </p>
          )}

          {info && (
            <p className="text-xs text-emerald-300 bg-emerald-950/40 border border-emerald-900 rounded-md px-2 py-1">
              {info}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 inline-flex items-center justify-center px-4 py-2 rounded-md bg-emerald-500 text-slate-950 text-sm font-medium hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {loading
              ? "Processing..."
              : mode === "login"
              ? "Log in"
              : "Create account"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg text-center text-sm text-slate-300">
            Loading...
          </div>
        </main>
      }
    >
      <AuthPageInner />
    </Suspense>
  );
}
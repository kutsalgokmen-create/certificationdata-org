"use client";

import { FormEvent, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

type VerifyResult = {
  certificate_code: string;
  created_at: string;
  asset_title: string;
  owner_name: string | null;
  description?: string;
};

function extractCode(raw: string): string | null {
  const trimmed = raw.trim();

  if (!trimmed) return null;

  try {
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      const url = new URL(trimmed);
      const fromQuery = url.searchParams.get("code");
      if (fromQuery?.trim()) {
        return fromQuery.trim();
      }
      const parts = url.pathname.split("/").filter(Boolean);
      const last = parts[parts.length - 1];
      return last || null;
    }
  } catch {
    // URL parse edilemezse normal kod gibi davranacağız
  }

  return trimmed;
}

function VerifyPageInner() {
  const searchParams = useSearchParams();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const autoVerifiedForCodeRef = useRef<string | null>(null);

  const verifyCertificate = useCallback(
    async (code: string, options?: { signal?: AbortSignal }) => {
      setError(null);
      setResult(null);
      setLoading(true);

      try {
        const res = await fetch(
          `/api/verify?code=${encodeURIComponent(code)}`,
          { method: "GET", signal: options?.signal }
        );

        const body = await res.json().catch(() => ({}));

        if (!res.ok) {
          if (res.status === 404) {
            throw new Error(
              "Certificate not found. Please check the code or URL."
            );
          }
          if (res.status === 400) {
            throw new Error(
              typeof body.error === "string"
                ? body.error
                : "Please enter a certificate code or URL."
            );
          }
          throw new Error(
            typeof body.error === "string"
              ? body.error
              : "Verification failed. Please try again."
          );
        }

        setResult({
          certificate_code: body.certificate_code,
          created_at: body.created_at,
          asset_title: body.asset_title,
          owner_name: body.owner_name ?? null,
          description: body.description,
        });
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        console.error(err);
        const message =
          err instanceof Error
            ? err.message
            : "Verification failed. Please try again.";
        setError(message);
      } finally {
        if (!options?.signal?.aborted) {
          setLoading(false);
        }
      }
    },
    []
  );

  const codeFromQuery =
    extractCode(searchParams.get("code") ?? "") ?? "";

  useEffect(() => {
    if (!codeFromQuery) {
      autoVerifiedForCodeRef.current = null;
      return;
    }

    setInput(codeFromQuery);

    if (autoVerifiedForCodeRef.current === codeFromQuery) {
      return;
    }
    autoVerifiedForCodeRef.current = codeFromQuery;

    const ac = new AbortController();
    void verifyCertificate(codeFromQuery, { signal: ac.signal });
    return () => ac.abort();
  }, [codeFromQuery, verifyCertificate]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);

    const code = extractCode(input);
    if (!code) {
      setError("Please enter a certificate code or URL.");
      return;
    }

    await verifyCertificate(code);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
      <div className="w-full max-w-xl px-4 py-8">
        <h1 className="text-2xl font-semibold mb-2">Verify a certificate</h1>
        <p className="text-sm text-slate-300 mb-5">
          Enter a certificate code (for example:{" "}
          <span className="font-mono text-[12px] bg-slate-900 px-1 rounded">
            CD-1234...
          </span>
          ) or paste a full certificate URL to confirm its validity.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mb-4 rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-3"
        >
          <div className="text-left">
            <label className="block text-xs text-slate-300 mb-1">
              Certificate code or URL
            </label>
            <input
              type="text"
              className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="CD-1765309... or https://certificationdata.org/verify?code=CD-..."
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-950/40 border border-red-900 rounded-md px-2 py-1">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center px-4 py-2 rounded-md bg-emerald-500 text-slate-950 text-sm font-medium hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {loading ? "Verifying..." : "Verify certificate"}
          </button>
        </form>

        {/* Sonuç kartı */}
        {result && (
          <div className="rounded-xl border border-emerald-600/70 bg-slate-900/80 p-4 text-sm">
            <p className="text-xs text-emerald-400 mb-1">
              Certificate found and valid
            </p>
            <p className="text-sm font-medium text-slate-100 mb-1">
              {result.asset_title}
            </p>

            {result.owner_name && (
              <p className="text-xs text-slate-300 mb-1">
                Certified owner:{" "}
                <span className="font-medium">{result.owner_name}</span>
              </p>
            )}
            <p className="text-[11px] text-slate-400 mb-2">
              Certificate code:{" "}
              <span className="font-mono">{result.certificate_code}</span>
            </p>
            <p className="text-[11px] text-slate-400 mb-0">
              Issued at:{" "}
              <span className="text-slate-200">
                {new Date(result.created_at).toLocaleString()}
              </span>
            </p>

            {typeof result.description === "string" &&
              result.description.trim() !== "" && (
                <div className="mt-3 border-t border-slate-700/50 pt-3">
                  <p className="text-xs text-slate-400">Description</p>
                  <p className="mt-1 text-sm text-slate-300 line-clamp-3 break-words">
                    {result.description.trim()}
                  </p>
                </div>
              )}
          </div>
        )}
      </div>
    </main>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
          <div className="w-full max-w-xl px-4 py-8 text-sm text-slate-300 text-center">
            Loading...
          </div>
        </main>
      }
    >
      <VerifyPageInner />
    </Suspense>
  );
}

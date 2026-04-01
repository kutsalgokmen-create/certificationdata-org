"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";

type VerifyResult = {
  certificate_code: string;
  created_at: string;
  asset_title: string;
  owner_name: string | null;
};

export default function VerifyPage() {
  const router = useRouter();

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function extractCode(raw: string): string | null {
    const trimmed = raw.trim();

    if (!trimmed) return null;

    // Eğer tam URL ise son segmenti çek
    try {
      if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
        const url = new URL(trimmed);
        const parts = url.pathname.split("/").filter(Boolean);
        const last = parts[parts.length - 1];
        return last || null;
      }
    } catch {
      // URL parse edilemezse normal kod gibi davranacağız
    }

    // Eğer direk kod girildiyse
    return trimmed;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);

    const code = extractCode(input);
    if (!code) {
      setError("Please enter a certificate code or URL.");
      return;
    }

    setLoading(true);

    try {
      // 1) Sertifikayı kodla bul
      const { data: cert, error: certError } = await supabase
        .from("certificates")
        .select("certificate_code, created_at, asset_id")
        .eq("certificate_code", code)
        .single();

      if (certError || !cert) {
        throw new Error("Certificate not found. Please check the code or URL.");
      }

      // 2) İlgili asset'i bul (title + owner_name)
      const { data: asset, error: assetError } = await supabase
        .from("assets")
        .select("title, owner_name")
        .eq("id", cert.asset_id)
        .single();

      if (assetError || !asset) {
        throw new Error(
          "The asset related to this certificate could not be found."
        );
      }

      setResult({
        certificate_code: cert.certificate_code,
        created_at: cert.created_at,
        asset_title: asset.title,
        owner_name: asset.owner_name ?? null,
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleOpenCertificate() {
    if (!result) return;
    router.push(
      `/certificates/${encodeURIComponent(result.certificate_code)}`
    );
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
              placeholder="CD-1765309... or https://certificationdata.org/certificates/CD-..."
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
            <p className="text-[11px] text-slate-400 mb-3">
              Issued at:{" "}
              <span className="text-slate-200">
                {new Date(result.created_at).toLocaleString()}
              </span>
            </p>

            
          </div>
        )}
      </div>
    </main>
  );
}

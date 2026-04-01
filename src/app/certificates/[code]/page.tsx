"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";
import { WatermarkPreviewRequest } from "@/app/components/WatermarkPreviewRequest";

type CertView = {
  certificate_code: string;
  created_at: string;
  asset_title: string;
  asset_description: string | null;
  asset_id: string;
  fingerprint: string;
  owner_name: string | null;
};

export default function CertificateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;

  const [data, setData] = useState<CertView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setError(null);
      setLoading(true);

      try {
        // 1) Find certificate by code
        const { data: cert, error: certError } = await supabase
          .from("certificates")
          .select("id, asset_id, certificate_code, created_at")
          .eq("certificate_code", code)
          .single();

        if (certError || !cert) {
          throw new Error("Certificate not found.");
        }

        // 2) Get the related asset (including fingerprint & owner_name)
        const { data: asset, error: assetError } = await supabase
          .from("assets")
          .select("id, title, description, fingerprint, owner_name, created_at")
          .eq("id", cert.asset_id)
          .single();

        if (assetError || !asset) {
          throw new Error("Asset related to this certificate was not found.");
        }

        setData({
          certificate_code: cert.certificate_code,
          created_at: cert.created_at,
          asset_title: asset.title,
          asset_description: asset.description ?? null,
          asset_id: asset.id,
          fingerprint: asset.fingerprint,
          owner_name: asset.owner_name ?? null,
        });
      } catch (err: any) {
        console.error(err);
        setError(
          err.message || "Unable to load this certificate. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }

    if (code) {
      load();
    }
  }, [code]);

  // NOTE: sabit baseUrl kullanıyoruz, hydration hatasını önlemek için
  const baseUrl = "https://certificationdata.org";
  const verifyUrl = `${baseUrl}/certificates/${encodeURIComponent(code)}`;

  const qrUrlSmall = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
    verifyUrl
  )}`;

  const qrUrlLarge = `https://api.qrserver.com/v1/create-qr-code/?size=512x512&data=${encodeURIComponent(
    verifyUrl
  )}`;

  function handleDownloadQr() {
    if (typeof window === "undefined") return;
    window.open(`/qr/${encodeURIComponent(code)}`, "_blank", "noopener,noreferrer");
  }

  function handleDownloadPdf() {
    window.open(`/api/certificate/pdf?code=${encodeURIComponent(code)}`, "_blank");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
      <div className="w-full max-w-4xl px-4 py-8">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-xs text-slate-400 hover:text-slate-200 mb-3"
        >
          ← Back
        </button>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg shadow-slate-950/50">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left: QR + verify info */}
            <div className="md:w-1/3 border border-slate-800 rounded-xl bg-slate-950/60 p-4 flex flex-col items-center text-center">
              <p className="text-xs text-slate-400 mb-2">
                Verification QR code
              </p>
              {loading ? (
                <div className="w-32 h-32 border border-slate-800 rounded-md bg-slate-900/60" />
              ) : error || !data ? (
                <p className="text-xs text-red-400">
                  Unable to generate QR for this certificate.
                </p>
              ) : (
                <img
                  src={qrUrlSmall}
                  alt="Certificate QR Code"
                  className="border border-slate-700 rounded-md bg-white mb-3"
                />
              )}

              <p className="text-[11px] text-slate-400 break-all">
                {verifyUrl}
              </p>
              <p className="mt-2 text-[11px] text-slate-500">
                Verified by{" "}
                <span className="text-emerald-400 font-semibold">
                  CertificationData.org
                </span>
                . Anyone scanning this code can confirm this certificate online.
              </p>

              {!loading && !error && data && (
                <button
                  type="button"
                  onClick={handleDownloadQr}
                  className="mt-3 inline-flex items-center px-3 py-1.5 rounded-md bg-emerald-500 text-slate-950 text-[11px] font-medium hover:bg-emerald-400 transition"
                >
                  Download branded QR (PNG)
                </button>
              )}
            </div>

            {/* Right: certificate info */}
            <div className="md:flex-1">
              <h1 className="text-xl font-semibold mb-1">
                Certificate details
              </h1>
              {loading ? (
                <p className="text-sm text-slate-400">
                  Loading certificate...
                </p>
              ) : error ? (
                <p className="text-sm text-red-400 bg-red-950/40 border border-red-900 rounded-md px-3 py-2">
                  {error}
                </p>
              ) : data ? (
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-[11px] text-slate-400 mb-1">
                      Certificate code
                    </p>
                    <p className="font-mono text-[12px] inline-flex items-center rounded-md bg-slate-950/80 border border-slate-700 px-2 py-1">
                      {data.certificate_code}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-400 mb-1">
                      Asset title
                    </p>
                    <p className="text-sm font-medium text-slate-100">
                      {data.asset_title}
                    </p>
                  </div>

                  {data.owner_name && (
                    <div>
                      <p className="text-[11px] text-slate-400 mb-1">
                        Certified owner
                      </p>
                      <p className="text-sm text-slate-200">
                        {data.owner_name}
                      </p>
                    </div>
                  )}

                  {data.asset_description && (
                    <div>
                      <p className="text-[11px] text-slate-400 mb-1">
                        Description
                      </p>
                      <p className="text-sm text-slate-200 whitespace-pre-line">
                        {data.asset_description}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-[11px] text-slate-400 mb-1">
                      Issued at
                    </p>
                    <p className="text-sm text-slate-200">
                      {new Date(data.created_at).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-400 mb-1">
                      File fingerprint (SHA-256)
                    </p>
                    <p className="text-[11px] text-slate-200 font-mono break-all bg-slate-950/70 border border-slate-800 rounded-md px-2 py-2">
                      {data.fingerprint}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleDownloadPdf}
                      className="inline-flex items-center px-4 py-2 rounded-md bg-emerald-500 text-slate-950 text-xs font-medium hover:bg-emerald-400 transition"
                    >
                      Download PDF certificate
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        router.push(
                          `/assets/${encodeURIComponent(data.asset_id)}`
                        )
                      }
                      className="text-xs text-emerald-400 hover:underline"
                    >
                      View asset details
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (typeof navigator !== "undefined") {
                          navigator.clipboard
                            ?.writeText(verifyUrl)
                            .catch(() => {});
                        }
                      }}
                      className="text-xs text-slate-300 hover:text-emerald-300"
                    >
                      Copy verification link
                    </button>
                  </div>

                  {/* Public archive açıklaması */}
                  <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                    <p className="text-[12px] text-slate-200 font-medium mb-1">
                      Public visibility
                    </p>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      This certificate may appear in the Public Archive with only minimal
                      information (asset title, certified owner, issue time and certificate
                      code). The file contents, download links and contact details remain
                      private to the certificate owner.
                    </p>
                  </div>

                  {/* 🔹 BURASI YENİ: Watermarked preview isteği */}
                  <WatermarkPreviewRequest
                    certificateCode={data.certificate_code}
                    assetId={data.asset_id}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

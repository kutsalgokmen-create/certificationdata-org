"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/app/lib/supabaseClient";

type CertificateItem = {
  certificate_code: string;
  created_at: string;
  asset_id: string;
  asset_title: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [items, setItems] = useState<CertificateItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [storageUsedMB, setStorageUsedMB] = useState(0);
  const [displayName, setDisplayName] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);

      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        router.push("/auth");
        return;
      }

      const user = authData.user;
      const uid = user.id;

      const metaName =
        (user.user_metadata as any)?.display_name ||
        user.email?.split("@")[0] ||
        user.email ||
        null;
      setDisplayName(metaName);

      const { data: assets, error: assetsError } = await supabase
        .from("assets")
        .select("id, title, user_id");

      if (assetsError || !assets) {
        console.error("Assets load error:", assetsError);
        setItems([]);
        setStorageUsedMB(0);
        setLoading(false);
        return;
      }

      const userAssets = assets.filter((a: any) => a.user_id === uid);
      const assetIds = userAssets.map((a: any) => a.id);

      const { data: certs, error: certError } = await supabase
        .from("certificates")
        .select("certificate_code, created_at, asset_id")
        .order("created_at", { ascending: false });

      if (certError || !certs) {
        console.error("Certificate load error:", certError);
        setItems([]);
      } else {
        const mapped: CertificateItem[] = certs
          .filter((c: any) => assetIds.includes(c.asset_id))
          .map((c: any) => {
            const asset = userAssets.find((a: any) => a.id === c.asset_id);
            return {
              certificate_code: c.certificate_code,
              created_at: c.created_at,
              asset_id: c.asset_id,
              asset_title: asset?.title || "Untitled asset",
            };
          });

        setItems(mapped);
      }

      if (assetIds.length > 0) {
        const { data: files, error: filesError } = await supabase
          .from("asset_files")
          .select("asset_id, file_size");

        if (filesError) {
          console.error("Files load error:", filesError);
          setStorageUsedMB(0);
        } else {
          const totalBytes = (files || [])
            .filter((f: any) => assetIds.includes(f.asset_id))
            .reduce((sum: number, f: any) => {
              const size = typeof f.file_size === "number" ? f.file_size : 0;
              return sum + size;
            }, 0);

          const totalMB = totalBytes / (1024 * 1024);
          setStorageUsedMB(totalMB);
        }
      } else {
        setStorageUsedMB(0);
      }

      setLoading(false);
    }

    void load();
  }, [router]);

  const storageLabel = useMemo(() => {
    return `${storageUsedMB.toFixed(1)} MB used`;
  }, [storageUsedMB]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-start justify-center">
      <div className="w-full max-w-5xl px-4 py-8">
        <div className="flex items-center justify-between mb-6 gap-4">
          <div>
            {displayName && (
              <p className="text-base text-slate-200 mb-1 font-medium">
                Hello, {displayName}
              </p>
            )}
            <h1 className="text-2xl font-semibold">
              Your Certification Dashboard
            </h1>
            <p className="text-slate-300 text-sm mt-1">
              Manage your certified assets, download your certificate files and
              check your total storage usage.
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Need a new certificate? Start by checking your file size first.
            </p>
          </div>

          <Link
            href="/dashboard/check-file-size"
            className="inline-flex items-center px-4 py-2 rounded-md bg-emerald-500 text-slate-950 text-sm font-medium hover:bg-emerald-400 transition"
          >
            + New certificate
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-[2fr,1.2fr] mb-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-slate-100">
                Storage usage
              </p>
              <p className="text-xs text-slate-300">{storageLabel}</p>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden mb-2">
              <div
                className="h-full bg-emerald-500"
                style={{ width: `${Math.min(storageUsedMB, 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500">
              This is the total size of all files you&apos;ve uploaded for
              certification across your account.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-[12px] text-slate-300">
            <p className="font-medium mb-1">How it works</p>
            <p className="mb-2">
              Start a new certificate by uploading your file size first. We will
              show the one-time certificate option you need before payment.
            </p>
            <p className="text-[11px] text-slate-500">
              After payment, continue your certificate and complete the full
              form.
            </p>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-slate-400">Loading certificates...</p>
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/60 p-6 text-sm text-slate-300 text-center">
            <p className="mb-2">You don&apos;t have any certificates yet.</p>
            <p className="text-[12px] text-slate-500 mb-4">
              Create your first certificate to see it listed here.
            </p>
            <Link
              href="/dashboard/check-file-size"
              className="inline-flex items-center px-4 py-2 rounded-md bg-emerald-500 text-slate-950 text-sm font-medium hover:bg-emerald-400 transition"
            >
              Create your first certificate
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-slate-400 mb-1">Your certificates</p>

            {items.map((item) => (
              <div
                key={item.certificate_code}
                className="rounded-lg border border-slate-800 bg-slate-900/70 px-4 py-3 hover:border-emerald-500/50 transition"
              >
                <Link
                  href={`/certificates/${encodeURIComponent(
                    item.certificate_code
                  )}`}
                  className="block"
                >
                  <p className="text-sm font-medium text-white">
                    {item.asset_title}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Certificate code:{" "}
                    <span className="font-mono text-[11px]">
                      {item.certificate_code}
                    </span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Issued:{" "}
                    <span className="text-slate-200">
                      {new Date(item.created_at).toLocaleString()}
                    </span>
                  </p>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
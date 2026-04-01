"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/app/lib/supabaseClient";
import { FREE_PLAN } from "@/app/config/freePlan";

type SingleUseCredit = {
  id: string;
  tier_id: string;
  max_bytes: number;
  price_cents: number;
  currency: string;
  is_used: boolean;
  created_at: string;
  used_at: string | null;
  source: string | null;
};

function formatMB(bytes: number) {
  return `${Math.round(bytes / (1024 * 1024))} MB`;
}

function clampPct(p: number) {
  if (!Number.isFinite(p)) return 0;
  return Math.max(0, Math.min(100, Math.round(p)));
}

export default function AccountPage() {
  // Free plan defaults (later: pull from user plan)
  const FREE_MAX_CERTS = FREE_PLAN.maxCerts;
  const FREE_MAX_BYTES = FREE_PLAN.maxBytes;

  const [usageLoading, setUsageLoading] = useState(true);
  const [usageError, setUsageError] = useState<string | null>(null);

  const [certUsed, setCertUsed] = useState(0);
  const [certLimit, setCertLimit] = useState(FREE_MAX_CERTS);

  const [storageUsedBytes, setStorageUsedBytes] = useState(0);
  const [storageLimitBytes, setStorageLimitBytes] = useState(FREE_MAX_BYTES);

  const [creditsLoading, setCreditsLoading] = useState(true);
  const [creditsError, setCreditsError] = useState<string | null>(null);
  const [credits, setCredits] = useState<SingleUseCredit[]>([]);

  const certPct = useMemo(() => {
    return certLimit > 0 ? clampPct((certUsed / certLimit) * 100) : 0;
  }, [certUsed, certLimit]);

  const storagePct = useMemo(() => {
    return storageLimitBytes > 0
      ? clampPct((storageUsedBytes / storageLimitBytes) * 100)
      : 0;
  }, [storageUsedBytes, storageLimitBytes]);

  useEffect(() => {
    async function loadUsage() {
      setUsageError(null);
      setUsageLoading(true);

      try {
        setCertLimit(FREE_MAX_CERTS);
        setStorageLimitBytes(FREE_MAX_BYTES);

        // 1) Auth
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError || !authData.user) {
          throw new Error("You must be logged in to view your account.");
        }
        const uid = authData.user.id;

        // 2) Count assets (each asset = certificate)
        const { data: userAssets, count, error: assetsCountError } = await supabase
          .from("assets")
          .select("id", { count: "exact" })
          .eq("user_id", uid);

        if (assetsCountError) throw assetsCountError;

        const usedCerts =
          typeof count === "number" ? count : userAssets?.length || 0;
        setCertUsed(usedCerts);

        // 3) Sum storage from asset_files.file_size
        let totalBytes = 0;

        if (userAssets && userAssets.length > 0) {
          const assetIds = userAssets.map((a) => a.id);

          const { data: filesData, error: filesError } = await supabase
            .from("asset_files")
            .select("file_size, asset_id")
            .in("asset_id", assetIds);

          if (filesError) throw filesError;

          totalBytes =
            filesData?.reduce((sum, f: any) => sum + (f.file_size ?? 0), 0) ?? 0;
        }

        setStorageUsedBytes(totalBytes);
      } catch (err: any) {
        setUsageError(err?.message || "Failed to load usage data.");
      } finally {
        setUsageLoading(false);
      }
    }

    async function loadCredits() {
      setCreditsError(null);
      setCreditsLoading(true);

      try {
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError || !authData.user) {
          throw new Error("You must be logged in to view your credits.");
        }
        const uid = authData.user.id;

        const { data, error } = await supabase
          .from("single_use_credits")
          .select("id,tier_id,max_bytes,price_cents,currency,is_used,created_at,used_at,source")
          .eq("user_id", uid)
          .order("created_at", { ascending: false });

        if (error) throw error;

        setCredits((data as any) || []);
      } catch (err: any) {
        setCreditsError(err?.message || "Failed to load credits.");
      } finally {
        setCreditsLoading(false);
      }
    }

    loadUsage();
    loadCredits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto w-full max-w-5xl px-4 py-10">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-white">Account</h1>
          <p className="mt-1 text-sm text-slate-400">
            Billing & usage details for your CertificationData account.
          </p>
        </div>

        {/* Current plan */}
        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <p className="text-xs text-slate-400">Current plan</p>
              <p className="mt-1 text-lg font-semibold text-white">Free</p>
              <p className="mt-1 text-sm text-slate-300">
              Includes{" "}
              <span className="font-medium">1 free certificate</span> for a file up to{" "}
              <span className="font-medium">25&nbsp;MB</span>. 
              </p>
              <p className="mt-1 text-sm text-slate-300"> 
                 When you need more, you can buy one-time Pay Per Certificate credits.
              </p>
            </div>

            <div className="flex gap-2">
              <Link
                href="/pricing"
                className="inline-flex items-center px-4 py-2 rounded-md border border-slate-700 text-slate-200 text-sm hover:border-emerald-500 hover:text-emerald-200 transition"
              >
                View pricing
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center px-4 py-2 rounded-md bg-emerald-500 text-slate-950 text-sm font-medium hover:bg-emerald-400 transition"
              >
                Upgrade
              </Link>
            </div>
          </div>

          <p className="mt-4 text-[12px] text-slate-400">
          Your existing certificates remain verifiable even if you stop using the service.
          Verification pages and QR codes continue to work.
          </p>
        </section>

        {/* Usage */}
<section className="mt-6">
  {/* Storage usage */}
  <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
    <p className="text-xs text-slate-400">Storage</p>
    <p className="mt-1 text-lg font-semibold text-white">
      {usageLoading
        ? "Loading..."
        : `${formatMB(storageUsedBytes)} used`}
    </p>
    <p className="mt-1 text-sm text-slate-300">
      Total storage used by your uploaded certified files.
    </p>

    <div className="mt-4 h-2 w-full rounded-full bg-slate-800 overflow-hidden">
      <div
        className="h-2 rounded-full bg-emerald-500"
        style={{ width: `${usageLoading ? 0 : storagePct}%` }}
      />
    </div>

    {usageError ? (
      <p className="mt-3 text-[12px] text-red-400">{usageError}</p>
    ) : (
      <p className="mt-2 text-[12px] text-slate-400">
        You can delete old assets from your dashboard to free up space.
      </p>
    )}
  </div>
</section>


        {/* Pay Per Certificate credits */}
        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-white">Pay Per Certificate credits</h2>
              <p className="mt-1 text-sm text-slate-400">
                One-time credits you can use to certify an asset beyond Free limits.
              </p>
            </div>

            <Link
              href="/pricing"
              className="inline-flex items-center px-4 py-2 rounded-md border border-slate-700 text-slate-200 text-sm hover:border-emerald-500 hover:text-emerald-200 transition"
            >
              Buy credits
            </Link>
          </div>

          {creditsLoading ? (
            <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950/40 p-4">
              <p className="text-[12px] text-slate-400">Loading credits...</p>
            </div>
          ) : creditsError ? (
            <div className="mt-4 rounded-lg border border-red-900 bg-red-950/30 p-4">
              <p className="text-[12px] text-red-400">{creditsError}</p>
            </div>
          ) : credits.length === 0 ? (
            <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950/40 p-4">
              <p className="text-[12px] text-slate-400">
                No credits yet. Purchase a Pay Per Certificate option from the Pricing page.
              </p>
            </div>
          ) : (
            <div className="mt-4 overflow-hidden rounded-lg border border-slate-800">
              <div className="grid grid-cols-5 bg-slate-950/60 px-4 py-2 text-[11px] text-slate-400">
                <div>Tier</div>
                <div>Max size</div>
                <div>Price</div>
                <div>Status</div>
                <div>Created</div>
              </div>

              <div className="divide-y divide-slate-800 bg-slate-950/30">
                {credits.slice(0, 10).map((c) => (
                  <div
                    key={c.id}
                    className="grid grid-cols-5 px-4 py-3 text-[12px] text-slate-200"
                  >
                    <div className="font-medium">{c.tier_id}</div>
                    <div className="text-slate-300">{formatMB(c.max_bytes)}</div>
                    <div className="text-slate-300">
                      ${(c.price_cents / 100).toFixed(2)} {c.currency}
                    </div>
                    <div>
  {c.is_used ? (
    <span className="inline-flex items-center rounded-md bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300">
      Used
    </span>
  ) : (
    <div className="flex items-center gap-2">
      <span className="inline-flex items-center rounded-md bg-emerald-500/20 px-2 py-0.5 text-[11px] text-emerald-200">
        Available
      </span>

      <Link
        href="/dashboard/new"
        className="text-[11px] text-emerald-400 hover:text-emerald-300 hover:underline"
      >
        Continue your certificate
      </Link>
    </div>
  )}
</div>
                    <div className="text-slate-400">
                      {new Date(c.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="mt-3 text-[12px] text-slate-400">
            Credits are applied automatically when you create a certificate that exceeds Free limits.
          </p>
        </section>

        {/* Quick links */}
        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
          <h3 className="text-sm font-semibold text-white">Quick actions</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 rounded-md border border-slate-700 text-slate-200 text-sm hover:border-emerald-500 hover:text-emerald-200 transition"
            >
              Go to dashboard
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center px-4 py-2 rounded-md border border-slate-700 text-slate-200 text-sm hover:border-emerald-500 hover:text-emerald-200 transition"
            >
              View pricing
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center px-4 py-2 rounded-md border border-slate-700 text-slate-200 text-sm hover:border-emerald-500 hover:text-emerald-200 transition"
            >
              How it works
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";
import {
  PAY_PER_CERT_TIERS_LIST,
  type PayPerCertTier,
} from "@/app/config/payPerCertificate";
import { FREE_PLAN } from "@/app/config/freePlan";

type AvailableCredit = {
  id: string;
  max_bytes: number;
  tier_id: string;
  created_at: string;
};

function formatBytes(bytes: number) {
  if (bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let index = 0;

  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }

  return `${value.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

function findRequiredTier(fileSize: number): PayPerCertTier | null {
  const sorted = [...PAY_PER_CERT_TIERS_LIST].sort(
    (a, b) => a.maxBytes - b.maxBytes
  );

  return sorted.find((tier) => fileSize <= tier.maxBytes) ?? null;
}

export default function CheckFileSizePage() {
  const router = useRouter();

  const [authChecked, setAuthChecked] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [usageLoading, setUsageLoading] = useState(false);
  const [currentCertCount, setCurrentCertCount] = useState(0);
  const [currentBytes, setCurrentBytes] = useState(0);

  const [availableCredits, setAvailableCredits] = useState<AvailableCredit[]>([]);

  useEffect(() => {
    async function init() {
      const { data: authData, error: authError } = await supabase.auth.getUser();

      if (authError || !authData.user) {
        router.push(
          `/auth?redirect=${encodeURIComponent("/dashboard/check-file-size")}`
        );
        return;
      }

      setUserId(authData.user.id);
      setAuthChecked(true);
    }

    void init();
  }, [router]);

  useEffect(() => {
    async function loadUsage() {
      if (!userId) return;

      setUsageLoading(true);

      try {
        const { data: userAssets, count, error: assetsError } = await supabase
          .from("assets")
          .select("id", { count: "exact" })
          .eq("user_id", userId);

        if (assetsError) {
          throw assetsError;
        }

        const certCount =
          typeof count === "number" ? count : userAssets?.length || 0;
        setCurrentCertCount(certCount);

        let totalBytes = 0;
        const assetIds = (userAssets || []).map((a) => a.id);

        if (assetIds.length > 0) {
          const { data: filesData, error: filesError } = await supabase
            .from("asset_files")
            .select("asset_id, file_size")
            .in("asset_id", assetIds);

          if (filesError) {
            throw filesError;
          }

          totalBytes =
            filesData?.reduce((sum, item) => {
              const size = typeof item.file_size === "number" ? item.file_size : 0;
              return sum + size;
            }, 0) ?? 0;
        }

        setCurrentBytes(totalBytes);

        const { data: creditsData, error: creditsError } = await supabase
          .from("single_use_credits")
          .select("id, max_bytes, tier_id, created_at")
          .eq("user_id", userId)
          .eq("is_used", false)
          .order("created_at", { ascending: true });

        if (creditsError) {
          throw creditsError;
        }

        setAvailableCredits((creditsData || []) as AvailableCredit[]);
      } catch (err) {
        console.error("check-file-size load error:", err);
        setError(
          "We could not check your current usage right now. Please refresh and try again."
        );
      } finally {
        setUsageLoading(false);
      }
    }

    void loadUsage();
  }, [userId]);

  const freePlanStillAvailable = useMemo(() => {
    if (!file) return false;
    const wouldExceedCertCount = currentCertCount >= FREE_PLAN.maxCerts;
    const wouldExceedStorage = currentBytes + file.size > FREE_PLAN.maxBytes;
    return !wouldExceedCertCount && !wouldExceedStorage;
  }, [file, currentBytes, currentCertCount]);

  const requiredTier = useMemo(() => {
    if (!file) return null;
    return findRequiredTier(file.size);
  }, [file]);

  const matchingAvailableCredit = useMemo(() => {
    if (!file || availableCredits.length === 0) return null;

    return (
      availableCredits.find((credit) => file.size <= credit.max_bytes) ?? null
    );
  }, [file, availableCredits]);

  const showTooLargeState = !!file && !freePlanStillAvailable && !requiredTier;

  if (!authChecked) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <p className="text-sm text-slate-300">Checking your account...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
      <div className="w-full max-w-3xl px-4 py-8">
        <div className="mb-6">
          <p className="text-[11px] text-slate-500 mb-2">Step 1 of 2</p>
          <h1 className="text-2xl font-semibold mb-2">
            Check the file size for your next certificate
          </h1>
          <p className="text-sm text-slate-300">
            Upload your file first. We will check how much storage this
            certificate needs and show only the one-time option that fits.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5">
          <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4 mb-4">
            <p className="text-sm font-medium text-slate-100 mb-1">
              What happens next?
            </p>
            <ul className="text-[12px] text-slate-300 space-y-1">
              <li>• Upload your file here to check the required size</li>
              <li>• Complete the one-time payment if needed</li>
              <li>• Continue to the certificate form and finish your certificate</li>
            </ul>
          </div>

          <div className="text-left mb-4">
            <label className="block text-xs text-slate-300 mb-1">
              Upload your file to check the required size
            </label>
            <input
              type="file"
              onChange={(e) => {
                setError(null);
                const nextFile = e.target.files?.[0] ?? null;
                setFile(nextFile);
              }}
              className="w-full text-sm text-slate-200 file:mr-3 file:rounded-md file:border-0 file:bg-emerald-500 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-slate-950 hover:file:bg-emerald-400"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              This step only checks size. You will complete the full certificate
              form after payment.
            </p>
          </div>

          {usageLoading && (
            <p className="text-xs text-slate-400 mb-3">
              Checking your available options...
            </p>
          )}

          {error && (
            <p className="text-xs text-red-400 bg-red-950/40 border border-red-900 rounded-md px-3 py-2 mb-4">
              {error}
            </p>
          )}

          {file && !usageLoading && (
            <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4">
              <p className="text-sm font-medium text-slate-100 mb-2">
                File analysis
              </p>

              <div className="grid gap-2 text-[12px] text-slate-300 mb-4">
                <p>
                  <span className="text-slate-500">File name:</span>{" "}
                  <span className="text-slate-100">{file.name}</span>
                </p>
                <p>
                  <span className="text-slate-500">File size:</span>{" "}
                  <span className="text-slate-100">{formatBytes(file.size)}</span>
                </p>
              </div>

              {matchingAvailableCredit ? (
                <div className="rounded-md border border-emerald-700 bg-emerald-950/20 p-4">
                  <p className="text-sm font-medium text-emerald-200 mb-1">
                    You already have an available one-time certificate option
                  </p>
                  <p className="text-[12px] text-emerald-100 mb-3">
                    Your existing purchase covers this file size. Continue
                    directly to the certificate form.
                  </p>

                  <Link
                    href="/dashboard/new"
                    className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-emerald-500 text-slate-950 text-sm font-medium hover:bg-emerald-400 transition"
                  >
                    Continue your certificate
                  </Link>
                </div>
              ) : freePlanStillAvailable ? (
                <div className="rounded-md border border-emerald-700 bg-emerald-950/20 p-4">
                  <p className="text-sm font-medium text-emerald-200 mb-1">
                    Your free certificate can still cover this file
                  </p>
                  <p className="text-[12px] text-emerald-100 mb-3">
                    You can continue without payment and complete your
                    certificate form now.
                  </p>

                  <Link
                    href="/dashboard/new"
                    className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-emerald-500 text-slate-950 text-sm font-medium hover:bg-emerald-400 transition"
                  >
                    Continue your certificate
                  </Link>
                </div>
              ) : showTooLargeState ? (
                <div className="rounded-md border border-red-900 bg-red-950/20 p-4">
                  <p className="text-sm font-medium text-red-300 mb-1">
                    This file is larger than our current standard options
                  </p>
                  <p className="text-[12px] text-red-200 mb-3">
                    Your file is bigger than 1 GB. Please contact us for a
                    custom certificate setup.
                  </p>

                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-red-700 text-red-200 text-sm font-medium hover:bg-red-950/40 transition"
                  >
                    Contact us
                  </Link>
                </div>
              ) : requiredTier ? (
                <div className="rounded-md border border-slate-700 bg-slate-900/60 p-4">
                  <p className="text-sm font-medium text-slate-100 mb-1">
                    Required one-time certificate option
                  </p>
                  <p className="text-[12px] text-slate-300 mb-3">
                    This file needs the{" "}
                    <span className="text-white font-medium">
                      {requiredTier.label}
                    </span>{" "}
                    certificate option.
                  </p>

                  <div className="flex flex-col gap-3 rounded-lg border border-slate-800 bg-slate-950/40 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-white">
                          {requiredTier.label} per certificate
                        </p>
                        <p className="text-[12px] text-slate-400 mt-1">
                          One-time payment for one certificate up to{" "}
                          {requiredTier.label}.
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-semibold text-emerald-300">
                          ${requiredTier.priceUsd.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`/checkout/pay-per-certificate?tier=${encodeURIComponent(
                        requiredTier.id
                      )}&source=file_size_check`}
                      className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-emerald-500 text-slate-950 text-sm font-medium hover:bg-emerald-400 transition"
                    >
                      Continue to secure payment
                    </Link>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          <div className="mt-4">
            <Link
              href="/dashboard"
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              ← Back to dashboard
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
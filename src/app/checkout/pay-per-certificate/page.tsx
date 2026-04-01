"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";
import {
  getPayPerCertTier,
  type PayPerCertTier,
} from "@/app/config/payPerCertificate";

function CheckoutInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [tier, setTier] = useState<PayPerCertTier | null>(null);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function init() {
      setLoading(true);
      setError(null);

      const tierId = searchParams.get("tier");
      const source = searchParams.get("source") || "pricing";

      const tierInfo = getPayPerCertTier(tierId);
      if (!tierInfo) {
        setError("Invalid or missing tier. Please go back to the Pricing page.");
        setLoading(false);
        return;
      }

      setTier(tierInfo);

      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData.user) {
        router.push(
          `/auth?redirect=${encodeURIComponent(
            `/checkout/pay-per-certificate?tier=${encodeURIComponent(
              tierInfo.id
            )}&source=${encodeURIComponent(source)}`
          )}`
        );
        return;
      }

      setUserEmail(authData.user.email ?? null);
      setLoading(false);
    }

    void init();
  }, [searchParams, router]);

  async function handleCheckout() {
    if (!tier) return;

    setSubmitting(true);
    setError(null);

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        throw new Error("You need to be signed in to complete this purchase.");
      }

      const source = searchParams.get("source") || "pricing";

      const response = await fetch("/api/pay-per-certificate/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          tierId: tier.id,
          source,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result?.checkoutUrl) {
        throw new Error(
          result?.error || "Could not create Stripe Checkout session."
        );
      }

      window.location.href = result.checkoutUrl;
    } catch (err: any) {
      console.error(err);
      setError(
        err?.message ||
          "Something went wrong during checkout. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <p className="text-sm text-slate-300">Preparing your checkout...</p>
      </main>
    );
  }

  if (error && !tier) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="max-w-md px-4 py-6 border border-slate-800 rounded-xl bg-slate-900/80">
          <p className="text-sm text-red-400 mb-3">
            {error || "Something went wrong."}
          </p>
          <button
            onClick={() => router.push("/pricing")}
            className="text-xs text-emerald-400 hover:underline"
          >
            Go back to Pricing
          </button>
        </div>
      </main>
    );
  }

  if (!tier) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <p className="text-sm text-red-400">Missing tier information.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
      <div className="w-full max-w-md px-4 py-6 border border-slate-800 rounded-xl bg-slate-900/80">
        <h1 className="text-xl font-semibold mb-2">Pay Per Certificate</h1>

        <button
          type="button"
          disabled={submitting}
          onClick={handleCheckout}
          className="w-full inline-flex items-center justify-center px-4 py-2 rounded-md bg-emerald-500 text-slate-950 text-sm font-medium hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed transition mt-4"
        >
          {submitting
            ? "Redirecting..."
            : `Continue — $${tier.priceUsd.toFixed(2)}`}
        </button>
      </div>
    </main>
  );
}

export default function PayPerCertificateCheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutInner />
    </Suspense>
  );
}
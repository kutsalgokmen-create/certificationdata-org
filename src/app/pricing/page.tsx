import Link from "next/link";
import {
  PAY_PER_CERT_TIERS_LIST,
  PayPerCertTier,
} from "@/app/config/payPerCertificate";
import { FREE_PLAN } from "@/app/config/freePlan";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-8 max-w-3xl mx-auto">
          <h1 className="text-3xl font-semibold mb-2">Pricing</h1>
          <p className="text-sm text-slate-300 mb-2">
            Start with a free certificate. When you need more, choose a
            one-time per-certificate option with storage included.
          </p>
          <p className="text-[11px] text-slate-500">
            No subscriptions. You only pay when you issue a new certificate
            that needs more storage.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-slate-100 mb-1 text-center md:text-left">
              Choose what fits your next certificate
            </p>
            <p className="text-[12px] text-slate-400 max-w-3xl text-center md:text-left mx-auto md:mx-0">
              All options are one-time payments for a single certificate. Every
              certificate includes a timestamped cryptographic fingerprint, PDF
              certificate and public verification page.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {/* Free plan – ilk kart */}
            <div className="rounded-2xl border border-emerald-500 bg-slate-900/90 p-4 flex flex-col">
              <div className="flex items-center justify-between gap-3 mb-2">
                <h2 className="text-sm font-semibold text-emerald-300">
                  Free — First certificate
                </h2>
                <span className="inline-flex items-center rounded-full border border-emerald-500/60 bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-200">
                  Best place to start
                </span>
              </div>

              <p className="text-3xl font-bold mb-1">$0</p>
              <p className="text-[12px] text-slate-300 mb-3">
                Create and test your first real certificate without any
                payment.
              </p>

              <ul className="text-[12px] text-slate-200 space-y-1 flex-1">
                <li>●{FREE_PLAN.maxCerts} certificate included</li>
                <li>●Up to {Math.round(FREE_PLAN.maxBytes / (1024 * 1024))} MB storage</li>
                <li>● SHA-256 fingerprint & timestamp</li>
                <li>● Digital PDF certificate</li>
                <li>● Verification page with QR code</li>
                <li>● Public verification via code or QR</li>
                <li>● Personal or commercial use</li>
              </ul>

              <Link
                href="/dashboard/new"
                className="mt-4 inline-flex items-center justify-center px-4 py-2 rounded-md bg-emerald-500 text-slate-950 text-xs font-medium hover:bg-emerald-400 transition"
              >
                Create your free certificate
              </Link>

              <p className="mt-2 text-[11px] text-slate-500">
                Perfect if you only need to certify one important work or want
                to see how CertificationData fits your workflow.
              </p>
            </div>

            {/* 7 adet ücretli tier – config'ten geliyor */}
            {PAY_PER_CERT_TIERS_LIST.map((tier: PayPerCertTier) => (
              <div
                key={tier.id}
                className={`rounded-2xl border bg-slate-900/80 p-4 flex flex-col ${
                  tier.recommended
                    ? "border-emerald-500 shadow-lg shadow-emerald-500/20"
                    : "border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="text-sm font-semibold text-slate-50">
                    {tier.label} per certificate
                  </h3>
                  {tier.recommended && (
                    <span className="inline-flex items-center rounded-full bg-emerald-500/10 border border-emerald-400 px-2 py-0.5 text-[10px] text-emerald-200">
                      Most common choice
                    </span>
                  )}
                </div>

                <p className="text-2xl font-bold mb-1">
                  ${tier.priceUsd.toFixed(2)}
                </p>
                <p className="text-[12px] text-slate-300 mb-3">
                  Storage included up to {tier.label} for this certificate.
                </p>

                <ul className="text-[12px] text-slate-300 space-y-1 flex-1">
                  <li>● One-time payment for 1 certificate</li>
                  <li>● Storage up to {tier.label} for that asset</li>
                  <li>● SHA-256 fingerprint & timestamp</li>
                  <li>● PDF certificate + QR code</li>
                  <li>● Public verification via link or code</li>
                </ul>

                <Link
                  href={`/checkout/pay-per-certificate?tier=${encodeURIComponent(
                    tier.id
                  )}&source=pricing`}
                  className="mt-4 inline-flex items-center justify-center px-3 py-2 rounded-md bg-emerald-500 text-slate-950 text-xs font-medium hover:bg-emerald-400 transition"
                >
                  Choose {tier.label} option
                </Link>

                <p className="mt-2 text-[11px] text-slate-500">
                  Ideal when you know the approximate size of the file you want
                  to certify.
                </p>
              </div>
            ))}

            {/* High-volume custom option – 1 GB üstü */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 flex flex-col">
              <div className="flex items-center justify-between gap-2 mb-2">
                <h3 className="text-sm font-semibold text-slate-50">
                  Need more than 1 GB?
                </h3>
                <span className="inline-flex items-center rounded-full bg-slate-800/80 border border-slate-700 px-2 py-0.5 text-[10px] text-slate-300">
                  Custom volume
                </span>
              </div>

              <p className="text-2xl font-bold mb-1">Let&apos;s talk</p>
              <p className="text-[12px] text-slate-300 mb-3">
                For studios, platforms or archives that need much larger
                storage per certificate or special legal/operational
                arrangements.
              </p>

              <ul className="text-[12px] text-slate-300 space-y-1 flex-1">
                <li>● Custom storage limits</li>
                <li>● Multiple certificates or collections</li>
                <li>● Tailored documentation &amp; process</li>
                <li>● Priority support and guidance</li>
              </ul>

              <Link
                href="/contact"
                className="mt-4 inline-flex items-center justify-center px-3 py-2 rounded-md border border-emerald-500/70 text-emerald-200 text-xs font-medium hover:bg-emerald-500/10 hover:border-emerald-400 transition"
              >
                Contact us for a custom offer
              </Link>

              <p className="mt-2 text-[11px] text-slate-500">
                Tell us about your use case, file sizes and volume. We&apos;ll
                propose a storage and certification setup that fits.
              </p>
            </div>
          </div>

          {/* Billing explanation */}
          <div className="mt-2 rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-[11px] text-slate-400">
            <p className="mb-1 text-slate-200 font-medium">
              How billing works
            </p>
            <p className="mb-1">
              You pay once for each per-certificate option you choose. There
              are no subscriptions or automatic renewals — you only pay again
              when you decide to certify another asset that needs storage.
            </p>
            <p>
              Certificate records (fingerprint, timestamp, owner and
              verification link) are designed to be long-term and independent
              from your payment schedule.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

// src/app/pay-per-certificate/cancel/page.tsx
import Link from "next/link";

export default function PayPerCertificateCancelPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
      <div className="w-full max-w-md px-4 py-6 border border-slate-800 rounded-xl bg-slate-900/80">
        <h1 className="text-xl font-semibold mb-2">Payment canceled</h1>
        <p className="text-sm text-slate-300 mb-4">
          Your payment was not completed. No charge was recorded and no credit was added.
        </p>

        <Link
          href="/pricing"
          className="w-full inline-flex items-center justify-center px-4 py-2 rounded-md bg-emerald-500 text-slate-950 text-sm font-medium hover:bg-emerald-400 transition"
        >
          Back to pricing
        </Link>
      </div>
    </main>
  );
}
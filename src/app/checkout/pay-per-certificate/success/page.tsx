import Link from "next/link";

export default function PayPerCertificateSuccessPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
      <div className="w-full max-w-md px-4 py-6 border border-slate-800 rounded-xl bg-slate-900/80">
        <p className="text-[11px] text-slate-500 mb-2">Payment completed</p>

        <h1 className="text-xl font-semibold mb-2">Continue your certificate</h1>

        <p className="text-sm text-slate-300 mb-4">
          Your one-time certificate option was added successfully. Continue to
          the certificate form to complete your certificate.
        </p>

        <div className="border border-slate-800 rounded-lg p-3 mb-4 text-[12px] text-slate-300 bg-slate-950/40">
          After payment, you can continue directly with the certificate form.
          If your file matches the purchased option, it will be applied
          automatically.
        </div>

        <Link
          href="/dashboard/new"
          className="w-full inline-flex items-center justify-center px-4 py-2 rounded-md bg-emerald-500 text-slate-950 text-sm font-medium hover:bg-emerald-400 transition"
        >
          Continue your certificate
        </Link>
      </div>
    </main>
  );
}
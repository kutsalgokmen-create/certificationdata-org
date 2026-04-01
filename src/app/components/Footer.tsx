import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/95">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <img
              src="/logo.png"
              alt="CertificationData logo"
              className="h-9 w-9 rounded-md border border-slate-700 bg-slate-900 object-contain"
            />
            <div className="leading-tight">
              <p className="text-sm font-semibold text-slate-100">
                CertificationData.org
              </p>
              <p className="text-xs text-slate-500">Certify your digital work</p>
            </div>
          </div>

          <p className="text-xs text-slate-400 max-w-sm">
            Create verifiable certificates for your digital assets with a cryptographic
            fingerprint, timestamp, and QR verification.
          </p>

          <p className="mt-4 text-[11px] text-slate-500">
            © {new Date().getFullYear()} CertificationData. All rights reserved.
          </p>
        </div>

        {/* Product */}
        <div>
          <p className="text-xs font-semibold text-slate-200 mb-3">Product</p>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/pricing" className="text-slate-400 hover:text-emerald-300 transition">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/how-it-works" className="text-slate-400 hover:text-emerald-300 transition">
                How It Works
              </Link>
            </li>
            <li>
              <Link href="/verify" className="text-slate-400 hover:text-emerald-300 transition">
                Verify Certificate
              </Link>
            </li>
            <li>
            <Link
              href="/archive"
              className="text-slate-400 hover:text-emerald-300 transition"
                >
                Public Archive
            </Link>
            </li>
          </ul>
        </div>

        {/* Support + Legal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <p className="text-xs font-semibold text-slate-200 mb-3">Support</p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/support" className="text-slate-400 hover:text-emerald-300 transition">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-slate-400 hover:text-emerald-300 transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-emerald-300 transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-400 hover:text-emerald-300 transition">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-200 mb-3">Legal</p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/legal/terms" className="text-slate-400 hover:text-emerald-300 transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="text-slate-400 hover:text-emerald-300 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/refunds"
                  className="text-slate-400 hover:text-emerald-300 transition"
                >
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/disputes"
                  className="text-slate-400 hover:text-emerald-300 transition"
                >
                  Dispute Resolution
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* tiny bottom line */}
      <div className="border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-4 text-[11px] text-slate-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <span>
            Certificates provide verifiable proof of existence and ownership records on
            CertificationData.
          </span>
          <span className="text-slate-600">
            Need help?{" "}
            <Link href="/contact" className="text-slate-400 hover:text-emerald-300 transition">
              Contact support
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}

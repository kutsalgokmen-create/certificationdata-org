import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero section */}
      <section className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        {/* Soft glow background */}
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-500 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-64 w-64 translate-x-1/3 translate-y-1/3 rounded-full bg-cyan-500 blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 pt-16 pb-20 flex flex-col items-center text-center">
          {/* Logo */}
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900/80 border border-emerald-500/60 shadow-lg shadow-emerald-500/20">
              <img
                src="/logo.png"
                alt="CertificationData logo"
                className="w-full h-full object-contain p-2"
              />
            </div>
            <div className="text-left">
              <p className="text-[11px] tracking-wide uppercase text-emerald-400">
                CertificationData
              </p>
              <p className="text-xs text-slate-300">
                Digital asset certification for the AI era
              </p>
            </div>
          </div>

          {/* Heading & subtitle */}
          <h1 className="text-3xl md:text-4xl font-semibold mb-3">
            Certify your digital creations.
            <span className="block text-emerald-400">
              Instantly. Cryptographically. Verifiably.
            </span>
          </h1>

          <p className="max-w-2xl text-sm md:text-base text-slate-300 mb-6">
            Upload your file, get a timestamped cryptographic fingerprint, a
            tamper-proof PDF certificate and a public verification page with QR
            code. No complex legal steps, no blockchain jargon.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <Link
              href="/auth"
              className="inline-flex items-center px-5 py-2.5 rounded-md bg-emerald-500 text-slate-950 text-sm font-medium hover:bg-emerald-400 transition shadow shadow-emerald-500/30"
            >
              Create your first certificate
            </Link>

            {/* New button → .com personal QR site */}
            <Link
              href="https://certificationdata.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2.5 rounded-md border border-slate-700 text-sm text-slate-200 hover:border-emerald-500 hover:text-emerald-300 transition"
            >
              Get a personal QR tag
            </Link>
          </div>

          <p className="text-[11px] text-slate-500">
            No subscription required. Start with{" "}
            <span className="text-slate-300 font-medium">
              one free certificate (up to 25&nbsp;MB)
            </span>
            , then use simple one-time options whenever you need more, or use a
            personal QR tag for your real-world belongings.
          </p>
        </div>
      </section>

      {/* Features section – digital certificate product */}
      <section className="max-w-5xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold mb-2">
            What does CertificationData give you?
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            Behind the scenes we combine cryptography, structured storage and
            verifiable links so you can prove
            <span className="block mt-1 text-slate-200">
              “I created this digital work at this time.”
            </span>
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {/* Feature 1 */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-xs font-semibold text-emerald-400 mb-1">
              1. Cryptographic fingerprint
            </p>
            <h3 className="text-sm font-medium mb-2">
              SHA-256 hash of your file
            </h3>
            <p className="text-xs text-slate-300 mb-2">
              We never need to know the content of your file. We compute a
              one-way SHA-256 fingerprint that uniquely represents your asset
              without exposing the original.
            </p>
            <p className="text-[11px] text-slate-500">
              If someone modifies the file even slightly, the fingerprint
              changes completely.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-xs font-semibold text-emerald-400 mb-1">
              2. Timestamped certificate
            </p>
            <h3 className="text-sm font-medium mb-2">
              PDF certificate with all key details
            </h3>
            <p className="text-xs text-slate-300 mb-2">
              For every certified asset, you receive a signed PDF certificate
              containing the asset title, fingerprint, issue time, and a unique
              certificate code.
            </p>
            <p className="text-[11px] text-slate-500">
              You can send this PDF to clients, store it with your contracts or
              use it in legal discussions.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-xs font-semibold text-emerald-400 mb-1">
              3. Public verification page
            </p>
            <h3 className="text-sm font-medium mb-2">
              QR code and shareable URL
            </h3>
            <p className="text-xs text-slate-300 mb-2">
              Each certificate has a verification page with a QR code and a
              public URL. Anyone you share it with can independently confirm the
              certificate details.
            </p>
            <p className="text-[11px] text-slate-500">
              Perfect for portfolios, releases, licensing and provenance proof.
            </p>
          </div>

          {/* Feature 4 – NEW: Optional watermarked preview */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-xs font-semibold text-emerald-400 mb-1">
              4. Optional watermarked preview
            </p>
            <h3 className="text-sm font-medium mb-2">
              Branded preview files you can show publicly
            </h3>
            <p className="text-xs text-slate-300 mb-2">
              After certification, you can request a manually prepared,
              watermarked preview (for images and PDFs ) that is safe to
              share with clients, platforms or social media.
            </p>
            <p className="text-[11px] text-slate-500">
              Video, Music and 3D model projects use alternative preview formats
              (lyrics/description PDFs or rendered images), while your original
              certified file stays private.
            </p>
          </div>
        </div>
      </section>

      {/* Personal QR tags section – new product teaser */}
      <section className="border-t border-slate-800 bg-slate-950/80">
        <div className="max-w-5xl mx-auto px-4 py-10 grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold mb-2">
              Personal QR tags for the real world
            </h2>
            <p className="text-sm text-slate-300 mb-3 leading-relaxed">
              CertificationData.com will offer a simple “lost &amp; found” QR
              tag for your daily life. You buy one personal QR code, print or
              stick it on your items, and choose how people can contact you.
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">
              If someone finds your pet, phone, wallet or luggage, they scan the
              QR and see the contact method you defined – email, phone, social
              handle or a private message form.
            </p>

            <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-300">
              <span className="inline-flex items-center rounded-full border border-slate-700 px-3 py-1 text-[12px]">
                Pets &amp; collars
              </span>
              <span className="inline-flex items-center rounded-full border border-slate-700 px-3 py-1 text-[12px]">
                Phones, bags &amp; wallets
              </span>
              <span className="inline-flex items-center rounded-full border border-slate-700 px-3 py-1 text-[12px]">
                Travel luggage &amp; tags
              </span>
              <span className="inline-flex items-center rounded-full border border-slate-700 px-3 py-1 text-[12px]">
                Kids &amp; memory care patients
              </span>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <Link
                href="https://certificationdata.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 rounded-md bg-emerald-500 text-slate-950 text-sm font-medium hover:bg-emerald-400 transition"
              >
                Learn more about personal QR tags →
              </Link>
              <p className="text-[11px] text-slate-500 max-w-xs">
                Separate service at CertificationData.com — focused only on
                personal QR codes and lost &amp; found scenarios.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-sm text-slate-300 space-y-2">
            <p className="text-xs font-semibold text-emerald-400">
              Example use cases
            </p>
            <ul className="space-y-2 text-sm text-slate-300 leading-relaxed">
              <li>• Attach to your pet’s collar for instant recovery.</li>
              <li>• Add to your phone, wallet or backpack for easy return.</li>
              <li>• Use on luggage during international travel.</li>
              <li>• Create safety tags for children at public events.</li>
              <li>• Mark laptops, tablets or professional equipment.</li>
              <li>• Tag drones and accessories for quick identification.</li>
              <li>• Place on passport covers for emergency contact.</li>
              <li>
                • Provide discreet support for Alzheimer/dementia patients.
              </li>
              <li>• Attach to car keys and keychains.</li>
              <li>• Use on motorcycle helmets or protective gear.</li>
              <li>• Add to personal belongings such as bags or instruments.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Public Archive section (stays as is) */}
      <section className="border-t border-slate-800 bg-slate-950/70">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="max-w-3xl">
            <h2 className="text-xl font-semibold mb-2">
              Public Archive of Certified Works
            </h2>

            <p className="text-sm text-slate-300 mb-4 leading-relaxed">
              The Public Archive is a minimal, open list of certificates issued
              on CertificationData.org. It does not sell your products and does
              not show any contact details or file contents.
            </p>

            <p className="text-sm text-slate-300 mb-4 leading-relaxed">
              Each entry shows only the asset title, the certified owner&apos;s
              name, the issue time and the certificate code, so anyone can
              confirm that a work has been certified without revealing the full
              asset.
            </p>

            <ul className="space-y-2 text-sm text-slate-300 mb-5">
              <li className="flex gap-2">
                <span className="text-emerald-400">•</span>
                <span>
                  Provide public proof that your digital work has been
                  certified, without exposing the file itself.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-400">•</span>
                <span>
                  Use certificate codes in contracts, releases or licensing
                  agreements and let others confirm them via the archive.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-400">•</span>
                <span>
                  Your verification pages remain accessible via direct link or
                  QR code even if people don&apos;t browse the archive.
                </span>
              </li>
            </ul>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/archive"
                className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-emerald-500 text-slate-950 text-sm font-medium hover:bg-emerald-400 transition"
              >
                Browse the Public Archive →
              </Link>

              <p className="text-[11px] text-slate-500 sm:self-center">
                Only minimal metadata is visible. Asset files and contact
                details remain private to the certificate owner.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

import Link from "next/link";

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="max-w-4xl mx-auto px-4 py-10">
        {/* Başlık */}
        <header className="mb-8">
          <p className="text-[11px] uppercase tracking-wide text-emerald-400 mb-1">
            Process overview
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold mb-2">
            How CertificationData works
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl">
            CertificationData is built for creators, freelancers and companies who
            want a simple way to prove:{" "}
            <span className="text-slate-100 font-medium">
              &quot;I created this digital work at this time, under this name.&quot;
            </span>
          </p>
        </header>

        {/* 3 adım – zaman çizelgesi */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-3">The 3–step flow</h2>

          <div className="space-y-5">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="h-7 w-7 rounded-full bg-emerald-500 text-slate-950 text-xs font-bold flex items-center justify-center">
                  1
                </div>
                <div className="flex-1 w-px bg-slate-700 mt-1" />
              </div>
              <div>
                <p className="text-xs text-emerald-400 mb-1">
                  Step 1 — Upload & describe
                </p>
                <h3 className="text-sm font-medium mb-1">
                  You upload your digital asset
                </h3>
                <p className="text-sm text-slate-300 mb-1">
                  From your dashboard, you go to{" "}
                  <span className="font-mono text-[12px] bg-slate-900 px-1 rounded">
                    New certificate
                  </span>{" "}
                  and:
                </p>
                <ul className="text-[13px] text-slate-300 list-disc list-inside space-y-1">
                  <li>Enter a clear title for your asset</li>
                  <li>
                    Optionally add a description (context, version, notes, etc.)
                  </li>
                  <li>
                    Provide the{" "}
                    <span className="font-medium">
                      legal owner name (person or company)
                    </span>
                  </li>
                  <li>Upload the file you want to certify</li>
                </ul>
                <p className="text-[11px] text-slate-500 mt-2">
                  Supported examples: music, images, videos, PDFs, design files,
                  documents, AI–generated outputs, 3D models and more.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="h-7 w-7 rounded-full bg-emerald-500 text-slate-950 text-xs font-bold flex items-center justify-center">
                  2
                </div>
                <div className="flex-1 w-px bg-slate-700 mt-1" />
              </div>
              <div>
                <p className="text-xs text-emerald-400 mb-1">
                  Step 2 — Fingerprint & timestamp
                </p>
                <h3 className="text-sm font-medium mb-1">
                  We generate a cryptographic fingerprint
                </h3>
                <p className="text-sm text-slate-300 mb-1">
                  On our side, we don&apos;t need to read the content of your file.
                  Instead we:
                </p>
                <ul className="text-[13px] text-slate-300 list-disc list-inside space-y-1">
                  <li>
                    Compute a{" "}
                    <span className="font-medium">SHA-256 hash</span> of your file
                    (a one–way fingerprint)
                  </li>
                  <li>
                    Store this fingerprint together with the asset title,
                    description, file metadata and the{" "}
                    <span className="font-medium">legal owner name</span>
                  </li>
                  <li>
                    Attach a precise{" "}
                    <span className="font-medium">timestamp</span> and your account
                    identity (user id)
                  </li>
                </ul>
                <p className="text-[11px] text-slate-500 mt-2">
                  If the file changes even by 1 byte in the future, the fingerprint
                  will be completely different, which makes later tampering easy to
                  detect.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="h-7 w-7 rounded-full bg-emerald-500 text-slate-950 text-xs font-bold flex items-center justify-center">
                  3
                </div>
              </div>
              <div>
                <p className="text-xs text-emerald-400 mb-1">
                  Step 3 — Certificate & verification
                </p>
                <h3 className="text-sm font-medium mb-1">
                  You receive a PDF certificate and verification page
                </h3>
                <p className="text-sm text-slate-300 mb-1">
                  Once the asset is stored, we create:
                </p>
                <ul className="text-[13px] text-slate-300 list-disc list-inside space-y-1">
                  <li>
                    A unique{" "}
                    <span className="font-mono text-[12px] bg-slate-900 px-1 rounded">
                      certificate_code
                    </span>
                  </li>
                  <li>
                    A downloadable{" "}
                    <span className="font-medium">PDF certificate</span> with:
                    <ul className="list-[square] list-inside ml-4 mt-1 space-y-0.5">
                      <li>Asset title</li>
                      <li>Certified owner name</li>
                      <li>Issue date and time</li>
                      <li>SHA-256 file fingerprint</li>
                      <li>Verification URL</li>
                    </ul>
                  </li>
                  <li>
                    An online{" "}
                    <span className="font-medium">verification page</span> with QR
                    code
                  </li>
                </ul>
                <p className="text-[11px] text-slate-500 mt-2">
                  You can share the PDF with clients or authorities, and place the
                  verification QR code on your covers, videos, websites and more.
                </p>

                {/* NEW: Optional watermarked preview explanation */}
                <div className="mt-4 rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-[12px]">
                  <p className="text-slate-100 font-medium mb-1">
                    Optional: request a watermarked preview file
                  </p>
                  <p className="text-slate-300 mb-2">
                    After certification, you can optionally request a{" "}
                    <span className="font-medium">
                      manually prepared, watermarked preview
                    </span>{" "}
                    of your work. This preview is designed for safe public sharing
                    and is delivered to you by email, typically within{" "}
                    <span className="font-medium">24–72 hours</span>.
                  </p>
                  <ul className="list-disc list-inside text-slate-300 space-y-1">
                    <li>
                      <span className="font-medium">Images &amp; PDFs:</span> direct
                      visual watermark on the file (cover art, posters, e-book
                      covers, portfolio pages, etc.).
                    </li>
                    <li>
                      <span className="font-medium">Videos:</span> you can provide visible overlay 
                      Certificationdata QR Code on the video preview (Video clips or teaser).
                    </li>
                    <li>
                      <span className="font-medium">Audio projects:</span> we do not
                      modify the audio file; instead you can provide a{" "}
                      <span className="font-medium">lyrics or info PDF</span> to
                      receive as a watermarked preview.
                    </li>
                    <li>
                      <span className="font-medium">3D models:</span> we do not touch
                      the original 3D file; you can upload{" "}
                      <span className="font-medium">
                        rendered images 
                      </span>{" "}
                      of your model to be watermarked.
                    </li>
                  </ul>
                  <p className="text-[11px] text-slate-500 mt-2">
                    Your original certified file always stays stored as–is. The
                    watermarked preview is a separate, shareable version.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ne tür işler sertifikalanabilir? */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-3">
            What kind of work can you certify?
          </h2>
          <p className="text-sm text-slate-300 mb-3">
            CertificationData focuses on{" "}
            <span className="font-medium">digital assets</span>. As long as it can
            be saved as a file, it can usually be certified. Below are examples
            plus typical{" "}
            <span className="font-medium">
              source formats and recommended preview formats
            </span>{" "}
            for watermarked versions:
          </p>
          <div className="grid gap-3 md:grid-cols-2 text-[13px]">
            {/* Creative works */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3">
              <p className="font-medium mb-1 text-slate-100">Creative works</p>
              <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                <li>Music, beats, songs, instrumentals</li>
                <li>Illustrations, photos, digital paintings</li>
                <li>Videos, short films, trailers</li>
              </ul>
              <p className="mt-2 text-[12px] text-slate-400">
                <span className="font-medium">Certified as:</span> audio files
                (WAV, MP3), image files (JPG, PNG), video files (MP4, MOV) and
                similar formats.
              </p>
              <p className="mt-1 text-[12px] text-slate-400">
                <span className="font-medium">Watermarked preview:</span> image
                covers, posters, still frames or short video clips with a visual
                watermark. For music, you may also use a lyrics/credits PDF.
              </p>
            </div>

            {/* Written content */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3">
              <p className="font-medium mb-1 text-slate-100">Written content</p>
              <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                <li>Books, manuscripts, scripts</li>
                <li>Articles, research drafts, reports</li>
                <li>E-books, course material PDFs</li>
              </ul>
              <p className="mt-2 text-[12px] text-slate-400">
                <span className="font-medium">Certified as:</span> PDFs, DOCX,
                ODT, Markdown exports and similar document files.
              </p>
              <p className="mt-1 text-[12px] text-slate-400">
                <span className="font-medium">Watermarked preview:</span> selected
                PDF pages, covers or summary pages with an overlaid watermark for
                safe preview sharing.
              </p>
            </div>

            {/* Design & technical work */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3">
              <p className="font-medium mb-1 text-slate-100">
                Design &amp; technical work
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                <li>Logos, UI/UX design files</li>
                <li>Architectural plans, 3D models</li>
                <li>Product mockups, brand systems</li>
              </ul>
              <p className="mt-2 text-[12px] text-slate-400">
                <span className="font-medium">Certified as:</span> source design
                files (PSD, Figma exports, SVG), CAD/PDF plans and 3D formats
                (OBJ, FBX, GLB, BLEND, etc.).
              </p>
              <p className="mt-1 text-[12px] text-slate-400">
                <span className="font-medium">Watermarked preview:</span> static
                renders, screenshots or short animations as images or videos.
                The original 3D/CAD files are not modified; only the rendered
                previews receive a watermark.
              </p>
            </div>

            {/* AI-generated content */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3">
              <p className="font-medium mb-1 text-slate-100">
                AI-generated content
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                <li>AI art, AI music, AI video scenes</li>
                <li>Prompt-based designs and assets</li>
                <li>Virtual characters, avatars and influencers</li>
              </ul>
              <p className="mt-2 text-[12px] text-slate-400">
                <span className="font-medium">Certified as:</span> exported image,
                audio, video or document files from your AI tools, plus optional
                prompt documentation.
              </p>
              <p className="mt-1 text-[12px] text-slate-400">
                <span className="font-medium">Watermarked preview:</span> image or
                video exports with a visible watermark; for text–based AI work,
                watermarked PDFs or cover images. This is ideal for AI–driven
                brands and virtual influencer projects.
              </p>
            </div>
          </div>
        </section>

        {/* Legal & practical notes */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-3">
            What does this prove (and what not)?
          </h2>
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-[13px] space-y-2">
            <p className="text-slate-200 font-medium">
              CertificationData is not a government patent office. It&apos;s a
              time-stamped certification record for your digital work.
            </p>
            <p className="text-slate-300">
              Each certificate records that{" "}
              <span className="font-medium">
                a specific user account, under a specific legal name, uploaded a
                specific file at a specific time,
              </span>{" "}
              and that file had a specific SHA-256 fingerprint.
            </p>

            {/* Not a marketplace / no selling */}
            <p className="text-slate-300">
              <span className="font-medium">Important:</span> CertificationData is
              not a marketplace. We do not sell your products, broker deals, or
              take commissions. Our role is to create a verifiable certification
              record and a verification page.
            </p>

            <p className="text-slate-300">
              In practical terms, this can help you show priority, authorship and
              integrity of your work when talking to clients, platforms or legal
              advisors.
            </p>
            <p className="text-[11px] text-slate-500">
              For formal legal disputes, you should always consult a lawyer in your
              country. Our certificates are designed to be{" "}
              <span className="font-medium">strong technical record</span>, not a
              replacement for local intellectual property law.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="mb-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-100 mb-1">
                Ready to certify your first asset?
              </p>
              <p className="text-[12px] text-slate-400">
                You can start with a single certificate or explore one-time options
                later if you need more.
              </p>
            </div>
            <div className="flex flex-col items-start gap-2">
              <div className="flex gap-2">
                <Link
                  href="/dashboard/new"
                  className="inline-flex items-center px-4 py-2 rounded-md bg-emerald-500 text-slate-950 text-xs font-medium hover:bg-emerald-400 transition"
                >
                  Create a certificate
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center px-4 py-2 rounded-md border border-slate-700 text-slate-200 text-xs font-medium hover:border-emerald-500 hover:text-emerald-300 transition"
                >
                  View pricing
                </Link>
              </div>

              <a
                href="/archive"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] text-emerald-300 hover:underline"
              >
                Explore Certified Records →
              </a>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

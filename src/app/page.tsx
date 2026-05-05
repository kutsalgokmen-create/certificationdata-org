// app/page.tsx
import Link from "next/link";
import type { Metadata } from "next";

const siteUrl = "https://www.certificationdata.org";

export const metadata: Metadata = {
  title:
    "Digital Asset Certification for Creators | CertificationData.org",
  description:
    "Certify digital files with a SHA-256 fingerprint, timestamped PDF certificate, and public QR verification page. Built for artists, designers, photographers, writers, musicians, AI creators, freelancers, and agencies.",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title:
      "Digital Asset Certification for Creators | CertificationData.org",
    description:
      "Create timestamped digital certificates for your files with cryptographic SHA-256 fingerprints, PDF certificates, and public QR verification pages.",
    url: siteUrl,
    siteName: "CertificationData.org",
    type: "website",
  },
  twitter: {
    card: "summary",
    title:
      "Digital Asset Certification for Creators | CertificationData.org",
    description:
      "Certify digital files with SHA-256 fingerprints, timestamped PDF certificates, and public QR verification pages.",
  },
};

const bestFor = [
  "Digital artists who want timestamped proof of their work",
  "Photographers sending previews or finished files to clients",
  "Designers sharing logos, graphics, layouts, or brand assets",
  "Writers, musicians, AI creators, and 3D model creators",
  "Freelancers who want proof before delivering work",
  "Agencies managing client approvals, releases, and creative files",
];

const notFor = [
  "Replacing official copyright registration",
  "Replacing legal advice, notary services, or court filings",
  "Transferring ownership of intellectual property",
  "Selling digital products directly as a marketplace",
  "Blockchain tokenization, NFT minting, or escrow services",
  "Public file hosting or permanent storage of the original asset",
];

const faqItems = [
  {
    q: "What is CertificationData.org?",
    a: "CertificationData.org is a digital asset certification service for creators. It creates a SHA-256 fingerprint of your file, records a timestamp, generates a PDF certificate, and provides a public verification page with a QR code.",
  },
  {
    q: "Does CertificationData.org prove copyright ownership?",
    a: "No. CertificationData.org does not replace official copyright registration, legal advice, or court filings. It helps you create timestamped technical proof that a specific digital file existed at a specific time.",
  },
  {
    q: "Is my original file public?",
    a: "No. Your original file is not shown in the public archive or public verification page. Public records show only limited certificate metadata such as title, certificate code, issue time, and verification details.",
  },
  {
    q: "What is a SHA-256 fingerprint?",
    a: "A SHA-256 fingerprint is a one-way cryptographic hash that uniquely represents a file. If the file changes even slightly, the fingerprint changes completely.",
  },
  {
    q: "Who is this service best for?",
    a: "It is best for digital artists, photographers, designers, writers, musicians, AI creators, freelancers, agencies, and anyone who wants timestamped proof for a digital file.",
  },
  {
    q: "Can I share my certificate with clients or collaborators?",
    a: "Yes. You can share the PDF certificate, certificate code, QR code, or public verification page with clients, collaborators, platforms, or legal advisors.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "CertificationData.org",
      url: siteUrl,
      description:
        "CertificationData.org provides digital asset certification for creators using SHA-256 fingerprints, timestamped PDF certificates, and public QR verification pages.",
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "CertificationData.org",
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
    },
    {
      "@type": "Service",
      "@id": `${siteUrl}/#service`,
      name: "Digital asset certification service",
      serviceType: "Digital file certification",
      provider: {
        "@id": `${siteUrl}/#organization`,
      },
      areaServed: "Worldwide",
      url: siteUrl,
      description:
        "Certify digital files with SHA-256 fingerprints, timestamped PDF certificates, certificate codes, public verification pages, and QR codes.",
      audience: {
        "@type": "Audience",
        audienceType:
          "Digital creators, artists, designers, photographers, writers, musicians, AI creators, freelancers, and agencies",
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/#faq`,
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    },
  ],
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Hero section */}
      <section className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-500 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-64 w-64 translate-x-1/3 translate-y-1/3 rounded-full bg-cyan-500 blur-3xl" />
        </div>

        <div className="relative mx-auto flex max-w-5xl flex-col items-center px-4 pb-20 pt-16 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-emerald-500/60 bg-slate-900/80 shadow-lg shadow-emerald-500/20">
              <img
                src="/logo.png"
                alt="CertificationData.org logo"
                className="h-full w-full object-contain scale-100"
              />
            </div>

            <div className="text-left">
              <p className="text-[11px] uppercase tracking-wide text-emerald-400">
                CertificationData.org
              </p>
              <p className="text-xs text-slate-300">
                Digital asset certification for the AI era
              </p>
            </div>
          </div>

          <h1 className="mb-3 text-3xl font-semibold md:text-4xl">
            Certify your digital creations.
            <span className="block text-emerald-400">
              Instantly. Cryptographically. Verifiably.
            </span>
          </h1>

          <p className="mb-6 max-w-2xl text-sm text-slate-300 md:text-base">
            Upload your file and get a timestamped SHA-256 fingerprint, a PDF
            certificate, a unique certificate code, and a public verification
            page with QR code. Built for creators who want clear proof that a
            digital file existed at a specific time.
          </p>

          <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/auth"
              className="inline-flex items-center rounded-md bg-emerald-500 px-5 py-2.5 text-sm font-medium text-slate-950 shadow shadow-emerald-500/30 transition hover:bg-emerald-400"
            >
              Create your first certificate
            </Link>

            <Link
              href="/archive"
              className="inline-flex items-center rounded-md border border-slate-700 px-4 py-2.5 text-sm text-slate-200 transition hover:border-emerald-500 hover:text-emerald-300"
            >
              Browse the Public Archive
            </Link>
          </div>

          <p className="text-[11px] text-slate-500">
            No subscription required. Start with{" "}
            <span className="font-medium text-slate-300">
              one free certificate up to 25&nbsp;MB
            </span>
            , then use simple one-time options whenever you need more.
          </p>
        </div>
      </section>

      {/* AI-readable product summary */}
      <section className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6 shadow-xl shadow-black/20">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-400">
            What is CertificationData.org?
          </p>

          <h2 className="mb-3 text-xl font-semibold">
            A digital asset certification service for creators, freelancers,
            artists, designers, photographers, writers, musicians, AI creators,
            and agencies.
          </h2>

          <p className="text-sm leading-relaxed text-slate-300">
            CertificationData.org creates a cryptographic SHA-256 fingerprint of
            your digital file, records a timestamp, generates a PDF certificate,
            and gives you a public verification page with a QR code. It is best
            for proving that a specific digital work existed at a specific time
            and for sharing verifiable proof with clients, collaborators,
            platforms, or legal advisors.
          </p>
        </div>
      </section>

      {/* Features section */}
      <section className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-xl font-semibold">
            What does CertificationData give you?
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-slate-400">
            Behind the scenes we combine cryptographic fingerprints, structured
            certificate records, PDF output, and public verification links so you
            can show:
            <span className="mt-1 block text-slate-200">
              “This digital work was certified at this time.”
            </span>
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              eyebrow: "1. Cryptographic fingerprint",
              title: "SHA-256 hash of your file",
              desc:
                "A one-way SHA-256 fingerprint uniquely represents your asset without exposing the original file.",
              note:
                "If someone modifies the file even slightly, the fingerprint changes completely.",
            },
            {
              eyebrow: "2. Timestamped certificate",
              title: "PDF certificate with key details",
              desc:
                "For every certified asset, you receive a PDF certificate with the asset title, fingerprint, issue time, and certificate code.",
              note:
                "You can send this PDF to clients, store it with contracts, or use it in legal discussions.",
            },
            {
              eyebrow: "3. Public verification page",
              title: "QR code and shareable URL",
              desc:
                "Each certificate has a public verification page with a QR code and URL so others can confirm certificate details.",
              note:
                "Useful for portfolios, releases, licensing, and provenance proof.",
            },
            {
              eyebrow: "4. Optional watermarked preview",
              title: "Preview files you can show publicly",
              desc:
                "After certification, you can request a manually prepared watermarked preview for selected asset types.",
              note:
                "Your original certified file stays private while you share a safer public preview.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-slate-800 bg-slate-900/70 p-4"
            >
              <p className="mb-1 text-xs font-semibold text-emerald-400">
                {feature.eyebrow}
              </p>
              <h3 className="mb-2 text-sm font-medium">{feature.title}</h3>
              <p className="mb-2 text-xs text-slate-300">{feature.desc}</p>
              <p className="text-[11px] text-slate-500">{feature.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Best for / Not for */}
      <section className="mx-auto max-w-5xl px-4 py-10">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <h2 className="mb-4 text-xl font-semibold">Best for</h2>
            <div className="space-y-3 text-sm leading-relaxed text-slate-300">
              {bestFor.map((item) => (
                <div key={item} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <h2 className="mb-4 text-xl font-semibold">Not for</h2>
            <div className="space-y-3 text-sm leading-relaxed text-slate-300">
              {notFor.map((item) => (
                <div key={item} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-amber-300" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-slate-800 bg-slate-950/70">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <div className="mb-8 max-w-3xl">
            <h2 className="mb-2 text-xl font-semibold">
              How digital certification works
            </h2>
            <p className="text-sm leading-relaxed text-slate-300">
              The process is designed to be simple for creators while producing
              clear technical proof that can be shared and verified.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                title: "Upload your file",
                desc:
                  "Choose the digital asset you want to certify, such as an image, PDF, design file, music file, video, writing sample, or AI-generated work.",
              },
              {
                title: "Create a fingerprint",
                desc:
                  "CertificationData calculates a SHA-256 fingerprint and records certificate metadata with an issue time and unique certificate code.",
              },
              {
                title: "Share proof",
                desc:
                  "Download your PDF certificate and share the public verification page or QR code with clients, collaborators, platforms, or advisors.",
              },
            ].map((step) => (
              <div
                key={step.title}
                className="rounded-xl border border-slate-800 bg-slate-900/70 p-5"
              >
                <h3 className="mb-2 text-sm font-semibold text-slate-100">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-300">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Public Archive section */}
      <section className="border-b border-slate-800 bg-slate-950/70">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <div className="max-w-3xl">
            <h2 className="mb-2 text-xl font-semibold">
              Public Archive of Certified Works
            </h2>

            <p className="mb-4 text-sm leading-relaxed text-slate-300">
              The Public Archive is a minimal, open list of certificates issued
              on CertificationData.org. It does not sell your products and does
              not show file contents, full private files, or contact details.
            </p>

            <p className="mb-4 text-sm leading-relaxed text-slate-300">
              Each entry shows limited certificate metadata so others can confirm
              that a work has been certified without revealing the full asset.
              Your verification pages remain accessible via direct link or QR
              code.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/archive"
                className="inline-flex items-center justify-center rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-emerald-400"
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

      {/* FAQ */}
      <section className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-8 max-w-3xl">
          <h2 className="mb-2 text-xl font-semibold">
            Common certification questions
          </h2>
          <p className="text-sm leading-relaxed text-slate-300">
            These answers help creators, clients, search engines, and AI
            assistants understand what CertificationData.org does and where its
            limits are.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {faqItems.map((item) => (
            <div
              key={item.q}
              className="rounded-xl border border-slate-800 bg-slate-900/70 p-5"
            >
              <h3 className="mb-2 text-sm font-semibold text-slate-100">
                {item.q}
              </h3>
              <p className="text-sm leading-relaxed text-slate-300">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sibling product */}
      <section className="border-t border-slate-800 bg-slate-950/80">
        <div className="mx-auto grid max-w-5xl gap-5 px-4 py-10 md:grid-cols-[1.3fr_0.7fr]">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-400">
              Related service
            </p>
            <h2 className="mb-2 text-xl font-semibold">
              Need QR tags for real-world items?
            </h2>
            <p className="max-w-2xl text-sm leading-relaxed text-slate-300">
              CertificationData.com is a separate privacy-first QR tag service
              for lost items, pets, luggage, business contact, tools, handmade
              products, and personal use. CertificationData.org stays focused on
              digital file certification.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <h3 className="mb-2 text-sm font-semibold">
              CertificationData.com
            </h3>
            <p className="mb-4 text-sm leading-relaxed text-slate-300">
              Personal QR tags for lost-and-found and controlled public contact.
            </p>
            <Link
              href="https://www.certificationdata.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-emerald-400"
            >
              Visit .com →
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-emerald-500/10 to-slate-900/70 p-6 shadow-xl shadow-black/20">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Ready to certify your first digital work?
              </h2>
              <p className="mt-2 text-sm text-slate-300">
                Start with one free certificate up to 25 MB. No subscription
                required.
              </p>
            </div>

            <Link
              href="/auth"
              className="inline-flex items-center justify-center rounded-md bg-emerald-500 px-5 py-2.5 text-sm font-medium text-slate-950 shadow shadow-emerald-500/30 transition hover:bg-emerald-400"
            >
              Create your first certificate
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
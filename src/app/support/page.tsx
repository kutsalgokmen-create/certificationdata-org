export default function SupportPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold mb-2">Help Center</h1>

        <p className="text-sm text-slate-300">
          Find answers about certificates, verification, downloads, and account usage.
        </p>

        <section className="mt-6 space-y-8 text-sm leading-relaxed text-slate-300">

          {/* GENERAL */}
          <div>
            <h2 className="text-lg font-semibold text-slate-100 mb-2">
              General
            </h2>
            <p>
              CertificationData.org is a digital certification platform that helps you
              create verifiable records for your files. Each certification generates
              a unique certificate code, a verification page, and an evidence PDF.
            </p>
          </div>

          {/* CERTIFICATES */}
          <div>
            <h2 className="text-lg font-semibold text-slate-100 mb-2">
              Certificates
            </h2>

            <ul className="list-disc pl-6 space-y-2">
              <li>
                Each certificate is linked to a unique file fingerprint (SHA-256).
              </li>
              <li>
                Once created, a certificate cannot be edited or replaced.
              </li>
              <li>
                Make sure you upload the correct file before creating a certificate.
              </li>
              <li>
                You can share your certificate using its public verification link or QR code.
              </li>
            </ul>
          </div>

          {/* VERIFICATION */}
          <div>
            <h2 className="text-lg font-semibold text-slate-100 mb-2">
              Verification
            </h2>

            <p>
              Anyone can verify a certificate by visiting the verification page and
              entering the certificate code, or by scanning the QR code.
            </p>

            <p className="mt-2">
              The verification page shows limited public information, while sensitive
              data and file contents remain private.
            </p>
          </div>

          {/* DOWNLOADS */}
          <div>
            <h2 className="text-lg font-semibold text-slate-100 mb-2">
              Downloads
            </h2>

            <ul className="list-disc pl-6 space-y-2">
              <li>
                You can download your certificate as a PDF at any time.
              </li>
              <li>
                Branded QR codes are available for sharing or embedding.
              </li>
              <li>
                Always keep a copy of your certificate and files for your own records.
              </li>
            </ul>
          </div>

          {/* WATERMARK */}
          <div>
            <h2 className="text-lg font-semibold text-slate-100 mb-2">
              Watermarked Previews
            </h2>

            <p>
              You can request a watermarked preview file after creating a certificate.
            </p>

            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>
                Watermark processing is performed manually.
              </li>
              <li>
                Processing time may vary depending on workload (typically 24–72 hours).
              </li>
              <li>
                Currently, image and PDF files are supported directly.
              </li>
              <li>
                For audio, video, or 3D content, you may provide a PDF or image-based
                representation for watermarking.
              </li>
            </ul>
          </div>

          {/* ACCOUNT */}
          <div>
            <h2 className="text-lg font-semibold text-slate-100 mb-2">
              Account
            </h2>

            <ul className="list-disc pl-6 space-y-2">
              <li>
                You can access your certificates from your dashboard.
              </li>
              <li>
                Make sure your email address is correct when signing up.
              </li>
              <li>
                Your display name may appear on certificates if provided.
              </li>
            </ul>
          </div>

          {/* IMPORTANT */}
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="text-sm font-semibold text-slate-100 mb-2">
              Important Notes
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li>
                CertificationData does not verify ownership of uploaded content.
              </li>
              <li>
                You are responsible for the files and information you submit.
              </li>
              <li>
                We are not a marketplace, escrow service, or legal authority.
              </li>
            </ul>
          </div>

          {/* CONTACT CTA */}
          <div>
            <h2 className="text-lg font-semibold text-slate-100 mb-2">
              Still need help?
            </h2>

            <p>
              If you cannot find the answer here, feel free to contact us:
            </p>

            <p className="mt-2 text-emerald-300 font-medium break-all">
              support@certificationdata.org
            </p>
          </div>

        </section>
      </div>
    </main>
  );
}
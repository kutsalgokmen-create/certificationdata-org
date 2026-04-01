export default function FaqPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold mb-2">FAQ</h1>
        <p className="text-sm text-slate-300">
          Common questions about digital certification, verification, and how CertificationData works.
        </p>

        <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="text-lg font-semibold text-white">
            Frequently Asked Questions
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Clear answers to help you understand how the system works.
          </p>

          <div className="mt-6 space-y-6 text-sm">

            {/* WHAT IS */}
            <div>
              <p className="font-medium text-slate-100">
                What is CertificationData and how does it work?
              </p>
              <p className="mt-1 text-slate-300">
                CertificationData is a digital certification system that creates
                a unique cryptographic fingerprint (SHA-256) of your file and
                attaches a timestamp. This generates a certificate, a verification
                page, and an evidence PDF that can be used as proof that your file
                existed in a specific form at a specific time.
              </p>
            </div>

            {/* CERTIFICATE PURPOSE */}
            <div>
              <p className="font-medium text-slate-100">
                What does a certificate actually prove?
              </p>
              <p className="mt-1 text-slate-300">
                A certificate proves that a specific file existed at a specific
                time and has not been altered since. It does not automatically
                prove legal ownership, but it can serve as strong technical
                evidence in many scenarios.
              </p>
            </div>

            {/* LEGAL */}
            <div>
              <p className="font-medium text-slate-100">
                Is this a replacement for copyright, patent, or trademark registration?
              </p>
              <p className="mt-1 text-slate-300">
                No. CertificationData is not a legal registry. It provides
                technical proof (timestamp + fingerprint), not official
                government registration.
              </p>
            </div>

            {/* FILE SAFETY */}
            <div>
              <p className="font-medium text-slate-100">
                Are my files publicly visible?
              </p>
              <p className="mt-1 text-slate-300">
                No. Your original files are stored securely and are not publicly
                accessible. Only limited certificate information appears on the
                public verification page.
              </p>
            </div>

            {/* PERMANENCE */}
            <div>
              <p className="font-medium text-slate-100">
                Do certificates expire?
              </p>
              <p className="mt-1 text-slate-300">
                No. Certificates do not expire and remain verifiable. However,
                long-term file storage is not guaranteed, so you should always
                keep your own copies.
              </p>
            </div>

            {/* WATERMARK */}
            <div>
              <p className="font-medium text-slate-100">
                How do watermarked previews work?
              </p>
              <p className="mt-1 text-slate-300">
                After certification, you can request a manually prepared
                watermarked preview. This is a separate, shareable version of
                your file that includes your certificate code and branding,
                while your original file remains unchanged.
              </p>
            </div>

            {/* SUPPORTED FILES */}
            <div>
              <p className="font-medium text-slate-100">
                Which file types are supported for watermark previews?
              </p>
              <p className="mt-1 text-slate-300">
                Image and PDF files are supported directly. For audio, video, or
                3D projects, you can submit a PDF or image-based representation
                (such as lyrics, storyboard, or renders) for watermarking.
              </p>
            </div>

            {/* PROCESS TIME */}
            <div>
              <p className="font-medium text-slate-100">
                How long does watermark processing take?
              </p>
              <p className="mt-1 text-slate-300">
                Watermark previews are prepared manually and typically take
                between 24–72 hours depending on workload.
              </p>
            </div>

            {/* WRONG FILE */}
            <div>
              <p className="font-medium text-slate-100">
                What happens if I upload the wrong file?
              </p>
              <p className="mt-1 text-slate-300">
                Certificates cannot be edited or replaced once created. You
                would need to create a new certification with the correct file.
              </p>
            </div>

            {/* PAYMENTS */}
            <div>
              <p className="font-medium text-slate-100">
                Are payments refundable?
              </p>
              <p className="mt-1 text-slate-300">
                Generally no. Once a certification is created, the service is
                considered completed. Refunds are only considered in rare cases
                involving verified technical issues.
              </p>
            </div>

            {/* VERIFICATION */}
            <div>
              <p className="font-medium text-slate-100">
                How can others verify my certificate?
              </p>
              <p className="mt-1 text-slate-300">
                Anyone can verify your certificate by entering the certificate
                code on the verification page or by scanning the QR code linked
                to your certificate.
              </p>
            </div>

            {/* SECURITY */}
            <div>
              <p className="font-medium text-slate-100">
                Can someone fake or modify my certificate?
              </p>
              <p className="mt-1 text-slate-300">
                No. Each certificate is linked to a unique cryptographic
                fingerprint. If the file is changed, the fingerprint will no
                longer match, making tampering detectable.
              </p>
            </div>

            {/* CONTACT */}
            <div>
              <p className="font-medium text-slate-100">
                How can I get support?
              </p>
              <p className="mt-1 text-slate-300">
                You can contact us at{" "}
                <span className="text-emerald-300">
                  support@certificationdata.org
                </span>. Most requests are answered within 24–48 hours.
              </p>
            </div>

          </div>
        </section>
      </div>
    </main>
  );
}
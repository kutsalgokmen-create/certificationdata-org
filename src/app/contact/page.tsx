export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold mb-2">Contact Us</h1>

        <section className="mt-4 space-y-5 text-sm leading-relaxed text-slate-300">
          <p>
            If you have any questions about your certificate, watermark request,
            account, or a technical issue, you can contact us directly via email.
          </p>

          <p>
            We aim to respond as quickly as possible. Most inquiries are answered
            within <span className="text-slate-100">24–48 hours</span>, depending
            on workload.
          </p>

          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-xs text-slate-400 mb-1">
              Support email
            </p>
            <p className="text-sm text-emerald-300 font-medium break-all">
              support@certificationdata.org
            </p>
          </div>

          <p>
            To help us assist you more efficiently, please include relevant
            details in your message, such as:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Your certificate code (if applicable)</li>
            <li>Your account email address</li>
            <li>A clear description of the issue</li>
          </ul>

          <p>
            For watermark preview requests, please note that processing is
            performed manually and may take time depending on queue volume.
          </p>

          <p className="text-xs text-slate-500">
            CertificationData is a digital certification service. We do not act
            as a marketplace, intermediary, or legal authority, and we do not
            handle ownership disputes between users.
          </p>
          <p>
            Before contacting us, please review our FAQ
          </p>
        </section>
      </div>
    </main>
  );
}
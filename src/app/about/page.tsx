export default function AboutPage() {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <h1 className="text-2xl font-semibold mb-2">About CertificationData</h1>
  
          <p className="text-sm text-slate-300">
            A digital certification platform for creative works, files, and proof-based records.
          </p>
  
          <section className="mt-6 space-y-6 text-sm leading-relaxed text-slate-300">
            <p>
              CertificationData.org is a digital certification platform designed to help creators,
              professionals, and rights holders generate structured proof for their digital works.
            </p>
  
            <p>
              Our system allows users to upload a file, generate a cryptographic fingerprint
              (SHA-256), create a timestamped certification record, and receive a certificate code,
              verification page, QR code, and supporting evidence PDF.
            </p>
  
            <p>
              The purpose of CertificationData.org is to provide a clear and verifiable record that
              a specific digital file existed in a particular form at a specific point in time.
              This can be useful for creators, designers, writers, artists, researchers, developers,
              and other individuals or businesses who want stronger documentation around authorship,
              creation history, or file integrity.
            </p>
  
            <p>
              CertificationData.org helps users create an organized proof layer around their work.
              Instead of relying only on local files, screenshots, or scattered upload histories,
              users can generate a structured certification record linked to a unique certificate code
              and online verification page.
            </p>
  
            <p>
              In addition to the core certification process, the platform may also provide supporting
              features such as evidence PDFs, verification QR codes, and optional manually prepared
              watermarked preview files for image- and PDF-based materials.
            </p>
  
            <p>
              CertificationData.org is not a marketplace. We do not buy, sell, broker, license,
              or distribute digital works on behalf of users. We do not act as an escrow service,
              payment intermediary, legal registry, or intellectual property office.
            </p>
  
            <p>
              We also do not independently verify legal ownership of uploaded works. Users are solely
              responsible for the files they submit, the information they provide, and the legal rights
              associated with their content.
            </p>
  
            <p>
              Our role is to provide technical certification infrastructure: fingerprinting,
              timestamping, structured records, and verification tools that help users document and
              present the existence of their work in a clearer and more professional way.
            </p>
  
            <p>
              Our long-term vision is to build a practical trust layer for digital content — helping
              creators and organizations support originality, traceability, and verifiable file-based
              records in a simple and globally accessible format.
            </p>
  
            <p>
              CertificationData.org is operated by AZRAQ DIGITAL LLC, a company registered in Wyoming,
              United States, serving users globally.
            </p>
          </section>
        </div>
      </main>
    );
  }
export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold mb-2">Privacy Policy</h1>

        <div className="space-y-5 text-sm text-slate-300 leading-relaxed">
          <p>
            <strong>Effective Date:</strong> {new Date().toLocaleDateString()}
          </p>

          <p>
            CertificationData respects your privacy and is committed to
            protecting your personal data. This Privacy Policy explains what
            information we collect, how we use it, and your rights.
          </p>

          {/* 1 */}
          <h2 className="text-lg font-medium text-white">
            1. Information We Collect
          </h2>
          <p>
            We may collect the following types of information:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Account information (email, display name)</li>
            <li>Asset-related data (titles, descriptions, fingerprints)</li>
            <li>Uploaded files (for certification purposes)</li>
            <li>Technical data (IP address, browser, device type)</li>
          </ul>

          {/* 2 */}
          <h2 className="text-lg font-medium text-white">
            2. How We Use Your Data
          </h2>
          <p>
            We use your data only to operate and improve the service, including:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Creating certificates and verification records</li>
            <li>Generating fingerprints and evidence documents</li>
            <li>Providing watermark preview services</li>
            <li>Maintaining account access and functionality</li>
            <li>Improving system performance and security</li>
          </ul>

          {/* 3 */}
          <h2 className="text-lg font-medium text-white">
            3. File Storage and Privacy
          </h2>
          <p>
            Uploaded files are stored securely and are not publicly accessible.
          </p>
          <p>
            Only limited certificate information (such as title, certificate
            code, and timestamp) may be visible on public verification pages.
          </p>

          {/* 4 */}
          <h2 className="text-lg font-medium text-white">
            4. Data Sharing
          </h2>
          <p>
            We do not sell, rent, or trade your personal data.
          </p>
          <p>
            Your data may only be shared:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>When required by law or legal obligation</li>
            <li>With trusted service providers (e.g. hosting, payments)</li>
            <li>To protect the integrity and security of the platform</li>
          </ul>

          {/* 5 */}
          <h2 className="text-lg font-medium text-white">
            5. Data Retention
          </h2>
          <p>
            We retain data only as long as necessary to operate the service.
          </p>
          <p>
            CertificationData is not a permanent storage service. Files and data
            may be removed, archived, or become unavailable due to system
            maintenance, storage policies, or technical limitations.
          </p>

          {/* 6 */}
          <h2 className="text-lg font-medium text-white">
            6. Security
          </h2>
          <p>
            We implement reasonable technical and organizational measures to
            protect your data. However, no system is completely secure, and we
            cannot guarantee absolute security.
          </p>

          {/* 7 */}
          <h2 className="text-lg font-medium text-white">
            7. Cookies and Analytics
          </h2>
          <p>
            We may use essential cookies and basic analytics to ensure the
            platform functions correctly and to improve user experience.
          </p>

          {/* 8 */}
          <h2 className="text-lg font-medium text-white">
            8. Your Rights
          </h2>
          <p>
            Depending on your location, you may have rights regarding your
            personal data, including:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Accessing your data</li>
            <li>Requesting correction</li>
            <li>Requesting deletion</li>
            <li>Restricting or objecting to processing</li>
          </ul>

          {/* 9 */}
          <h2 className="text-lg font-medium text-white">
            9. Third-Party Services
          </h2>
          <p>
            We may use third-party services such as Supabase (database and
            storage) and Stripe (payments). These providers may process data in
            accordance with their own privacy policies.
          </p>

          {/* 10 */}
          <h2 className="text-lg font-medium text-white">
            10. Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. Updates will be
            posted on this page with a revised effective date.
          </p>

          {/* 11 */}
          <h2 className="text-lg font-medium text-white">
            11. Contact
          </h2>
          <p>
            If you have any questions about this Privacy Policy, you can contact:
          </p>
          <p className="text-emerald-400 font-medium break-all">
            support@certificationdata.org
          </p>
        </div>

        <p className="mt-6 text-xs text-slate-500">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </main>
  );
}
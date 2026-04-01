export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold mb-2">Refund Policy</h1>

        <p className="text-sm text-slate-300 mb-2">
          Last updated: March 16, 2026
        </p>

        <section className="mt-6 space-y-6 text-sm leading-relaxed text-slate-300">
          <p>
            This Refund Policy explains when payments made for services on
            CertificationData.org may or may not be refunded. By purchasing or
            using any paid service on CertificationData.org, you acknowledge and
            agree to the terms of this Refund Policy.
          </p>

          <h2 className="text-lg font-semibold text-slate-100 mt-8">
            1. Nature of the Service
          </h2>

          <p>
            CertificationData.org provides digital certification services for
            creative and digital works. These services may include:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Cryptographic fingerprint generation (SHA-256)</li>
            <li>Timestamped digital certification</li>
            <li>Creation of a certificate record and certificate code</li>
            <li>Generation of an evidence PDF</li>
            <li>Optional manual preparation of watermarked preview files</li>
          </ul>

          <p>
            All services are digital and delivered electronically. Once a
            certification has been created, the core service is considered
            performed.
          </p>

          <h2 className="text-lg font-semibold text-slate-100 mt-8">
            2. Non-Refundable Services
          </h2>

          <p>
            Because the certification process generates a permanent
            cryptographic record and timestamp tied to the submitted file,
            payments for completed certifications are generally non-refundable.
          </p>

          <p>This includes situations where:</p>

          <ul className="list-disc pl-6 space-y-2">
            <li>The user later decides not to use the certificate</li>
            <li>The user uploads the wrong file</li>
            <li>The user changes their mind after certification is issued</li>
            <li>The user no longer needs the service</li>
            <li>The user misunderstands the intended use of the service</li>
          </ul>

          <p>
            Users are responsible for reviewing their files and information
            before submitting them for certification.
          </p>

          <h2 className="text-lg font-semibold text-slate-100 mt-8">
            3. Watermarked Preview Requests
          </h2>

          <p>
            Watermarked preview files are prepared manually upon request and are
            considered an optional supporting service. Due to the manual nature
            of this service, processing times may vary, typically between 24–72
            hours depending on workload and technical suitability.
          </p>

          <p>
            Payments associated with the underlying certification remain
            non-refundable regardless of whether a watermarked preview is
            requested, delayed, declined, or ultimately not used.
          </p>

          <p>
            If a preview cannot reasonably be produced due to technical,
            format-related, or operational limitations, the certification itself
            remains valid and no refund will be issued on that basis alone.
          </p>

          <h2 className="text-lg font-semibold text-slate-100 mt-8">
            4. Technical Issues
          </h2>

          <p>
            Refunds may be considered in limited cases where a verified
            technical error on CertificationData.org prevents the certification
            service from being completed as intended.
          </p>

          <p>Examples may include:</p>

          <ul className="list-disc pl-6 space-y-2">
            <li>A payment is processed but no certification record is generated</li>
            <li>
              A system malfunction prevents delivery of the certificate evidence
              PDF
            </li>
            <li>Duplicate payment caused by a confirmed system error</li>
          </ul>

          <p>
            If such a situation occurs, please contact support within 7 days of
            the transaction. CertificationData reserves the right to review and
            investigate the issue before issuing any refund.
          </p>

          <h2 className="text-lg font-semibold text-slate-100 mt-8">
            5. Duplicate Purchases
          </h2>

          <p>
            If a user accidentally purchases the same certification more than
            once due to a confirmed payment or system error, a refund may be
            issued for the duplicate transaction.
          </p>

          <h2 className="text-lg font-semibold text-slate-100 mt-8">
            6. Recurring Plans or Future Subscription Services
          </h2>

          <p>
            If CertificationData.org offers recurring plans, memberships, or
            subscription-based services in the future, those services may be
            governed by additional billing and cancellation terms presented at
            the time of purchase.
          </p>

          <p>
            Unless otherwise stated at checkout, charges already incurred for a
            completed billing period are generally non-refundable.
          </p>

          <h2 className="text-lg font-semibold text-slate-100 mt-8">
            7. Chargebacks and Disputes
          </h2>

          <p>
            Initiating a chargeback or payment dispute without first contacting
            support may result in:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Suspension of associated accounts</li>
            <li>Revocation or restriction of certification-related services</li>
            <li>Blocking of future access to CertificationData services</li>
          </ul>

          <p>
            Users are strongly encouraged to contact support first so that any
            issue can be reviewed and, where possible, resolved directly.
          </p>

          <h2 className="text-lg font-semibold text-slate-100 mt-8">
            8. Storage and File Availability
          </h2>

          <p>
            CertificationData stores submitted files and related records for
            operational purposes. However, long-term storage availability is not
            guaranteed, and CertificationData should not be treated as a
            permanent backup or archival storage provider.
          </p>

          <p>
            Users are responsible for keeping their own copies of original
            files, certificates, evidence PDFs, and any other important
            materials.
          </p>

          <p>
            Refunds will not be issued due to loss of local copies, external
            storage failures, later inability to access previously downloaded
            files, or the eventual removal or unavailability of stored files.
          </p>

          <h2 className="text-lg font-semibold text-slate-100 mt-8">
            9. Contact
          </h2>

          <p>
            If you believe a refund request qualifies under the conditions
            described above, please contact:
          </p>

          <p className="font-medium text-slate-100">
            support@certificationdata.org
          </p>

          <p>
            Please include your certificate code, transaction date, account
            email address, and a clear description of the issue. Each request
            will be reviewed individually.
          </p>

          <p>
            CertificationData reserves the right to make the final decision
            regarding all refund requests, subject to applicable law.
          </p>
        </section>
      </div>
    </main>
  );
}
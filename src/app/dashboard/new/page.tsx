"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/app/lib/supabaseClient";
import { FREE_PLAN } from "@/app/config/freePlan";

const FREE_MAX_CERTS = FREE_PLAN.maxCerts;
const FREE_MAX_BYTES = FREE_PLAN.maxBytes;

export default function NewCertificatePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [acceptedDeclaration, setAcceptedDeclaration] = useState(false);
  const DECLARATION_VERSION = "v1";
  const [showDeclaration, setShowDeclaration] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!file) {
      setError("Please select a file to certify.");
      return;
    }

    if (!title.trim()) {
      setError("Please enter an asset title.");
      return;
    }

    if (!ownerName.trim()) {
      setError("Please enter the legal owner name (person or company).");
      return;
    }

    if (!acceptedDeclaration) {
      setError(
        "You must accept the legal declaration before creating a certificate."
      );
      return;
    }

    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();

      if (authError || !authData.user) {
        throw new Error("You must be logged in to create a certificate.");
      }

      const uid = authData.user.id;

      const { data: userAssets, count, error: assetsCountError } = await supabase
        .from("assets")
        .select("id", { count: "exact" })
        .eq("user_id", uid);

      if (assetsCountError) {
        console.error(assetsCountError);
        throw new Error("Could not check your current usage. Please try again.");
      }

      const currentCertCount =
        typeof count === "number" ? count : userAssets?.length || 0;

      let currentBytes = 0;

      if (userAssets && userAssets.length > 0) {
        const assetIds = userAssets.map((a) => a.id);

        const { data: filesData, error: filesError } = await supabase
          .from("asset_files")
          .select("file_size, asset_id")
          .in("asset_id", assetIds);

        if (filesError) {
          console.error(filesError);
          throw new Error("Could not check your storage usage. Please try again.");
        }

        currentBytes =
          filesData?.reduce((sum, f) => sum + (f.file_size ?? 0), 0) ?? 0;
      }

      const wouldExceedCertCount = currentCertCount >= FREE_MAX_CERTS;
      const wouldExceedStorage = currentBytes + file.size > FREE_MAX_BYTES;

      const { data: creditsData, error: creditsError } = await supabase
        .from("single_use_credits")
        .select("id, max_bytes, created_at")
        .eq("user_id", uid)
        .eq("is_used", false)
        .order("created_at", { ascending: true });

      if (creditsError) {
        console.error("Credits read error:", creditsError);
      }

      let creditToUse: { id: string; max_bytes: number } | null = null;

      if (creditsData && creditsData.length > 0) {
        const matchingCredit = (creditsData as any[]).find(
          (credit) => file.size <= credit.max_bytes
        );

        if (
          matchingCredit &&
          (wouldExceedCertCount || wouldExceedStorage)
        ) {
          creditToUse = {
            id: matchingCredit.id,
            max_bytes: matchingCredit.max_bytes,
          };
        }
      }

      if (!creditToUse) {
        if (wouldExceedCertCount || wouldExceedStorage) {
          setError(
            "You do not have a matching one-time certificate option for this file yet. Please go back and check your file size before continuing."
          );
          setLoading(false);
          return;
        }
      } else if (file.size > creditToUse.max_bytes) {
        setError(
          "Your available one-time certificate option does not cover this file size. Please check your file size again and choose a higher option."
        );
        setLoading(false);
        return;
      }

      const fileBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest("SHA-256", fileBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const fingerprint = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      const fileExt = file.name.split(".").pop() || "bin";
      const filePath = `${uid}/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.${fileExt}`;

      const { data: storageData, error: storageError } = await supabase.storage
        .from("certification-files")
        .upload(filePath, file);

      if (storageError) {
        console.error(storageError);
        throw new Error("File upload failed.");
      }

      const uploadedPath = storageData?.path || filePath;
      const fileType = file.type || "application/octet-stream";
      const fileSize = file.size;

      const { data: asset, error: assetError } = await supabase
        .from("assets")
        .insert({
          user_id: uid,
          title: title.trim(),
          description: description.trim() || null,
          owner_name: ownerName.trim(),
          fingerprint,
          declaration_accepted: true,
          declaration_accepted_at: new Date().toISOString(),
          declaration_version: DECLARATION_VERSION,
        })
        .select()
        .single();

      if (assetError || !asset) {
        console.error(assetError);
        throw new Error("Failed to create asset record.");
      }

      const { error: fileRecordError } = await supabase.from("asset_files").insert({
        asset_id: asset.id,
        file_path: uploadedPath,
        mime_type: fileType,
        file_type: fileType,
        file_size: fileSize,
        user_id: uid,
        is_primary: true,
      });

      if (fileRecordError) {
        console.error("fileRecordError:", fileRecordError);
        console.error(
          "fileRecordError JSON:",
          JSON.stringify(fileRecordError, null, 2)
        );

        throw new Error(
          "Failed to save file information. " +
            (fileRecordError?.message
              ? `Message: ${fileRecordError.message}`
              : "")
        );
      }

      const certificateCode = `CD-${Date.now()}-${Math.random()
        .toString(16)
        .slice(2, 6)
        .toUpperCase()}`;

      const { data: cert, error: certError } = await supabase
        .from("certificates")
        .insert({
          asset_id: asset.id,
          certificate_code: certificateCode,
        })
        .select()
        .single();

      if (certError || !cert) {
        console.error(certError);
        throw new Error("Failed to create certificate.");
      }

      if (creditToUse) {
        const { error: creditUpdateError } = await supabase
          .from("single_use_credits")
          .update({
            is_used: true,
            used_at: new Date().toISOString(),
          })
          .eq("id", creditToUse.id);

        if (creditUpdateError) {
          console.error("Credit update error:", creditUpdateError);
        }
      }

      router.push(`/certificates/${encodeURIComponent(certificateCode)}`);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.message || "Something went wrong while creating certificate."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
      <div className="w-full max-w-2xl px-4 py-8">
        <div className="mb-5">
          <p className="text-[11px] text-slate-500 mb-2">Step 2 of 2</p>
          <h1 className="text-2xl font-semibold mb-1">
            Complete your certificate
          </h1>
          <p className="text-sm text-slate-300">
            Fill out the certificate details and upload the file you want to
            certify. If you already purchased a matching one-time certificate
            option, it will be applied automatically.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/80 p-4"
        >

          <div className="text-left">
            <label className="block text-xs text-slate-300 mb-1">
              Asset title
            </label>
            <input
              type="text"
              required
              className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Short, descriptive title for your asset"
            />
          </div>

          <div className="text-left">
            <label className="block text-xs text-slate-300 mb-1">
              Description (optional)
            </label>
            <textarea
              className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500 min-h-[80px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your digital asset in detail.
Include what the content is, its purpose, format, and any distinguishing characteristics
(for example: music genre, 3D model type, video content, artwork style, version, creative purpose, technical details, or unique features or context).
A clear and accurate description strengthens the credibility and verifiability of your certificate."
            />
          </div>

          <div className="text-left">
            <label className="block text-xs text-slate-300 mb-1">
              Legal owner name (person or company)
            </label>
            <input
              type="text"
              required
              className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder="Full personal name or full company name"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              This name will appear on the certificate as the legal owner of the
              asset.
            </p>
          </div>

          <div className="text-left">
            <label className="block text-xs text-slate-300 mb-1">
              File to certify
            </label>
            <input
              type="file"
              required
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setFile(e.target.files[0]);
                }
              }}
              className="w-full text-sm text-slate-200 file:mr-3 file:rounded-md file:border-0 file:bg-emerald-500 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-slate-950 hover:file:bg-emerald-400"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Supported: PDFs, images, audio, video, 3D models and most other
              file types.
            </p>
          </div>

          {error && (
            <div className="rounded-md border border-red-900 bg-red-950/30 px-3 py-2">
              <p className="text-xs text-red-300">{error}</p>
            </div>
          )}

          <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3 text-[12px]">
            <p className="text-slate-100 font-medium mb-1">ⓘ Legal notice</p>
            <p className="text-slate-300 mb-2">
              Before creating a certificate, please confirm ownership and
              responsibility for the uploaded asset.
            </p>

            <button
              type="button"
              onClick={() => setShowDeclaration(true)}
              className="text-emerald-400 hover:underline text-[12px]"
            >
              Read full User Declaration & Legal Responsibility
            </button>

            <label className="mt-3 flex items-start gap-2 text-slate-300">
              <input
                type="checkbox"
                checked={acceptedDeclaration}
                onChange={(e) => setAcceptedDeclaration(e.target.checked)}
                className="mt-1 h-4 w-4 accent-emerald-500"
              />
              <span>
                I confirm that I am the legal owner (or authorized
                representative) of this asset and accept full responsibility for
                the information provided.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 inline-flex items-center justify-center px-4 py-2 rounded-md bg-emerald-500 text-slate-950 text-sm font-medium hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {loading ? "Creating certificate..." : "Create certificate"}
          </button>

          {showDeclaration && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
              role="dialog"
              aria-modal="true"
            >
              <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-950 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      User Declaration & Legal Responsibility
                    </p>
                    <p className="text-[12px] text-slate-400">
                      Version: {DECLARATION_VERSION}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowDeclaration(false)}
                    className="rounded-md border border-slate-800 px-3 py-1.5 text-xs text-slate-200 hover:border-emerald-500 hover:text-emerald-200 transition"
                  >
                    Close
                  </button>
                </div>

                <div className="max-h-[70vh] overflow-auto px-5 py-4 text-sm text-slate-300 leading-relaxed space-y-4">
                  <p>
                    By creating a certificate on CertificationData, you confirm
                    and agree to the following:
                  </p>

                  <div>
                    <p className="font-medium text-white">
                      1. Ownership & Authorization
                    </p>
                    <p>
                      You declare that you are the legal owner of the digital
                      asset you are certifying, or that you have full legal
                      rights and authorization from the rightful owner to
                      certify this asset.
                    </p>
                  </div>

                  <div>
                    <p className="font-medium text-white">
                      2. Accuracy of Information
                    </p>
                    <p>
                      You confirm that all information you provide — including
                      asset details, descriptions, and ownership information —
                      is accurate, truthful, and provided in good faith.
                    </p>
                  </div>

                  <div>
                    <p className="font-medium text-white">
                      3. Certification Scope
                    </p>
                    <p>
                      CertificationData records your digital asset using a
                      cryptographic fingerprint and timestamp, creating
                      verifiable proof of existence and declared ownership at a
                      specific point in time. This certification does not
                      replace official copyright, trademark, or patent
                      registration.
                    </p>
                  </div>

                  <div>
                    <p className="font-medium text-white">
                      4. User Responsibility
                    </p>
                    <p>
                      You acknowledge that CertificationData does not
                      independently verify ownership or legal rights related to
                      the uploaded content. Responsibility for the asset and its
                      legal status remains solely with you.
                    </p>
                  </div>

                  <div>
                    <p className="font-medium text-white">
                      5. Limitation of Liability
                    </p>
                    <p>
                      CertificationData, its operators, and affiliates shall not
                      be held liable for any claims, disputes, or damages
                      related to the certified asset.
                    </p>
                  </div>

                  <div>
                    <p className="font-medium text-white">6. Indemnification</p>
                    <p>
                      You agree to indemnify and hold harmless CertificationData
                      from any claims, losses, liabilities, or legal expenses
                      arising from your use of the service or violation of this
                      declaration.
                    </p>
                  </div>

                  <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-3 text-[12px] text-slate-400">
                    This declaration is required to issue a certificate.
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-slate-800 px-5 py-4">
                  <button
                    type="button"
                    onClick={() => setShowDeclaration(false)}
                    className="rounded-md border border-slate-800 px-4 py-2 text-xs text-slate-200 hover:border-emerald-500 hover:text-emerald-200 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </main>
  );
}
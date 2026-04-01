"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";

interface Props {
  certificateCode: string;
  assetId: string;
}

export function WatermarkPreviewRequest({ certificateCode, assetId }: Props) {
  const [email, setEmail] = useState("");
  const [requestType, setRequestType] = useState<"image_or_pdf">("image_or_pdf");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    setSubmitting(true);

    // ---------------------------------------------------------
    // 🧱 1) Kullanıcının kim olduğunu al
    // ---------------------------------------------------------
    const { data: auth, error: authErr } = await supabase.auth.getUser();
    if (authErr || !auth.user) {
      setError("You must be logged in to send a preview request.");
      setSubmitting(false);
      return;
    }
    const userId = auth.user.id;

    // ---------------------------------------------------------
    // 🧱 2) EN KRİTİK NOKTA:
    // Bu kullanıcı + bu asset + status="pending" → zaten istek var mı?
    // ---------------------------------------------------------
    const { count: pendingCount, error: pendingErr } = await supabase
      .from("watermark_preview_requests")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("asset_id", assetId)
      .eq("status", "pending");

    if (pendingErr) {
      console.error("Pending check error:", pendingErr);
    }

    if ((pendingCount ?? 0) > 0) {
      setError(
        "You already have a pending watermark preview request for this certificate. Please wait until it is processed before creating a new one."
      );
      setSubmitting(false);
      return;
    }

    // ---------------------------------------------------------
    // 🧱 3) E-mail kontrollü optional field
    // ---------------------------------------------------------
    const deliveryEmail = email.trim() || null;

    // ---------------------------------------------------------
    // 🧱 4) Yeni istek yarat
    // ---------------------------------------------------------
    const { error: insertErr } = await supabase.from("watermark_preview_requests").insert({
      user_id: userId,
      certificate_code: certificateCode,
      asset_id: assetId,
      delivery_email: deliveryEmail,
      request_type: requestType,
      notes: notes || null,
      status: "pending",
    });

    if (insertErr) {
      console.error(insertErr);
      setError("Failed to submit request. Please try again.");
      setSubmitting(false);
      return;
    }

    // ---------------------------------------------------------
    // 🧱 5) Başarılı
    // ---------------------------------------------------------
    setSuccess("Your watermark preview request has been created successfully.");
    setSubmitting(false);
    setEmail("");
    setNotes("");
  }

  return (
    <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/40 p-4">
      <h2 className="text-sm font-semibold text-slate-100 mb-2">
        Request a watermarked preview file
      </h2>

      <p className="text-[11px] text-slate-400 mb-4">
        You may request a protected preview (image or PDF).  
        For security reasons, you can only have one active (pending) request per certificate.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Email */}
        <div>
          <label className="block text-xs text-slate-300 mb-1">Delivery email (optional)</label>
          <input
            type="email"
            value={email}
            placeholder="your@email.com"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-slate-100"
          />
        </div>

        {/* Request type */}
        <div>
          <label className="block text-xs text-slate-300 mb-1">Preview type</label>
          <select
            value={requestType}
            onChange={(e) =>
              setRequestType(e.target.value as "image_or_pdf")
            }
            className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-slate-100"
          >
            <option value="image_or_pdf">Image / PDF preview (supported)</option>
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs text-slate-300 mb-1">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-slate-100"
            rows={3}
            placeholder="Additional explanation"
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-400 text-xs bg-red-900/40 border border-red-900 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        {/* Success */}
        {success && (
          <p className="text-emerald-300 text-xs bg-emerald-900/40 border border-emerald-900 rounded-md px-3 py-2">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full inline-flex items-center justify-center px-4 py-2 rounded-md bg-emerald-500 text-slate-950 text-xs font-semibold hover:bg-emerald-400 disabled:opacity-60"
        >
          {submitting ? "Submitting…" : "Send watermark preview request"}
        </button>
      </form>
    </div>
  );
}

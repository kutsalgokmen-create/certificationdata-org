import { NextResponse } from "next/server";
import * as QRCode from "qrcode";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { resolvePublicSiteOrigin } from "@/lib/siteUrl";
import { buildCertificatePdf } from "./buildCertificatePdf";

function getPublicOriginForPdf(): string {
  try {
    return resolvePublicSiteOrigin();
  } catch {
    return (process.env.SITE_URL || "https://certificationdata.org").replace(
      /\/$/,
      ""
    );
  }
}

export const runtime = "nodejs";

function formatBytes(bytes: number) {
  if (!bytes || bytes <= 0) return "0 B";

  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let value = bytes;

  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i++;
  }

  return `${value.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

function toUtcString(input: string | Date) {
  const date = typeof input === "string" ? new Date(input) : input;

  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  const hh = String(date.getUTCHours()).padStart(2, "0");
  const mi = String(date.getUTCMinutes()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd} ${hh}:${mi} UTC`;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ error: "Missing code" }, { status: 400 });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        {
          error:
            "Missing server Supabase env vars (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)",
        },
        { status: 500 }
      );
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    // 1) Certificate
    const { data: cert, error: certError } = await admin
      .from("certificates")
      .select("certificate_code, created_at, asset_id")
      .eq("certificate_code", code)
      .single();

    if (certError || !cert) {
      return NextResponse.json(
        { error: "Certificate not found" },
        { status: 404 }
      );
    }

    // 2) Asset
    const { data: asset, error: assetError } = await admin
      .from("assets")
      .select("id, title, description, fingerprint, owner_name, created_at")
      .eq("id", cert.asset_id)
      .single();

    if (assetError || !asset) {
      return NextResponse.json(
        { error: "Asset not found for this certificate" },
        { status: 404 }
      );
    }

    // 3) File info
    const { data: fileRow, error: fileError } = await admin
      .from("asset_files")
      .select("file_type, file_size")
      .eq("asset_id", asset.id)
      .limit(1)
      .maybeSingle();

    if (fileError) {
      return NextResponse.json(
        { error: "File info lookup failed" },
        { status: 500 }
      );
    }

    const origin = getPublicOriginForPdf();
    const verifyUrl = `${origin}/verify?code=${encodeURIComponent(
      cert.certificate_code
    )}`;

    // Logo (base64)
    const logoPath = path.join(process.cwd(), "public", "logo.png");
    let logoBase64 = "";

    try {
      const buffer = fs.readFileSync(logoPath);
      logoBase64 = `data:image/png;base64,${buffer.toString("base64")}`;
    } catch {
      logoBase64 = "";
    }

    // QR Code
    const qrBase64 = await QRCode.toDataURL(verifyUrl, {
      width: 1024,
      margin: 1,
    });

    // PDF üret
    const pdfBytes = buildCertificatePdf({
      certificateCode: cert.certificate_code,
      ownerName: asset.owner_name || "—",
      assetTitle: asset.title || "—",
      description: asset.description ?? "—",
      fingerprint: asset.fingerprint || "—",
      fileType: fileRow?.file_type || "—",
      fileSize: fileRow?.file_size
        ? formatBytes(fileRow.file_size)
        : "—",
      createdAtUTC: toUtcString(
        cert.created_at || asset.created_at || new Date()
      ),
      verifyUrl,
      qrBase64,
      logoBase64,
    });

    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${cert.certificate_code}.pdf"`,
      },
    });
  } catch (err) {
    console.error("PDF generation error:", err);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
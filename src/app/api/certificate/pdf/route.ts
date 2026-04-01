import { NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import * as QRCode from "qrcode";
import { createClient } from "@supabase/supabase-js";
import { certificateHtml } from "./template";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

function formatBytes(bytes: number) {
  if (!bytes || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let v = bytes;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

function toUtcString(d: string | Date) {
  const date = typeof d === "string" ? new Date(d) : d;
  // YYYY-MM-DD HH:mm UTC
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  const hh = String(date.getUTCHours()).padStart(2, "0");
  const mi = String(date.getUTCMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${mi} UTC`;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const siteUrl = process.env.SITE_URL || "https://certificationdata.org";

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { error: "Missing server Supabase env vars (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)" },
      { status: 500 }
    );
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // 1) certificates: code → asset_id
  const { data: cert, error: certError } = await admin
    .from("certificates")
    .select("certificate_code, created_at, asset_id")
    .eq("certificate_code", code)
    .single();

  if (certError || !cert) {
    return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
  }

  // 2) assets: asset_id → title/description/fingerprint/owner_name/created_at
  const { data: asset, error: assetError } = await admin
    .from("assets")
    .select("id, title, description, fingerprint, owner_name, created_at")
    .eq("id", cert.asset_id)
    .single();

  if (assetError || !asset) {
    return NextResponse.json({ error: "Asset not found for this certificate" }, { status: 404 });
  }

  // 3) asset_files: asset_id → file_type, file_size (en güncel satır varsayıyoruz)
  const { data: fileRow, error: fileError } = await admin
    .from("asset_files")
    .select("file_type, file_size")
    .eq("asset_id", asset.id)
    .limit(1)
    .maybeSingle();

  if (fileError) {
    return NextResponse.json({ error: "File info lookup failed" }, { status: 500 });
  }

  const verifyUrl = `${siteUrl.replace(/\/$/, "")}/certificates/${encodeURIComponent(
    cert.certificate_code
  )}`;

  // ✅ Logo base64 (public/logo.png)
const logoPath = path.join(process.cwd(), "public", "logo.png");
let logoBase64 = "";
try {
  const buf = fs.readFileSync(logoPath);
  logoBase64 = `data:image/png;base64,${buf.toString("base64")}`;
} catch {
  // logo yoksa sorun çıkarmasın
  logoBase64 = "";
}

  // 4) QR base64 (Data URL)
  const qrBase64 = await QRCode.toDataURL(verifyUrl, {
    width: 1024,   // yüksek kaliteli üret (PDF’de net çıkar)
    margin: 1,
  });
  
  // 5) Description otomatik küçültme: biz HTML/CSS ile çözeceğiz (sonraki adımda iyileştireceğiz)
  const description = asset.description ?? "";

  // 6) PDF HTML
  const html = certificateHtml({
    certificateCode: cert.certificate_code,
    ownerName: asset.owner_name || "—",
    assetTitle: asset.title || "—",
    description: description || "—",
    fingerprint: asset.fingerprint || "—",
    fileType: fileRow?.file_type || "—",
    fileSize: fileRow?.file_size ? formatBytes(fileRow.file_size) : "—",
    createdAtUTC: toUtcString(cert.created_at || asset.created_at || new Date()),
    verifyUrl,
    qrBase64,
    logoBase64,

  });

  // 7) Puppeteer + serverless Chromium (Vercel / AWS Lambda)
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBytes = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    const pdfBuffer = Buffer.from(pdfBytes);

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${cert.certificate_code}.pdf"`,
      },
    });
  } finally {
    await browser.close();
  }
}

"use client";

import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import QRCode from "qrcode";

function loadImageFromDataUrl(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = dataUrl;
  });
}

async function fetchAsDataUrl(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch: ${url}`);
  const blob = await res.blob();
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export default function BrandedQrPage() {
  const params = useParams();
  const code = params.code as string;

  const baseUrl = "https://certificationdata.org";
  const verifyUrl = useMemo(
    () => `${baseUrl}/certificates/${encodeURIComponent(code)}`,
    [baseUrl, code]
  );

  // Ekranda gösterim için (istersen bunu da local QR ile yapabiliriz)
  const qrPreviewUrl = useMemo(() => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=512x512&data=${encodeURIComponent(
      verifyUrl
    )}`;
  }, [verifyUrl]);

  const [downloading, setDownloading] = useState(false);
  const [dlError, setDlError] = useState<string | null>(null);

  async function handleDownloadBrandedQr() {
    setDlError(null);
    setDownloading(true);

    try {
      // 1) QR'ı local olarak DataURL üret (CORS yok)
      const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
        width: 360, // QR çizimde kullanacağımız boyut
        margin: 1,
        errorCorrectionLevel: "M",
      });

      // 2) Logo'yu local /public/logo.png’den DataURL olarak al
      const logoDataUrl = await fetchAsDataUrl("/logo.png");

      // 3) İkisini de Image objesine çevir
      const [qrImg, logoImg] = await Promise.all([
        loadImageFromDataUrl(qrDataUrl),
        loadImageFromDataUrl(logoDataUrl),
      ]);

      // 4) 512x512 canvas oluştur
      const size = 512;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas is not supported in this browser.");

      // Background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);

      // 5) Header (logo + brand)
      // Logo küçük
      const logoW = 44;
      const logoH = 44;
      const headerY = 22;
      const headerX = 24;

      ctx.drawImage(logoImg, headerX, headerY, logoW, logoH);

      ctx.fillStyle = "#0f172a"; // slate-900
      ctx.font = "700 18px Arial";
      ctx.fillText("CertificationData.org", headerX + logoW + 12, headerY + 22);

      ctx.fillStyle = "#334155"; // slate-600
      ctx.font = "400 12px Arial";
      ctx.fillText(
        "Verified Digital Certificates",
        headerX + logoW + 12,
        headerY + 40
      );

      // 6) QR + ince altın çerçeve
const qrSize = 360;
const framePadding = 10; // çerçeve boşluğu
const frameSize = qrSize + framePadding * 2;

const qrX = Math.round((size - qrSize) / 2);
const qrY = 96;

const frameX = Math.round((size - frameSize) / 2);
const frameY = qrY - framePadding;

// Altın çerçeve
ctx.strokeStyle = "#d4af37"; // klasik gold
ctx.lineWidth = 3;
ctx.strokeRect(frameX, frameY, frameSize, frameSize);

// QR
ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);


      // 7) Footer text
      ctx.fillStyle = "#0f172a";
      ctx.font = "700 14px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Scan to verify this certificate", size / 2, 480);

      ctx.fillStyle = "#64748b"; // slate-500
      ctx.font = "400 11px Arial";
      ctx.fillText("certificationdata.org", size / 2, 500);

      // 8) Download
      const pngData = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = pngData;
      a.download = `CertificationData-${code}-QR.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e: any) {
      setDlError(e?.message || "Failed to generate branded QR.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-center shadow-lg shadow-slate-950/60">
        {/* Branding */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <img
            src="/logo.png"
            alt="CertificationData"
            className="w-10 h-10 opacity-95"
          />
          <div className="text-left">
            <div className="text-base font-semibold text-white">
              CertificationData.org
            </div>
            <div className="text-[12px] text-slate-400">
              Verified Digital Certificates
            </div>
          </div>
        </div>

        {/* QR preview */}
        <div className="mx-auto inline-block rounded-xl bg-white p-3 border border-slate-700">
          <img
            src={qrPreviewUrl}
            alt="Verification QR"
            className="w-[320px] h-[320px] md:w-[420px] md:h-[420px]"
          />
        </div>

        <p className="mt-4 text-sm text-slate-300">
          Scan to verify this certificate
        </p>
        <p className="mt-1 text-[12px] text-slate-400 break-all">{verifyUrl}</p>

        {/* Download button */}
        <div className="mt-5 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={handleDownloadBrandedQr}
            disabled={downloading}
            className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-emerald-500 text-slate-950 text-sm font-medium hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {downloading ? "Preparing..." : "Download branded QR (512×512 PNG)"}
          </button>

          <p className="text-[12px] text-slate-400">
            This download includes the QR + CertificationData branding in one image.
          </p>

          {dlError && (
            <p className="text-[12px] text-red-400 border border-red-900 bg-red-950/30 rounded-md px-3 py-2">
              {dlError}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

import { jsPDF } from "jspdf";

export type CertificatePdfInput = {
  certificateCode: string;
  ownerName: string;
  assetTitle: string;
  description: string;
  fingerprint: string;
  fileType: string;
  fileSize: string;
  createdAtUTC: string;
  verifyUrl: string;
  qrBase64: string;
  logoBase64: string;
};

const GOLD: [number, number, number] = [212, 175, 55];
const DARK: [number, number, number] = [22, 22, 22];
const TEXT: [number, number, number] = [34, 34, 34];
const MUTED: [number, number, number] = [88, 88, 88];
const LIGHT_BG: [number, number, number] = [255, 248, 230];
const STAMP: [number, number, number] = [205, 138, 138]; // gül kurusu

function safeAddImage(
  doc: jsPDF,
  dataUrl: string,
  format: "PNG" | "JPEG",
  x: number,
  y: number,
  w: number,
  h: number
): boolean {
  try {
    doc.addImage(dataUrl, format, x, y, w, h);
    return true;
  } catch {
    return false;
  }
}

function wrapText(doc: jsPDF, value: string, width: number): string[] {
  return doc.splitTextToSize(value?.trim() ? value : "—", width) as string[];
}

function fitImage(
  imgW: number,
  imgH: number,
  maxW: number,
  maxH: number
): { w: number; h: number } {
  if (!imgW || !imgH) {
    return { w: maxW, h: maxH };
  }

  const scale = Math.min(maxW / imgW, maxH / imgH);

  return {
    w: imgW * scale,
    h: imgH * scale,
  };
}

function drawFieldRow(
  doc: jsPDF,
  y: number,
  label: string,
  value: string,
  labelX: number,
  valueX: number,
  valueWidthMm: number,
  underlineEndX: number,
  mono = false
): number {
  const lineH = mono ? 3.9 : 4.35;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...TEXT);
  doc.text(label, labelX, y);

  doc.setFont(mono ? "courier" : "helvetica", "normal");
  doc.setFontSize(mono ? 7.3 : 9);
  doc.setTextColor(...TEXT);

  const lines: string[] = wrapText(doc, value, valueWidthMm);
  let vy = y;

  lines.forEach((line: string) => {
    doc.text(line, valueX, vy);
    vy += lineH;
  });

  const lastBaseline = vy - lineH;
  const lineY = lastBaseline + 2.6;

  doc.setDrawColor(210, 210, 210);
  doc.setLineWidth(0.18);
  doc.line(labelX, lineY, underlineEndX, lineY);

  return lineY + 4.2;
}

function drawDescriptionBlock(
  doc: jsPDF,
  y: number,
  labelX: number,
  valueX: number,
  valueWidthMm: number,
  underlineEndX: number,
  description: string
): number {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...TEXT);
  doc.text("Asset Description", labelX, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...TEXT);

  const desc = description?.trim() ? description : "—";
  const descLinesAll: string[] = wrapText(doc, desc, valueWidthMm);
  const maxDescLines = 7;
  const descLines = [...descLinesAll.slice(0, maxDescLines)];

  if (descLinesAll.length > maxDescLines) {
    const last = descLines[maxDescLines - 1] || "";
    descLines[maxDescLines - 1] =
      last.length > 3 ? `${last.slice(0, Math.max(0, last.length - 3))}...` : "...";
  }

  let dy = y;

  descLines.forEach((line: string) => {
    doc.text(line, valueX, dy);
    dy += 4.25;
  });

  const lineY = dy - 4.25 + 2.6;

  doc.setDrawColor(210, 210, 210);
  doc.setLineWidth(0.18);
  doc.line(labelX, lineY, underlineEndX, lineY);

  return lineY + 4.2;
}

function drawQrPanel(
  doc: jsPDF,
  x: number,
  y: number,
  size: number,
  qrBase64: string,
  verifyUrl: string
) {
  const outerX = x - 4.5;
  const outerY = y - 4.5;
  const outerW = size + 9;
  const outerH = size + 28;

  doc.setDrawColor(150, 150, 150);
  doc.setLineWidth(0.22);
  doc.roundedRect(outerX, outerY, outerW, outerH, 2.2, 2.2, "S");

  doc.setDrawColor(205, 205, 205);
  doc.setLineWidth(0.12);
  doc.roundedRect(x - 1.2, y - 1.2, size + 2.4, size + 2.4, 1.2, 1.2, "S");

  safeAddImage(doc, qrBase64, "PNG", x, y, size, size);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.2);
  doc.setTextColor(...TEXT);
  doc.text("Scan to verify", x + size / 2, y + size + 6.2, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.8);
  doc.setTextColor(...MUTED);

  const urlLines: string[] = wrapText(doc, verifyUrl, size + 2);
  let uy = y + size + 10.4;

  urlLines.slice(0, 4).forEach((ul: string) => {
    doc.text(ul, x + size / 2, uy, { align: "center" });
    uy += 2.8;
  });
}

function drawStamp(doc: jsPDF, centerX: number, centerY: number) {
  const angle = -10;

  doc.setDrawColor(...STAMP);
  doc.setTextColor(...STAMP);
  doc.setLineWidth(0.45);

  // jsPDF ellipse rotate etmiyor; bu yüzden yazıyı eğimli tutup
  // çerçeveyi daha zarif ölçülerle kullanıyoruz.
  doc.ellipse(centerX, centerY, 28, 15, "S");
  doc.ellipse(centerX, centerY, 24.5, 11.8, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.text("CertificationData", centerX, centerY - 1, {
    align: "center",
    angle,
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.2);
  doc.text("Verified Digital Record", centerX, centerY + 5, {
    align: "center",
    angle,
  });

  doc.setTextColor(...TEXT);
}

export function buildCertificatePdf(data: CertificatePdfInput): Uint8Array {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  const m = 16;
  const labelX = m;
  const valueX = m + 50;
  const valueW = 66;
  const qrX = 149;
  const qrSize = 34;
  const tableLineEndX = 134;

  // Outer frames
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.45);
  doc.rect(9, 9, pageW - 18, pageH - 18);

  doc.setLineWidth(0.2);
  doc.rect(11, 11, pageW - 22, pageH - 22);

  let y = m;

  // Logo: yaklaşık %30 büyütüldü ve kenarlardan biraz uzaklaştırıldı
  if (data.logoBase64) {
    const props = doc.getImageProperties(data.logoBase64);
    const fitted = fitImage(props.width, props.height, 23.4, 11.7);
    safeAddImage(doc, data.logoBase64, "PNG", m + 1.5, y - 0.2, fitted.w, fitted.h);
  } else {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...DARK);
    doc.text("CertificationData", m + 1.5, y + 4.2);
  }

  // Header right
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.3);
  doc.setTextColor(...MUTED);
  doc.text("Digital Creation Certification", pageW - m, y + 2.3, {
    align: "right",
  });
  doc.text("www.CertificationData.org", pageW - m, y + 6.7, {
    align: "right",
  });

  // Main title + content biraz aşağı kaydırıldı
  y = 33.5;

  doc.setFont("times", "bold");
  doc.setFontSize(18.5);
  doc.setTextColor(...DARK);
  doc.text("DIGITAL ASSET CERTIFICATE", pageW / 2, y, { align: "center" });

  y += 6.8;

  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.32);
  doc.line(74, y, pageW - 74, y);

  y += 8.7;

  // Certificate badge
  const bandText = `CERTIFICATE CODE   ${data.certificateCode}`;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.4);

  const tw = doc.getTextWidth(bandText);
  const bandW = Math.min(pageW - 2 * m, tw + 16);
  const bandX = (pageW - bandW) / 2;

  doc.setFillColor(...LIGHT_BG);
  doc.setDrawColor(...GOLD);
  doc.roundedRect(bandX, y - 4.5, bandW, 9, 2, 2, "FD");

  doc.setTextColor(...TEXT);
  doc.text(bandText, pageW / 2, y + 0.5, { align: "center" });

  y += 12.5;

  // Lead
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.8);
  doc.setTextColor(70, 70, 70);

  const lead =
    "This document certifies the existence and ownership of the digital asset described below.";
  const leadLines: string[] = wrapText(doc, lead, pageW - 2 * m);

  leadLines.forEach((ln: string) => {
    doc.text(ln, pageW / 2, y, { align: "center" });
    y += 4.1;
  });

  y += 5.2;

  const fieldsStartY = y;
  let fieldY = fieldsStartY;

  fieldY = drawFieldRow(
    doc,
    fieldY,
    "Certificate Code",
    data.certificateCode,
    labelX,
    valueX,
    valueW,
    tableLineEndX,
    false
  );

  fieldY = drawFieldRow(
    doc,
    fieldY,
    "Legal Owner Name",
    data.ownerName,
    labelX,
    valueX,
    valueW,
    tableLineEndX,
    false
  );

  fieldY = drawFieldRow(
    doc,
    fieldY,
    "Asset Title",
    data.assetTitle,
    labelX,
    valueX,
    valueW,
    tableLineEndX,
    false
  );

  fieldY = drawDescriptionBlock(
    doc,
    fieldY,
    labelX,
    valueX,
    valueW,
    tableLineEndX,
    data.description
  );

  fieldY = drawFieldRow(
    doc,
    fieldY,
    "Creation Timestamp (UTC)",
    data.createdAtUTC,
    labelX,
    valueX,
    valueW,
    tableLineEndX,
    false
  );

  fieldY = drawFieldRow(
    doc,
    fieldY,
    "File Type",
    data.fileType,
    labelX,
    valueX,
    valueW,
    tableLineEndX,
    false
  );

  fieldY = drawFieldRow(
    doc,
    fieldY,
    "File Size",
    data.fileSize,
    labelX,
    valueX,
    valueW,
    tableLineEndX,
    false
  );

  fieldY = drawFieldRow(
    doc,
    fieldY,
    "Fingerprint (SHA-256)",
    data.fingerprint,
    labelX,
    valueX,
    valueW,
    tableLineEndX,
    true
  );

  drawQrPanel(doc, qrX, fieldsStartY + 2, qrSize, data.qrBase64, data.verifyUrl);

  drawStamp(doc, pageW / 2, pageH * 0.675);

  // Footer
  const footTop = pageH - 33;

  doc.setDrawColor(150, 150, 150);
  doc.setLineWidth(0.2);
  doc.line(m, footTop, pageW - m, footTop);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.2);
  doc.setTextColor(...MUTED);
  doc.text("CertificationData.org", m, footTop + 4.5);

  const disclaimer =
    "This certificate records your digital asset on CertificationData with a cryptographic fingerprint and timestamp, providing verifiable proof of existence and ownership. Our certificates are designed to provide a verifiable technical record (fingerprint + timestamp). It does not replace official copyright or patent registration or local intellectual property law or official registration.";

  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.8);

  const footLines: string[] = wrapText(doc, disclaimer, pageW - 2 * m);
  let fy = footTop + 8.2;

  footLines.slice(0, 6).forEach((fl: string) => {
    doc.text(fl, m, fy);
    fy += 2.9;
  });

  const buf = doc.output("arraybuffer");
  return new Uint8Array(buf);
}
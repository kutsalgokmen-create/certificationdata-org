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
const MUTED: [number, number, number] = [68, 68, 68];
const LIGHT_BG: [number, number, number] = [255, 248, 230];
const STAMP: [number, number, number] = [198, 0, 0];

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

function drawCenteredText(
  doc: jsPDF,
  text: string,
  y: number,
  font: "helvetica" | "times" | "courier",
  style: "normal" | "bold",
  size: number,
  color: [number, number, number]
) {
  doc.setFont(font, style);
  doc.setFontSize(size);
  doc.setTextColor(...color);
  doc.text(text, doc.internal.pageSize.getWidth() / 2, y, { align: "center" });
}

function wrapText(doc: jsPDF, value: string, width: number): string[] {
  return doc.splitTextToSize(value?.trim() ? value : "—", width) as string[];
}

function drawFieldRow(
  doc: jsPDF,
  y: number,
  label: string,
  value: string,
  labelX: number,
  valueX: number,
  valueWidthMm: number,
  mono = false
): number {
  const lineH = mono ? 3.9 : 4.2;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...TEXT);
  doc.text(label, labelX, y);

  doc.setFont(mono ? "courier" : "helvetica", "normal");
  doc.setFontSize(mono ? 7.6 : 9);
  doc.setTextColor(...TEXT);

  const lines: string[] = wrapText(doc, value, valueWidthMm);
  const blockH = Math.max(1, lines.length) * lineH;

  let vy = y;
  lines.forEach((line: string) => {
    doc.text(line, valueX, vy);
    vy += lineH;
  });

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.1);
  doc.line(labelX, y + blockH + 0.8, valueX + valueWidthMm, y + blockH + 0.8);

  return y + blockH + 4;
}

function drawDescriptionBlock(
  doc: jsPDF,
  y: number,
  labelX: number,
  valueX: number,
  valueWidthMm: number,
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
  const maxDescLines = 8;
  const descLines = [...descLinesAll.slice(0, maxDescLines)];

  if (descLinesAll.length > maxDescLines) {
    const last = descLines[maxDescLines - 1] || "";
    descLines[maxDescLines - 1] =
      last.length > 3 ? `${last.slice(0, Math.max(0, last.length - 3))}...` : "...";
  }

  let dy = y;
  descLines.forEach((line: string) => {
    doc.text(line, valueX, dy);
    dy += 4.2;
  });

  doc.setLineWidth(0.1);
  doc.line(labelX, dy + 0.2, valueX + valueWidthMm, dy + 0.2);

  return dy + 3.2;
}

function drawQrPanel(
  doc: jsPDF,
  x: number,
  y: number,
  size: number,
  qrBase64: string,
  verifyUrl: string
) {
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.18);
  doc.roundedRect(x - 5, y - 5, size + 10, size + 34, 2.5, 2.5, "S");

  safeAddImage(doc, qrBase64, "PNG", x, y, size, size);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...TEXT);
  doc.text("Scan to verify", x + size / 2, y + size + 7, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(85, 85, 85);

  const urlLines: string[] = wrapText(doc, verifyUrl, size + 8);
  let uy = y + size + 11;
  urlLines.slice(0, 4).forEach((ul: string) => {
    doc.text(ul, x + size / 2, uy, { align: "center" });
    uy += 3.2;
  });
}

function drawStamp(doc: jsPDF, centerX: number, centerY: number) {
  doc.setTextColor(...STAMP);
  doc.setDrawColor(...STAMP);
  doc.setLineWidth(0.7);

  doc.ellipse(centerX, centerY, 34, 18, "S");
  doc.ellipse(centerX, centerY, 30, 14.5, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("CertificationData", centerX, centerY - 1.5, {
    align: "center",
    angle: -10,
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Verified Digital Record", centerX, centerY + 5.5, {
    align: "center",
    angle: -10,
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
  const valueW = 74;
  const qrX = 145;
  const qrSize = 42;

  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.45);
  doc.rect(9, 9, pageW - 18, pageH - 18);

  doc.setLineWidth(0.2);
  doc.rect(11, 11, pageW - 22, pageH - 22);

  let y = m;

  // Header
  if (data.logoBase64) {
    const ok = safeAddImage(doc, data.logoBase64, "PNG", m, y - 3, 28, 12);
    if (!ok) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(...DARK);
      doc.text("CertificationData", m, y + 5);
    }
  } else {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(...DARK);
    doc.text("CertificationData", m, y + 5);
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...MUTED);
  doc.text("Digital Creation Certification", pageW - m, y + 2.5, {
    align: "right",
  });
  doc.text("www.CertificationData.org", pageW - m, y + 7.2, {
    align: "right",
  });

  y = 31;

  // Title
  drawCenteredText(
    doc,
    "DIGITAL ASSET CERTIFICATE",
    y,
    "times",
    "bold",
    19,
    DARK
  );

  y += 7;
  doc.setTextColor(...GOLD);
  doc.setFont("courier", "normal");
  doc.setFontSize(11);
  doc.text("────────────────────────", pageW / 2, y, { align: "center" });
  y += 8;

  // Certificate code band
  const bandText = `CERTIFICATE CODE   ${data.certificateCode}`;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  const tw = doc.getTextWidth(bandText);
  const bandW = Math.min(pageW - 2 * m, tw + 16);
  const bandX = (pageW - bandW) / 2;

  doc.setFillColor(...LIGHT_BG);
  doc.setDrawColor(...GOLD);
  doc.roundedRect(bandX, y - 4.5, bandW, 9, 2, 2, "FD");
  doc.setTextColor(...TEXT);
  doc.text(bandText, pageW / 2, y + 0.5, { align: "center" });

  y += 12;

  // Lead
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(51, 51, 51);
  const lead =
    "This document certifies the existence and ownership of the digital asset described below.";
  const leadLines: string[] = wrapText(doc, lead, pageW - 2 * m);

  leadLines.forEach((ln: string) => {
    doc.text(ln, pageW / 2, y, { align: "center" });
    y += 4.2;
  });

  y += 4;

  // Main content
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
    false
  );

  fieldY = drawDescriptionBlock(
    doc,
    fieldY,
    labelX,
    valueX,
    valueW,
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
    true
  );

  // QR panel
  drawQrPanel(doc, qrX, fieldsStartY + 2, qrSize, data.qrBase64, data.verifyUrl);

  // Red stamp
  drawStamp(doc, pageW / 2, pageH * 0.66);

  // Footer
  const footTop = pageH - 33;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(m, footTop, pageW - m, footTop);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(85, 85, 85);
  doc.text("CertificationData.org", m, footTop + 5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.2);
  doc.setTextColor(...MUTED);

  const disclaimer =
    "This certificate records your digital asset on CertificationData with a cryptographic fingerprint and timestamp, providing verifiable proof of existence and ownership. Our certificates are designed to provide a verifiable technical record (fingerprint + timestamp). It does not replace official copyright or patent registration or local intellectual property law or official registration.";

  const footLines: string[] = wrapText(doc, disclaimer, pageW - 2 * m);
  let fy = footTop + 9;

  footLines.slice(0, 6).forEach((fl: string) => {
    doc.text(fl, m, fy);
    fy += 3.35;
  });

  const buf = doc.output("arraybuffer");
  return new Uint8Array(buf);
}
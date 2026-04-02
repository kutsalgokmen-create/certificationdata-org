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

function drawFieldRow(
  doc: jsPDF,
  y: number,
  label: string,
  value: string,
  labelX: number,
  valueX: number,
  valueWidthMm: number,
  mono: boolean
): number {
  const lineH = mono ? 3.8 : 4.1;

  doc.setTextColor(34, 34, 34);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(label, labelX, y);

  doc.setFont(mono ? "courier" : "helvetica", "normal");
  doc.setFontSize(mono ? 7.5 : 9);

  const lines: string[] = doc.splitTextToSize(
    value?.trim() ? value : "—",
    valueWidthMm
  );

  const blockH = Math.max(1, lines.length) * lineH;

  let vy = y;

  lines.forEach((line: string) => {
    doc.text(line, valueX, vy);
    vy += lineH;
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  return y + blockH + 2.5;
}

export function buildCertificatePdf(
  data: CertificatePdfInput
): Uint8Array {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  const m = 16;
  const labelX = m;
  const valueX = m + 52;
  const valueW = 72;
  const qrX = 142;
  const qrSize = 50;

  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.45);
  doc.rect(9, 9, pageW - 18, pageH - 18);

  doc.setLineWidth(0.2);
  doc.rect(11, 11, pageW - 22, pageH - 22);

  let y = m;

  const headerTextX = m + 36;

  if (data.logoBase64) {
    const ok = safeAddImage(doc, data.logoBase64, "PNG", m, y - 2, 32, 12);
    if (!ok) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text("CertificationData", m, y + 6);
    }
  } else {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("CertificationData", m, y + 6);
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text("Digital Creation Certification", headerTextX, y + 3);
  doc.text("www.CertificationData.org", headerTextX, y + 7.5);

  y = m + 26;

  doc.setFont("times", "bold");
  doc.setFontSize(19);
  doc.text("DIGITAL ASSET CERTIFICATE", pageW / 2, y, {
    align: "center",
  });

  y += 8;
  doc.setLineWidth(0.3);
  doc.line(52, y, pageW - 52, y);

  y += 8;

  const bandText = `CERTIFICATE CODE   ${data.certificateCode}`;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);

  const tw = doc.getTextWidth(bandText);
  const bandW = Math.min(pageW - 2 * m, tw + 16);
  const bandX = (pageW - bandW) / 2;

  doc.setFillColor(255, 248, 230);
  doc.roundedRect(bandX, y - 4.5, bandW, 9, 2, 2, "FD");

  doc.text(bandText, pageW / 2, y + 0.5, { align: "center" });

  y += 12;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  const lead =
    "This document certifies the existence and ownership of the digital asset described below.";

  const leadLines: string[] = doc.splitTextToSize(
    lead,
    pageW - 2 * m
  );

  leadLines.forEach((ln: string) => {
    doc.text(ln, pageW / 2, y, { align: "center" });
    y += 4.2;
  });

  y += 3;

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

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Asset Description", labelX, fieldY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  const desc = data.description?.trim() ? data.description : "—";

  const descLinesAll: string[] = doc.splitTextToSize(desc, valueW);

  const maxDescLines = 11;
  let descLines = descLinesAll.slice(0, maxDescLines);

  if (descLinesAll.length > maxDescLines) {
    const last = descLines[maxDescLines - 1];
    if (last && last.length > 3) {
      descLines[maxDescLines - 1] =
        last.slice(0, last.length - 3) + "...";
    }
  }

  let dy = fieldY;

  descLines.forEach((line: string) => {
    doc.text(line, valueX, dy);
    dy += 4.1;
  });

  fieldY = dy + 2.5;

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

  const qrY = fieldsStartY;

  doc.roundedRect(qrX - 3, qrY - 3, qrSize + 6, qrSize + 22, 2.5, 2.5);

  safeAddImage(doc, data.qrBase64, "PNG", qrX, qrY, qrSize, qrSize);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("Scan to verify", qrX + qrSize / 2, qrY + qrSize + 6, {
    align: "center",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);

  const urlLines: string[] = doc.splitTextToSize(
    data.verifyUrl,
    qrSize + 8
  );

  let uy = qrY + qrSize + 10;

  urlLines.slice(0, 4).forEach((ul: string) => {
    doc.text(ul, qrX + qrSize / 2, uy, { align: "center" });
    uy += 3.2;
  });

  const footTop = pageH - 34;

  doc.line(m, footTop, pageW - m, footTop);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("CertificationData.org", m, footTop + 5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);

  const disclaimer =
    "This certificate records your digital asset on CertificationData with a cryptographic fingerprint and timestamp, providing verifiable proof of existence and ownership.";

  const footLines: string[] = doc.splitTextToSize(
    disclaimer,
    pageW - 2 * m
  );

  let fy = footTop + 9;

  footLines.forEach((fl: string) => {
    doc.text(fl, m, fy);
    fy += 3.4;
  });

  const buf = doc.output("arraybuffer");

  return new Uint8Array(buf);
}
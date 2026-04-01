export function certificateHtml(data: {
    certificateCode: string;
    ownerName: string;
    assetTitle: string;
    description?: string;
    fingerprint: string;
    fileType: string;
    fileSize: string;
    createdAtUTC: string;
    verifyUrl: string;
    qrBase64: string;
    logoBase64?: string;
  }) {  
    
    const brandHtml = data.logoBase64
    ? `<img src="${data.logoBase64}" class="brandLogo" alt="CertificationData logo" />`
    : `<div class="logoText">CertificationData</div>`;

    return `
  <!DOCTYPE html>
  <html>
  <head>
  <meta charset="utf-8" />
  <style>
    @page { size: A4; margin: 0; }
  
    html, body {
      width: 210mm;
      height: 297mm;
      margin: 0;
      padding: 0;
    }
  
    .page {
      width: 210mm;
      height: 297mm;
      padding: 22mm;
      box-sizing: border-box;
      overflow: hidden;     /* 🔑 2. sayfayı öldüren satır */
      position: relative;
      font-family: Arial, Helvetica, sans-serif;
    }

  
    /* Header */
    .header {
      display:flex;
      justify-content:space-between;
      align-items:center;
    }
    .logo { font-weight: 700; font-size: 18px; }
    .subtitle { font-size: 12px; color:#444; }
    .brand { display:flex; align-items:center; gap:10px; }
    .brandLogo { height: 60px; width: auto; display:block; max-height: none; } /* ~%30 bigger */
    .logoText { font-weight: 700; font-size: 18px; }


 
    .serialBand {
      margin: 12px auto 10px;
      width: fit-content;
      padding: 8px 14px;
      border-radius: 999px;
      border: 1px solid rgba(212,175,55,0.70);
      background: rgba(212,175,55,0.10);
      font-size: 11px;
      color: #222;
      letter-spacing: 0.8px;
    }

   .serialBand .label {
      font-weight: 700;
     margin-right: 8px;
    }

   .serialBand .code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
      font-weight: 700;
    }

    /* Title */
    h1 {
      text-align:center;
      font-family: "Times New Roman", serif;
      font-size: 26px;
      margin: 10px 0 6px;
      letter-spacing: 0.5px;
    }
    .divider {
      text-align:center;
      color:#d4af37;
      margin-bottom: 10px;
    }
    .lead {
      text-align:center;
      font-size: 12px;
      color:#333;
      margin: 0 18px 14px;
      line-height: 1.35;
    }
  
    /* ✅ Main 2-column layout */
    .main {
      display: grid;
      grid-template-columns: 1fr 190px; /* right column reserved for QR */
      gap: 16px;
      align-items: start;
      max-height: 560px; /* A4 içeriğe göre güvenli */
    }
  
    /* Left table */
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12.5px;
    }
    tr { border-bottom: 1px solid rgba(0,0,0,0.06); }
    td {
      padding: 7px 6px;
      vertical-align: top;
    }
    td.label {
      font-weight: 700;
      width: 38%;
      color: #222;
    }
    .mono {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
      word-break: break-all;
      font-size: 10.5px;
      line-height: 1.25;
    }
  
    /* ✅ Description auto-shrink (simple + safe) */
    .desc {
      font-size: 12px;
      line-height: 1.4;
      color: #222;
      display: -webkit-box;
     -webkit-box-orient: vertical;
      overflow: hidden;
      max-height: 90px; 
    }
    .desc.small { font-size: 11px; }
    .desc.tiny { font-size: 10px; }
  
    /* Right QR block (no overlap) */
    .qrBox {
      border: 1px solid rgba(0,0,0,0.10);
      border-radius: 10px;
      background: rgba(255,255,255,0.55);
      padding: 10px;
      text-align:center;
    }
    .qrBox img {
      width: 170px;   /* ✅ smaller */
      height: 170px;
      background: white;
      border-radius: 8px;
      border: 1px solid rgba(0,0,0,0.15);
    }
    .qrHint {
      font-size: 10.5px;
      color:#333;
      margin-top: 8px;
      line-height: 1.25;
    }
    .verifyUrl {
      margin-top: 6px;
      font-size: 9.5px;
      color:#555;
      word-break: break-all;
    }
  
    /* ✅ Stamp: behind content, smaller, no overlap feeling */
    .stamp {
      position: absolute;
      left: 50%;
      top: 68%;
      transform: translate(-50%, -50%) rotate(-10deg);
      width: 220px;
      height: 160px;
      border-radius: 999px;

      border: 3.5px solid rgba(198, 0, 0, 0.85);
      color: rgba(198, 0, 0, 0.85);

      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;

      font-weight: 800;
      font-size: 14px;
      letter-spacing: 1px;

      opacity: 0.28;              /* 🔑 solukluk burada */
      pointer-events: none;
    }
    .frameOuter {
      position: absolute;
      inset: 10mm;
      border: 2px solid #d4af37;
      pointer-events: none;
    }

    .frameInner {
      position: absolute;
      inset: 12mm;
      border: 1px solid rgba(212,175,55,0.65);
      pointer-events: none;
    }

  
    /* Footer */
    .footer {
     position: absolute;
     left: 22mm;
     right: 22mm;
     bottom: 18mm;
     font-size: 9.5px;
     color: #444;
     border-top: 1px solid rgba(0,0,0,0.20);
     padding-top: 6px;
     line-height: 1.25;
     box-sizing: border-box;
     word-break: break-word;
    }

     .muted { color:#555; }
  </style>
  </head>
  
  <body>
    <div class="page">

      <div class="frameOuter"></div>
      <div class="frameInner"></div>

      <div class="header">
       <div class="brand">${brandHtml}</div>
       
      <div class="subtitle">Digital Creation Certification</div>
      <div class="subtitle">www.CertificationData.org</div>
   </div>

      <h1>DIGITAL ASSET CERTIFICATE</h1>

      <div class="divider">────────────────────────</div>
      <div class="serialBand">
  <span class="label">CERTIFICATE CODE</span>
  <span class="code">${data.certificateCode}</span>
</div>

      <p class="lead">
        This document certifies the existence and ownership of the digital asset described below.
      </p>

      <div class="main">
        <!-- LEFT: Data -->
        <div>
          <table>
            <tr><td class="label">Certificate Code</td><td>${data.certificateCode}</td></tr>
            <tr><td class="label">Legal Owner Name</td><td>${data.ownerName}</td></tr>
            <tr><td class="label">Asset Title</td><td>${data.assetTitle}</td></tr>
            <tr>
              <td class="label">Asset Description</td>
              <td class="desc ${autoDescClass(data.description || "")}">
                ${escapeHtml(data.description || "—")}
              </td>
            </tr>
            <tr><td class="label">Creation Timestamp (UTC)</td><td>${data.createdAtUTC}</td></tr>
            <tr><td class="label">File Type</td><td>${data.fileType}</td></tr>
            <tr><td class="label">File Size</td><td>${data.fileSize}</td></tr>
            <tr><td class="label">Fingerprint (SHA-256)</td><td class="mono">${data.fingerprint}</td></tr>
          </table>
        </div>
  
        <!-- RIGHT: QR -->
        <div class="qrBox">
          <img src="${data.qrBase64}" alt="QR" />
          <div class="qrHint"><strong>Scan to verify</strong></div>
          <div class="verifyUrl">${data.verifyUrl}</div>
        </div>
      </div>
  
      <div class="stamp">
        CertificationData<br/>
        Verified Digital Record
      </div>
  
      <div class="footer">
        <div class="muted">CertificationData.org</div>
        This certificate records your digital asset on CertificationData with a cryptographic fingerprint and timestamp, 
        providing verifiable proof of existence and ownership. 
        Our certificates are designed to provide a verifiable technical record (fingerprint + timestamp). 
        It does not replace official copyright or patent registration or local intellectual property law or official registration.
      </div>
    </div>
  </body>
  </html>
  `;
  }
  
  /** simple font auto-shrink for description length */
  function autoDescClass(desc: string) {
    const n = (desc || "").trim().length;
    if (n > 360) return "desc tiny";
    if (n > 200) return "desc small";
    return "desc";
  }
  
  /** prevents HTML breaking if description has < > etc. */
  function escapeHtml(s: string) {
    return s
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }
  
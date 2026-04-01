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
  }) {
    return `
  <!DOCTYPE html>
  <html>
  <head>
  <meta charset="utf-8" />
  <style>
    @page {
      size: A4;
      margin: 20mm 18mm;
    }
  
    body {
      font-family: Arial, sans-serif;
      background: #fafaf7;
      color: #111;
    }
  
    .page {
      border: 2px solid #d4af37;
      padding: 24px;
      position: relative;
      height: 100%;
    }
  
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
  
    .logo {
      font-weight: bold;
      font-size: 18px;
    }
  
    .subtitle {
      font-size: 12px;
      color: #444;
    }
  
    h1 {
      text-align: center;
      font-family: "Times New Roman", serif;
      font-size: 28px;
      margin: 20px 0 10px;
    }
  
    .divider {
      text-align: center;
      color: #d4af37;
      margin-bottom: 20px;
    }
  
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
  
    td {
      padding: 6px 4px;
      vertical-align: top;
    }
  
    td.label {
      font-weight: bold;
      width: 35%;
    }
  
    .fingerprint {
      font-family: monospace;
      word-break: break-all;
    }
  
    .qr {
      position: absolute;
      right: 24px;
      bottom: 120px;
      text-align: center;
    }
  
    .qr img {
      width: 120mm;
      height: 120mm;
    }
  
    .stamp {
      position: absolute;
      left: 50%;
      bottom: 140px;
      transform: translateX(-50%) rotate(-6deg);
      border: 3px solid #c60000;
      color: #c60000;
      border-radius: 50%;
      padding: 26px 36px;
      font-weight: bold;
      font-size: 18px;
      opacity: 0.22;
      text-align: center;
    }
  
    .footer {
      position: absolute;
      bottom: 24px;
      left: 24px;
      right: 24px;
      font-size: 10px;
      color: #444;
      border-top: 1px solid #ccc;
      padding-top: 8px;
    }
  </style>
  </head>
  
  <body>
    <div class="page">
      <div class="header">
        <div class="logo">CertificationData</div>
        <div class="subtitle">Digital Creation Certification</div>
      </div>
  
      <h1>DIGITAL ASSET CERTIFICATE</h1>
      <div class="divider">────────────────────────</div>
  
      <table>
        <tr><td class="label">Certificate Code</td><td>${data.certificateCode}</td></tr>
        <tr><td class="label">Legal Owner Name</td><td>${data.ownerName}</td></tr>
        <tr><td class="label">Asset Title</td><td>${data.assetTitle}</td></tr>
        <tr><td class="label">Asset Description</td><td>${data.description || "-"}</td></tr>
        <tr><td class="label">Creation Timestamp (UTC)</td><td>${data.createdAtUTC}</td></tr>
        <tr><td class="label">File Type</td><td>${data.fileType}</td></tr>
        <tr><td class="label">File Size</td><td>${data.fileSize}</td></tr>
        <tr>
          <td class="label">Fingerprint (SHA-256)</td>
          <td class="fingerprint">${data.fingerprint}</td>
        </tr>
      </table>
  
      <div class="qr">
        <img src="${data.qrBase64}" />
        <div style="font-size:11px;margin-top:6px;">
          Scan to verify<br/>
          ${data.verifyUrl}
        </div>
      </div>
  
      <div class="stamp">
        CertificationData<br/>
        Verified Digital Record
      </div>
  
      <div class="footer">
        Generated on: ${data.createdAtUTC} • CertificationData.org<br/>
        This certificate records your digital asset on CertificationData with a cryptographic fingerprint and timestamp, providing verifiable proof of existence and ownership. It does not replace official copyright or patent registration.
      </div>
    </div>
  </body>
  </html>
  `;
  }
  
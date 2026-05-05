// app/layout.tsx
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

const siteUrl = "https://www.certificationdata.org";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  applicationName: "CertificationData.org",

  title: {
    default:
      "CertificationData.org | Digital Asset Certification for Creators",
    template: "%s | CertificationData.org",
  },

  description:
    "Certify digital files with a SHA-256 fingerprint, timestamped PDF certificate, public verification page, certificate code, and QR code. Built for artists, designers, photographers, writers, musicians, AI creators, freelancers, and agencies.",

  keywords: [
    "digital asset certification",
    "digital file certification",
    "SHA-256 certificate",
    "timestamped certificate",
    "PDF certificate for digital files",
    "QR verification page",
    "proof of creation",
    "digital creation proof",
    "AI creator certificate",
    "artist certificate",
    "designer certificate",
    "photographer certificate",
    "freelancer proof of work",
    "certificate code verification",
    "cryptographic fingerprint",
    "CertificationData",
  ],

  alternates: {
    canonical: siteUrl,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "CertificationData.org",
    title: "CertificationData.org | Digital Asset Certification for Creators",
    description:
      "Create timestamped digital certificates for your files with cryptographic SHA-256 fingerprints, PDF certificates, public verification pages, certificate codes, and QR codes.",
    locale: "en_US",
  },

  twitter: {
    card: "summary",
    title: "CertificationData.org | Digital Asset Certification for Creators",
    description:
      "Certify digital files with SHA-256 fingerprints, timestamped PDF certificates, public verification pages, certificate codes, and QR codes.",
  },

  category: "technology",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020617",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
        <Footer />

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-9946Z11Q8D"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-9946Z11Q8D', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </body>
    </html>
  );
}
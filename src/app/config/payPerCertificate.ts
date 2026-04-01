// src/app/config/payPerCertificate.ts

// Tüm sistemde kullanılacak ID tipi
export type PayPerCertTierId =
  | "0-25"      // 25 MB
  | "25-50"     // 50 MB
  | "50-100"    // 100 MB
  | "100-250"   // 250 MB
  | "250-500"   // 500 MB
  | "500-750"   // 750 MB
  | "750-1000"; // 1 GB

export type PayPerCertTier = {
  id: PayPerCertTierId;   // "0-25" gibi
  label: string;          // UI'da görünen metin ("25 MB" gibi)
  maxBytes: number;       // byte cinsinden limit
  priceUsd: number;       // 2.99, 4.99 vs.
  priceCents: number;     // 299, 499 vs. (DB için güzel)
  stripePriceEnv: string; // .env içindeki price ID değişken adı
  recommended?: boolean;  // Pricing sayfasında "most common" işareti
};

// MB → byte helper (okunaklı olsun)
const MB = (n: number) => n * 1024 * 1024;

export const PAY_PER_CERT_TIERS: Record<PayPerCertTierId, PayPerCertTier> = {
  "0-25": {
    id: "0-25",
    label: "25 MB",
    maxBytes: MB(25),
    priceUsd: 2.99,
    priceCents: 299,
    stripePriceEnv: "STRIPE_PRICE_0_25",
  },
  "25-50": {
    id: "25-50",
    label: "50 MB",
    maxBytes: MB(50),
    priceUsd: 4.99,
    priceCents: 499,
    stripePriceEnv: "STRIPE_PRICE_25_50",
  },
  "50-100": {
    id: "50-100",
    label: "100 MB",
    maxBytes: MB(100),
    priceUsd: 8.99,
    priceCents: 899,
    stripePriceEnv: "STRIPE_PRICE_50_100",
    recommended: true, // Pricing'de "Most common" olarak göstereceğiz
  },
  "100-250": {
    id: "100-250",
    label: "250 MB",
    maxBytes: MB(250),
    priceUsd: 14.99,
    priceCents: 1499,
    stripePriceEnv: "STRIPE_PRICE_100_250",
  },
  "250-500": {
    id: "250-500",
    label: "500 MB",
    maxBytes: MB(500),
    priceUsd: 19.99,
    priceCents: 1999,
    stripePriceEnv: "STRIPE_PRICE_250_500",
  },
  "500-750": {
    id: "500-750",
    label: "750 MB",
    maxBytes: MB(750),
    priceUsd: 24.99,
    priceCents: 2499,
    stripePriceEnv: "STRIPE_PRICE_500_750",
  },
  "750-1000": {
    id: "750-1000",
    label: "1 GB",
    maxBytes: MB(1000),
    priceUsd: 29.99,
    priceCents: 2999,
    stripePriceEnv: "STRIPE_PRICE_750_1000",
  },
};

// Convenience: array olarak da lazım olacak yerler için
export const PAY_PER_CERT_TIERS_LIST: PayPerCertTier[] = Object.values(
  PAY_PER_CERT_TIERS
);
// Dosyanın en sonuna BUNU ekle:
export function getPayPerCertTier(
  id: string | null | undefined
): PayPerCertTier | null {
  if (!id) return null;

  const key = id as PayPerCertTierId;

  if (key in PAY_PER_CERT_TIERS) {
    return PAY_PER_CERT_TIERS[key];
  }

  return null;
}
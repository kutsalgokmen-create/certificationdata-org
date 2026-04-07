/**
 * Public origin for Stripe redirects and absolute links.
 * Trims env noise, validates, and falls back for Vercel Preview (VERCEL_URL).
 */
export function resolvePublicSiteOrigin(): string {
  const candidates: (string | undefined)[] = [
    process.env.SITE_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`
      : undefined,
  ];

  for (const raw of candidates) {
    if (typeof raw !== "string") continue;
    const trimmed = raw.trim().replace(/^['"]|['"]$/g, "");
    if (!trimmed) continue;

    const withProtocol =
      trimmed.startsWith("http://") || trimmed.startsWith("https://")
        ? trimmed
        : `https://${trimmed}`;

    try {
      const url = new URL(withProtocol);
      if (url.protocol !== "http:" && url.protocol !== "https:") continue;
      return url.origin;
    } catch {
      continue;
    }
  }

  throw new Error(
    "Missing or invalid SITE_URL / NEXT_PUBLIC_SITE_URL. Set an absolute URL (e.g. https://yourdomain.com) in Vercel env, or rely on VERCEL_URL on Vercel."
  );
}

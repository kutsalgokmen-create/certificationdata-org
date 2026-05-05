// app/robots.ts
import type { MetadataRoute } from "next";

const siteUrl = "https://www.certificationdata.org";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/auth",
        "/auth/",
        "/dashboard",
        "/dashboard/",
        "/certificates/new",
        "/certificates/new/",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
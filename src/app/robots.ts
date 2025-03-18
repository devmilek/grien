import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/konto", "/konto/*"],
    },
    sitemap: [`${BASE_URL}/sitemap.xml`, `${BASE_URL}/przepisy/sitemap.xml`],
  };
}

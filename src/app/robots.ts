import { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/siteConfig";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = SITE_CONFIG.url;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/cart",
          "/order",
          "/admin",
          "/api/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

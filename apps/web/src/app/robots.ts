import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.length ? process.env.NEXT_PUBLIC_APP_URL : "https://listygifty.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard", "/holidays", "/people", "/settings", "/billing", "/gifts"],
      },
      // AI Crawlers - explicitly allow public pages
      {
        userAgent: "GPTBot",
        allow: ["/", "/giving-pledge", "/login", "/signup"],
        disallow: ["/api/", "/dashboard", "/holidays", "/people", "/settings", "/billing", "/gifts"],
      },
      {
        userAgent: "ChatGPT-User",
        allow: ["/", "/giving-pledge", "/login", "/signup"],
        disallow: ["/api/", "/dashboard", "/holidays", "/people", "/settings", "/billing", "/gifts"],
      },
      {
        userAgent: "Claude-Web",
        allow: ["/", "/giving-pledge", "/login", "/signup"],
        disallow: ["/api/", "/dashboard", "/holidays", "/people", "/settings", "/billing", "/gifts"],
      },
      {
        userAgent: "Anthropic-AI",
        allow: ["/", "/giving-pledge", "/login", "/signup"],
        disallow: ["/api/", "/dashboard", "/holidays", "/people", "/settings", "/billing", "/gifts"],
      },
      {
        userAgent: "PerplexityBot",
        allow: ["/", "/giving-pledge", "/login", "/signup"],
        disallow: ["/api/", "/dashboard", "/holidays", "/people", "/settings", "/billing", "/gifts"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: "Googlebot-Image",
        allow: "/",
      },
    ],
    sitemap: "https://bimbok-portfolio.vercel.app/sitemap.xml",
    host: "https://bimbok-portfolio.vercel.app",
  };
}

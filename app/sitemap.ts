import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://bratikmkj.vercel.app";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
      images: [
        `${baseUrl}/images/profile/bratik-mukherjee-developer.jpg`,
        `${baseUrl}/images/profile/bratik-mukherjee-bimbok-speaker.jpg`,
        `${baseUrl}/images/profile/bratik-mukherjee-keynote.jpg`,
        `${baseUrl}/images/profile/bratik-mukherjee-bimbok.jpg`,
        `${baseUrl}/banner.png`,
      ],
    },
  ];
}

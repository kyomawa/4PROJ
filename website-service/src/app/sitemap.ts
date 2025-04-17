import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date();
  const baseUrl = "http://localhost";

  const staticUrls: MetadataRoute.Sitemap = [];

  const urls: MetadataRoute.Sitemap = [...staticUrls];

  return urls;
}

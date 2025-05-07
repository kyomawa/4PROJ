import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/panel/", "/api/"],
    },
    sitemap: "http://localhost/sitemap.xml",
  };
}

import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://keviniansyah.site" }, { url: "https://keviniansyah.site/projects" }, { url: "https://keviniansyah.site/articles" }];
}

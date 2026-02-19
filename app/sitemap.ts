import { MetadataRoute } from "next";
import { apiServer } from "@/lib/api/server";

const baseUrl = "https://keviniansyah.site";

type Item = {
  slug: string;
  updated_at: string;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await apiServer.get<Item[]>("/api/projects");
  const articles = await apiServer.get<Item[]>("/api/articles");

  const urls: MetadataRoute.Sitemap = [{ url: baseUrl }, { url: `${baseUrl}/projects` }, { url: `${baseUrl}/articles` }];

  projects.forEach((project) => {
    urls.push({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified: new Date(project.updated_at),
    });
  });

  articles.forEach((article) => {
    urls.push({
      url: `${baseUrl}/articles/${article.slug}`,
      lastModified: new Date(article.updated_at),
    });
  });

  return urls;
}

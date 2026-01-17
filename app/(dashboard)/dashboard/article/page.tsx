import { apiServer } from "@/lib/api/server";
import { Article } from "@/lib/types/article";
import { Paginator } from "@/lib/types/paginator";
import Articles from "./_components/article";

async function getInitialArticles(): Promise<Paginator<Article> | null> {
  try {
    const articles = await apiServer.get<Paginator<Article>>("/api/articles");
  
    return articles;
  } catch (error) {
    console.error("Failed to fetch articles:", error);

    return null;
  }
}

export default async function Page() {
  const initialArticles = await getInitialArticles();

  return <Articles initialArticles={initialArticles} />;
}

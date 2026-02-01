import type { Metadata } from "next";

import { apiServer } from "@/lib/api/server";
import { ApiError } from "@/lib/types/api";
import { Article } from "@/lib/types/article";
import { Paginator } from "@/lib/types/paginator";
import { getServerLocale } from "@/lib/server-utils";

import { ErrorWrapper } from "@/components/error-wrapper";
import Articles from "./_components/articles";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const isEN = locale === "en";

  const title = isEN ? "Articles – Web Development, Backend & Machine Learning" : "Artikel – Web Development, Backend & Machine Learning";

  const description = isEN
    ? "A collection of articles about web development, backend, APIs, machine learning, and thoughts on building software."
    : "Kumpulan artikel seputar web development, backend, API, machine learning, serta berbagai pemikiran dalam membangun software.";

  return {
    title: `${title} | Kevin Iansyah`,
    description,
    keywords: ["Web Development", "Backend", "API", "React", "Next.js", "Laravel", "Machine Learning", "AI", "Data Science", "Programming"],
    openGraph: {
      title,
      description,
      type: "website",
      locale: isEN ? "en_US" : "id_ID",
      siteName: isEN ? "Kevin Iansyah Articles" : "Artikel Kevin Iansyah",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `https://keviniansyah.site/articles`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

async function getInitialData(locale: string) {
  try {
    const articles = await apiServer.get<Paginator<Article>>(`/api/articles`);

    return { articles, error: null };
  } catch (error) {
    console.error("Failed to fetch articles:", error);

    if (error instanceof ApiError) {
      return {
        articles: null,
        error: {
          message: error.message,
          status: error.status,
          errors: error.errors,
        },
      };
    }

    return {
      articles: null,
      error: {
        message: locale === "id" ? "Terjadi kesalahan yang tidak terduga" : "An unexpected error occurred",
        status: 500,
      },
    };
  }
}

export default async function Page() {
  const locale = await getServerLocale();
  const { articles, error } = await getInitialData(locale);

  return (
    <ErrorWrapper error={error}>
      <Articles initialData={articles} />
    </ErrorWrapper>
  );
}

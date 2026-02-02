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

  return {
    title: isEN ? "Articles on IT, Web & Software Engineering | Kevin Iansyah" : "Artikel IT, Web & Software Engineering | Kevin Iansyah",

    description: isEN
      ? "Articles and insights on the IT world, covering web development, backend and frontend engineering, APIs, machine learning, and building modern software."
      : "Artikel dan insight seputar dunia IT yang membahas web development, backend dan frontend engineering, API, machine learning, serta pengembangan software modern.",

    keywords: isEN
      ? ["Kevin Iansyah", "IT Articles", "Web Development", "Backend", "Frontend", "API", "Software Engineering", "Machine Learning", "AI", "Programming", "React", "Next.js", "Laravel"]
      : ["Kevin Iansyah", "Artikel IT", "Web Development", "Backend", "Frontend", "API", "Software Engineering", "Machine Learning", "AI", "Pemrograman", "React", "Next.js", "Laravel"],

    openGraph: {
      title: isEN ? "Articles on IT, Web & Software Engineering | Kevin Iansyah" : "Artikel IT, Web & Software Engineering | Kevin Iansyah",
      description: isEN
        ? "Read articles and technical insights on web development, software engineering, APIs, and machine learning."
        : "Baca artikel dan insight teknis seputar web development, software engineering, API, dan machine learning.",
      type: "website",
      locale: isEN ? "en_US" : "id_ID",
      url: "https://keviniansyah.site/articles",
      siteName: isEN ? "Kevin Iansyah Articles" : "Artikel Kevin Iansyah",
    },

    twitter: {
      card: "summary_large_image",
      title: isEN ? "Articles on IT, Web & Software Engineering | Kevin Iansyah" : "Artikel IT, Web & Software Engineering | Kevin Iansyah",
      description: isEN
        ? "Technical articles and insights on web development, software engineering, and machine learning."
        : "Artikel dan insight teknis seputar web development, software engineering, dan machine learning.",
    },

    alternates: {
      canonical: "https://keviniansyah.site/articles",
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

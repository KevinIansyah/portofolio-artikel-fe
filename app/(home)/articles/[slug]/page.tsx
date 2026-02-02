import { Metadata } from "next";
import { notFound } from "next/navigation";

import { Article } from "@/lib/types/article";
import { getFullImageUrl } from "@/lib/utils";
import { apiServer } from "@/lib/api/server";
import { ApiError } from "@/lib/types/api";
import { getServerLocale } from "@/lib/server-utils";

import Detail from "./_components/detail";
import { ErrorWrapper } from "@/components/error-wrapper";
import { BreadcrumbSchema } from "@/components/breadcrumb-schema";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getServerLocale();
  const { article } = await getInitialArticle(slug, locale);

  if (!article) {
    return {
      title: locale === "id" ? "Artikel Tidak Ditemukan - Kevin Iansyah" : "Article Not Found - Kevin Iansyah",
      description: locale === "id" ? "Artikel tidak ditemukan" : "Article not found",
    };
  }

  return {
    title: `${article.title} - Kevin Iansyah`,
    description: article.description,
    keywords: article.tags.map((tag) => tag.name),
    authors: [{ name: "Kevin Iansyah" }],
    openGraph: {
      title: `${article.title} - Kevin Iansyah`,
      description: article.description,
      type: "article",
      locale: locale === "id" ? "id_ID" : "en_US",
      url: `https://keviniansyah.site/articles/${article.slug}`,
      siteName: "Portofolio Kevin Iansyah",
      images: [
        {
          url: getFullImageUrl(article.thumbnail_url),
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${article.title} - Kevin Iansyah`,
      description: article.description,
      images: [getFullImageUrl(article.thumbnail_url)],
    },
    alternates: {
      canonical: `https://keviniansyah.site/articles/${article.slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

async function getInitialArticle(slug: string, locale: string) {
  try {
    const article = await apiServer.get<Article>(`/api/articles/${slug}`);

    return { article, error: null };
  } catch (error) {
    console.error("Failed to fetch article:", error);

    if (error instanceof ApiError) {
      return {
        article: null,
        error: {
          message: error.message,
          status: error.status,
          errors: error.errors,
        },
      };
    }

    return {
      article: null,
      error: {
        message: locale === "id" ? "Terjadi kesalahan yang tidak terduga" : "An unexpected error occurred",
        status: 500,
      },
    };
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getServerLocale();
  const { article, error } = await getInitialArticle(slug, locale);

  if (!article && !error) {
    notFound();
  }

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://keviniansyah.site" },
          { name: "Articles", url: "https://keviniansyah.site/articles" },
          {
            name: article?.title ?? "Article",
            url: `https://keviniansyah.site/articles/${article?.slug ?? slug}`,
          },
        ]}
      />

      <ErrorWrapper error={error}>
        <Detail article={article} />
      </ErrorWrapper>
    </>
  );
}

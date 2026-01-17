"use client";

import { useLanguage } from "@/hooks/use-language";

import { Article } from "@/lib/types/article";
import { Paginator } from "@/lib/types/paginator";

import Heading from "@/components/dashboard/heading";
import { DataTable } from "./datatable";
import { SectionCards } from "./section-cards";

interface ArticleProps {
  initialArticles: Paginator<Article> | null;
}

export default function Articles({ initialArticles }: ArticleProps) {
  const { t } = useLanguage();

  return (
    <div>
      <Heading title={t("heading.article.title")} description={t("heading.article.description")} />

      <div className="space-y-4 md:space-y-6">
        {/* <SectionCards /> */}

        <DataTable initialData={initialArticles} />
      </div>
    </div>
  );
}

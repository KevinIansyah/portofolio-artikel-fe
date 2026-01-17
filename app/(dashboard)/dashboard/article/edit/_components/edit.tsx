"use client";

import { useLanguage } from "@/hooks/use-language";

import { Category } from "@/lib/types/category";
import { Tag } from "@/lib/types/tag";
import { ArticleEditData } from "@/lib/types/article";

import Heading from "@/components/dashboard/heading";
import EditForm from "./editForm";

interface EditProps {
  article: ArticleEditData;
  categories: Category[];
  tags: Tag[];
}

export default function Edit({ article, categories, tags }: EditProps) {
  const { t } = useLanguage();

  return (
    <>
      <Heading title={t("heading.article.edit.title")} description={t("heading.article.edit.description")} />

      <EditForm article={article} categories={categories} tags={tags} />
    </>
  );
}

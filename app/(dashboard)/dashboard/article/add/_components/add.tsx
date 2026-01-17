"use client";

import { useLanguage } from "@/hooks/use-language";

import { Category } from "@/lib/types/category";
import { Tag } from "@/lib/types/tag";

import Heading from "@/components/dashboard/heading";
import AddForm from "./add-form";

interface AddProps {
  categories: Category[];
  tags: Tag[];
}

export default function Add({ categories, tags }: AddProps) {
  const { t } = useLanguage();

  return (
    <>
      <Heading title={t("heading.article.add.title")} description={t("heading.article.add.description")} />

      <AddForm categories={categories} tags={tags} />
    </>
  );
}

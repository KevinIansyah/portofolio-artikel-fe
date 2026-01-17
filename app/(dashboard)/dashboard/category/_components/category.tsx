"use client";

import { useLanguage } from "@/hooks/use-language";

import { Paginator } from "@/lib/types/paginator";
import { Category } from "@/lib/types/category";

import Heading from "@/components/dashboard/heading";
import { DataTable } from "./datatable";

interface CategoryProps {
  initialCategories: Paginator<Category> | null;
}

export default function Categories({ initialCategories }: CategoryProps) {
  const { t } = useLanguage();

  return (
    <div>
      <Heading title={t("heading.category.title")} description={t("heading.category.description")} />

      <div className="space-y-4 md:space-y-6">
        <DataTable initialData={initialCategories} />
      </div>
    </div>
  );
}

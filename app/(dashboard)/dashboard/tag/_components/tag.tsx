"use client";

import { useLanguage } from "@/hooks/use-language";

import { Paginator } from "@/lib/types/paginator";
import { Tag } from "@/lib/types/tag";

import Heading from "@/components/dashboard/heading";
import { DataTable } from "./datatable";

interface TagProps {
  initialTags: Paginator<Tag> | null;
}

export default function Tags({ initialTags }: TagProps) {
  const { t } = useLanguage();

  return (
    <div>
      <Heading title={t("heading.tag.title")} description={t("heading.tag.description")} />

      <div className="space-y-4 md:space-y-6">
        <DataTable initialData={initialTags} />
      </div>
    </div>
  );
}

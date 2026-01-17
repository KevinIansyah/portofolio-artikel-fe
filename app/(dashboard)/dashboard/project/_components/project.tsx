"use client";

import { useLanguage } from "@/hooks/use-language";

import { Paginator } from "@/lib/types/paginator";
import { Project } from "@/lib/types/project";

import Heading from "@/components/dashboard/heading";
import { DataTable } from "./datatable";

interface ProjectProps {
  initialProjects: Paginator<Project> | null;
}

export default function Projects({ initialProjects }: ProjectProps) {
  const { t } = useLanguage();

  return (
    <div>
      <Heading title={t("heading.project.title")} description={t("heading.project.description")} />

      <div className="space-y-4 md:space-y-6">
        <DataTable initialData={initialProjects} />
      </div>
    </div>
  );
}

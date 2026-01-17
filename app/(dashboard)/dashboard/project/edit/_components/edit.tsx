"use client";

import { useLanguage } from "@/hooks/use-language";

import { Category } from "@/lib/types/category";
import { Skill } from "@/lib/types/skill";
import { ProjectEditData } from "@/lib/types/project";

import Heading from "@/components/dashboard/heading";
import EditForm from "./editForm";

interface EditProps {
  project: ProjectEditData;
  categories: Category[];
  skills: Skill[];
}

export default function Edit({ project, categories, skills }: EditProps) {
  const { t } = useLanguage();

  return (
    <>
      <Heading title={t("heading.project.edit.title")} description={t("heading.project.edit.description")} />

      <EditForm project={project} categories={categories} skills={skills} />
    </>
  );
}

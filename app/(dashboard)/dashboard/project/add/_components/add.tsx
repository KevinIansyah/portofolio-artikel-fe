"use client";

import { useLanguage } from "@/hooks/use-language";

import { Category } from "@/lib/types/category";
import { Skill } from "@/lib/types/skill";

import Heading from "@/components/dashboard/heading";
import AddForm from "./add-form";

interface AddProps {
  categories: Category[];
  skills: Skill[];
}

export default function Add({ categories, skills }: AddProps) {
  const { t } = useLanguage();

  return (
    <>
      <Heading title={t("heading.project.add.title")} description={t("heading.project.add.description")} />

      <AddForm categories={categories} skills={skills} />
    </>
  );
}

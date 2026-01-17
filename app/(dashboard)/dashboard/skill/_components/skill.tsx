"use client";

import { useLanguage } from "@/hooks/use-language";

import { Paginator } from "@/lib/types/paginator";
import { Skill } from "@/lib/types/skill";

import Heading from "@/components/dashboard/heading";
import { DataTable } from "./datatable";

interface SkillProps {
  initialSkills: Paginator<Skill> | null;
}

export default function Skills({ initialSkills }: SkillProps) {
  const { t } = useLanguage();

  return (
    <div>
      <Heading title={t("heading.skill.title")} description={t("heading.skill.description")} />

      <div className="space-y-4 md:space-y-6">
        <DataTable initialData={initialSkills} />
      </div>
    </div>
  );
}

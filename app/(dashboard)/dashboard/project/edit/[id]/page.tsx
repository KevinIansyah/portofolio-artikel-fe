import { redirect } from "next/navigation";

import { Category } from "@/lib/types/category";
import { Skill } from "@/lib/types/skill";
import { ProjectEditData } from "@/lib/types/project";
import { apiServer } from "@/lib/api/server";

import Edit from "../_components/edit";

async function getFormData(id: string) {
  try {
    const [project, categories, skills] = await Promise.all([
      apiServer.get<ProjectEditData>(`/api/projects/${id}/edit`),
      apiServer.get<Category[]>("/api/categories/projects"),
      apiServer.get<Skill[]>("/api/skills"),
    ]);

    return { project, categories, skills };
  } catch (e) {
    console.error("Failed to fetch form options:", e);

    redirect("/dashboard/project");
  }
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { project, categories, skills } = await getFormData(id);

  return <Edit project={project} categories={categories} skills={skills} />;
}

import { Metadata } from "next";

import { apiServer } from "@/lib/api/server";
import { Category } from "@/lib/types/category";
import { Skill } from "@/lib/types/skill";

import Add from "../../project/add/_components/add";


export const metadata: Metadata = {
  title: "Add Project - Kevin Iansyah",
};

async function getFormOptions() {
  try {
    const [categories, skills] = await Promise.all([apiServer.get<Category[]>("/api/categories/projects"), apiServer.get<Skill[]>("/api/skills")]);

    return { categories, skills };
  } catch (error) {
    console.error("Failed to fetch form options:", error);

    return { categories: [], skills: [] };
  }
}

export default async function Page() {
  const { categories, skills } = await getFormOptions();

  return <Add categories={categories} skills={skills} />;
}

import { Metadata } from "next";

import { apiServer } from "@/lib/api/server";
import { Category } from "@/lib/types/category";
import { Tag } from "@/lib/types/tag";

import Add from "./_components/add";

export const metadata: Metadata = {
  title: "Add Article - Kevin Iansyah",
};

async function getFormData() {
  try {
    const [categories, tags] = await Promise.all([apiServer.get<Category[]>("/api/categories/articles"), apiServer.get<Tag[]>("/api/tags")]);

    return { categories, tags };
  } catch (e) {
    console.error("Failed to fetch form options:", e);

    return { categories: [], tags: [] };
  }
}

export default async function Page() {
  const { categories, tags } = await getFormData();

  return <Add categories={categories} tags={tags} />;
}

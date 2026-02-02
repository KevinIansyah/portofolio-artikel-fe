import { Metadata } from "next";
import { redirect } from "next/navigation";

import { Category } from "@/lib/types/category";
import { Tag } from "@/lib/types/tag";
import { ArticleEditData } from "@/lib/types/article";
import { apiServer } from "@/lib/api/server";

import Edit from "../_components/edit";

export const metadata: Metadata = {
  title: "Edit Article - Kevin Iansyah",
};

async function getFormData(id: string) {
  try {
    const [article, categories, tags] = await Promise.all([
      apiServer.get<ArticleEditData>(`/api/articles/${id}/edit`),
      apiServer.get<Category[]>("/api/categories/articles"),
      apiServer.get<Tag[]>("/api/tags"),
    ]);

    return { article, categories, tags };
  } catch (e) {
    console.error("Failed to fetch form options:", e);

    redirect("/dashboard/article");
  }
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { article, categories, tags } = await getFormData(id);

  return <Edit article={article} categories={categories} tags={tags} />;
}

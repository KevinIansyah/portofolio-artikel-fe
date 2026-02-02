import { Metadata } from "next";

import { apiServer } from "@/lib/api/server";
import { Category } from "@/lib/types/category";
import { Paginator } from "@/lib/types/paginator";

import Categories from "./_components/category";


export const metadata: Metadata = {
  title: "Category - Kevin Iansyah",
};

async function getInitialCategories(): Promise<Paginator<Category> | null> {
  try {
    const categories = await apiServer.get<Paginator<Category>>("/api/categories/paginated");

    return categories;
  } catch (error) {
    console.error("Failed to fetch categories:", error);

    return null;
  }
}

export default async function Page() {
  const initialCategories = await getInitialCategories();

  return <Categories initialCategories={initialCategories} />;
}

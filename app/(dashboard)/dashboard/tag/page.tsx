import { Metadata } from "next";

import { apiServer } from "@/lib/api/server";
import { Category } from "@/lib/types/category";
import { Paginator } from "@/lib/types/paginator";

import Tags from "./_components/tag";

export const metadata: Metadata = {
  title: "Tag - Kevin Iansyah",
};

async function getInitialTags(): Promise<Paginator<Category> | null> {
  try {
    const tags = await apiServer.get<Paginator<Category>>("/api/tags/paginated");

    return tags;
  } catch (error) {
    console.error("Failed to fetch tags:", error);

    return null;
  }
}

export default async function Page() {
  const initialtags = await getInitialTags();

  return <Tags initialTags={initialtags} />;
}

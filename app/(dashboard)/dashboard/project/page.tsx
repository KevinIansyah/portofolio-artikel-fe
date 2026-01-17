import { apiServer } from "@/lib/api/server";
import { Article } from "@/lib/types/article";
import { Paginator } from "@/lib/types/paginator";

import Projects from "./_components/project";

async function getInitialProjects(): Promise<Paginator<Article> | null> {
  try {
    const projects = await apiServer.get<Paginator<Article>>("/api/projects");

    return projects;
  } catch (error) {
    console.error("Failed to fetch projects:", error);

    return null;
  }
}

export default async function Page() {
  const initialProjects = await getInitialProjects();

  return <Projects initialProjects={initialProjects} />;
}

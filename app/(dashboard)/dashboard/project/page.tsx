import { apiServer } from "@/lib/api/server";

import { Paginator } from "@/lib/types/paginator";
import { Project } from "@/lib/types/project";

import Projects from "./_components/project";

async function getInitialProjects(): Promise<Paginator<Project> | null> {
  try {
    const projects = await apiServer.get<Paginator<Project>>("/api/projects");

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

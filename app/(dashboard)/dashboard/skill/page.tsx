import { apiServer } from "@/lib/api/server";
import { Skill } from "@/lib/types/skill";
import { Paginator } from "@/lib/types/paginator";

import Skills from "./_components/skill";

async function getInitialSkills(): Promise<Paginator<Skill> | null> {
  try {
    const skills = await apiServer.get<Paginator<Skill>>("/api/skills/paginated");

    return skills;
  } catch (error) {
    console.error("Failed to fetch skills:", error);

    return null;
  }
}

export default async function Page() {
  const initialSkills = await getInitialSkills();

  return <Skills initialSkills={initialSkills} />;
}

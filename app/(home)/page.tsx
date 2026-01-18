import { Metadata } from "next";

import { apiServer } from "@/lib/api/server";
import { Project } from "@/lib/types/project";
import { Skill } from "@/lib/types/skill";

import Home from "./_components/home";
import { Paginator } from "@/lib/types/paginator";

export const metadata: Metadata = {
  title: "Kevin Iansyah - Full Stack Developer & Software Engineer",
  description: "Full Stack Developer yang berspesialisasi dalam React, Next.js, TypeScript, dan Laravel. Jelajahi proyek, artikel, dan keahlian saya dalam pengembangan web.",
  keywords: ["Full Stack Developer", "Web Developer", "React", "Next.js", "Laravel", "TypeScript", "Portofolio"],
  authors: [{ name: "Kevin Iansyah" }],
  openGraph: {
    title: "Kevin Iansyah - Full Stack Developer",
    description: "Full Stack Developer yang passionate dalam membangun aplikasi web modern",
    type: "website",
    locale: "id_ID",
    url: "https://keviniansyah.site",
    siteName: "Portofolio Kevin Iansyah",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kevin Iansyah - Full Stack Developer",
    description: "Full Stack Developer yang passionate dalam membangun aplikasi web modern",
  },
};

async function getInitialData() {
  try {
    const [projects, skills] = await Promise.all([apiServer.get<Paginator<Project>>("/api/projects"), apiServer.get<Skill[]>("/api/skills")]);

    return { projects, skills };
  } catch (e) {
    console.error("Failed to fetch form options:", e);

    return { projects: null, skills: [] };
  }
}

export default async function Page() {
  const { projects, skills } = await getInitialData();

  return <Home projects={projects} skills={skills} />;
}

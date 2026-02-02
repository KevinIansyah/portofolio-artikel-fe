import { Metadata } from "next";

import { apiServer } from "@/lib/api/server";
import { ApiError } from "@/lib/types/api";
import { Project } from "@/lib/types/project";
import { Paginator } from "@/lib/types/paginator";
import { getServerLocale } from "@/lib/server-utils";

import { ErrorWrapper } from "@/components/error-wrapper";
import Projects from "./_components/projects";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const isEN = locale === "en";

  return {
    title: isEN ? "Web & Software Engineering Projects | Kevin Iansyah" : "Proyek Web & Software Engineering | Kevin Iansyah",

    description: isEN
      ? "A curated collection of projects I’ve built in the IT world, including web applications, dashboards, APIs, and experimental or personal software projects."
      : "Kumpulan proyek yang saya kerjakan di dunia IT, mencakup aplikasi web, dashboard, API, serta proyek software eksperimental dan personal.",

    keywords: isEN
      ? ["Kevin Iansyah", "Projects", "IT Projects", "Web Development", "Web Application", "Dashboard", "API", "Software Engineering", "React", "Next.js", "Laravel", "Portfolio"]
      : ["Kevin Iansyah", "Proyek", "Proyek IT", "Web Development", "Aplikasi Web", "Dashboard", "API", "Software Engineering", "React", "Next.js", "Laravel", "Portofolio"],

    openGraph: {
      title: isEN ? "Web & Software Engineering Projects | Kevin Iansyah" : "Proyek Web & Software Engineering | Kevin Iansyah",

      description: isEN
        ? "Explore projects and case studies I’ve worked on, including web apps, dashboards, APIs, and software engineering experiments."
        : "Jelajahi proyek dan studi kasus yang pernah saya kerjakan, meliputi aplikasi web, dashboard, API, dan eksperimen software engineering.",
      type: "website",
      locale: isEN ? "en_US" : "id_ID",
      url: "https://keviniansyah.site/projects",
      siteName: isEN ? "Kevin Iansyah Portfolio" : "Portofolio Kevin Iansyah",
    },

    twitter: {
      card: "summary_large_image",
      title: isEN ? "Web & Software Engineering Projects | Kevin Iansyah" : "Proyek Web & Software Engineering | Kevin Iansyah",

      description: isEN
        ? "Selected projects and software solutions I’ve built across web development and the IT world."
        : "Pilihan proyek dan solusi software yang saya bangun di bidang web development dan dunia IT.",
    },

    alternates: {
      canonical: "https://keviniansyah.site/projects",
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

async function getInitialData(locale: string) {
  try {
    const projects = await apiServer.get<Paginator<Project>>(`/api/projects`);

    return { projects, error: null };
  } catch (error) {
    console.error("Failed to fetch projects:", error);

    if (error instanceof ApiError) {
      return {
        projects: null,
        error: {
          message: error.message,
          status: error.status,
          errors: error.errors,
        },
      };
    }

    return {
      projects: null,
      error: {
        message: locale === "id" ? "Terjadi kesalahan yang tidak terduga" : "An unexpected error occurred",
        status: 500,
      },
    };
  }
}

export default async function Page() {
  const locale = await getServerLocale();
  const { projects, error } = await getInitialData(locale);

  return (
    <ErrorWrapper error={error}>
      <Projects initialData={projects} />
    </ErrorWrapper>
  );
}

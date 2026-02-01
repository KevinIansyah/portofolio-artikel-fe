import { Metadata } from "next";

import { apiServer } from "@/lib/api/server";
import { Project } from "@/lib/types/project";
import { Article } from "@/lib/types/article";
import { Skill } from "@/lib/types/skill";
import { Paginator } from "@/lib/types/paginator";
import { ApiError } from "@/lib/types/api";
import { getServerLocale } from "@/lib/server-utils";

import Home from "./_components/home";
import { ErrorWrapper } from "@/components/error-wrapper";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const isEN = locale === "en";

  return {
    title: "Kevin Iansyah - Full Stack Developer & Software Engineer",

    description: isEN
      ? "Full Stack Developer specializing in React, Next.js, TypeScript, and Laravel. Explore my projects, articles, and skills in web development."
      : "Full Stack Developer yang berspesialisasi dalam React, Next.js, TypeScript, dan Laravel. Jelajahi proyek, artikel, dan keahlian saya dalam pengembangan web.",

    keywords: isEN
      ? ["Full Stack Developer", "Software Engineer", "Web Developer", "React", "Next.js", "Laravel", "TypeScript", "Portfolio"]
      : ["Full Stack Developer", "Web Developer", "React", "Next.js", "Laravel", "TypeScript", "Portofolio"],

    openGraph: {
      title: "Kevin Iansyah - Full Stack Developer",
      description: isEN ? "Passionate full stack developer building modern web applications" : "Full Stack Developer yang passionate dalam membangun aplikasi web modern",
      type: "website",
      locale: isEN ? "en_US" : "id_ID",
      url: "https://keviniansyah.site",
      siteName: isEN ? "Kevin Iansyah Portfolio" : "Portofolio Kevin Iansyah",
    },
    twitter: {
      card: "summary_large_image",
      title: "Kevin Iansyah - Full Stack Developer",
      description: isEN ? "Passionate full stack developer building modern web applications" : "Full Stack Developer yang passionate dalam membangun aplikasi web modern",
    },
    alternates: {
      canonical: `https://keviniansyah.site/`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

function getError(error: unknown, locale: string) {
  console.error("Failed to fetch initial data:", error);

  if (error instanceof ApiError) {
    return {
      message: error.message,
      status: error.status,
      errors: error.errors,
    };
  }

  return {
    message: locale === "id" ? "Terjadi kesalahan yang tidak terduga" : "An unexpected error occurred",
    status: 500,
  };
}

async function getInitialData() {
  const [projectsResult, articlesResult, skillsResult] = await Promise.allSettled([
    apiServer.get<Paginator<Project>>("/api/projects"),
    apiServer.get<Paginator<Article>>("/api/articles"),
    apiServer.get<Skill[]>("/api/skills"),
  ]);

  const locale = await getServerLocale();

  const errors = [projectsResult, articlesResult, skillsResult].filter((result): result is PromiseRejectedResult => result.status === "rejected").map((result) => getError(result.reason, locale));

  return {
    projects: projectsResult.status === "fulfilled" ? projectsResult.value : null,
    articles: articlesResult.status === "fulfilled" ? articlesResult.value : null,
    skills: skillsResult.status === "fulfilled" ? skillsResult.value : [],
    error: errors.length > 0 ? errors[0] : null,
  };
}

export default async function Page() {
  const { projects, articles, skills, error } = await getInitialData();

  return (
    <ErrorWrapper error={error}>
      <Home projects={projects} articles={articles} skills={skills} />
    </ErrorWrapper>
  );
}

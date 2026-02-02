import { Metadata } from "next";
import { notFound } from "next/navigation";

import { apiServer } from "@/lib/api/server";
import { getFullImageUrl } from "@/lib/utils";
import { Project } from "@/lib/types/project";
import { ApiError } from "@/lib/types/api";

import Detail from "./_components/detail";
import { ErrorWrapper } from "@/components/error-wrapper";
import { getServerLocale } from "@/lib/server-utils";
import { BreadcrumbSchema } from "@/components/breadcrumb-schema";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getServerLocale();

  const { project } = await getInitialProject(slug, locale);

  if (!project) {
    return {
      title: locale === "id" ? "Proyek Tidak Ditemukan - Kevin Iansyah" : "Project Not Found - Kevin Iansyah",
      description: locale === "id" ? "Proyek tidak ditemukan" : "Project not found",
    };
  }

  return {
    title: `${project.title} - Kevin Iansyah`,
    description: project.description,
    keywords: project.skills.map((skill) => skill.name),
    authors: [{ name: "Kevin Iansyah" }],
    openGraph: {
      title: `${project.title} - Kevin Iansyah`,
      description: project.description,
      type: "website",
      locale: locale === "id" ? "id_ID" : "en_US",
      url: `https://keviniansyah.site/projects/${project.slug}`,
      siteName: "Portofolio Kevin Iansyah",
      images: [
        {
          url: getFullImageUrl(project.thumbnail_url),
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} - Kevin Iansyah`,
      description: project.description,
      images: [getFullImageUrl(project.thumbnail_url)],
    },
    alternates: {
      canonical: `https://keviniansyah.site/projects/${project.slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

async function getInitialProject(slug: string, locale: string) {
  try {
    const project = await apiServer.get<Project>(`/api/projects/${slug}`);

    return { project, error: null };
  } catch (error) {
    console.error("Failed to fetch project:", error);

    if (error instanceof ApiError) {
      if (error.status === 404) {
        return { project: null, error: null };
      }

      return {
        project: null,
        error: {
          message: error.message,
          status: error.status,
          errors: error.errors,
        },
      };
    }

    return {
      project: null,
      error: {
        message: locale === "id" ? "Terjadi kesalahan yang tidak terduga" : "An unexpected error occurred",
        status: 500,
      },
    };
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getServerLocale();
  const { project, error } = await getInitialProject(slug, locale);

  if (!project && !error) {
    notFound();
  }

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://keviniansyah.site" },
          { name: "Projects", url: "https://keviniansyah.site/projects" },
          {
            name: project?.title ?? "Project",
            url: `https://keviniansyah.site/projects/${project?.slug ?? slug}`,
          },
        ]}
      />

      <ErrorWrapper error={error}>
        <Detail project={project} />
      </ErrorWrapper>
    </>
  );
}

import { apiServer } from "@/lib/api/server";
import Detail from "./_components/detail";
import { Project } from "@/lib/types/project";
import { Metadata } from "next";

async function getInitialProject(slug: string) {
  try {
    const project = await apiServer.get<Project>(`/api/projects/${slug}`);

    return project;
  } catch (error) {
    console.error("Failed to fetch project:", error);

    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getInitialProject(slug);

  if (!project) {
    return {
      title: "Project Not Found - Kevin Iansyah",
      description: "Proyek tidak ditemukan",
    };
  }

  const getFullImageUrl = (path: string) => {
    if (path.startsWith("http")) return path;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api-portofolio.keviniansyah.site";
    return `${apiUrl}${path}`;
  };

  return {
    title: `${project.title} - Kevin Iansyah`,
    description: project.description,
    keywords: project.skills.map((skill) => skill.name),
    authors: [{ name: "Kevin Iansyah" }],
    openGraph: {
      title: `${project.title} - Kevin Iansyah`,
      description: project.description,
      type: "article",
      locale: "id_ID",
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
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getInitialProject(slug);

  return <Detail project={project} />;
}

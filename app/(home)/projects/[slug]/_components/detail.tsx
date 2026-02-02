"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Github, Calendar, Computer } from "lucide-react";

import { useLanguage } from "@/hooks/use-language";

import { Project } from "@/lib/types/project";
import { formatDate, getFullImageUrl, getInitials } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Error from "@/components/error";

interface DetailProps {
  project: Project | null;
}

export default function Detail({ project }: DetailProps) {
  const { t, language } = useLanguage();
  const router = useRouter();
  const initialLanguage = useRef(language);
  const unoptimized = process.env.NEXT_PUBLIC_IMAGE_UNOPTIMIZED === "true";

  useEffect(() => {
    const tables = document.querySelectorAll(".prose table");
    tables.forEach((table) => {
      if (table.parentElement?.classList.contains("table-wrapper")) {
        return;
      }

      const wrapper = document.createElement("div");
      wrapper.className = "table-wrapper overflow-x-auto";

      table.parentNode?.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });
  }, [project?.content]);

  useEffect(() => {
    if (language === initialLanguage.current || !project) {
      return;
    }

    const slug = language === "id" ? project.slug_id : project.slug_en;

    initialLanguage.current = language;

    router.push(`/projects/${slug}`);
  }, [language, project, router]);

  if (!project) {
    return <Error />;
  }

  return (
    <div className="min-h-screen pt-14">
      {/* Header Section */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Title & Meta */}
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={project.user.avatar_url} alt={project.user.name} />
                <AvatarFallback className="rounded-lg">{getInitials(project.user.name)}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate font-medium text-sm">{project.user.name}</span>
                <span className="truncate text-xs">{project.user.email}</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold leading-normal">{project.title}</h1>
            <p className="text-lg text-muted-foreground">{project.description}</p>

            {project.published_at && (
              <div className="flex items-center gap-2">
                <Calendar className="size-3.5" />
                <span className="text-sm">{formatDate(project.published_at, language)}</span>
              </div>
            )}

            {/* Categories */}
            <div className="flex flex-wrap gap-2 mt-8">
              {project.categories.map((category) => (
                <Badge key={category.id} className="py-1.5 px-3">
                  {category.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 justify-start lg:justify-end items-center">
            {project.demo_url ? (
              <Link href={project.demo_url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  <ExternalLink />
                  {t("button.home.detail.project.seeDemo")}
                </Button>
              </Link>
            ) : (
              <Button variant="outline" disabled>
                <ExternalLink />
                {t("button.home.detail.project.seeDemo")}
              </Button>
            )}

            {project.project_url ? (
              <Link href={project.project_url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  <Github />
                  {t("button.home.detail.project.seeCode")}
                </Button>
              </Link>
            ) : (
              <Button variant="secondary" disabled>
                <Github />
                {t("button.home.detail.project.seeCode")}
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Thumbnail Image */}
      <section className="max-w-5xl mx-auto px-4 mt-2">
        <div className="relative w-full h-100 md:h-120 rounded-lg overflow-hidden">
          <Image src={getFullImageUrl(project.thumbnail_url)} alt={project.title} fill className="object-cover object-center" priority unoptimized={unoptimized} />
        </div>
      </section>

      {/* Skills Section */}
      <section className="max-w-5xl mx-auto px-4 my-8">
        <div className="flex gap-2 items-center mb-4">
          <Computer className="size-5" />
          <h2 className="text-xl font-semibold">{t("home.detail.project.technology")}</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {project.skills.map((skill) => (
            <Badge key={skill.id} variant="outline" className="py-1.5 px-3">
              {skill.name}
            </Badge>
          ))}
        </div>
      </section>

      {/* Content Section */}
      {project.content && (
        <section className="max-w-5xl mx-auto px-4 pb-16">
          <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: project.content }} />
        </section>
      )}
    </div>
  );
}

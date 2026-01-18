"use client";

import { Project } from "@/lib/types/project";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Github, Calendar, Computer } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DetailProps {
  project: Project | null;
}

export default function Detail({ project }: DetailProps) {
  if (!project) {
    notFound();
  }

  const getFullImageUrl = (path: string) => {
    if (path.startsWith("http")) {
      return path;
    }
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api-portofolio.keviniansyah.site";
    return `${apiUrl}${path}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const initials = project.user.name
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen mt-28">
      {/* Back Button */}
      <div className="max-w-5xl mx-auto px-4">
        <Link href="/#proyek">
          <Button variant="ghost" className="gap-2 text-lg">
            <ArrowLeft className="size-6" />
            Kembali ke Proyek
          </Button>
        </Link>
      </div>

      {/* Header Section */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Title & Meta */}
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={project.user.avatar_url} alt={project.user.name} />
                <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate font-medium text-sm">{project.user.name}</span>
                <span className="truncate text-xs">{project.user.email}</span>
              </div>
            </div>

            <h1 className="text-5xl font-bold">{project.title}</h1>

            <p className="text-lg text-muted-foreground">{project.description}</p>

            {project.published_at && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{formatDate(project.published_at)}</span>
              </div>
            )}

            {/* Categories */}
            <div className="flex flex-wrap gap-2 mt-8">
              {project.categories.map((category) => (
                <Badge key={category.id} className="text-sm py-2 px-4">
                  {category.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-start lg:justify-end items-center">
            {project.demo_url ? (
              <Link href={project.demo_url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  <ExternalLink />
                  Lihat Demo
                </Button>
              </Link>
            ) : (
              <Button variant="outline" disabled>
                <ExternalLink />
                Lihat Demo
              </Button>
            )}
            {project.project_url ? (
              <Link href={project.project_url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  <Github />
                  Lihat Source Code
                </Button>
              </Link>
            ) : (
              <Button variant="secondary" disabled>
                <Github />
                Lihat Source Code
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Thumbnail Image */}
      <section className="max-w-5xl mx-auto px-4 mt-2">
        <div className="relative w-full h-100 md:h-120 rounded-lg overflow-hidden">
          <Image src={getFullImageUrl(project.thumbnail_url)} alt={project.title} fill className="object-cover object-center" priority />
        </div>
      </section>

      {/* Skills Section */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex gap-2 items-center mb-4">
          <Computer className="w-6 h-6" />
          <h2 className="text-2xl font-semibold">Teknologi yang Digunakan</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {project.skills.map((skill) => (
            <Badge key={skill.id} variant="outline" className="text-sm py-2 px-4">
              {skill.name}
            </Badge>
          ))}
        </div>
      </section>

      {/* Content Section */}
      {project.content && (
        <section className="max-w-5xl mx-auto px-4 pb-16">
          <div
            className="prose dark:prose-invert max-w-none 
    [&>p]:mb-4 [&>p]:leading-7
    [&>ul]:my-4 
    [&>ul>li]:my-0
    [&>ul>li>p]:my-0 [&>ul>li>p]:leading-relaxed
    [&>ol]:my-4
    [&>ol>li]:my-0
    [&>ol>li>p]:my-0 [&>ol>li>p]:leading-relaxed
    [&>h2]:mt-8 [&>h2]:mb-4
    [&>strong]:font-semibold"
            dangerouslySetInnerHTML={{ __html: project.content }}
          />
        </section>
      )}
    </div>
  );
}

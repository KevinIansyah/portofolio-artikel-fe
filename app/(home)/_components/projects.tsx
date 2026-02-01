"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useLanguage } from "@/hooks/use-language";

import { Project } from "@/lib/types/project";
import { Paginator } from "@/lib/types/paginator";
import { getFullImageUrl } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import Heading from "@/components/home/heading";

interface ProjectsSectionProps {
  projects: Paginator<Project> | null;
  id?: string;
}

export default function ProjectsSection({ projects, id }: ProjectsSectionProps) {
  const { t, language } = useLanguage();
  const router = useRouter();
  const unoptimized = process.env.NEXT_PUBLIC_IMAGE_UNOPTIMIZED === "true";

  useEffect(() => {
    router.refresh();
  }, [language, router]);

  const projectsData = projects?.data || [];
  const latestProjects = projectsData.slice(0, 4);

  if (latestProjects.length === 0) {
    return (
      <section id={id} className="py-16 mx-auto px-4 max-w-6xl">
        <div className="space-y-14">
          <Heading title={t("heading.home.project.title")} subtitle={t("heading.home.project.subtitle")} description={t("heading.home.project.description")} />

          <p className="text-center text-sm text-muted-foreground italic">{t("home.project.empty")}</p>
        </div>
      </section>
    );
  }

  return (
    <section id={id} className="py-16 mx-auto px-4 max-w-6xl">
      <div className="space-y-14">
        <Heading title={t("heading.home.project.title")} subtitle={t("heading.home.project.subtitle")} description={t("heading.home.project.description")} />

        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {latestProjects.map((project, index) => (
              <Link href={`/projects/${project.slug}`} key={project.id} className={index === 3 ? "md:block hidden lg:hidden" : ""}>
                <Card key={project.id} className="group overflow-hidden flex flex-col rounded-lg pt-0 lg:pt-0 bg-linear-to-br from-muted to-background hover:shadow-lg">
                  {/* Project Image */}
                  <div className="w-full h-50 overflow-hidden">
                    <div className="relative w-full h-50">
                      <Image
                        src={getFullImageUrl(project.thumbnail_url)}
                        alt={project.title}
                        fill
                        className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-110"
                        sizes="fullscreen"
                        unoptimized={unoptimized}
                      />
                    </div>
                  </div>

                  {/* Project Title & Category */}
                  <CardHeader>
                    <h3 className="font-semibold text-lg line-clamp-2">{project.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.categories.slice(0, 2).map((category) => (
                        <Badge key={category.id}>{category.name}</Badge>
                      ))}
                    </div>
                  </CardHeader>

                  {/* Project Description */}
                  <CardContent className="text-sm text-muted-foreground line-clamp-3">{project.description}</CardContent>

                  {/* Project Tags & Button */}
                  <CardFooter className="space-y-4 lg:space-y-6">
                    <div className="flex flex-wrap gap-2">
                      {project.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill.id} variant="outline">
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>

          {/* View All Button */}
          {latestProjects.length >= 3 && (
            <div className="flex justify-center">
              <Link href="/projects" className="w-full max-w-sm">
                <Button variant="outline" className="w-full shadow-none">
                  {t("button.home.project.viewAll")}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

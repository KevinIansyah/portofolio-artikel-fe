"use client";

import { Project } from "@/lib/types/project";
import { Paginator } from "@/lib/types/paginator";

import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import Heading from "@/components/home/heading";

interface ProjectsSectionProps {
  projects: Paginator<Project> | null;
  id?: string;
}

export default function ProjectsSection({ projects, id }: ProjectsSectionProps) {
  const projectsData = projects?.data || [];
  // const latestProjects = projectsData.slice(0, 3);

  const getFullImageUrl = (path: string) => {
    if (path.startsWith("http")) {
      return path;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api-portofolio.keviniansyah.site";

    return `${apiUrl}${path}`;
  };

  if (projectsData.length === 0) {
    return (
      <section className="py-16 mx-auto px-4 max-w-6xl">
        <p className="text-center text-muted-foreground">Tidak ada proyek tersedia.</p>
      </section>
    );
  }

  return (
    <section id={id} className="py-16 mx-auto px-4 max-w-6xl">
      <div className="space-y-14">
        <Heading
          title="Studi Kasus Terbaru"
          subtitle="Proyek Saya"
          description="Beberapa proyek yang telah saya kerjakan, mulai dari landing page, aplikasi web interaktif hingga sistem informasi untuk pengelolaan data dan proses bisnis."
          delay={200}
        />

        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {projectsData.map((project) => (
              <Link href={`/projects/${project.slug}`} key={project.id}>
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
                      />
                    </div>
                  </div>

                  {/* Project Title & Category */}
                  <CardHeader className="">
                    <h3 className="font-semibold text-lg">{project.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.categories.slice(0, 2).map((category) => (
                        <Badge key={category.id}>{category.name}</Badge>
                      ))}
                    </div>
                  </CardHeader>

                  {/* Project Description */}
                  <CardContent className="text-sm text-muted-foreground line-clamp-3">{project.description}</CardContent>

                  {/* Project Tags & Button */}
                  <CardFooter className="space-y-4 lg:space-y-6 inline mt-auto">
                    <div className="flex flex-wrap gap-2">
                      {project.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill.id} variant="outline">
                          {skill.name}
                        </Badge>
                      ))}
                    </div>

                    {/* <Link href={`/projects/${project.slug}`} className="w-full">
                      <Button variant="ghost" className="w-full shadow-none flex items-center justify-center gap-2">
                        Lihat Detail
                        <ArrowRight />
                      </Button>
                    </Link> */}
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>

          {/* View All Button */}
          {/* <div className="flex justify-center">
            <Link href="/projects" className="w-full max-w-sm">
              <Button variant="outline" className="w-full shadow-none">
                Lihat Semua Proyek
              </Button>
            </Link>
          </div> */}
        </div>
      </div>
    </section>
  );
}

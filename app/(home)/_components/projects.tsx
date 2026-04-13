"use client";

import { Fragment, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowRight, ChevronRight } from "lucide-react";

import { useLanguage } from "@/hooks/use-language";

import { Project } from "@/lib/types/project";
import { Paginator } from "@/lib/types/paginator";
import { cn, getFullImageUrl } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Heading from "@/components/home/heading";

interface ProjectsSectionProps {
  projects: Paginator<Project> | null;
  id?: string;
}

function FeatureBullet() {
  return (
    <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border border-primary">
      <span className="h-1 w-1 rounded-full bg-primary" />
    </span>
  );
}

export default function ProjectsSection({ projects, id }: ProjectsSectionProps) {
  const { t, language } = useLanguage();
  const router = useRouter();
  const unoptimized = process.env.NEXT_PUBLIC_IMAGE_UNOPTIMIZED === "true";

  useEffect(() => {
    router.refresh();
  }, [language, router]);

  const projectsData = projects?.data || [];
  const latestProjects = projectsData.slice(0, 3);

  if (latestProjects.length === 0) {
    return (
      <section id={id} className="py-16 mx-auto px-4 max-w-5xl">
        <div className="space-y-14">
          <Heading title={t("heading.home.project.title")} subtitle={t("heading.home.project.subtitle")} description={t("heading.home.project.description")} />

          <p className="text-center text-sm text-muted-foreground italic">{t("home.project.empty")}</p>
        </div>
      </section>
    );
  }

  return (
    <section id={id} className="py-26 mx-auto px-4 max-w-6xl">
      <div className="space-y-14">
        <Heading title={t("heading.home.project.title")} subtitle={t("heading.home.project.subtitle")} description={t("heading.home.project.description")} />

        <div className="space-y-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:justify-center lg:gap-0">
            {latestProjects.map((project, index) => {
              const featureItems = project.skills.length > 0 ? project.skills.slice(0, 3) : project.categories.slice(0, 3);

              return (
                <Fragment key={project.id}>
                  <motion.div
                    className="min-w-0 flex-1 lg:max-w-md lg:px-3"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-48px" }}
                    transition={{ duration: 0.45, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link href={`/projects/${project.slug}`} className="group block h-full rounded-3xl border border-dashed p-2">
                      <article className={cn("flex h-full flex-col rounded-2xl border border-border bg-card p-0 shadow-none transition-colors", "hover:border-primary/35")}>
                        <div className="p-2">
                          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                            <Image
                              src={getFullImageUrl(project.thumbnail_url)}
                              alt={project.title}
                              fill
                              className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
                              sizes="(max-width: 1024px) 100vw, 33vw"
                              unoptimized={unoptimized}
                            />
                          </div>
                        </div>

                        <hr className="border-border" />

                        <div className="px-4 pb-4">
                          <div className="mt-4 flex items-center gap-3">
                            <span className="shrink-0 text-[10px] font-medium tabular-nums text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                            <div className="h-px w-4 shrink-0 bg-border" aria-hidden />
                          </div>

                          <h3 className="mt-3 text-base font-semibold leading-snug tracking-tight text-foreground line-clamp-2">{project.title}</h3>

                          <p className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground line-clamp-3">{project.description}</p>

                          {featureItems.length > 0 && (
                            <ul className="mt-4 space-y-2.5">
                              {featureItems.map((item) => (
                                <li key={item.id} className="flex gap-2.5 text-sm text-muted-foreground items-center">
                                  <FeatureBullet />
                                  <span className="leading-snug text-xs">{item.name}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </article>
                    </Link>
                  </motion.div>

                  {index < latestProjects.length - 1 && (
                    <div className="hidden shrink-0 items-center justify-center self-center lg:flex lg:px-1" aria-hidden>
                      <ChevronRight className="h-4 w-4 text-muted-foreground/45" strokeWidth={2} />
                    </div>
                  )}
                </Fragment>
              );
            })}
          </div>

          {projectsData.length >= 3 && (
            <motion.div
              className="flex justify-center pt-2"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <Button variant="outline" size="lg" className="border-dashed shadow-none" asChild>
                <Link href="/projects" className="gap-2 px-6">
                  {t("button.home.project.viewAll")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

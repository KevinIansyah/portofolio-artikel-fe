"use client";

import { Project } from "@/lib/types/project";
import { Article } from "@/lib/types/article";
import { Skill } from "@/lib/types/skill";
import { Paginator } from "@/lib/types/paginator";

import { HomePageBlobs } from "@/components/home-page-blobs";

import HeroSection from "./hero";
import SkillsSection from "./skill";
import ContactSection from "./contact";
import ProjectsSection from "./projects";
import ArticlesSection from "./articles";

interface HomeProps {
  projects: Paginator<Project> | null;
  articles: Paginator<Article> | null;
  skills: Skill[];
}

export default function Home({ projects, articles, skills }: HomeProps) {
  return (
    <>
      <HomePageBlobs />
      <div className="relative z-10">
        <HeroSection />
        <SkillsSection skills={skills} id="technology" />
        <ProjectsSection projects={projects} id="projects" />
        <ArticlesSection articles={articles} id="articles" />
        <ContactSection id="contact" />
      </div>
    </>
  );
}

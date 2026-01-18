"use-client";

import { Project } from "@/lib/types/project";
import { Skill } from "@/lib/types/skill";
import { Paginator } from "@/lib/types/paginator";

import HeroSection from "./hero";
import SkillsSection from "./skill";
import ContactSection from "./contact";
import ProjectsSection from "./projects";

interface HomeProps {
  projects: Paginator<Project> | null;
  skills: Skill[];
}

export default function Home({ projects, skills }: HomeProps) {
  return (
    <>
      <HeroSection />
      <SkillsSection skills={skills} id="technology" />
      <ProjectsSection projects={projects} id="projects" />
      <ContactSection id="contact" />
    </>
  );
}

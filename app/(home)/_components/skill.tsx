"use client";

import Image from "next/image";
import { Skill } from "@/lib/types/skill";
import Heading from "@/components/home/heading";

interface SkillsSectionProps {
  skills: Skill[];
  id?: string;
}

export default function SkillsSection({ skills, id }: SkillsSectionProps) {
  const getFullImageUrl = (path: string) => {
    if (path.startsWith("http")) {
      return path;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api-portofolio.keviniansyah.site";

    return `${apiUrl}${path}`;
  };

  return (
    <section id={id} className="mx-auto py-16 px-4 lg:max-w-6xl">
      <div className="space-y-14">
        <Heading title="Teknologi yang Digunakan" subtitle="Teknologi" description="Beberapa teknologi yang saya gunakan dalam pengembangan aplikasi web" delay={200} />

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4 lg:gap-6 lg:[&>*:nth-last-child(-n+3):nth-child(7n+1)]:col-start-3">
          {skills.map((skill, index) => (
            <div
              key={skill.id}
              className="group flex flex-col items-center justify-center space-y-2 p-4 lg:p-6 rounded-lg transition-all duration-300 bg-linear-to-br from-muted to-background hover:shadow-lg hover:scale-105 opacity-0 translate-y-4 animate-fade-in"
              style={{ animationDelay: `${800 + index * 100}ms` }}
            >
              <div className="relative h-10 w-10 transition-transform duration-300 group-hover:scale-110">
                <Image src={getFullImageUrl(skill.dark_icon_url)} alt={skill.name} fill className="object-contain" sizes="40px" />
              </div>
              <p className="text-sm text-center text-foreground">{skill.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

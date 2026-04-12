"use client";

import Image from "next/image";
import { motion } from "motion/react";

import { useLanguage } from "@/hooks/use-language";

import { Skill } from "@/lib/types/skill";

import Heading from "@/components/home/heading";
import { getFullImageUrl } from "@/lib/utils";

interface SkillsSectionProps {
  skills: Skill[];
  id?: string;
}

export default function SkillsSection({ skills, id }: SkillsSectionProps) {
  const { t } = useLanguage();
  const unoptimized = process.env.NEXT_PUBLIC_IMAGE_UNOPTIMIZED === "true";

  if (skills.length === 0) {
    return (
      <section id={id} className="py-16 mx-auto px-4 max-w-6xl">
        <div className="space-y-14">
          <Heading title={t("heading.home.skill.title")} subtitle={t("heading.home.skill.subtitle")} description={t("heading.home.skill.description")} />

          <p className="text-center text-sm text-muted-foreground italic">{t("home.skill.empty")}</p>
        </div>
      </section>
    );
  }

  return (
    <section id={id} className="mx-auto py-26 px-4 lg:max-w-6xl">
      <div className="space-y-14">
        <Heading title={t("heading.home.skill.title")} subtitle={t("heading.home.skill.subtitle")} description={t("heading.home.skill.description")} />

        <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 lg:gap-6">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.id}
              className="rounded-3xl border border-dashed p-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="group flex flex-col items-center justify-center space-y-3 rounded-2xl bg-card p-4 transition-all duration-300 hover:shadow-lg">
                <div className="relative h-10 w-10 transition-transform duration-300 group-hover:scale-110">
                  <Image src={getFullImageUrl(skill.dark_icon_url)} alt={skill.name} fill className="object-contain" sizes="40px" unoptimized={unoptimized} />
                </div>
                <p className="text-center text-xs text-foreground">{skill.name}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

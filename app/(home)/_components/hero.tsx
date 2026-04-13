"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";

const floatTransition = (duration: number) =>
  ({
    duration,
    repeat: Infinity,
    ease: "easeInOut" as const,
    repeatType: "loop" as const,
  }) as const;

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative bg-background">
      <div className="relative mx-auto flex max-h-screen min-h-screen max-w-6xl items-center justify-center overflow-hidden px-4 lg:overflow-visible">
        <div className="absolute inset-0 z-0">
          <motion.div className="absolute top-25 left-25 h-72 w-72 rounded-full bg-purple-600/30 blur-3xl" animate={{ y: [0, -20, 0], x: [0, 20, 0] }} transition={floatTransition(6)} />
          <motion.div
            className="absolute top-40 left-0 h-64 w-64 rounded-full bg-pink-500/30 blur-3xl md:top-50 md:left-120 lg:top-100 lg:left-150 xl:top-100 xl:left-100"
            animate={{ y: [0, 20, 0], x: [0, -20, 0] }}
            transition={floatTransition(5)}
          />
          <motion.div className="absolute right-25 bottom-25 h-72 w-72 rounded-full bg-blue-500/30 blur-3xl" animate={{ y: [0, -18, 0], x: [0, -16, 0] }} transition={floatTransition(4)} />
          <motion.div
            className="absolute right-0 bottom-40 h-64 w-64 rounded-full bg-yellow-500/30 blur-3xl md:bottom-50 md:right-120 lg:bottom-100 lg:right-150 xl:bottom-100 xl:right-100"
            animate={{ y: [0, -20, 0], x: [0, 20, 0] }}
            transition={floatTransition(6)}
          />
        </div>

        <div className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center gap-3"
          >
            <div className="h-px w-12 shrink-0 bg-linear-to-r from-transparent to-border sm:w-16" aria-hidden />
            <span className="shrink-0 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur-sm">{t("heading.home.hero.title")}</span>
            <div className="h-px w-12 shrink-0 bg-linear-to-l from-transparent to-border sm:w-16" aria-hidden />
          </motion.div>

          <motion.div className="mx-auto mt-4 max-w-3xl" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            <h1 className="text-6xl leading-tight font-bold text-foreground md:text-7xl" style={{ fontFamily: "var(--font-caveat)" }}>
              Kevin Iansyah
            </h1>
          </motion.div>

          <motion.div className="mx-auto mt-6 max-w-xl" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1, ease: [0.22, 1, 0.36, 1] }}>
            <p className="text-base leading-relaxed text-muted-foreground">{t("heading.home.hero.description")}</p>
          </motion.div>

          <motion.div className="mt-8 flex justify-center gap-3" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}>
            <Button size="lg" className="px-6 shadow-none w-35" asChild>
              <Link href="#projects">{t("button.home.hero.showProjects")}</Link>
            </Button>
            <Button size="lg" className="border-dashed px-6 shadow-none w-35" variant="outline" asChild>
              <Link href="/pdf/resume.pdf" target="_blank" download>
                {t("button.home.hero.downloadResume")}
              </Link>
            </Button>
          </motion.div>

          <motion.div
            className="mt-6 flex items-center justify-center gap-x-1 sm:gap-x-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-sm text-muted-foreground">{t("home.hero.builtWith")}</span>
            <span className="text-sm font-bold">Next.js</span>
            <span className="text-xs">&amp;</span>
            <span className="text-sm font-bold">Laravel</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

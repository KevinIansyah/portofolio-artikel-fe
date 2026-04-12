"use client";

import { motion } from "motion/react";

interface HeadingProps {
  title: string;
  subtitle?: string;
  description?: string;
  titleColor?: string;
  descriptionColor?: string;
  as?: "h1" | "h2" | "h3" | "h4";
}

export default function Heading({ title, subtitle, description, titleColor, descriptionColor, as = "h2" }: HeadingProps) {
  const TitleTag = as;

  return (
    <motion.div
      className="mx-auto max-w-3xl space-y-4 text-center"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {subtitle && (
        <div className="flex items-center justify-center gap-3">
          <div className="h-px w-12 shrink-0 bg-linear-to-r from-transparent to-border sm:w-16" aria-hidden />
          <span className="shrink-0 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur-sm">{subtitle}</span>
          <div className="h-px w-12 shrink-0 bg-linear-to-l from-transparent to-border sm:w-16" aria-hidden />
        </div>
      )}

      <TitleTag className="text-3xl font-bold tracking-tight md:text-4xl" style={titleColor ? { color: titleColor } : undefined}>
        {title}
      </TitleTag>

      {description && (
        <p className="text-sm text-muted-foreground" style={descriptionColor ? { color: descriptionColor } : undefined}>
          {description}
        </p>
      )}
    </motion.div>
  );
}

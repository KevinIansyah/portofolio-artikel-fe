"use client";

import React from "react";

interface HeadingProps {
  title: string;
  subtitle?: string;
  description?: string;
  titleColor?: string;
  descriptionColor?: string;
  as?: "h1" | "h2" | "h3" | "h4";
}

export default function Heading({
  title,
  subtitle,
  description,
  titleColor,
  descriptionColor,
  as = "h2",
}: HeadingProps) {
  const TitleTag = as;

  return (
    <div className="mx-auto max-w-3xl space-y-4 text-center">
      {subtitle && <div className="bg-primary/10 text-primary inline-block rounded-lg px-3 py-1 text-sm">{subtitle}</div>}

      <TitleTag className="text-3xl font-bold tracking-tight md:text-4xl" style={titleColor ? { color: titleColor } : undefined}>
        {title}
      </TitleTag>

      {description && (
        <p className="text-muted-foreground" style={descriptionColor ? { color: descriptionColor } : undefined}>
          {description}
        </p>
      )}
    </div>
  );
}

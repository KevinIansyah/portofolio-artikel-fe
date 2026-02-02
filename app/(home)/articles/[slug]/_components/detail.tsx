"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Calendar, Clock, Eye, Tags } from "lucide-react";
import hljs from "highlight.js";

import { useLanguage } from "@/hooks/use-language";

import { Article } from "@/lib/types/article";
import { formatDate, getFullImageUrl, getInitials } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Error from "@/components/error";

interface DetailProps {
  article: Article | null;
}

export default function Detail({ article }: DetailProps) {
  const { t, language } = useLanguage();
  const router = useRouter();
  const unoptimized = process.env.NEXT_PUBLIC_IMAGE_UNOPTIMIZED === "true";
  const initialLanguage = useRef(language);

  useEffect(() => {
    const tables = document.querySelectorAll(".prose table");
    tables.forEach((table) => {
      if (table.parentElement?.classList.contains("table-wrapper")) {
        return;
      }

      const wrapper = document.createElement("div");
      wrapper.className = "table-wrapper overflow-x-auto";

      table.parentNode?.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });

    document.querySelectorAll(".prose pre").forEach((pre) => {
      const code = pre.querySelector("code");

      if (code) {
        hljs.highlightElement(code as HTMLElement);
      }

      if (pre.querySelector(".copy-button")) return;

      pre.classList.add("relative", "group");

      const button = document.createElement("button");
      button.className =
        "copy-button absolute top-2 right-2 p-2 rounded bg-muted hover:bg-muted/80 " +
        "opacity-0 group-hover:opacity-100 transition-opacity duration-200 " +
        "flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground";
      button.innerHTML = `
        <svg class="copy-icon w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
        </svg>
        <span class="copy-text">Copy</span>
      `;

      button.addEventListener("click", async () => {
        const code = pre.querySelector("code");
        if (!code) return;

        try {
          await navigator.clipboard.writeText(code.textContent || "");

          button.innerHTML = `
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span>Copied!</span>
          `;
          button.classList.add("text-green-500");

          setTimeout(() => {
            button.innerHTML = `
              <svg class="copy-icon w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                <path d="M4 16c-1.1 0-2-.9-2 2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
              </svg>
              <span class="copy-text">Copy</span>
            `;
            button.classList.remove("text-green-500");
          }, 2000);
        } catch (err) {
          console.error("Failed to copy:", err);
        }
      });

      pre.appendChild(button);
    });
  }, [article?.content]);

  useEffect(() => {
    if (language === initialLanguage.current || !article) {
      return;
    }

    const slug = language === "id" ? article.slug_id : article.slug_en;

    initialLanguage.current = language;

    router.push(`/articles/${slug}`);
  }, [language, article, router]);

  if (!article) {
    return <Error />;
  }

  return (
    <div className="min-h-screen pt-14">
      {/* Header Section */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8">
          {/* Title & Meta */}
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={article.user.avatar_url} alt={article.user.name} />
                <AvatarFallback className="rounded-lg">{getInitials(article.user.name)}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate font-medium text-sm">{article.user.name}</span>
                <span className="truncate text-xs">{article.user.email}</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold leading-normal">{article.title}</h1>
            <p className="text-lg text-muted-foreground">{article.description}</p>

            <div className="flex gap-4 items-center">
              {article.published_at && (
                <div className="flex items-center gap-2">
                  <Calendar className="size-3.5" />
                  <span className="text-sm">{formatDate(article.published_at, language)}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Eye className="size-4" />
                <span className="text-sm">
                  {article.views} {t("home.article.seen")}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="size-4" />
                <span className="text-sm">
                  {article.reading_time} {t("home.article.minute")}
                </span>
              </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 mt-8">
              {article.categories.map((category) => (
                <Badge key={category.id} className="py-1.5 px-3">
                  {category.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Thumbnail Image */}
      <section className="max-w-5xl mx-auto px-4 mt-2">
        <div className="relative w-full h-100 md:h-120 rounded-lg overflow-hidden">
          <Image src={getFullImageUrl(article.thumbnail_url)} alt={article.title} fill className="object-cover object-center" priority unoptimized={unoptimized} />
        </div>
      </section>

      {/* Tags Section */}
      <section className="max-w-5xl mx-auto px-4 my-8">
        <div className="flex gap-2 items-center mb-4">
          <Tags className="size-5" />
          <h2 className="text-xl font-semibold">{t("home.detail.article.tag")}</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <Badge key={tag.id} variant="outline" className="py-1.5 px-3">
              {tag.name}
            </Badge>
          ))}
        </div>
      </section>

      {/* Content Section */}
      {article.content && (
        <section className="max-w-5xl mx-auto px-4 pb-16">
          <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
        </section>
      )}
    </div>
  );
}

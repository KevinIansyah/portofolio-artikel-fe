"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Calendar, Clock, Eye, Tags } from "lucide-react";

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
          <div
            className="prose dark:prose-invert max-w-none
      [&>p]:mb-4 [&>p]:leading-7
      [&>ul]:my-4
      [&>ul>li]:my-0
      [&>ul>li>p]:my-0 [&>ul>li>p]:leading-relaxed
      [&>ol]:my-4
      [&>ol>li]:my-0
      [&>ol>li>p]:my-0 [&>ol>li>p]:leading-relaxed

      [&>h1]:mt-10 [&>h1]:mb-6 [&>h1]:text-3xl [&>h1]:text-white
      [&>h2]:mt-8  [&>h2]:mb-4 [&>h2]:text-2xl [&>h2]:text-white
      [&>h3]:mt-6  [&>h3]:mb-3 [&>h3]:text-xl  [&>h3]:text-white

      [&>strong]:font-semibold"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </section>
      )}
    </div>
  );
}

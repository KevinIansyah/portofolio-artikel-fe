"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Clock, Eye } from "lucide-react";

import { useLanguage } from "@/hooks/use-language";

import { Article } from "@/lib/types/article";
import { Paginator } from "@/lib/types/paginator";
import { getFullImageUrl } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Heading from "@/components/home/heading";

interface ArticlesSectionProps {
  articles: Paginator<Article> | null;
  id?: string;
}

export default function ArticlesSection({ articles, id }: ArticlesSectionProps) {
  const { t, language } = useLanguage();
  const router = useRouter();
  const unoptimized = process.env.NEXT_PUBLIC_IMAGE_UNOPTIMIZED === "true";

  useEffect(() => {
    router.refresh();
  }, [language, router]);

  const articlesData = articles?.data || [];
  const latestArticles = articlesData.slice(0, 4);

  if (latestArticles.length === 0) {
    return (
      <section id={id} className="py-16 mx-auto px-4 max-w-6xl">
        <div className="space-y-14">
          <Heading title={t("heading.home.article.title")} subtitle={t("heading.home.article.subtitle")} description={t("heading.home.article.description")} />

          <p className="text-center text-sm text-muted-foreground italic">{t("home.article.empty")}</p>
        </div>
      </section>
    );
  }

  return (
    <section id={id} className="py-16 mx-auto px-4 max-w-6xl">
      <div className="space-y-14">
        <Heading title={t("heading.home.article.title")} subtitle={t("heading.home.article.subtitle")} description={t("heading.home.article.description")} />

        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {latestArticles.map((article, index) => (
              <Link href={`/articles/${article.slug}`} key={article.id} className={index === 3 ? "md:block hidden lg:hidden" : index === 2 ? "lg:hidden" : ""}>
                <Card key={article.id} className="h-full group overflow-hidden flex flex-col rounded-lg py-0 lg:py-0 bg-linear-to-br from-muted to-background hover:shadow-lg">
                  <div className="h-full grid grid-cols-1 lg:grid-cols-2">
                    {/* article Image */}
                    <div className="w-full h-50 lg:h-full overflow-hidden grid-cols-1">
                      <div className="relative w-full h-50 lg:h-full">
                        <Image
                          src={getFullImageUrl(article.thumbnail_url)}
                          alt={article.title}
                          fill
                          className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-110"
                          sizes="fullscreen"
                          unoptimized={unoptimized}
                        />
                      </div>
                    </div>

                    <div className="py-4 lg:py-6 space-y-4 lg:space-y-6 grid-cols-1">
                      {/* article Title & Category */}
                      <CardHeader>
                        <h3 className="font-semibold text-lg line-clamp-2 lg:line-clamp-3">{article.title}</h3>

                        <div className="space-y-4 lg:space-y-6 mb-2">
                          <div className="flex gap-4 items-center">
                            <div className="flex items-center gap-2">
                              <Eye className="size-4" />
                              <span className="text-sm md:text-xs">
                                {article.views} {t("home.article.seen")}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <Clock className="size-4" />
                              <span className="text-sm md:text-xs">
                                {article.reading_time} {t("home.article.minute")}
                              </span>
                            </div>
                          </div>

                          {/* <div className="flex flex-wrap gap-2">
                            {article.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag.id} variant="secondary" className="text-xs">
                                {tag.name}
                              </Badge>
                            ))}
                            {article.tags.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{article.tags.length - 2}
                              </Badge>
                            )}
                          </div> */}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {article.categories.slice(0, 2).map((tag) => (
                            <Badge key={tag.id} className="text-sm md:text-xs">
                              {tag.name}
                            </Badge>
                          ))}
                          {article.categories.length > 2 && <Badge className="text-sm md:text-xs">+{article.categories.length - 2}</Badge>}
                        </div>
                      </CardHeader>

                      {/* article Description */}
                      <CardContent className="md:text-sm text-muted-foreground line-clamp-3 lg:line-clamp-4 mb-0">{article.description}</CardContent>

                      {/* article Tags & Button */}
                      {/* <CardFooter></CardFooter> */}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {/* View All Button */}
          {latestArticles.length >= 4 && (
            <div className="flex justify-center">
              <Link href="/articles" className="w-full max-w-sm">
                <Button variant="outline" className="w-full shadow-none">
                  {t("button.home.article.viewAll")}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

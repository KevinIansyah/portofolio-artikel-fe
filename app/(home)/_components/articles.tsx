"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowRight, Clock, LayoutList, Sparkles } from "lucide-react";

import { useLanguage } from "@/hooks/use-language";

import { Article } from "@/lib/types/article";
import { Paginator } from "@/lib/types/paginator";
import { cn, getFullImageUrl } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Heading from "@/components/home/heading";
import type { TranslationKey } from "@/locales";

interface ArticlesSectionProps {
  articles: Paginator<Article> | null;
  id?: string;
}

function categoryLabel(article: Article): string {
  return article.categories[0]?.name ?? "—";
}

interface ArticleCardFrameProps {
  children: React.ReactNode;
  className?: string;
}

function ArticleCardFrame({ children, className }: ArticleCardFrameProps) {
  return <div className={cn("h-full border border-dashed border-border rounded-3xl p-2 transition-colors group-hover:border-primary/35", className)}>{children}</div>;
}

export default function ArticlesSection({ articles, id }: ArticlesSectionProps) {
  const { t, language } = useLanguage();
  const router = useRouter();
  const unoptimized = process.env.NEXT_PUBLIC_IMAGE_UNOPTIMIZED === "true";

  useEffect(() => {
    router.refresh();
  }, [language, router]);

  const articlesData = articles?.data || [];
  const list = articlesData.slice(0, 8);

  if (list.length === 0) {
    return (
      <section id={id} className="py-16 mx-auto px-4 max-w-6xl">
        <div className="space-y-14">
          <Heading title={t("heading.home.article.title")} subtitle={t("heading.home.article.subtitle")} description={t("heading.home.article.description")} />

          <p className="text-center text-sm text-muted-foreground italic">{t("home.article.empty")}</p>
        </div>
      </section>
    );
  }

  const [featured, side, ...rest] = list;
  // const middle = rest.slice(0, 3);
  const compact = rest.slice(0, 3);

  return (
    <section id={id} className="py-16 mx-auto px-4 max-w-6xl">
      <div className="space-y-14">
        <Heading title={t("heading.home.article.title")} subtitle={t("heading.home.article.subtitle")} description={t("heading.home.article.description")} />

        <div className="space-y-4 md:space-y-6">
          {/* Baris 1: featured (2/3) + kartu vertikal (1/3) */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
            <motion.div
              className={cn(side ? "lg:col-span-2" : "lg:col-span-3")}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-48px" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href={`/articles/${featured.slug}`} className="group block h-full">
                <ArticleCardFrame>
                  <article className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-border bg-card/40 transition-colors lg:min-h-[280px] lg:flex-row">
                    <div className="relative aspect-video w-full shrink-0 lg:aspect-auto lg:w-1/2 lg:max-w-[50%] lg:min-h-[260px]">
                      <Image
                        src={getFullImageUrl(featured.thumbnail_url)}
                        alt={featured.title}
                        fill
                        className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        unoptimized={unoptimized}
                      />

                      {featured.categories[0] && (
                        <Badge className="absolute left-3 top-3 border-0 rounded-sm py-1.5 px-2 bg-background/70 text-xs text-foreground backdrop-blur-sm">{featured.categories[0].name}</Badge>
                      )}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col p-5 lg:p-6">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-left text-base font-semibold leading-snug tracking-tight text-foreground line-clamp-2 lg:text-lg">{featured.title}</h3>
                        <Badge className="shrink-0 border-0 bg-primary py-2 px-3 text-xs font-semibold text-primary-foreground">
                          <Sparkles className="size-3.5 shrink-0 opacity-80" />
                          {t("home.article.featuredBadge")}
                        </Badge>
                      </div>

                      <p className="mt-3 flex-1 text-left text-xs leading-relaxed text-muted-foreground line-clamp-4">{featured.description}</p>

                      <div className="mt-3 flex items-center justify-between gap-2 text-xs text-muted-foreground sm:text-sm">
                        <span className="flex min-w-0 items-center gap-1.5 px-2 py-1.5 bg-primary/20 rounded-sm">
                          <LayoutList className="size-3 shrink-0 opacity-80" />
                          <span className="truncate text-xs">{categoryLabel(featured)}</span>
                        </span>
                        <span className="flex shrink-0 items-center gap-1.5 px-2 py-1.5 bg-primary/20 rounded-sm">
                          <Clock className="size-3 shrink-0 opacity-80" />
                          <span className="text-xs">
                            {featured.reading_time} {t("home.article.minute")}
                          </span>
                        </span>
                      </div>
                    </div>
                  </article>
                </ArticleCardFrame>
              </Link>
            </motion.div>

            {side && (
              <motion.div
                className="lg:col-span-1"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-48px" }}
                transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <VerticalArticleCard article={side} t={t} unoptimized={unoptimized} />
              </motion.div>
            )}
          </div>

          {/* Baris 2: tiga kartu vertikal */}
          {/* {middle.length > 0 && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {middle.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                >
                  <VerticalArticleCard article={article} t={t} unoptimized={unoptimized} />
                </motion.div>
              ))}
            </div>
          )} */}

          {/* Baris 3: kartu horizontal kompak */}
          {compact.length > 0 && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {compact.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                >
                  <CompactArticleCard article={article} t={t} unoptimized={unoptimized} />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {articlesData.length >= 4 && (
          <motion.div
            className="flex justify-center pt-2"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <Button variant="outline" size="lg" className="border-dashed shadow-none" asChild>
              <Link href="/articles" className="gap-2 px-6">
                {t("button.home.article.viewAll")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function VerticalArticleCard({ article, t, unoptimized }: { article: Article; t: (key: TranslationKey) => string; unoptimized: boolean }) {
  return (
    <Link href={`/articles/${article.slug}`} className="group block h-full">
      <ArticleCardFrame>
        <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card/40 transition-colors hover:border-primary/35">
          <div className="p-2">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={getFullImageUrl(article.thumbnail_url)}
                alt={article.title}
                fill
                className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 33vw"
                unoptimized={unoptimized}
              />
              {article.categories[0] && (
                <Badge className="absolute left-2 top-2 border-0 rounded-sm py-1.5 px-2 bg-background/70 text-xs text-foreground backdrop-blur-sm">{article.categories[0].name}</Badge>
              )}
            </div>
          </div>

          <hr className="border-border" />

          <div className="flex flex-1 flex-col px-4 pb-4 pt-1">
            <h3 className="mt-2 text-left text-base font-semibold leading-snug tracking-tight text-foreground line-clamp-2">{article.title}</h3>
            <p className="mt-3 flex-1 text-left text-xs leading-relaxed text-muted-foreground line-clamp-3">{article.description}</p>

            <div className="mt-4 flex items-center justify-between gap-2 text-muted-foreground">
              <span className="flex min-w-0 items-center gap-1.5 px-2 py-1.5 bg-primary/20 rounded-sm">
                <LayoutList className="size-3 shrink-0 opacity-80" />
                <span className="truncate text-xs">{categoryLabel(article)}</span>
              </span>
              <span className="flex shrink-0 items-center gap-1.5 px-2 py-1.5 bg-primary/20 rounded-sm">
                <Clock className="size-3 shrink-0 opacity-80" />
                <span className="text-xs">
                  {article.reading_time} {t("home.article.minute")}
                </span>
              </span>
            </div>
          </div>
        </article>
      </ArticleCardFrame>
    </Link>
  );
}

function CompactArticleCard({ article, t, unoptimized }: { article: Article; t: (key: TranslationKey) => string; unoptimized: boolean }) {
  return (
    <Link href={`/articles/${article.slug}`} className="group block h-full">
      <ArticleCardFrame>
        <article className="flex h-full min-h-[120px] flex-row gap-3 overflow-hidden rounded-2xl border border-border bg-card/40 p-3 transition-colors hover:border-primary/35 sm:gap-4 sm:p-4">
          <div className="relative size-24 shrink-0 overflow-hidden rounded-lg sm:size-28">
            <Image
              src={getFullImageUrl(article.thumbnail_url)}
              alt={article.title}
              fill
              className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
              sizes="112px"
              unoptimized={unoptimized}
            />
          </div>

          <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
            <h3 className="text-left text-sm font-semibold leading-snug text-foreground line-clamp-1">{article.title}</h3>
            <p className="mt-1 flex-1 text-left text-[10px] leading-relaxed text-muted-foreground line-clamp-2">{article.description}</p>

            <div className="mt-1 flex items-center justify-between gap-2 pt-2 text-[10px] text-muted-foreground sm:text-xs">
              <span className="flex min-w-0 items-center gap-1 px-1.5 py-1 bg-primary/20 rounded-sm">
                <LayoutList className="size-2.5 shrink-0 opacity-80" />
                <span className="truncate text-[10px]">{categoryLabel(article)}</span>
              </span>
              <span className="flex shrink-0 items-center gap-1 px-1.5 py-1 bg-primary/20 rounded-sm">
                <Clock className="size-2.5 shrink-0 opacity-80" />
                <span className="text-[10px]">
                  {article.reading_time} {t("home.article.minute")}
                </span>
              </span>
            </div>
          </div>
        </article>
      </ArticleCardFrame>
    </Link>
  );
}

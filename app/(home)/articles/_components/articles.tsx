"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { Clock, Eye, Search } from "lucide-react";

import { useLanguage } from "@/hooks/use-language";

import { Article } from "@/lib/types/article";
import { Paginator } from "@/lib/types/paginator";
import { cn, getFullImageUrl } from "@/lib/utils";
import { siteCardInner, siteCardOuter, siteFieldClass, siteSelectFieldClass } from "@/lib/site-ui";

import { apiClient } from "@/lib/api/client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Heading from "@/components/home/heading";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ArticlesProps {
  initialData: Paginator<Article> | null;
}

export default function Articles({ initialData }: ArticlesProps) {
  const { t, language } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const unoptimized = process.env.NEXT_PUBLIC_IMAGE_UNOPTIMIZED === "true";

  // Read from URL, fallback to default
  const [currentPage, setCurrentPage] = React.useState(Number(searchParams.get("page")) || 1);
  const [perPage, setPerPage] = React.useState(Number(searchParams.get("per_page")) || 20);
  const [search, setSearch] = React.useState(searchParams.get("search") || "");
  const [debouncedSearch, setDebouncedSearch] = React.useState(search);

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Sync state to URL every time it changes
  React.useEffect(() => {
    const params = new URLSearchParams();

    if (currentPage !== 1) params.set("page", currentPage.toString());
    if (perPage !== 20) params.set("per_page", perPage.toString());
    if (debouncedSearch) params.set("search", debouncedSearch);

    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;

    router.push(newUrl, { scroll: false });
  }, [currentPage, router, perPage, debouncedSearch]);

  // Build API URL with query params
  const buildApiUrl = React.useCallback(() => {
    const params = new URLSearchParams();

    params.append("page", currentPage.toString());
    params.append("per_page", perPage.toString());

    if (debouncedSearch) {
      params.append("search", debouncedSearch);
    }

    return `/api/articles?${params.toString()}`;
  }, [currentPage, perPage, debouncedSearch]);

  // Fetch data with SWR
  const { data, isLoading } = useSWR<Paginator<Article>>([buildApiUrl(), language], ([url]) => apiClient.get(url), {
    fallbackData: initialData || undefined,
    revalidateOnFocus: false,
    keepPreviousData: true,
  });

  // Reset to page 1 when language changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [language]);

  // Extract articles data
  const articles = data?.data || [];
  const meta = data;

  if (articles.length === 0) {
    return (
      <section className="pt-30 pb-16 mx-auto px-4 max-w-6xl">
        <Heading title={t("heading.home.article.title")} subtitle={t("heading.home.article.subtitle")} description={t("heading.home.article.description")} />

        <div className="space-y-4 lg:space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="relative min-w-0 w-full sm:max-w-md sm:flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder={t("table.article.search")} value={search} onChange={(e) => setSearch(e.target.value)} className={cn("h-10 pl-9", siteFieldClass)} />
            </div>

            <Select
              value={perPage.toString()}
              onValueChange={(value) => {
                setPerPage(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className={siteSelectFieldClass}>
                <span className="sr-only">Toggle Per Page</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{t("datatable.perPage")}</SelectLabel>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                  <SelectItem value="40">40</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <p className="text-center text-sm text-muted-foreground italic">{t("home.article.empty")}</p>

          <div className="flex items-center justify-between mt-4 lg:mt-6">
            <div className="text-sm text-muted-foreground">
              {t("datatable.showing")} {meta?.from || 0} {t("datatable.to")} {meta?.to || 0} {t("datatable.of")} {meta?.total || 0} {t("articles.lowercase")}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))} disabled={currentPage === 1 || isLoading}>
                {t("datatable.previous")}
              </Button>
              <div className="flex items-center gap-1">
                <span className="text-sm">
                  {t("datatable.page")} {currentPage} {t("datatable.of")} {meta?.last_page || 1}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage((prev) => prev + 1)} disabled={currentPage >= (meta?.last_page || 1) || isLoading}>
                {t("datatable.next")}
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-30 pb-16 mx-auto px-4 max-w-6xl">
      <div className="space-y-14">
        <Heading as="h1" title={t("heading.home.article.title")} subtitle={t("heading.home.article.subtitle")} description={t("heading.home.article.description")} />

        <div className="space-y-4 lg:space-y-6">
          {/* Filter */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            {/* Search */}
            <div className="relative min-w-0 w-full sm:max-w-md sm:flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder={t("table.article.search")} value={search} onChange={(e) => setSearch(e.target.value)} className={cn("h-10 pl-9", siteFieldClass)} />
            </div>

            {/* Per Page Select */}
            <Select
              value={perPage.toString()}
              onValueChange={(value) => {
                setPerPage(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className={siteSelectFieldClass}>
                <span className="sr-only">Toggle Per Page</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{t("datatable.perPage")}</SelectLabel>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                  <SelectItem value="40">40</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {articles.map((article) => (
              <Link href={`/articles/${article.slug}`} key={article.id} className="group block h-full">
                <div className={cn(siteCardOuter, "h-full transition-colors group-hover:border-primary/35")}>
                  <article className={cn("flex h-full flex-col overflow-hidden", siteCardInner)}>
                    <div className="p-2">
                      <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                        <Image
                          src={getFullImageUrl(article.thumbnail_url)}
                          alt={article.title}
                          fill
                          className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          unoptimized={unoptimized}
                        />
                        {article.categories[0] && (
                          <div className="absolute left-2 top-2 flex items-center gap-2">
                            <Badge className="border-0 rounded-sm py-1.5 px-2 bg-background/70 text-xs text-foreground backdrop-blur-sm">{article.categories[0].name}</Badge>
                          </div>
                        )}
                      </div>
                    </div>
                    <hr className="border-border" />
                    <div className="flex flex-1 flex-col px-4 pb-4 pt-1">
                      <div className="flex items-center gap-2 mt-3">
                        <Badge className="border-0 rounded-sm py-1.5 px-2 bg-background/70 text-xs text-foreground backdrop-blur-sm">
                          <Eye className="size-3 shrink-0 opacity-80" />
                          {article.views} {t("home.article.seen")}
                        </Badge>
                        <Badge className="border-0 rounded-sm py-1.5 px-2 bg-background/70 text-xs text-foreground backdrop-blur-sm">
                          <Clock className="size-3 shrink-0 opacity-80" />
                          {article.reading_time} {t("home.article.minute")}
                        </Badge>
                      </div>

                      <h3 className="mt-3 line-clamp-2 text-left text-base font-semibold leading-snug tracking-tight text-foreground">{article.title}</h3>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {article.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag.id} className="rounded-sm px-1 py-0.5 text-[10px]">
                            {tag.name}
                          </Badge>
                        ))}
                        {article.tags.length > 2 && <Badge className="rounded-sm px-1 py-0.5 text-[10px] min-w-6">+{article.tags.length - 2}</Badge>}
                      </div>
                      <p className="mt-3 line-clamp-3 flex-1 text-left text-xs leading-relaxed text-muted-foreground">{article.description}</p>
                    </div>
                  </article>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 lg:mt-6">
            <div className="text-sm text-muted-foreground">
              {t("datatable.showing")} {meta?.from || 0} {t("datatable.to")} {meta?.to || 0} {t("datatable.of")} {meta?.total || 0} {t("articles.lowercase")}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="border-dashed bg-transparent shadow-none" onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))} disabled={currentPage === 1 || isLoading}>
                {t("datatable.previous")}
              </Button>
              <div className="flex items-center gap-1">
                <span className="text-sm">
                  {t("datatable.page")} {currentPage} {t("datatable.of")} {meta?.last_page || 1}
                </span>
              </div>
              <Button
                variant="outline"
                className="border-dashed bg-transparent shadow-none"
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage >= (meta?.last_page || 1) || isLoading}
              >
                {t("datatable.next")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

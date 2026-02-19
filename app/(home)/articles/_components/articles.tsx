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
import { getFullImageUrl } from "@/lib/utils";

import { apiClient } from "@/lib/api/client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
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
          <div className="flex items-center justify-between gap-4">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder={t("table.article.search")} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>

            <Select
              value={perPage.toString()}
              onValueChange={(value) => {
                setPerPage(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-30">
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
          <div className="flex items-center justify-between gap-4">
            {/* Search */}
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder={t("table.article.search")} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>

            {/* Per Page Select */}
            <Select
              value={perPage.toString()}
              onValueChange={(value) => {
                setPerPage(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-30">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {articles.map((article) => (
              <Link href={`/articles/${article.slug}`} key={article.id}>
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
                        <h3 className="font-semibold text-lg line-clamp-3">{article.title}</h3>

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
                      <CardContent className="md:text-sm text-muted-foreground line-clamp-3 lg:line-clamp-4">{article.description}</CardContent>

                      {/* article Tags & Button */}
                      {/* <CardFooter></CardFooter> */}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {/* Pagination */}
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
      </div>
    </section>
  );
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Clock, Share2 } from "lucide-react";
import hljs from "highlight.js";

import { useLanguage } from "@/hooks/use-language";

import { Article } from "@/lib/types/article";
import { buildTocFromHtml } from "@/lib/build-content-toc";
import { siteWhatsAppChatUrl } from "@/lib/site-ui";
import { cn, formatDate, getFullImageUrl, getInitials } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import Error from "@/components/error";

interface DetailProps {
  article: Article | null;
}

export default function Detail({ article }: DetailProps) {
  const { t, language } = useLanguage();
  const router = useRouter();
  const initialLanguage = useRef(language);
  const [shareCopied, setShareCopied] = useState(false);
  const [shareFallbackOpen, setShareFallbackOpen] = useState(false);

  const toc = useMemo(() => (article?.content ? buildTocFromHtml(article.content) : []), [article]);

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
        const codeEl = pre.querySelector("code");
        if (!codeEl) return;

        try {
          await navigator.clipboard.writeText(codeEl.textContent || "");

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
    const root = document.getElementById("article-body");
    if (!root || toc.length === 0) return;

    const live = Array.from(root.querySelectorAll("h1, h2, h3"));
    const n = Math.min(live.length, toc.length);
    for (let i = 0; i < n; i++) {
      (live[i] as HTMLElement).id = toc[i].id;
    }
  }, [toc, article?.content]);

  useEffect(() => {
    if (language === initialLanguage.current || !article) {
      return;
    }

    const slug = language === "id" ? article.slug_id : article.slug_en;

    initialLanguage.current = language;

    router.push(`/articles/${slug}`);
  }, [language, article, router]);

  const ctaWhatsAppHref = useMemo(() => siteWhatsAppChatUrl(t("article.detail.ctaWhatsAppPrefill")), [t]);

  if (!article) {
    return <Error />;
  }

  const primaryCategory = article.categories[0];

  const handleShareClick = async () => {
    const url = window.location.href;
    const title = article.title;
    const text = article.description?.trim() ? `${title}\n\n${article.description.slice(0, 240)}` : title;

    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (e) {
        if (e && typeof e === "object" && "name" in e && (e as { name: string }).name === "AbortError") {
          return;
        }
      }
    }

    setShareFallbackOpen(true);
  };

  return (
    <>
      <div className="relative z-10 mt-16 min-h-screen">
        {/* Title & Meta */}
        <div className="mx-auto max-w-6xl px-4 pt-8 pb-6">
          {primaryCategory && <Badge className="mb-4 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">{primaryCategory.name}</Badge>}

          <h1 className="max-w-4xl text-3xl md:text-4xl font-bold tracking-tight text-foreground md:leading-tight">{article.title}</h1>
          <p className="max-w-3xl mt-3 text-base text-muted-foreground">{article.description}</p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <Avatar className="h-10 w-10 shrink-0 rounded-full">
                <AvatarImage src={article.user.avatar_url} alt={article.user.name} />
                <AvatarFallback className="rounded-full">{getInitials(article.user.name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-semibold text-sm">{article.user.name}</p>
                <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{article.user.bio ? article.user.bio : "Full Stack Developer"}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-400">
              {article.published_at ? <span>{formatDate(article.published_at, language)}</span> : null}
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5 shrink-0 opacity-80" aria-hidden />
                <span>
                  {article.reading_time} {t("article.detail.readTimeSuffix")}
                </span>
              </span>
              <span>
                {article.views} {t("article.detail.viewsUnit")}
              </span>
              <Popover open={shareFallbackOpen} onOpenChange={setShareFallbackOpen}>
                <PopoverAnchor asChild>
                  <button type="button" className="inline-flex items-center gap-1.5 text-zinc-400 transition-colors hover:text-white" onClick={() => void handleShareClick()}>
                    <Share2 className="size-3.5 shrink-0 opacity-80" aria-hidden />
                    {shareCopied ? t("article.detail.shareCopied") : t("article.detail.share")}
                  </button>
                </PopoverAnchor>
                <PopoverContent align="end" className="w-[min(100vw-2rem,18rem)] border-zinc-700 bg-zinc-950 p-3 text-zinc-100 shadow-lg" onOpenAutoFocus={(e) => e.preventDefault()}>
                  <p className="mb-2 text-xs font-medium text-zinc-400">{t("article.detail.shareDialogTitle")}</p>
                  <ul className="flex flex-col gap-0.5">
                    <li>
                      <button
                        type="button"
                        className="w-full rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-white/10"
                        onClick={() => {
                          const pageUrl = window.location.href;
                          const text = article.description?.trim() ? `${article.title}\n\n${article.description.slice(0, 200)}\n\n${pageUrl}` : `${article.title}\n\n${pageUrl}`;
                          window.open(siteWhatsAppChatUrl(text), "_blank", "noopener,noreferrer");
                          setShareFallbackOpen(false);
                        }}
                      >
                        {t("article.detail.shareViaWhatsApp")}
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="w-full rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-white/10"
                        onClick={() => {
                          const pageUrl = window.location.href;
                          window.open(`https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(article.title)}`, "_blank", "noopener,noreferrer");
                          setShareFallbackOpen(false);
                        }}
                      >
                        {t("article.detail.shareViaTelegram")}
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="w-full rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-white/10"
                        onClick={() => {
                          const pageUrl = window.location.href;
                          window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(article.title)}`, "_blank", "noopener,noreferrer");
                          setShareFallbackOpen(false);
                        }}
                      >
                        {t("article.detail.shareViaX")}
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="w-full rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-white/10"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(window.location.href);
                            setShareCopied(true);
                            setShareFallbackOpen(false);
                            window.setTimeout(() => setShareCopied(false), 2000);
                          } catch {
                            /* ignore */
                          }
                        }}
                      >
                        {t("article.detail.copyLink")}
                      </button>
                    </li>
                  </ul>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* Hero image + overlay judul */}
        <section className="mx-auto max-w-6xl px-4 pb-10">
          <div className="relative aspect-2/1 min-h-[220px] w-full overflow-hidden rounded-xl md:aspect-21/9 md:min-h-[280px]">
            <Image src={getFullImageUrl(article.thumbnail_url)} alt="" fill className="object-cover object-center" priority unoptimized />
            <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-transparent" aria-hidden />
          </div>
        </section>

        {/* Konten + sidebar */}
        <div className="mx-auto max-w-6xl px-4 pb-26">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
            <main className="min-w-0 lg:col-span-8 order-2 lg:order-1">
              {article.content && (
                <>
                  <div
                    id="article-body"
                    className="prose prose-neutral max-w-none dark:prose-invert prose-headings:scroll-mt-24 prose-a:text-primary [&>h1:first-child]:mt-0! [&>h2:first-child]:mt-0!"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                  />

                  {article.tags.length > 0 && (
                    <div className="mt-10 border-t border-border pt-10">
                      <div className="flex flex-wrap gap-2">
                        {article.tags.map((tag) => (
                          <span key={tag.id} className="text-sm text-muted-foreground">
                            #{tag.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-10 rounded-xl border border-border bg-card p-4 lg:p-6 shadow-sm block lg:hidden">
                    <p className="text-base font-semibold text-foreground">{t("article.detail.ctaTitle")}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{t("article.detail.ctaDescription")}</p>
                    <Button className="mt-4 w-full sm:w-auto" asChild>
                      <a href={ctaWhatsAppHref} target="_blank" rel="noopener noreferrer">
                        {t("article.detail.ctaButton")}
                      </a>
                    </Button>
                  </div>
                </>
              )}
            </main>

            <aside className={cn("lg:col-span-4 order-1 lg:order-2", toc.length > 0 ? "block" : "hidden")}>
              <div className="flex flex-col gap-4 lg:gap-6 lg:sticky lg:top-24">
                {toc.length > 0 && (
                  <nav className="rounded-xl border border-border bg-card p-4 lg:p-6 shadow-sm" aria-label={t("article.detail.toc")}>
                    <p className="mb-3 text-base font-semibold text-foreground">{t("article.detail.toc")}</p>
                    <ul className="space-y-2 text-sm">
                      {toc.map((item) => (
                        <li key={item.id}>
                          <a
                            href={`#${item.id}`}
                            className={cn(
                              "block text-muted-foreground transition-colors hover:text-foreground",
                              item.level === 1 && "font-medium text-foreground",
                              item.level === 2 && "font-medium text-foreground",
                              item.level === 3 && "pl-3 text-[13px]",
                            )}
                            onClick={(e) => {
                              e.preventDefault();
                              document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                            }}
                          >
                            {item.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                )}

                <div className="rounded-xl border border-border bg-card p-4 lg:p-6 shadow-sm hidden lg:block">
                  <p className="text-base font-semibold text-foreground">{t("article.detail.ctaTitle")}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{t("article.detail.ctaDescription")}</p>
                  <Button className="mt-4 w-full sm:w-auto" asChild>
                    <a href={ctaWhatsAppHref} target="_blank" rel="noopener noreferrer">
                      {t("article.detail.ctaButton")}
                    </a>
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}

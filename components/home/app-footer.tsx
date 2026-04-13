"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { useLanguage } from "@/hooks/use-language";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { siteFieldClass } from "@/lib/site-ui";

interface NavItem {
  title: string;
  href: string;
}

interface SocialItem {
  name: string;
  url: string;
}

export default function AppFooter() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");

  const mainNavItems: NavItem[] = [
    { title: t("nav.home"), href: "/" },
    { title: t("nav.technology"), href: "/#technology" },
    { title: t("nav.project"), href: "/projects" },
    { title: t("nav.article"), href: "/articles" },
    { title: t("nav.contact"), href: "/#contact" },
  ];

  const socials: SocialItem[] = [
    { name: "Facebook", url: "https://web.facebook.com/kevin.iansyah/" },
    { name: "Instagram", url: "https://www.instagram.com/keviniansyah/" },
    { name: "Twitter", url: "#" },
    { name: "LinkedIn", url: "https://www.linkedin.com/in/kevin-iansyah/" },
    { name: "GitHub", url: "https://github.com/KevinIansyah" },
  ];

  const subscribeNewsletter = () => {
    if (email.trim()) {
      setEmail("");
    }
  };

  const year = new Date().getFullYear();

  return (
    <footer className="bg-background px-4 py-12 md:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-3xl border border-dashed border-border p-2">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm lg:p-6">
            {/* Brand + Navigasi + Media sosial */}
            <div className="grid grid-cols-1 gap-10 md:grid-cols-3 lg:grid-cols-4 md:gap-8 lg:gap-12">
              <div className="space-y-4 lg:col-span-2">
                <p className="text-lg font-bold">KI</p>
                <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">{t("footer.description")}</p>
              </div>

              <div>
                <h4 className="mb-4 text-sm font-semibold text-foreground">{t("footer.navigation")}</h4>
                <ul className="space-y-3">
                  {mainNavItems.map((item) => (
                    <li key={item.title}>
                      <Link href={item.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="mb-4 text-sm font-semibold text-foreground">{t("footer.socialMedia")}</h4>
                <ul className="space-y-3">
                  {socials.map((item) => (
                    <li key={item.name}>
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <hr className="my-10 border-border" />

            {/* Newsletter */}
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
              <div className="max-w-lg space-y-2">
                <h4 className="text-base font-semibold text-foreground">{t("footer.newsletter.title")}</h4>
                <p className="text-xs leading-relaxed text-muted-foreground">{t("footer.articleSubscribeDescription")}</p>
              </div>
              <div className="w-full max-w-md shrink-0 space-y-2">
                <div className="flex gap-2">
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder={t("form.footer.placeholder.email")} className={cn("h-10 flex-1", siteFieldClass)} />
                  <Button
                    type="button"
                    size="icon"
                    className="h-10 w-10 shrink-0 rounded-md shadow-none"
                    onClick={subscribeNewsletter}
                    disabled={!email.trim()}
                    aria-label={t("footer.articleSubscribe")}
                  >
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">{t("footer.newsletter.hint")}</p>
              </div>
            </div>

            <hr className="my-10 border-border" />

            {/* Copyright + legal */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                © {year} {t("footer.brandName")}. {t("footer.allRightsReserved")}
              </p>
              <div className="flex flex-wrap gap-6 text-sm">
                <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                  {t("footer.legal.terms")}
                </Link>
                <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                  {t("footer.legal.privacy")}
                </Link>
                <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                  {t("footer.legal.cookies")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

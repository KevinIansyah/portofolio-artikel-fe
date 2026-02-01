"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { useLanguage } from "@/hooks/use-language";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface NavItem {
  title: string;
  href: string;
}

interface SocialItem {
  name: string;
  url: string;
}

interface GeneralLinkItem {
  title: string;
  href: string;
}

export default function AppFooter() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");

  const mainNavItems: NavItem[] = [
    { title: t("nav.home"), href: "/" },
    { title: t("nav.technology"), href: "#technology" },
    { title: t("nav.project"), href: "#projects" },
    { title: t("nav.article"), href: "#articles" },
    { title: t("nav.contact"), href: "#contact" },
  ];

  const socials: SocialItem[] = [
    { name: "Facebook", url: "https://web.facebook.com/kevin.iansyah/" },
    { name: "Instagram", url: "https://www.instagram.com/keviniansyah/" },
    { name: "Twitter", url: "#" },
    { name: "LinkedIn", url: "https://www.linkedin.com/in/kevin-iansyah/" },
    { name: "GitHub", url: "https://github.com/KevinIansyah" },
  ];

  const generalLinks: GeneralLinkItem[] = [
    { title: t("footer.explore.allArticle"), href: "/articles" },
    { title: t("footer.explore.allProject"), href: "/projects" },
    { title: t("footer.explore.publicApi"), href: "#" },
  ];

  const subscribeNewsletter = () => {
    if (email) {
      console.log("Subscribing email:", email);
      setEmail("");
    }
  };

  return (
    <footer className="bg-muted text-foreground">
      <div className="mx-auto px-4 max-w-6xl">
        <div className="py-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr_1fr_1fr]">
            {/* Brand & Newsletter */}
            <div className="lg:col-span-1 lg:w-[80%]">
              <h3 className="text-lg font-semibold mb-4">KI</h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-xs">{t("footer.description")}</p>

              <div>
                <h4 className="text-sm font-medium mb-4">Berlangganan Artikel</h4>
                <div className="flex">
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder={t("form.footer.placeholder.email")} className="text-sm flex-1" />
                  <Button onClick={subscribeNewsletter} className="ml-2 shadow-none" disabled>
                    <ArrowRight />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-4">{t("footer.articleSubscribeDescription")}</p>
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="text-sm font-semibold mb-4">{t("footer.navigation")}</h4>
              <ul className="space-y-4">
                {mainNavItems.map((item) => (
                  <li key={item.title}>
                    <Link href={item.href} className="text-sm text-foreground hover:text-muted-foreground transition-colors">
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="text-sm font-semibold mb-4">{t("footer.socialMedia")}</h4>
              <ul className="space-y-4">
                {socials.map((item) => (
                  <li key={item.name}>
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm text-foreground hover:text-muted-foreground transition-colors">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* General Links */}
            <div>
              <h4 className="text-sm font-semibold mb-4">{t("footer.explore")}</h4>
              <ul className="space-y-4">
                {generalLinks.map((item) => (
                  <li key={item.title}>
                    <Link href={item.href} className="text-sm text-foreground hover:text-muted-foreground transition-colors">
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <Separator />

        {/* Copyright */}
        <div className="py-10">
          <div className="flex flex-col lg:flex-row justify-center items-center">
            <div className="mb-4 lg:mb-0">
              <p className="text-sm text-muted-foreground">{t("footer.copyright")}</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

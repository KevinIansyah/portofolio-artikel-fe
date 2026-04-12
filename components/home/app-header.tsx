/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import Link from "next/link";

import { useLanguage } from "@/hooks/use-language";

import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import ModeToggle from "../mode-toggle";
import LanguageToggle from "../language-toggle";

interface NavItem {
  title: string;
  href: string;
}

export default function AppHeader() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const mainNavItems: NavItem[] = [
    { title: t("nav.home"), href: "/" },
    { title: t("nav.technology"), href: "/#technology" },
    { title: t("nav.project"), href: "/projects" },
    { title: t("nav.article"), href: "/articles" },
    { title: t("nav.contact"), href: "/#contact" },
  ];

  return (
    <div className="sticky top-0 z-50 w-full bg-transparent backdrop-blur-sm transition-colors duration-300">
      <div>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4">
          <Link className="flex shrink-0 items-center" href="/">
            <span className="text-lg font-bold">KI</span>
          </Link>

          <div className="hidden h-full flex-1 lg:flex lg:justify-center">
            <NavigationMenu className="flex h-full max-w-max items-stretch">
              <NavigationMenuList className="flex h-full items-stretch space-x-2">
                {mainNavItems.map((item, index) => (
                  <NavigationMenuItem key={index} className="relative flex h-full items-center">
                    <Link
                      href={item.href}
                      className="flex items-center gap-x-2 rounded-md px-3 py-2 text-sm font-normal text-foreground transition-all duration-300 hover:bg-accent hover:text-accent-foreground! dark:hover:bg-accent! dark:hover:text-accent-foreground!"
                    >
                      <span>{item.title}</span>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <LanguageToggle />
            <ModeToggle />
            <div className="lg:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="border-dashed bg-transparent shadow-none">
                    <Menu className="size-4.5" />
                    <span className="sr-only">Tombol buka navigasi</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="top" className="min-h-screen w-full border-0 bg-transparent p-6 shadow-none backdrop-blur-md">
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <SheetDescription className="sr-only">Daftar tautan navigasi utama pada situs web.</SheetDescription>

                  <nav className="mt-20 flex flex-col items-center justify-between space-y-16">
                    {mainNavItems.map((item) => (
                      <Link key={item.title} href={item.href} className="text-3xl font-medium text-white" onClick={() => setIsOpen(false)}>
                        {item.title}
                      </Link>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

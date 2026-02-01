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
    { title: t("nav.technology"), href: "#technology" },
    { title: t("nav.project"), href: "#projects" },
    { title: t("nav.article"), href: "#articles" },
    { title: t("nav.contact"), href: "#contact" },
  ];

  return (
    <div className="sticky top-0 z-50 w-full bg-transparent backdrop-blur-sm transition-colors duration-300">
      <div>
        <div className="mx-auto flex h-16 items-center px-4 max-w-6xl">
          <div className="lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2 h-9 w-9 text-foreground">
                  <Menu className="size-5 lg:size-4.5" />
                  <span className="sr-only">Tombol buka navigasi</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="w-full min-h-screen bg-transparent p-6 backdrop-blur-md shadow-none border-0">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <SheetDescription className="sr-only">Daftar tautan navigasi utama pada situs web.</SheetDescription>
                {/* <SheetHeader className="flex justify-center items-center">
                  <span className="text-lg font-bold">KI</span>
                </SheetHeader> */}

                <nav className="mt-20 flex flex-col justify-between items-center space-y-16">
                  {mainNavItems.map((item) => (
                    <Link key={item.title} href={item.href} className="text-3xl text-white font-medium" onClick={() => setIsOpen(false)}>
                      {item.title}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          <div className="w-full flex items-center justify-between space-x-2">
            <Link className="flex items-center" href="/">
              <span className="text-lg font-bold">KI</span>
            </Link>

            <div className="hidden h-full lg:flex">
              <NavigationMenu className="ml-10 flex h-full items-stretch">
                <NavigationMenuList className="flex h-full items-stretch space-x-2">
                  {mainNavItems.map((item, index) => (
                    <NavigationMenuItem key={index} className="relative flex h-full items-center">
                      <Link
                        href={item.href}
                        className="flex items-center gap-x-2 px-3 py-2 text-foreground text-sm font-normal hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 rounded-md transition-all duration-300"
                      >
                        <span>{item.title}</span>
                      </Link>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            <div className="flex items-center gap-2">
              <LanguageToggle />
              <ModeToggle />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

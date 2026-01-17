"use client";

import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import ModeToggle from "../mode-toggle";
import LanguageToggle from "../language-toggle";

// Data navigasi
const mainNavItems = [
  { title: "Beranda", href: "#home" },
  { title: "Tentang", href: "#about" },
  { title: "Proyek", href: "#projects" },
  { title: "Artikel", href: "#articles" },
  { title: "Kontak", href: "#contact" },
];

export default function AppHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sticky top-0 z-50 w-full bg-transparent backdrop-blur-sm transition-colors duration-300">
      <div>
        <div className="mx-auto flex h-16 items-center px-4 max-w-6xl">
          <div className="lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2 h-9 w-9 text-foreground">
                  <Menu className="size-6" />
                  <span className="sr-only">Tombol buka navigasi</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="w-full h-auto bg-transparent p-6 backdrop-blur-md shadow-none">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <SheetDescription className="sr-only">Daftar tautan navigasi utama pada situs web.</SheetDescription>
                <SheetHeader className="flex justify-center items-center">
                  {/* <img src="Logo" alt="Logo" className="w-8 h-8" /> */}
                  <span className="text-lg font-bold">KI</span>
                </SheetHeader>
                <div className="flex h-full flex-1 flex-col justify-between space-y-4">
                  <nav className="space-y-1">
                    {mainNavItems.map((item) => (
                      <Link key={item.title} href={item.href} className="flex items-center gap-2 rounded-lg py-3 text-sm text-white font-medium" onClick={() => setIsOpen(false)}>
                        {item.title}
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="w-full flex items-center justify-between space-x-2">
            <Link className="flex items-center" href="/">
              <span className="text-lg font-bold">KI</span>
              {/* <img src={Logo} alt="Logo" className="w-8 h-8" /> */}
            </Link>

            <div className="hidden h-full lg:flex">
              <NavigationMenu className="ml-10 flex h-full items-stretch">
                <NavigationMenuList className="flex h-full items-stretch space-x-2">
                  {mainNavItems.map((item, index) => (
                    <NavigationMenuItem key={index} className="relative flex h-full items-center">
                      <Link
                        href={item.href}
                        className="flex items-center gap-x-2 px-3 py-2 text-sm text-foreground font-normal hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 rounded-md transition-all duration-300"
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

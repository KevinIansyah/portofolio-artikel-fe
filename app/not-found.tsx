"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";

import { useLanguage } from "@/hooks/use-language";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
          <h2 className="text-2xl font-bold">{language === "id" ? "Halaman Tidak Ditemukan" : "Page Not Found"}</h2>
          <p className="text-muted-foreground">{language === "id" ? "Halaman yang Anda cari tidak ditemukan." : "The page you are looking for was not found."}</p>
        </div>

        <div className="flex gap-3 justify-center">
          <Link href="/">
            <Button>{language === "id" ? "Kembali Ke Beranda" : "Back to Home"}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

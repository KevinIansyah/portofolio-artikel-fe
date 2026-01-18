/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="bg-background relative">
      <div className="min-h-screen max-h-screen mx-auto px-4 max-w-6xl relative flex items-center justify-center overflow-hidden lg:overflow-visible">
        {/* Background animated blobs */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-25 left-25 w-72 h-72 bg-purple-600/30 rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute top-40 left-0 md:top-50 md:left-120 lg:top-100 lg:left-150 xl:top-100 xl:left-100 w-64 h-64 bg-pink-500/30 rounded-full blur-3xl animate-float-medium"></div>
          <div className="absolute bottom-25 right-25 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-float-fast"></div>
          <div className="absolute bottom-40 right-0 md:bottom-50 md:right-120 lg:bottom-100 lg:right-150 xl:bottom-100 xl:right-100 w-64 h-64 bg-yellow-500/30 rounded-full blur-3xl animate-float-slow"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Badge */}
          <div className="flex justify-center">
            <div
              className={`bg-transparent inline-flex items-center gap-x-2 rounded-full border p-1 ps-3 text-sm transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "500ms" }}
            >
              Haii, Saya
              <span className="bg-muted/50 inline-flex items-center justify-center gap-x-2 rounded-full px-2.5 py-1.5 text-sm font-semibold">
                <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Title */}
          <div className={`mx-auto mt-5 max-w-2xl text-center transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} style={{ transitionDelay: "700ms" }}>
            <h1 className="scroll-m-20 text-5xl font-extrabold tracking-tight text-foreground">Kevin Iansyah</h1>
          </div>

          {/* Description */}
          <div className={`mx-auto mt-5 max-w-3xl text-center transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} style={{ transitionDelay: "900ms" }}>
            <p className="text-muted-foreground text-xl">Fullstack Web Developer berpengalaman dengan teknologi modern seperti Vue, React, Tailwind CSS, Laravel, dan NestJS.</p>
          </div>

          {/* Buttons */}
          <div className={`mt-8 flex justify-center gap-3 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} style={{ transitionDelay: "1100ms" }}>
            <Button size="lg" className="shadow-none" asChild>
              <Link href="#projects">Lihat Proyek</Link>
            </Button>
            <Button size="lg" className="shadow-none" variant="outline" asChild>
              <Link href="/pdf/resume.pdf" target="_blank" download>
                Unduh Resume
              </Link>
            </Button>
          </div>

          {/* Built with */}
          <div
            className={`mt-5 flex items-center justify-center gap-x-1 sm:gap-x-3 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ transitionDelay: "1300ms" }}
          >
            <span className="text-muted-foreground text-sm">Dibangun dengan:</span>
            <span className="text-sm font-bold">Next.js</span>
            <svg className="text-muted-foreground h-5 w-5" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M6 13L10 3" stroke="currentColor" strokeLinecap="round" />
            </svg>
            <span className="text-sm font-bold">Laravel</span>
          </div>
        </div>
      </div>
    </section>
  );
}

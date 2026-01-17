import * as React from "react";

import AppSidebar from "@/components/dashboard/app-sidebar";
import ModeToggle from "@/components/mode-toggle";
import LanguageToggle from "@/components/language-toggle";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Breadcrumbs from "@/components/dashboard/breadcrumb";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset className="overflow-x-hidden">
        <header className="flex h-16 items-center gap-2 px-4 md:px-6">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="h-4" />
              <Breadcrumbs />
            </div>

            <div className="flex items-center gap-2">
              <LanguageToggle />
              <ModeToggle />
            </div>
          </div>
        </header>

        <main className="px-4 md:px-6 py-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

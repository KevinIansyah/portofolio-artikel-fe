"use client";

import * as React from "react";
import { BookOpen, Frame, PieChart } from "lucide-react";

import dynamic from "next/dynamic";
const NavMain = dynamic(() => import("./nav-main"), { ssr: false });
const NavLogo = dynamic(() => import("./nav-logo"), { ssr: false });

import { useLanguage } from "@/hooks/use-language";

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import NavUser from "./nav-user";

export default function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useLanguage();

  const data = {
    logo: {
      name: "Kevin Iansyah",
      plan: "Portofolio",
    },
    navMain: [
      {
        title: t("sidebar.nav.main.dashboard"),
        url: "/dashboard",
        icon: PieChart,
        isActive: false,
        isDropdown: false,
      },
      {
        title: t("sidebar.nav.main.content"),
        url: "#",
        icon: BookOpen,
        isActive: true,
        isDropdown: true,
        items: [
          {
            title: t("sidebar.nav.main.article"),
            url: "/dashboard/article",
          },
          {
            title: t("sidebar.nav.main.project"),
            url: "/dashboard/project",
          },
          {
            title: t("sidebar.nav.main.category"),
            url: "/dashboard/category",
          },
          {
            title: t("sidebar.nav.main.tag"),
            url: "/dashboard/tag",
          },
          {
            title: t("sidebar.nav.main.skill"),
            url: "/dashboard/skill",
          },
        ],
      },
    ],
    projects: [
      {
        name: "Design Engineering",
        url: "#",
        icon: Frame,
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavLogo logo={data.logo} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

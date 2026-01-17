"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/hooks/use-language";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const breadcrumbMap: Record<string, string> = {
    dashboard: t("sidebar.nav.main.dashboard"),
    article: t("sidebar.nav.main.article"),
    project: t("sidebar.nav.main.project"),
    category: t("sidebar.nav.main.category"),
    tag: t("sidebar.nav.main.tag"),
    skill: t("sidebar.nav.main.skill"),
  };

  const paths = pathname.split("/").filter(Boolean);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {paths.map((path, idx) => {
          const href = "/" + paths.slice(0, idx + 1).join("/");
          const label = breadcrumbMap[path] || path;
          const isCurrent = idx === paths.length - 1;

          return (
            <span key={href} className="flex items-center">
              <BreadcrumbItem>
                {isCurrent ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {idx < paths.length - 1 && <BreadcrumbSeparator />}
            </span>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

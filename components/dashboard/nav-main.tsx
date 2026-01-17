"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "@/components/ui/sidebar";

type ItemProps = {
  title: string;
  url: string;
  icon?: LucideIcon;
  isDropdown?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
};

const isActivePath = (pathname: string, url: string, exact = false) => {
  if (exact) {
    return pathname === url;
  }

  return pathname === url || pathname.startsWith(url + "/");
};

export default function NavMain({ items }: { items: ItemProps[] }) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>

      <SidebarMenu>
        {items.map((item) => {
          const isExact = item.url === "/dashboard";
          const isItemActive = isActivePath(pathname, item.url, isExact);
          const hasActiveSubItem = item.items?.some((sub) => isActivePath(pathname, sub.url));
          const shouldBeOpen = isItemActive || hasActiveSubItem;

          return (
            <Collapsible key={item.title} asChild defaultOpen={shouldBeOpen} className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  {item.isDropdown ? (
                    <SidebarMenuButton tooltip={item.title} isActive={isItemActive}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  ) : (
                    <SidebarMenuButton tooltip={item.title} asChild isActive={isItemActive}>
                      <Link href={item.url}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </CollapsibleTrigger>

                {item.isDropdown && (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((sub) => {
                        const isSubActive = isActivePath(pathname, sub.url);

                        return (
                          <SidebarMenuSubItem key={sub.title}>
                            <SidebarMenuSubButton asChild isActive={isSubActive}>
                              <Link href={sub.url}>
                                <span>{sub.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

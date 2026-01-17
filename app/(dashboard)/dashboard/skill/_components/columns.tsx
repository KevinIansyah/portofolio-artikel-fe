"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Skill } from "@/lib/types/skill";

import { Button } from "@/components/ui/button";
import Actions from "./action";

import { TranslationKey } from "@/locales";

export default function getColumns(t: (key: TranslationKey) => string): ColumnDef<Skill>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            {t("table.tag.name")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const skill = row.original;
        return (
          <div className="flex flex-col gap-1">
            <span className="font-medium">{skill.name}</span>
            <span className="text-xs text-muted-foreground">{skill.slug}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "dark_icon_url",
      header: t("table.skill.darkIcon"),
      cell: ({ row }) => {
        const darkIconUrl = row.original.dark_icon_url;

        if (!darkIconUrl) {
          return <span className="text-muted-foreground">-</span>;
        }

        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const imageUrl = new URL(darkIconUrl, baseUrl).toString();

        console.log("image url", imageUrl);

        return <img src={imageUrl} alt="status" className="h-10 w-10 block" />;
      },
    },
    {
      accessorKey: "light_icon_url",
      header: t("table.skill.lightIcon"),
      cell: ({ row }) => {
        const darkIconUrl = row.original.light_icon_url;

        if (!darkIconUrl) {
          return <span className="text-muted-foreground">-</span>;
        }

        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const imageUrl = new URL(darkIconUrl, baseUrl).toString();

        console.log("image url", imageUrl);

        return <img src={imageUrl} alt="status" className="h-10 w-10 block" />;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const skill = row.original;

        return <Actions skill={skill} />;
      },
    },
  ];
}

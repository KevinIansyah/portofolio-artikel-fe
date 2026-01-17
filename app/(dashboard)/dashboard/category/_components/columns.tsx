"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Category } from "@/lib/types/category";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Actions from "./actions";

import { TranslationKey } from "@/locales";

export default function getColumns(t: (key: TranslationKey) => string): ColumnDef<Category>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            {t("table.category.name")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const category = row.original;
        return (
          <div className="flex flex-col gap-1">
            <span className="font-medium">{category.name}</span>
            <span className="text-xs text-muted-foreground">{category.slug}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "type",
      header: t("table.category.type"),
      cell: ({ row }) => {
        const type = row.getValue("type") as string;
        return <Badge variant={type === "article" ? "default" : "secondary"}>{type === "article" ? t("article.uppercase") : t("project.uppercase")}</Badge>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const category = row.original;

        return <Actions category={category} />;
      },
    },
  ];
}

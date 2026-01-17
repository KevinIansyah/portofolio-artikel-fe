"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Tag } from "@/lib/types/tag";

import { Button } from "@/components/ui/button";

import { TranslationKey } from "@/locales";
import Actions from "./action";

export default function getColumns(t: (key: TranslationKey) => string): ColumnDef<Tag>[] {
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
        const tag = row.original;
        return (
          <div className="flex flex-col gap-1">
            <span className="font-medium">{tag.name}</span>
            <span className="text-xs text-muted-foreground">{tag.slug}</span>
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const tag = row.original;

        return <Actions tag={tag} />;
      },
    },
  ];
}

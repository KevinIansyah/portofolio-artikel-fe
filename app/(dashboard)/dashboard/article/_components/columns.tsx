"use client";

import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Article } from "@/lib/types/article";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Actions from "./actions";

import { TranslationKey } from "@/locales";

export default function getColumns(t: (key: TranslationKey) => string): ColumnDef<Article>[] {
  return [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          {t("table.article.title")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const article = row.original;
        return (
          <div className="flex flex-col gap-1">
            <span className="font-medium">{article.title}</span>
            <span className="text-xs text-muted-foreground">{article.slug}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return <Badge variant={status === "published" ? "default" : "secondary"}>{status}</Badge>;
      },
    },
    {
      accessorKey: "categories",
      header: t("table.article.category"),
      cell: ({ row }) => {
        const categories = row.original.categories || [];
        if (categories.length === 0) return <span className="text-muted-foreground">-</span>;

        return (
          <div className="flex flex-wrap gap-1">
            {categories.map((cat) => (
              <Badge key={cat.id} variant="outline" className="text-xs">
                {cat.name}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "tags",
      header: t("table.article.tag"),
      cell: ({ row }) => {
        const tags = row.original.tags || [];
        if (tags.length === 0) return <span className="text-muted-foreground">-</span>;

        return (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 2).map((tag) => (
              <Badge key={tag.id} variant="secondary" className="text-xs">
                {tag.name}
              </Badge>
            ))}
            {tags.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{tags.length - 2}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "user",
      header: t("table.article.author"),
      cell: ({ row }) => {
        const user = row.original.user;
        return user ? user.name : "-";
      },
    },
    {
      accessorKey: "views",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            {t("table.article.view")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="text-center">{row.getValue("views")}</div>;
      },
    },
    {
      accessorKey: "published_at",
      header: t("table.article.published_at"),
      cell: ({ row }) => {
        const date = row.getValue("published_at") as string;
        return date ? format(new Date(date), "MM dd,yyyy") : "-";
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const article = row.original;
        return <Actions article={article} />;
      },
    },
  ];
}

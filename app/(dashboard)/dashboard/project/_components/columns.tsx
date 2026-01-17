"use client";

import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Project } from "@/lib/types/project";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Actions from "./actions";

import { TranslationKey } from "@/locales";

export default function getColumns(t: (key: TranslationKey) => string): ColumnDef<Project>[] {
  return [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          {t("table.project.title")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const project = row.original;
        return (
          <div className="flex flex-col gap-1">
            <span className="font-medium">{project.title}</span>
            <span className="text-xs text-muted-foreground">{project.slug}</span>
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
      header: t("table.project.category"),
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
      accessorKey: "skills",
      header: t("table.project.skill"),
      cell: ({ row }) => {
        const skills = row.original.skills || [];
        if (skills.length === 0) return <span className="text-muted-foreground">-</span>;

        return (
          <div className="flex flex-wrap gap-1">
            {skills.slice(0, 2).map((skill) => (
              <Badge key={skill.id} variant="secondary" className="text-xs">
                {skill.name}
              </Badge>
            ))}
            {skills.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{skills.length - 2}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "user",
      header: t("table.project.author"),
      cell: ({ row }) => {
        const user = row.original.user;
        return user ? user.name : "-";
      },
    },
    {
      accessorKey: "published_at",
      header: t("table.project.published_at"),
      cell: ({ row }) => {
        const date = row.getValue("published_at") as string;
        return date ? format(new Date(date), "MMM dd,yyyy") : "-";
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const project = row.original;

        return <Actions project={project} />;
      },
    },
  ];
}

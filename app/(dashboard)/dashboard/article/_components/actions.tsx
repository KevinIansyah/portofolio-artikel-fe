"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal } from "lucide-react";
import { mutate } from "swr";
import type { Arguments } from "swr";

import { useLanguage } from "@/hooks/use-language";

import { Article } from "@/lib/types/article";
import { apiClient } from "@/lib/api/client";
import { ApiError } from "@/lib/types/api";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface ActionsProps {
  article: Article;
}

export default function Actions({ article }: ActionsProps) {
  const router = useRouter();
  const { t } = useLanguage();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    router.push(`/dashboard/article/edit/${article.id}`);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const loadingToast = toast.loading("Menghapus artikel...");

    try {
      await apiClient.delete(`/api/articles/${article.id}`);

      toast.success("Artikel berhasil dihapus!", {
        id: loadingToast,
      });

      setShowDeleteDialog(false);

      await mutate((key: Arguments) => Array.isArray(key) && key[0]?.toString().includes("/api/articles"));
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error("Gagal menghapus artikel", {
          id: loadingToast,
          description: err.message,
        });
      } else {
        toast.error("Terjadi kesalahan", {
          id: loadingToast,
        });
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => window.open(`/articles/${article.slug}`, "_blank")}>View</DropdownMenuItem>
          <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setShowDeleteDialog(true)}>
            {t("datatable.delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("heading.article.delete.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("heading.article.delete.description")} &quot;{article.title}&quot;{t("heading.article.delete.description.2")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>{t("datatable.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
              {isDeleting ? t("form.article.button.delete.process") : t("form.article.button.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

"use client";

import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { mutate } from "swr";
import type { Arguments } from "swr";

import { useLanguage } from "@/hooks/use-language";

import { Category } from "@/lib/types/category";
import { apiClient } from "@/lib/api/client";
import { ApiError } from "@/lib/types/api";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import EditForm from "./editForm";

interface ActionsProps {
  category: Category;
}

export default function Actions({ category }: ActionsProps) {
  const { t } = useLanguage();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [categoryId, setCategoryId] = useState<number | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    const loadingToast = toast.loading("Menghapus kategori...");

    try {
      await apiClient.delete(`/api/categories/${category.id}`);

      toast.success("Kategori berhasil dihapus!", {
        id: loadingToast,
      });

      setShowDeleteDialog(false);

      await mutate((key: Arguments) => Array.isArray(key) && key[0]?.toString().includes("/api/categories/paginated"));
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error("Gagal menghapus kategori", {
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
          <DropdownMenuItem onClick={() => setCategoryId(category.id)}>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setShowDeleteDialog(true)}>
            {t("datatable.delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("heading.category.delete.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("heading.category.delete.description")} &quot;{category.name}&quot;{t("heading.category.delete.description.2")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>{t("datatable.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
              {isDeleting ? t("form.category.button.delete.process") : t("form.category.button.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {categoryId && <EditForm open={!!categoryId} onOpenChange={(open) => setCategoryId(open ? category.id : null)} categoryId={category.id} />}
    </>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { Arguments, mutate } from "swr";
import { Loader2 } from "lucide-react";

import { useLanguage } from "@/hooks/use-language";

import { apiClient } from "@/lib/api/client";
import { ApiError } from "@/lib/types/api";
import { CategoryEditData, CategoryFormData } from "@/lib/types/category";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import ValidationError from "@/components/validation-error";

interface EditFormProps {
  categoryId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditForm({ categoryId, open, onOpenChange }: EditFormProps) {
  const { t } = useLanguage();
  const loadingFocusRef = useRef<HTMLButtonElement>(null);

  const [nameId, setNameId] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [type, setType] = useState<"project" | "article">("project");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const [loadingSkeleton, setLoadingSkeleton] = useState(true);

  useEffect(() => {
    if (open && categoryId) {
      const fetchData = async () => {
        setLoadingSkeleton(true);
        try {
          const response = await apiClient.get<CategoryEditData>(`/api/categories/${categoryId}/edit`);

          setNameId(response.translations.id.name);
          setNameEn(response.translations.en.name);
          setType(response.type);
        } catch (e) {
          if (e instanceof ApiError) {
            toast.error("Gagal memuat kategori", {
              description: e.message,
            });

            setError(e.message);
          } else {
            toast.error("Terjadi kesalahan", {
              description: "Kesalahan tidak terduga terjadi",
            });

            setError("An unexpected error occurred");
          }

          onOpenChange(false);
        } finally {
          setLoadingSkeleton(false);
        }
      };

      fetchData();
    }
  }, [categoryId, onOpenChange, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const loadingToast = toast.loading("Memperbarui kategori...");

    setError("");
    setValidationErrors({});
    setLoading(true);

    try {
      const data = {
        name_id: nameId,
        name_en: nameEn,
        type: type,
        _method: "PUT",
      };

      await apiClient.post<CategoryFormData>(`/api/categories/${categoryId}`, data);

      toast.success("Kategori berhasil diperbarui!", {
        id: loadingToast,
        description: "Perubahan telah disimpan ke database.",
      });

      await mutate((key: Arguments) => Array.isArray(key) && key[0]?.toString().includes("/api/categories/paginated"));

      onOpenChange(false);
    } catch (e) {
      if (e instanceof ApiError) {
        toast.error("Gagal memperbarui kategori", {
          id: loadingToast,
          description: e.message,
        });

        setError(e.message);

        if (e.errors) {
          setValidationErrors(e.errors);
        }
      } else {
        toast.error("Terjadi kesalahan", {
          id: loadingToast,
          description: "Kesalahan tidak terduga terjadi",
        });
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        className="h-[70vh]"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          queueMicrotask(() => loadingFocusRef.current?.focus());
        }}
      >
        {loadingSkeleton ? (
          <div className="flex min-h-0 flex-1 flex-col max-w-xl w-full mx-auto">
            <div>
              <DrawerHeader>
                <DrawerTitle>{t("heading.category.edit.title")}</DrawerTitle>
                <DrawerDescription>{t("heading.category.edit.description")}</DrawerDescription>
              </DrawerHeader>

              <div className="grid gap-6 px-4 pb-4">
                <div className="grid gap-4">
                  <Label htmlFor="edit-category">
                    {t("form.category.label.name")} 🇮🇩 <span className="text-destructive">*</span>
                  </Label>
                  <Skeleton className="h-10 w-full" />
                </div>

                <div className="grid gap-4">
                  <Label htmlFor="edit-category">
                    {t("form.category.label.name")} 🇬🇧 <span className="text-destructive">*</span>
                  </Label>
                  <Skeleton className="h-10 w-full" />
                </div>

                <div className="grid gap-4">
                  <Label htmlFor="edit-category">
                    {t("form.category.label.type")} <span className="text-destructive">*</span>
                  </Label>
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>

            <DrawerFooter className="flex flex-col md:flex-row gap-2">
              <Button type="button" disabled tabIndex={8} className="flex-1">
                {t("form.category.button.update")}
              </Button>
              <DrawerClose asChild>
                <Button ref={loadingFocusRef} variant="outline" type="button" className="flex-1">
                  {t("datatable.cancel")}
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col max-w-xl w-full mx-auto">
            <div>
              <DrawerHeader>
                <DrawerTitle>{t("heading.category.edit.title")}</DrawerTitle>
                <DrawerDescription>{t("heading.category.edit.description")}</DrawerDescription>
              </DrawerHeader>

              <FieldGroup className="px-4 pb-4">
                <Field>
                  <FieldLabel htmlFor="nameId">
                    {t("form.category.label.name")} 🇮🇩 <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input id="nameId" type="text" placeholder={t("form.category.placeholder.name_id")} value={nameId} onChange={(e) => setNameId(e.target.value)} required />
                  {validationErrors.name_id && <ValidationError message={validationErrors.name_id[0]} />}
                </Field>

                <Field>
                  <FieldLabel htmlFor="nameEn">
                    {t("form.category.label.name")} 🇬🇧 <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input id="nameEn" type="text" placeholder={t("form.category.placeholder.name_en")} value={nameEn} onChange={(e) => setNameEn(e.target.value)} required />
                  {validationErrors.name_en && <ValidationError message={validationErrors.name_en[0]} />}
                </Field>

                <Field>
                  <FieldLabel htmlFor="type">
                    {t("form.category.label.type")} <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Select value={type} onValueChange={(value) => setType(value as "project" | "article")}>
                    <SelectTrigger id="type" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>{t("form.category.label.type")}</SelectLabel>
                        <SelectItem value="project">{t("project.uppercase")}</SelectItem>
                        <SelectItem value="article">{t("article.uppercase")}</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {validationErrors.type && <ValidationError message={validationErrors.type[0]} />}
                </Field>
              </FieldGroup>
            </div>

            <DrawerFooter className="flex flex-col md:flex-row gap-2">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading && <Loader2 className="size-4 animate-spin" />}
                {loading ? t("form.category.button.update.process") : t("form.category.button.update")}
              </Button>

              <DrawerClose asChild disabled={loading}>
                <Button ref={loadingFocusRef} variant="outline" className="flex-1">
                  {t("datatable.cancel")}
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        )}
      </DrawerContent>
    </Drawer>
  );
}

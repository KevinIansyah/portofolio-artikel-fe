"use client";

import { useEffect, useRef, useState } from "react";
import { Arguments, mutate } from "swr";
import { Loader2 } from "lucide-react";

import { useLanguage } from "@/hooks/use-language";

import { apiClient } from "@/lib/api/client";
import { ApiError } from "@/lib/types/api";
import { TagEditData, TagFormData } from "@/lib/types/tag";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import ValidationError from "@/components/validation-error";

interface EditFormProps {
  tagId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditForm({ tagId, open, onOpenChange }: EditFormProps) {
  const { t } = useLanguage();
  const loadingFocusRef = useRef<HTMLButtonElement>(null);

  const [nameId, setNameId] = useState("");
  const [nameEn, setNameEn] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const [loadingSkeleton, setLoadingSkeleton] = useState(true);

  useEffect(() => {
    if (open && tagId) {
      const fetchData = async () => {
        setLoadingSkeleton(true);
        try {
          const response = await apiClient.get<TagEditData>(`/api/tags/${tagId}/edit`);

          setNameId(response.translations.id.name);
          setNameEn(response.translations.en.name);
        } catch (e) {
          if (e instanceof ApiError) {
            toast.error("Gagal memuat tag", {
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
  }, [tagId, onOpenChange, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const loadingToast = toast.loading("Memperbarui tag...");

    setError("");
    setValidationErrors({});
    setLoading(true);

    try {
      const data = {
        name_id: nameId,
        name_en: nameEn,
        _method: "PUT",
      };

      await apiClient.post<TagFormData>(`/api/tags/${tagId}`, data);

      toast.success("Kategori berhasil diperbarui!", {
        id: loadingToast,
        description: "Perubahan telah disimpan ke database.",
      });

      await mutate((key: Arguments) => Array.isArray(key) && key[0]?.toString().includes("/api/tags/paginated"));

      onOpenChange(false);
    } catch (e) {
      if (e instanceof ApiError) {
        toast.error("Gagal memperbarui kategory", {
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
                <DrawerTitle>{t("heading.tag.edit.title")}</DrawerTitle>
                <DrawerDescription>{t("heading.tag.edit.description")}</DrawerDescription>
              </DrawerHeader>

              <div className="grid gap-6 px-4 pb-4">
                <div className="grid gap-4">
                  <Label htmlFor="edit-tag">
                    {t("form.tag.label.name")} 🇮🇩 <span className="text-destructive">*</span>
                  </Label>
                  <Skeleton className="h-10 w-full" />
                </div>

                <div className="grid gap-4">
                  <Label htmlFor="edit-tag">
                    {t("form.tag.label.name")} 🇬🇧 <span className="text-destructive">*</span>
                  </Label>
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>

            <DrawerFooter className="flex flex-col md:flex-row gap-2">
              <Button type="button" disabled tabIndex={8} className="flex-1">
                {t("form.tag.button.update")}
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
                <DrawerTitle>{t("heading.tag.edit.title")}</DrawerTitle>
                <DrawerDescription>{t("heading.tag.edit.description")}</DrawerDescription>
              </DrawerHeader>

              <FieldGroup className="px-4 pb-4">
                <Field>
                  <FieldLabel htmlFor="nameId">
                    {t("form.tag.label.name")} 🇮🇩 <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input id="nameId" type="text" placeholder={t("form.tag.placeholder.name_id")} value={nameId} onChange={(e) => setNameId(e.target.value)} required />
                  {validationErrors.name_id && <ValidationError message={validationErrors.name_id[0]} />}
                </Field>

                <Field>
                  <FieldLabel htmlFor="nameEn">
                    {t("form.tag.label.name")} 🇬🇧 <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input id="nameEn" type="text" placeholder={t("form.tag.placeholder.name_en")} value={nameEn} onChange={(e) => setNameEn(e.target.value)} required />
                  {validationErrors.name_en && <ValidationError message={validationErrors.name_en[0]} />}
                </Field>
              </FieldGroup>
            </div>

            <DrawerFooter className="flex flex-col md:flex-row gap-2">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading && <Loader2 className="size-4 animate-spin" />}
                {loading ? t("form.tag.button.update.process") : t("form.tag.button.update")}
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

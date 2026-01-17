"use client";

import { useState } from "react";
import { Arguments, mutate } from "swr";
import { Loader2, Plus } from "lucide-react";

import { useLanguage } from "@/hooks/use-language";

import { apiClient } from "@/lib/api/client";
import { ApiError } from "@/lib/types/api";
import { TagFormData } from "@/lib/types/tag";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import ValidationError from "@/components/validation-error";

export default function AddForm() {
  const { t } = useLanguage();

  const [nameId, setNameId] = useState("");
  const [nameEn, setNameEn] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const loadingToast = toast.loading("Menyimpan tag...");

    setError("");
    setValidationErrors({});
    setLoading(true);

    try {
      const data = {
        name_id: nameId,
        name_en: nameEn,
      };

      await apiClient.post<TagFormData>("/api/tags", data);

      toast.success("Tag berhasil disimpan!", {
        id: loadingToast,
        description: "Tag telah ditambahkan ke database.",
      });

      setNameId("");
      setNameEn("");

      await mutate((key: Arguments) => Array.isArray(key) && key[0]?.toString().includes("/api/tags/paginated"));
    } catch (e) {
      if (e instanceof ApiError) {
        toast.error("Gagal menyimpan tag", {
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
    <Drawer>
      <DrawerTrigger asChild>
        <Button>
          {t("datatable.add")}
          <Plus />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="max-w-lg w-full mx-auto overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle>{t("heading.tag.add.title")}</DrawerTitle>
            <DrawerDescription>{t("heading.tag.add.description")}</DrawerDescription>
          </DrawerHeader>
          <form onSubmit={handleSubmit} className="space-y-2">
            <FieldGroup className="px-4">
              {/* Name Fields */}
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

            <DrawerFooter>
              {/* Submit Button */}
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? t("form.tag.button.add.process") : t("form.tag.button.add")}
              </Button>

              {/* Cancel Button */}
              <DrawerClose asChild disabled={loading}>
                <Button variant="outline" className="flex-1">
                  {t("datatable.cancel")}
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

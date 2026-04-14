"use client";

import { useRef, useState } from "react";
import { Arguments, mutate } from "swr";
import { Loader2, Plus } from "lucide-react";

import { useLanguage } from "@/hooks/use-language";

import { apiClient } from "@/lib/api/client";
import { ApiError } from "@/lib/types/api";
import { TagFormData } from "@/lib/types/tag";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Field, FieldLabel, FieldGroup, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import ValidationError from "@/components/validation-error";

export default function AddForm() {
  const { t } = useLanguage();

  const [name, setName] = useState("");
  const [darkIcon, setDarkIcon] = useState<File | null>(null);
  const [lightIcon, setLightIcon] = useState<File | null>(null);

  const darkIconInputRef = useRef<HTMLInputElement>(null);
  const lightIconInputRef = useRef<HTMLInputElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  const handleDarkIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setValidationErrors({
          ...validationErrors,
          dark_icon: ["File size must be less than 2MB"],
        });
        return;
      }

      setDarkIcon(file);
      const { ...rest } = validationErrors;
      setValidationErrors(rest);
    }
  };

  const handleLightIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setValidationErrors({
          ...validationErrors,
          light_icon: ["File size must be less than 2MB"],
        });
        return;
      }

      setLightIcon(file);
      const { ...rest } = validationErrors;
      setValidationErrors(rest);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const loadingToast = toast.loading("Menyimpan skill...");

    setError("");
    setValidationErrors({});
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", name);

      if (darkIcon) {
        formData.append("dark_icon", darkIcon);
      }

      if (lightIcon) {
        formData.append("light_icon", lightIcon);
      }

      await apiClient.postFormData<TagFormData>("/api/skills", formData);

      toast.success("Skill berhasil disimpan!", {
        id: loadingToast,
        description: "Skill telah ditambahkan ke database.",
      });

      setName("");
      setDarkIcon(null);
      setLightIcon(null);

      if (darkIconInputRef.current) {
        darkIconInputRef.current.value = "";
      }
      if (lightIconInputRef.current) {
        lightIconInputRef.current.value = "";
      }

      await mutate((key: Arguments) => Array.isArray(key) && key[0]?.toString().includes("/api/skills/paginated"));
    } catch (e) {
      if (e instanceof ApiError) {
        toast.error("Gagal menyimpan skill", {
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
          <Plus className="size-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[70vh]">
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col max-w-xl w-full mx-auto">
          <div>
            <DrawerHeader>
              <DrawerTitle>{t("heading.skill.add.title")}</DrawerTitle>
              <DrawerDescription>{t("heading.skill.add.description")}</DrawerDescription>
            </DrawerHeader>

            <FieldGroup className="px-4 pb-4">
              <Field>
                <FieldLabel htmlFor="nameId">
                  {t("form.skill.label.name")} 🇮🇩 <span className="text-destructive">*</span>
                </FieldLabel>
                <Input id="nameId" type="text" placeholder={t("form.skill.placeholder.name")} value={name} onChange={(e) => setName(e.target.value)} required />
                {validationErrors.name_id && <ValidationError message={validationErrors.name_id[0]} />}
              </Field>

              <Field>
                <FieldLabel htmlFor="darkIcon">
                  {t("form.skill.label.darkIcon")} <span className="text-destructive">*</span>
                </FieldLabel>
                <Input ref={darkIconInputRef} id="darkIcon" name="darkIcon" type="file" accept="image/jpeg,image/png,image/jpg,image/webp" onChange={handleDarkIconChange} required />
                <FieldDescription>
                  {t("form.article.description.thumbnail")}{" "}
                  {darkIcon && (
                    <span>
                      {t("form.article.description.thumbnail.2")} {darkIcon.name} ({(darkIcon.size / 1024).toFixed(2)} KB)
                    </span>
                  )}
                </FieldDescription>
                {validationErrors.dark_icon && <ValidationError message={validationErrors.dark_icon[0]} />}
              </Field>

              <Field>
                <FieldLabel htmlFor="lightIcon">
                  {t("form.skill.label.lightIcon")} <span className="text-destructive">*</span>
                </FieldLabel>
                <Input ref={lightIconInputRef} id="lightIcon" name="lightIcon" type="file" accept="image/jpeg,image/png,image/jpg,image/webp" onChange={handleLightIconChange} required />
                <FieldDescription>
                  {t("form.article.description.thumbnail")}{" "}
                  {lightIcon && (
                    <span>
                      {t("form.article.description.thumbnail.2")} {lightIcon.name} ({(lightIcon.size / 1024).toFixed(2)} KB)
                    </span>
                  )}
                </FieldDescription>
                {validationErrors.light_icon && <ValidationError message={validationErrors.light_icon[0]} />}
              </Field>
            </FieldGroup>
          </div>

          <DrawerFooter className="flex flex-col md:flex-row gap-2">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading && <Loader2 className="size-4 animate-spin" />}
              {loading ? t("form.skill.button.add.process") : t("form.skill.button.add")}
            </Button>

            <DrawerClose asChild disabled={loading}>
              <Button variant="outline" className="flex-1">
                {t("datatable.cancel")}
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}

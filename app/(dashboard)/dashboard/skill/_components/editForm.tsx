"use client";

import { useEffect, useRef, useState } from "react";
import { Arguments, mutate } from "swr";
import { Loader2 } from "lucide-react";

import { useLanguage } from "@/hooks/use-language";

import { apiClient } from "@/lib/api/client";
import { ApiError } from "@/lib/types/api";
import { SkillEditData, SkillFormData } from "@/lib/types/skill";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Field, FieldLabel, FieldGroup, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import ValidationError from "@/components/validation-error";

interface EditFormProps {
  skillId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditForm({ skillId, open, onOpenChange }: EditFormProps) {
  const { t } = useLanguage();

  const [name, setName] = useState("");
  const [darkIcon, setDarkIcon] = useState<File | null>(null);
  const [lightIcon, setLightIcon] = useState<File | null>(null);
  const [currentDarkIconUrl, setCurrentDarkIconUrl] = useState("");
  const [currentLightIconUrl, setCurrentLightIconUrl] = useState("");

  const darkIconInputRef = useRef<HTMLInputElement>(null);
  const lightIconInputRef = useRef<HTMLInputElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const [loadingSkeleton, setLoadingSkeleton] = useState(true);

  useEffect(() => {
    if (open && skillId) {
      const fetchData = async () => {
        setLoadingSkeleton(true);

        try {
          const response = await apiClient.get<SkillEditData>(`/api/skills/${skillId}/edit`);

          setName(response.name);
          setCurrentDarkIconUrl(response.dark_icon_url);
          setCurrentLightIconUrl(response.light_icon_url);

          setDarkIcon(null);
          setLightIcon(null);

          if (darkIconInputRef.current) {
            darkIconInputRef.current.value = "";
          }
          if (lightIconInputRef.current) {
            lightIconInputRef.current.value = "";
          }
        } catch (e) {
          if (e instanceof ApiError) {
            toast.error("Gagal memuat skill", {
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
  }, [skillId, onOpenChange, open]);

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

    const loadingToast = toast.loading("Memperbarui skill...");

    setError("");
    setValidationErrors({});
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("_method", "PUT");

      if (darkIcon) {
        formData.append("dark_icon", darkIcon);
      }

      if (lightIcon) {
        formData.append("light_icon", lightIcon);
      }

      await apiClient.postFormData<SkillFormData>(`/api/skills/${skillId}`, formData);

      toast.success("Skill berhasil diperbarui!", {
        id: loadingToast,
        description: "Perubahan telah disimpan ke database.",
      });

      await mutate((key: Arguments) => Array.isArray(key) && key[0]?.toString().includes("/api/skills/paginated"));

      onOpenChange(false);
    } catch (e) {
      if (e instanceof ApiError) {
        toast.error("Gagal memperbarui skill", {
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
      <DrawerContent>
        <div className="max-w-lg w-full mx-auto overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle>{t("heading.skill.edit.title")}</DrawerTitle>
            <DrawerDescription>{t("heading.skill.edit.description")}</DrawerDescription>
          </DrawerHeader>
          {loadingSkeleton ? (
            <div className="space-y-2">
              <div className="grid gap-6 px-4">
                {/* Name Skeleton */}
                <div className="grid gap-4">
                  <Label htmlFor="edit-name">
                    {t("form.skill.label.name")} <span className="text-destructive">*</span>
                  </Label>
                  <Skeleton className="h-10 w-full" />
                </div>

                {/* Dark Icon Skeleton */}
                <div className="grid gap-4">
                  <Label htmlFor="edit-dark-icon">
                    {t("form.skill.label.darkIcon")} <span className="text-destructive">*</span>
                  </Label>
                  <Skeleton className="h-10 w-full" />
                </div>

                {/* Light Icon Skeleton */}
                <div className="grid gap-4">
                  <Label htmlFor="edit-light-icon">
                    {t("form.skill.label.lightIcon")} <span className="text-destructive">*</span>
                  </Label>
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>

              <DrawerFooter>
                <Button type="button" disabled tabIndex={8} className="flex-1">
                  {t("form.skill.button.update")}
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline" type="button" className="flex-1">
                    {t("datatable.cancel")}
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-2">
              <FieldGroup className="px-4">
                {/* Name Field */}
                <Field>
                  <FieldLabel htmlFor="name">
                    {t("form.skill.label.name")} <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input id="name" type="text" placeholder={t("form.skill.placeholder.name")} value={name} onChange={(e) => setName(e.target.value)} required />
                  {validationErrors.name && <ValidationError message={validationErrors.name[0]} />}
                </Field>

                {/* Dark Icon Field */}
                <Field>
                  <FieldLabel htmlFor="darkIcon">{t("form.skill.label.darkIcon")}</FieldLabel>
                  <Input ref={darkIconInputRef} id="darkIcon" name="darkIcon" type="file" accept="image/jpeg,image/png,image/jpg,image/webp,image/svg+xml" onChange={handleDarkIconChange} />
                  <FieldDescription>
                    {t("form.article.description.thumbnail")}{" "}
                    {darkIcon ? (
                      <span>
                        {t("form.article.description.thumbnail.2")} {darkIcon.name} ({(darkIcon.size / 1024).toFixed(2)} KB)
                      </span>
                    ) : (
                      <span>
                        {t("form.article.description.thumbnail.3")} {currentDarkIconUrl}
                      </span>
                    )}
                  </FieldDescription>
                  {validationErrors.dark_icon && <ValidationError message={validationErrors.dark_icon[0]} />}
                </Field>

                {/* Light Icon Field */}
                <Field>
                  <FieldLabel htmlFor="lightIcon">{t("form.skill.label.lightIcon")}</FieldLabel>
                  <Input ref={lightIconInputRef} id="lightIcon" name="lightIcon" type="file" accept="image/jpeg,image/png,image/jpg,image/webp,image/svg+xml" onChange={handleLightIconChange} />
                  <FieldDescription>
                    {t("form.article.description.thumbnail")}{" "}
                    {lightIcon ? (
                      <span>
                        {t("form.article.description.thumbnail.2")} {lightIcon.name} ({(lightIcon.size / 1024).toFixed(2)} KB)
                      </span>
                    ) : (
                      <span>
                        {t("form.article.description.thumbnail.3")} {currentLightIconUrl}
                      </span>
                    )}
                  </FieldDescription>
                  {validationErrors.light_icon && <ValidationError message={validationErrors.light_icon[0]} />}
                </Field>
              </FieldGroup>

              <DrawerFooter>
                {/* Submit Button */}
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading ? t("form.skill.button.update.process") : t("form.skill.button.update")}
                </Button>

                {/* Cancel Button */}
                <DrawerClose asChild disabled={loading}>
                  <Button variant="outline" className="flex-1">
                    {t("datatable.cancel")}
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </form>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

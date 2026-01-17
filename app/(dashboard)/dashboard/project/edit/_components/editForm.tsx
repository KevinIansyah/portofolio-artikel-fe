"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useLanguage } from "@/hooks/use-language";

import { apiClient } from "@/lib/api/client";
import { ApiError } from "@/lib/types/api";
import { Category } from "@/lib/types/category";
import { ProjectEditData } from "@/lib/types/project";
import { Skill } from "@/lib/types/skill";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import ValidationError from "@/components/validation-error";
import Tiptap from "@/components/dashboard/tiptap";
import MultiSelect from "@/components/dashboard/multi-select";

interface EditFormProps {
  project: ProjectEditData;
  categories: Category[];
  skills: Skill[];
}

export default function EditForm({ project, categories, skills }: EditFormProps) {
  const router = useRouter();
  const { t } = useLanguage();

  const [titleId, setTitleId] = useState(project.translations.id.title || "");
  const [titleEn, setTitleEn] = useState(project.translations.en.title || "");
  const [descriptionId, setDescriptionId] = useState(project.translations.id.description || "");
  const [descriptionEn, setDescriptionEn] = useState(project.translations.en.description || "");
  const [contentId, setContentId] = useState(project.translations.id.content || "");
  const [contentEn, setContentEn] = useState(project.translations.en.content || "");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [demoUrl, setDemoUrl] = useState(project.demo_url || "");
  const [projectUrl, setProjectUrl] = useState(project.projecrt_url || "");
  const [status, setStatus] = useState<"draft" | "published">(project.status || "draft");
  const [selectedCategories, setSelectedCategories] = useState<number[]>(project.categories?.map((category) => category.id) || []);
  const [selectedSkills, setSelectedSkills] = useState<number[]>(project.skills?.map((skill) => skill.id) || []);

  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setValidationErrors({
          ...validationErrors,
          thumbnail: ["File size must be less than 2MB"],
        });
        return;
      }
      setThumbnail(file);
      const { thumbnail: _, ...rest } = validationErrors;
      setValidationErrors(rest);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setValidationErrors({});
    setLoading(true);

    const loadingToast = toast.loading("Memperbarui artikel...");

    try {
      const formData = new FormData();

      formData.append("title_id", titleId);
      formData.append("title_en", titleEn);
      formData.append("description_id", descriptionId);
      formData.append("description_en", descriptionEn);
      formData.append("content_id", contentId);
      formData.append("content_en", contentEn);
      formData.append("status", status);
      formData.append("_method", "PUT");

      if (demoUrl) {
        formData.append("demo_url", demoUrl);
      }

      if (projectUrl) {
        formData.append("project_url", projectUrl);
      }

      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      selectedCategories.forEach((categoryId) => {
        formData.append("categories[]", categoryId.toString());
      });

      selectedSkills.forEach((skillId) => {
        formData.append("skills[]", skillId.toString());
      });

      await apiClient.postFormData<ProjectEditData>(`/api/projects/${project.id}`, formData);

      toast.success("Proyek berhasil diperbarui!", {
        id: loadingToast,
        description: "Perubahan telah disimpan ke database.",
      });

      router.push("/dashboard/project");
      router.refresh();
    } catch (e) {
      if (e instanceof ApiError) {
        toast.error("Gagal", {
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
    <div className="p-4 border rounded-xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Error */}
        {error && <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg">{error}</div>}

        {/* Title Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="titleId">
              {t("form.project.label.title")} 🇮🇩 <span className="text-destructive">*</span>
            </FieldLabel>
            <Input id="titleId" type="text" placeholder={t("form.project.placeholder.title_id")} value={titleId} onChange={(e) => setTitleId(e.target.value)} required />
            {validationErrors.title_id && <ValidationError message={validationErrors.title_id[0]} />}
          </Field>

          <Field>
            <FieldLabel htmlFor="titleEn">
              {t("form.project.label.title")} 🇬🇧 <span className="text-destructive">*</span>
            </FieldLabel>
            <Input id="titleEn" type="text" placeholder={t("form.project.placeholder.title_en")} value={titleEn} onChange={(e) => setTitleEn(e.target.value)} required />
            {validationErrors.title_en && <ValidationError message={validationErrors.title_en[0]} />}
          </Field>
        </div>

        {/* Description Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="descriptionId">
              {t("form.project.label.description")} 🇮🇩 <span className="text-destructive">*</span>
            </FieldLabel>
            <Textarea
              id="descriptionId"
              className="min-h-24"
              placeholder={t("form.project.placeholder.description_id")}
              value={descriptionId}
              onChange={(e) => setDescriptionId(e.target.value)}
              required
            />
            {validationErrors.description_id && <ValidationError message={validationErrors.description_id[0]} />}
          </Field>

          <Field>
            <FieldLabel htmlFor="descriptionEn">
              Deskripsi 🇬🇧 <span className="text-destructive">*</span>
            </FieldLabel>
            <Textarea
              id="descriptionEn"
              className="min-h-24"
              placeholder={t("form.project.placeholder.description_en")}
              value={descriptionEn}
              onChange={(e) => setDescriptionEn(e.target.value)}
              required
            />
            {validationErrors.description_en && <ValidationError message={validationErrors.description_en[0]} />}
          </Field>
        </div>

        {/* Meta Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field>
            <FieldLabel htmlFor="status">
              Status <span className="text-destructive">*</span>
            </FieldLabel>
            <Select value={status} onValueChange={(value) => setStatus(value as "draft" | "published")}>
              <SelectTrigger id="status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {validationErrors.status && <ValidationError message={validationErrors.status[0]} />}
          </Field>

          <Field>
            <FieldLabel htmlFor="demoUrl">{t("form.project.label.demoUrl")}</FieldLabel>
            <Input id="readingTime" type="url" min={1} placeholder="httpps://" value={demoUrl} onChange={(e) => setDemoUrl(e.target.value)} />
            {validationErrors.demo_url && <ValidationError message={validationErrors.demo_url[0]} />}
          </Field>

          <Field>
            <FieldLabel htmlFor="projectUrl">{t("form.project.label.projectUrl")}</FieldLabel>
            <Input id="readingTime" type="url" min={1} placeholder="httpps://" value={projectUrl} onChange={(e) => setProjectUrl(e.target.value)} />
            {validationErrors.project_url && <ValidationError message={validationErrors.project_url[0]} />}
          </Field>
        </div>

        {/* Thumbnail */}
        <Field>
          <FieldLabel htmlFor="thumbnail">Thumbnail</FieldLabel>
          <Input id="thumbnail" name="thumbnail" type="file" accept="image/jpeg,image/png,image/jpg,image/webp" onChange={handleThumbnailChange} />
          <FieldDescription>
            {t("form.project.description.thumbnail")}{" "}
            {thumbnail ? (
              <span>
                {t("form.project.description.thumbnail.2")} {thumbnail.name} ({(thumbnail.size / 1024).toFixed(2)} KB)
              </span>
            ) : (
              <span>
                {t("form.project.description.thumbnail.3")} {project.thumbnail_url}
              </span>
            )}
          </FieldDescription>
          {validationErrors.thumbnail && <ValidationError message={validationErrors.thumbnail[0]} />}
        </Field>

        {/* Categories */}
        <Field>
          <FieldLabel>
            {t("form.project.label.category")} <span className="text-destructive">*</span>
          </FieldLabel>
          <MultiSelect
            options={categories.map((cat) => ({ id: cat.id, label: cat.name }))}
            selected={selectedCategories}
            onChange={setSelectedCategories}
            placeholder={t("form.project.placeholder.category")}
          />
          <FieldDescription>{t("form.project.description.category")}</FieldDescription>
          {validationErrors.category_ids && <ValidationError message={validationErrors.category_ids[0]} />}
        </Field>

        {/* Skills */}
        <Field>
          <FieldLabel>
            {t("form.project.label.skill")} <span className="text-destructive">*</span>
          </FieldLabel>
          <MultiSelect options={skills.map((skill) => ({ id: skill.id, label: skill.name }))} selected={selectedSkills} onChange={setSelectedSkills} placeholder={t("form.project.placeholder.tag")} />
          <FieldDescription>{t("form.project.description.skill")}</FieldDescription>
          {validationErrors.skill_ids && <ValidationError message={validationErrors.skill_ids[0]} />}
        </Field>

        {/* Content Fields */}
        <Field>
          <FieldLabel htmlFor="contentId">
            {t("form.project.label.content")} 🇮🇩 <span className="text-destructive">*</span>
          </FieldLabel>
          <Tiptap content={contentId} onChange={setContentId} />
          {validationErrors.content_id && <ValidationError message={validationErrors.content_id[0]} />}
        </Field>

        <Field>
          <FieldLabel htmlFor="contentEn">
            {t("form.project.label.content")} 🇬🇧 <span className="text-destructive">*</span>
          </FieldLabel>
          <Tiptap content={contentEn} onChange={setContentEn} />
          {validationErrors.content_en && <ValidationError message={validationErrors.content_en[0]} />}
        </Field>

        {/* Submit Buttons */}
        <Button type="submit" disabled={loading} className="w-full">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? t("form.project.button.update.process") : t("form.project.button.update")}
        </Button>
      </form>
    </div>
  );
}

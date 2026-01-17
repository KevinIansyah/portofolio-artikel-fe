"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { useLanguage } from "@/hooks/use-language";

import { apiClient } from "@/lib/api/client";
import { ApiError } from "@/lib/types/api";
import { Category } from "@/lib/types/category";
import { Tag } from "@/lib/types/tag";
import { ArticleFormData } from "@/lib/types/article";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import ValidationError from "@/components/validation-error";
import Tiptap from "@/components/dashboard/tiptap";
import MultiSelect from "@/components/dashboard/multi-select";
import { toast } from "sonner";

interface AddFormProps {
  categories: Category[];
  tags: Tag[];
}

export default function AddForm({ categories, tags }: AddFormProps) {
  const router = useRouter();
  const { t } = useLanguage();

  const [titleId, setTitleId] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [descriptionId, setDescriptionId] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [contentId, setContentId] = useState("");
  const [contentEn, setContentEn] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [readingTime, setReadingTime] = useState<number>(5);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      const { ...rest } = validationErrors;
      setValidationErrors(rest);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const loadingToast = toast.loading("Menyimpan artikel...");

    setError("");
    setValidationErrors({});
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("title_id", titleId);
      formData.append("title_en", titleEn);
      formData.append("description_id", descriptionId);
      formData.append("description_en", descriptionEn);
      formData.append("content_id", contentId);
      formData.append("content_en", contentEn);
      formData.append("status", status);
      formData.append("reading_time", readingTime.toString());

      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      selectedCategories.forEach((categoryId) => {
        formData.append("categories[]", categoryId.toString());
      });

      selectedTags.forEach((tagId) => {
        formData.append("tags[]", tagId.toString());
      });

      await apiClient.postFormData<ArticleFormData>("/api/articles", formData);

      toast.success("Artikel berhasil disimpan!", {
        id: loadingToast,
        description: "Artikel telah ditambahkan ke database.",
      });

      router.push("/dashboard/article");
      router.refresh();
    } catch (e) {
      if (e instanceof ApiError) {
        toast.error("Gagal menyimpan artikel", {
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
        {/* {error && <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg">{error}</div>} */}

        {/* Title Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="titleId">
              {t("form.article.label.title")} 🇮🇩 <span className="text-destructive">*</span>
            </FieldLabel>
            <Input id="titleId" type="text" placeholder={t("form.article.placeholder.title_id")} value={titleId} onChange={(e) => setTitleId(e.target.value)} required />
            {validationErrors.title_id && <ValidationError message={validationErrors.title_id[0]} />}
          </Field>

          <Field>
            <FieldLabel htmlFor="titleEn">
              {t("form.article.label.title")} 🇬🇧 <span className="text-destructive">*</span>
            </FieldLabel>
            <Input id="titleEn" type="text" placeholder={t("form.article.placeholder.title_en")} value={titleEn} onChange={(e) => setTitleEn(e.target.value)} required />
            {validationErrors.title_en && <ValidationError message={validationErrors.title_en[0]} />}
          </Field>
        </div>

        {/* Description Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="descriptionId">
              {t("form.article.label.description")} 🇮🇩 <span className="text-destructive">*</span>
            </FieldLabel>
            <Textarea
              id="descriptionId"
              className="min-h-24"
              placeholder={t("form.article.placeholder.description_id")}
              value={descriptionId}
              onChange={(e) => setDescriptionId(e.target.value)}
              required
            />
            {validationErrors.description_id && <ValidationError message={validationErrors.description_id[0]} />}
          </Field>

          <Field>
            <FieldLabel htmlFor="descriptionEn">
              {t("form.article.label.description")} 🇬🇧 <span className="text-destructive">*</span>
            </FieldLabel>
            <Textarea
              id="descriptionEn"
              className="min-h-24"
              placeholder={t("form.article.placeholder.description_en")}
              value={descriptionEn}
              onChange={(e) => setDescriptionEn(e.target.value)}
              required
            />
            {validationErrors.description_en && <ValidationError message={validationErrors.description_en[0]} />}
          </Field>
        </div>

        {/* Meta Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <FieldLabel htmlFor="readingTime">
              {t("form.article.label.reading_time")} <span className="text-destructive">*</span>
            </FieldLabel>
            <Input id="readingTime" type="number" min={1} max={60} placeholder="5" value={readingTime} onChange={(e) => setReadingTime(parseInt(e.target.value) || 0)} required />
            {validationErrors.reading_time && <ValidationError message={validationErrors.reading_time[0]} />}
          </Field>
        </div>

        {/* Thumbnail */}
        <Field>
          <FieldLabel htmlFor="thumbnail">
            Thumbnail <span className="text-destructive">*</span>
          </FieldLabel>
          <Input id="thumbnail" name="thumbnail" type="file" accept="image/jpeg,image/png,image/jpg,image/webp" onChange={handleThumbnailChange} required />
          <FieldDescription>
            {t("form.article.description.thumbnail")}{" "}
            {thumbnail && (
              <span>
                {t("form.article.description.thumbnail.2")} {thumbnail.name} ({(thumbnail.size / 1024).toFixed(2)} KB)
              </span>
            )}
          </FieldDescription>
          {validationErrors.thumbnail && <ValidationError message={validationErrors.thumbnail[0]} />}
        </Field>

        {/* Categories */}
        <Field>
          <FieldLabel>
            {t("form.article.label.category")} <span className="text-destructive">*</span>
          </FieldLabel>
          <MultiSelect options={categories.map((cat) => ({ id: cat.id, label: cat.name }))} selected={selectedCategories} onChange={setSelectedCategories} placeholder="Pilih kategori..." />
          <FieldDescription>{t("form.article.description.category")}</FieldDescription>
          {validationErrors.category_ids && <ValidationError message={validationErrors.category_ids[0]} />}
        </Field>

        {/* Tags */}
        <Field>
          <FieldLabel>
            {t("form.article.label.tag")} <span className="text-destructive">*</span>
          </FieldLabel>
          <MultiSelect options={tags.map((tag) => ({ id: tag.id, label: tag.name }))} selected={selectedTags} onChange={setSelectedTags} placeholder="Pilih tag..." />
          <FieldDescription>{t("form.article.description.tag")}</FieldDescription>
          {validationErrors.tag_ids && <ValidationError message={validationErrors.tag_ids[0]} />}
        </Field>

        {/* Content Fields */}
        <Field>
          <FieldLabel htmlFor="contentId">
            {t("form.article.label.content")} 🇮🇩 <span className="text-destructive">*</span>
          </FieldLabel>
          <Tiptap content={contentId} onChange={setContentId} />
          {validationErrors.content_id && <ValidationError message={validationErrors.content_id[0]} />}
        </Field>

        <Field>
          <FieldLabel htmlFor="contentEn">
            {t("form.article.label.content")} 🇬🇧 <span className="text-destructive">*</span>
          </FieldLabel>
          <Tiptap content={contentEn} onChange={setContentEn} />
          {validationErrors.content_en && <ValidationError message={validationErrors.content_en[0]} />}
        </Field>

        {/* Submit Buttons */}
        <Button type="submit" disabled={loading} className="w-full">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? t("form.article.button.add.process") : t("form.article.button.add")}
        </Button>
      </form>
    </div>
  );
}

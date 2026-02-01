import { Category } from "./category";
import { Tag } from "./tag";
import { User } from "./user";

export interface Article {
  id: number;
  title: string;
  slug: string;
  slug_id: string;
  slug_en: string;
  description: string;
  content: string;
  thumbnail_url: string;
  status: "draft" | "published";
  views: number;
  reading_time: number;
  published_at: string;
  created_at: string;
  updated_at: string;
  categories: Category[];
  tags: Tag[];
  user: User;
}

export interface ArticleFormData {
  id: number;
  title_id: string;
  title_en: string;
  description_id: string;
  description_en: string;
  content_id: string;
  content_en: string;
  thumbnail: File | null;
  status: "draft" | "published";
  reading_time: number;
  categories: number[];
  tags: number[];
}

export interface ArticleEditData {
  id: number;
  user_id: number;
  thumbnail_url: string;
  status: "draft" | "published";
  views: number;
  reading_time: number | null;
  published_at: string;
  created_at: string;
  updated_at: string;
  translations: {
    id: {
      title: string;
      description: string;
      content: string;
    };
    en: {
      title: string;
      description: string;
      content: string;
    };
  };
  categories: Category[];
  tags: Tag[];
}

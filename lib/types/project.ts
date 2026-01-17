import { Category } from "./category";
import { Skill } from "./skill";
import { User } from "./user";

export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  thumbnail_url: string;
  demo_url?: string;
  projecrt_url?: string;
  status: "draft" | "published";
  published_at: string;
  created_at?: string;
  updated_at?: string;
  categories?: Category[];
  skills?: Skill[];
  user?: User;
}

export interface ProjectFormData {
  title_id: string;
  title_en: string;
  description_id: string;
  description_en: string;
  content_id: string;
  content_en: string;
  thumbnail: File | null;
  status: "draft" | "published";
  reading_time: number;
  cetagories: number[];
  tags: number[];
}

export interface ProjectEditData {
  id: number;
  user_id: number;
  thumbnail_url: string;
  demo_url?: string;
  projecrt_url?: string;
  status: "draft" | "published";
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
  skills: Skill[];
}

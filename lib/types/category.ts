export interface Category {
  id: number;
  name: string;
  slug: string;
  slug_id: string;
  slug_en: string;
  type: "article" | "project";
}

export interface CategoryFormData {
  id: number;
  name_id: string;
  name_en: string;
  type: "article" | "project";
}

export interface CategoryEditData {
  id: number;
  type: "article" | "project";
  translations: {
    id: {
      name: string;
    };
    en: {
      name: string;
    };
  };
}

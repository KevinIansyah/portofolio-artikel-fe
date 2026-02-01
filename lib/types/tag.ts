export interface Tag {
  id: number;
  name: string;
  slug: string;
  slug_id: string;
  slug_en: string;
}

export interface TagFormData {
  id: number;
  name_id: string;
  name_en: string;
}

export interface TagEditData {
  id: number;
  translations: {
    id: {
      name: string;
    };
    en: {
      name: string;
    };
  };
}

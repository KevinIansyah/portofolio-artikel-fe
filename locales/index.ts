import { id } from './id';
import { en } from './en';

export const translations = {
  id,
  en,
} as const;

export type Language = 'id' | 'en';
export type TranslationKey = keyof typeof translations.id;

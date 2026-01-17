export type UserRole = "admin" | "author" | "visitor";

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  role: UserRole;
  avatar_url?: string;
  bio?: string;
  instagram_url?: string;
  github_url?: string;
  linkedin_url?: string;
  facebook_url?: string;
  twitter_url?: string;
  created_at?: string;
  updated_at?: string;
}

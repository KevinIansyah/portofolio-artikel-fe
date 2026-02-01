import { cookies } from "next/headers";

/**
 * Get current locale from cookie (server-side only)
 * @returns 'id' or 'en'
 */
export async function getServerLocale(): Promise<"id" | "en"> {
  const cookieStore = await cookies();
  const locale = cookieStore.get("language")?.value;
  return locale === "en" ? "en" : "id";
}

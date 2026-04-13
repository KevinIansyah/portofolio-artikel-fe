import { cn } from "@/lib/utils";

/** Nomor WhatsApp tanpa + — selaras dengan blok kontak & CTA detail */
export const siteWhatsAppNumber = "6285815787906";
export const siteWhatsAppUrl = `https://wa.me/${siteWhatsAppNumber}` as const;

/** `wa.me` dengan kolom chat terisi (`text` di-encode). */
export function siteWhatsAppChatUrl(message: string): string {
  return `${siteWhatsAppUrl}?text=${encodeURIComponent(message)}`;
}

/** Bungkus luar kartu (selaras proyek/kontak di beranda) */
export const siteCardOuter = "rounded-3xl border border-dashed border-border p-2";

/** Isi kartu (hover untuk link / kartu interaktif) */
export const siteCardInner =
  "rounded-2xl border border-border bg-card shadow-none transition-colors hover:border-primary/35";

/** Warna/border field (tanpa lebar — dipakai input & select) */
export const siteFieldTone = cn(
  "bg-primary/10! text-sm rounded-md border-primary",
  "placeholder:text-muted-foreground"
);

/** Input penuh lebar — footer, kontak, search */
export const siteFieldClass = cn("w-full", siteFieldTone);

/** Select filter (per page): lebar tetap; `!h-10` menimpa `h-9` default SelectTrigger */
export const siteSelectFieldClass = cn("!h-10 w-32 shrink-0 justify-between", siteFieldTone);

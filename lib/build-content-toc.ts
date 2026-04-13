export interface ContentTocItem {
  id: string;
  text: string;
  level: 1 | 2 | 3;
}

function slugifyHeadingId(text: string, index: number): string {
  const base = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 48);
  return base ? `heading-${index}-${base}` : `heading-${index}`;
}

function stripInnerHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildTocFromHtml(html: string): ContentTocItem[] {
  const items: ContentTocItem[] = [];
  const re = /<h([1-3])[^>]*>([\s\S]*?)<\/h\1>/gi;
  let match: RegExpExecArray | null;
  let index = 0;

  while ((match = re.exec(html)) !== null) {
    const level = Number(match[1]) as 1 | 2 | 3;
    const text = stripInnerHtml(match[2] ?? "");
    if (!text) continue;

    const id = slugifyHeadingId(text, index);
    items.push({ id, text, level });
    index += 1;
  }

  return items;
}

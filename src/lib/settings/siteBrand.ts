export const DEFAULT_SITE_BRAND = {
  name: "Oblivion-CMS",
  subtitle: "文章可视化编辑器",
  description: "Oblivion-CMS — 类似 QQ 空间的轻量级文章说说可视化编辑器，直连 Cloudflare D1 数据库",
  icon: "/favicon.svg",
  appleTouchIcon: "/apple-touch-icon.png",
} as const;

export function formatDocumentTitle(name: string, subtitle?: string): string {
  const cleanName = name.trim() || DEFAULT_SITE_BRAND.name;
  const cleanSub = (subtitle ?? "").trim();
  return cleanSub ? `${cleanName} — ${cleanSub}` : cleanName;
}

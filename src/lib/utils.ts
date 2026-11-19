export function isMobileViewport(): boolean {
  if (typeof window === "undefined") return false;
  if (typeof window.matchMedia === "function") {
    return window.matchMedia("(max-width: 767px)").matches;
  }
  return window.innerWidth <= 767;
}

export function handleDockWheel(e: {
  deltaY: number;
  deltaX: number;
  currentTarget: { scrollLeft: number };
}) {
  if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
    e.currentTarget.scrollLeft += e.deltaY;
  }
}

export function parseTagList(raw: string): string[] {
  return raw
    .split(/[，,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function downloadJsonFile(filename: string, payload: unknown): void {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function normalizeSlug(raw: string): string {
  return raw
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 150)
    .replace(/-$/, "");
}

/** Generate URL-safe slug from title, loading pinyin-pro only for non-ASCII titles. */
export async function slugFromTitle(title: string): Promise<string> {
  if (!/[^\x00-\x7F]/.test(title)) {
    return normalizeSlug(title);
  }
  const { pinyin } = await import("pinyin-pro");
  return normalizeSlug(
    pinyin(title, {
      toneType: "none",
      type: "array",
      nonZh: "consecutive",
    }).join("-"),
  );
}

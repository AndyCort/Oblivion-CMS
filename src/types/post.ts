const isLanguageCode = (key: string) => /^[a-z]{2,3}(?:-[a-z0-9]{2,8})*$/i.test(key);

function isLocalizedText(value: unknown): value is Record<string, string> {
  return (
    !!value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.entries(value).every(([key, text]) => isLanguageCode(key) && typeof text === "string")
  );
}

function pickLocalizedText(map: Record<string, string>): string {
  return (
    map.zh ||
    map["zh-CN"] ||
    map.en ||
    Object.values(map).find((v) => v.trim()) ||
    ""
  );
}

/** Extracts plain text while staying compatible with legacy localized JSON objects. */
export function extractPlainText(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed.startsWith("{")) {
      try {
        const parsed: unknown = JSON.parse(trimmed);
        if (isLocalizedText(parsed) && Object.keys(parsed).length > 0) {
          return pickLocalizedText(parsed);
        }
      } catch {
        /* ordinary text */
      }
    }
    return value;
  }
  if (isLocalizedText(value)) {
    return Object.keys(value).length > 0 ? pickLocalizedText(value) : "";
  }
  throw new Error("文章标题、摘要或正文格式无效：需要纯文本或语言映射");
}

export function replacePostDateDay(date: string, day: string): string {
  return day ? day + date.slice(10) : "";
}

export function isPostDate(date: unknown): date is string {
  if (typeof date !== "string") return false;
  const match = date.match(
    /^(\d{4}-\d{2}-\d{2})(?:[ T]([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d)(?:\.\d{1,3})?)?(?:Z|[+-](?:0\d|1[0-4]):[0-5]\d)?)?$/,
  );
  if (!match) return false;
  const time = Date.parse(match[1]);
  return Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === match[1];
}

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  tags: string[];
  cover?: string;
  author?: string;
  pinned?: boolean;
  chars?: number;
  updated_at?: string;
}

export interface PostDraft {
  id: string;
  post: BlogPost;
  originalId?: string;
  baseline: BlogPost;
  updatedAt: number;
}

export function countChars(content: string): number {
  return Array.from(content.replace(/\s/g, "")).length;
}

export function emptyPost(): BlogPost {
  const now = new Date();
  const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  return { id: "", title: "", summary: "", content: "", date, tags: [], pinned: false };
}

export function validatePost(value: unknown): BlogPost {
  const p = value as BlogPost;
  if (
    !p ||
    typeof p !== "object" ||
    typeof p.id !== "string" ||
    !/^[a-z0-9]+(?:[-_][a-z0-9]+)*$/.test(p.id) ||
    p.id.length > 150
  ) {
    throw new Error("Slug 必须为英文小写、数字、连字符或下划线，最多 150 字符");
  }
  for (const [field, limit] of [
    ["title", 300],
    ["summary", 2_000_000],
    ["content", 2_000_000],
  ] as const) {
    const raw = p[field];
    if (typeof raw !== "string") {
      throw new Error(`${field} 必须为纯文本字符串`);
    }
    if (raw.length > limit) {
      throw new Error(`${field} 超出长度限制`);
    }
  }
  if (!p.title.trim() || !p.content.trim()) {
    throw new Error("标题和正文不能为空");
  }
  if (
    !Array.isArray(p.tags) ||
    p.tags.length > 50 ||
    p.tags.some((t) => typeof t !== "string" || !t.trim() || t.length > 100)
  ) {
    throw new Error("标签格式不正确");
  }
  if (!isPostDate(p.date)) throw new Error("发布日期无效");
  if (p.cover && (typeof p.cover !== "string" || !/^https?:\/\//i.test(p.cover))) {
    throw new Error("封面必须使用 HTTP(S) 地址");
  }
  if (p.author !== undefined && typeof p.author !== "string") {
    throw new Error("作者格式不正确");
  }
  if (p.pinned !== undefined && typeof p.pinned !== "boolean") {
    throw new Error("置顶格式不正确");
  }
  return {
    id: p.id,
    title: p.title.trim(),
    summary: p.summary,
    content: p.content,
    date: p.date,
    tags: [...new Set(p.tags.map((t) => t.trim()))],
    cover: p.cover || "",
    author: p.author || "",
    pinned: !!p.pinned,
    chars: countChars(p.content),
  };
}

import { parseArticlesFromSource } from "../ast/articleParser";
import type { Article, ArticleMedia, ArticleMusic } from "../../types/article";

export interface ImportStats {
  total: number;
  earliestTime?: number;
  latestTime?: number;
  mediaCount: number;
  uniqueTags: string[];
}

export interface ParseImportResult {
  articles: Article[];
  stats: ImportStats;
}

/**
 * Normalizes an article item from arbitrary input formats
 */
export function normalizeArticle(raw: any, fallbackIndex = 0): Article | null {
  if (!raw || typeof raw !== "object") return null;

  // 1. Time / timestamp parsing
  let time = 0;
  const rawTime =
    raw.time ?? raw.timestamp ?? raw.date ?? raw.created_at ?? raw.createdAt;

  if (typeof rawTime === "number" && !isNaN(rawTime)) {
    // If it's unix timestamp in seconds (10 digits), convert to ms
    time = rawTime < 1e11 ? rawTime * 1000 : rawTime;
  } else if (typeof rawTime === "string" && rawTime.trim()) {
    const parsed = Date.parse(rawTime.trim());
    if (!isNaN(parsed)) {
      time = parsed;
    } else {
      const num = Number(rawTime.trim());
      if (!isNaN(num) && num > 0) {
        time = num < 1e11 ? num * 1000 : num;
      }
    }
  }

  // If time is missing or completely invalid, generate fallback timestamp
  if (!time || isNaN(time) || time <= 0) {
    time = Date.now() - fallbackIndex * 60000;
  }

  // 2. Content
  let content = "";
  const rawContent =
    raw.content ?? raw.text ?? raw.body ?? raw.title ?? "";

  if (typeof rawContent === "string") {
    content = rawContent;
  } else if (typeof rawContent === "number" || typeof rawContent === "boolean") {
    content = String(rawContent);
  } else if (typeof rawContent === "object" && rawContent !== null) {
    content =
      rawContent.zh ||
      rawContent.en ||
      rawContent.text ||
      JSON.stringify(rawContent);
  }

  // 3. Media
  const media: ArticleMedia[] = [];
  const rawMedia =
    raw.media ?? raw.images ?? raw.photos ?? raw.videos ?? raw.attachments;

  if (Array.isArray(rawMedia)) {
    for (const item of rawMedia) {
      if (typeof item === "string" && item.trim()) {
        const isVideo = /\.(mp4|mov|webm|m4v)($|\?)/i.test(item);
        media.push({
          type: isVideo ? "vid" : "img",
          url: item.trim(),
        });
      } else if (item && typeof item === "object" && typeof item.url === "string") {
        media.push({
          type: item.type === "vid" ? "vid" : "img",
          url: item.url.trim(),
        });
      }
    }
  }

  // 4. Tags
  const tags: string[] = [];
  const rawTags = raw.tags ?? raw.categories ?? raw.category ?? raw.tag;

  if (Array.isArray(rawTags)) {
    for (const t of rawTags) {
      if (typeof t === "string" && t.trim()) {
        tags.push(t.trim());
      }
    }
  } else if (typeof rawTags === "string" && rawTags.trim()) {
    const split = rawTags.split(/[,，]/).map((s) => s.trim()).filter(Boolean);
    tags.push(...split);
  }

  // Deduplicate tags
  const uniqueTags = Array.from(new Set(tags));

  // 5. Location
  let location = "";
  if (typeof raw.location === "string") {
    location = raw.location.trim();
  } else if (raw.location && typeof raw.location === "object") {
    location = String(raw.location.name || raw.location.address || "");
  }

  // 6. Music
  let music: ArticleMusic | undefined = undefined;
  if (raw.music && typeof raw.music === "object") {
    music = {
      title: String(raw.music.title || ""),
      artist: String(raw.music.artist || ""),
      url: String(raw.music.url || ""),
    };
  }

  return {
    time,
    content,
    media,
    tags: uniqueTags,
    location,
    ...(music ? { music } : {}),
  };
}

/**
 * Calculates statistics for parsed articles
 */
export function calculateImportStats(articles: Article[]): ImportStats {
  if (articles.length === 0) {
    return {
      total: 0,
      mediaCount: 0,
      uniqueTags: [],
    };
  }

  let earliest = articles[0].time;
  let latest = articles[0].time;
  let mediaCount = 0;
  const tagSet = new Set<string>();

  for (const a of articles) {
    if (a.time < earliest) earliest = a.time;
    if (a.time > latest) latest = a.time;
    mediaCount += a.media?.length || 0;
    for (const t of a.tags || []) {
      tagSet.add(t);
    }
  }

  return {
    total: articles.length,
    earliestTime: earliest,
    latestTime: latest,
    mediaCount,
    uniqueTags: Array.from(tagSet),
  };
}

/**
 * Parses raw input text (JSON or TypeScript/JavaScript moments.ts file)
 */
export function parseImportSource(source: string): ParseImportResult {
  const trimmed = source.trim();
  if (!trimmed) {
    throw new Error("请粘贴数据或选择要导入的文件内容");
  }

  let articles: Article[] = [];

  // 1. Attempt JSON parsing
  try {
    const parsedJson = JSON.parse(trimmed);

    if (Array.isArray(parsedJson)) {
      articles = parsedJson
        .map((item, idx) => normalizeArticle(item, idx))
        .filter((a): a is Article => a !== null);
    } else if (parsedJson && typeof parsedJson === "object") {
      // Check common property wrapper names
      const candidateKeys = ["moments", "articles", "posts", "data", "list", "items"];
      let foundArray: any[] | null = null;

      for (const key of candidateKeys) {
        if (Array.isArray(parsedJson[key])) {
          foundArray = parsedJson[key];
          break;
        }
      }

      // If none of known keys matched, check any property that is an array
      if (!foundArray) {
        for (const val of Object.values(parsedJson)) {
          if (Array.isArray(val) && val.length > 0 && typeof val[0] === "object") {
            foundArray = val;
            break;
          }
        }
      }

      if (foundArray) {
        articles = foundArray
          .map((item, idx) => normalizeArticle(item, idx))
          .filter((a): a is Article => a !== null);
      }
    }
  } catch {
    // Not valid JSON, proceed to AST parser
  }

  // If successfully parsed via JSON, return sorted
  if (articles.length > 0) {
    const sorted = articles.sort((a, b) => b.time - a.time);
    return {
      articles: sorted,
      stats: calculateImportStats(sorted),
    };
  }

  // 2. Attempt AST parsing (TypeScript / JavaScript moments.ts file)
  let codeToParse = trimmed;
  // If user pasted naked array [ ... ], wrap with export const moments = ...
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    codeToParse = `export const moments = ${trimmed};`;
  } else if (
    !trimmed.includes("export") &&
    !trimmed.includes("const ") &&
    !trimmed.includes("let ") &&
    !trimmed.includes("var ")
  ) {
    codeToParse = `export const moments = ${trimmed};`;
  }

  try {
    const { articles: parsedArticles } = parseArticlesFromSource(codeToParse);
    if (parsedArticles && parsedArticles.length > 0) {
      articles = parsedArticles
        .map((item, idx) => normalizeArticle(item, idx))
        .filter((a): a is Article => a !== null);
    }
  } catch (astErr: any) {
    // If wrapping failed, try parsing the original verbatim
    if (codeToParse !== trimmed) {
      try {
        const { articles: parsedOriginal } = parseArticlesFromSource(trimmed);
        if (parsedOriginal && parsedOriginal.length > 0) {
          articles = parsedOriginal
            .map((item, idx) => normalizeArticle(item, idx))
            .filter((a): a is Article => a !== null);
        }
      } catch {}
    }

    if (articles.length === 0) {
      throw new Error(
        `无法解析导入内容: ${astErr?.message || "未能识别有效的数据结构，请确认文件格式为 JSON 或 moments.ts 代码"}`
      );
    }
  }

  if (articles.length === 0) {
    throw new Error("未能从输入内容中识别出有效的文章或说说数据列表");
  }

  const sorted = articles.sort((a, b) => b.time - a.time);
  return {
    articles: sorted,
    stats: calculateImportStats(sorted),
  };
}

export type ArticleMediaType = "img" | "vid";

export interface ArticleMedia {
  type: ArticleMediaType;
  url: string;
}

export interface ArticleMusic {
  title: string;
  artist: string;
  url: string;
}

export type MomentContent = string | { zh: string; en: string };

export interface Article {
  time: number;
  content: string;
  media: ArticleMedia[];
  tags: string[];
  location: string;
  music?: ArticleMusic;
}

export interface ArticleDraft {
  id: string; // "new" or "article-{fingerprint}"
  article: Article;
  baseSha?: string;
  originalFingerprint?: string;
  updatedAt: number;
  isNew: boolean;
}

export interface ParseResult {
  articles: Article[];
  exportIdentifier: string; // e.g. "moments" or "articles" or "default"
  exportKind: "named" | "default";
  declarationKind: "const" | "let" | "var" | "default";
  arrayStartOffset: number;
  arrayEndOffset: number;
  articleRanges: Array<{
    start: number;
    end: number;
    fingerprint: string;
    article: Article;
  }>;
}

export interface PublishRequest {
  action: "create" | "update" | "delete";
  article?: Article;
  targetFingerprint?: string;
  baseSha: string;
  commitMessage?: string;
}

export interface PublishResponse {
  success: boolean;
  newSha: string;
  commitUrl?: string;
  commitMessage: string;
  articleCount: number;
}

export interface ConflictErrorResponse {
  error: "CONFLICT";
  message: string;
  remoteSha: string;
  clientBaseSha: string;
}

/**
 * Generates a stable deterministic fingerprint for an article to identify it
 * even if order or time is changed, based on initial creation signature.
 */
export function generateArticleFingerprint(article: Article): string {
  const mediaUrls = (article.media || []).map((m) => m.url).join(",");
  const tagsStr = (article.tags || []).join(",");
  const base = `${article.time}_${article.content.trim().slice(0, 40)}_${article.location}_${mediaUrls}_${tagsStr}`;
  // Simple quick 32-bit hash
  let hash = 0;
  for (let i = 0; i < base.length; i++) {
    const char = base.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `${article.time}-${Math.abs(hash).toString(36)}`;
}

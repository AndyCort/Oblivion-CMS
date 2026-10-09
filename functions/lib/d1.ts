import type { Article } from "../../src/types/article";

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
  exec(query: string): Promise<D1ExecResult>;
}

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  run<T = unknown>(): Promise<D1Result<T>>;
  all<T = unknown>(): Promise<D1Result<T>>;
}

export interface D1Result<T = unknown> {
  results?: T[];
  success: boolean;
  error?: string;
  meta?: Record<string, unknown>;
}

export interface D1ExecResult {
  count: number;
  duration: number;
}

export interface D1ArticleRow {
  time: number;
  content: string;
  media: string;
  tags: string;
  location: string;
  music: string | null;
  created_at: number;
  updated_at: number;
}

// In-memory fallback for local development or when D1 is not yet bound
let inMemoryArticles: Article[] = [
  {
    time: 1791400876000,
    content: `我从来都不是为了和谁在一起\n      我想要的是你能真心实意地告诉我\n      “我曾爱你”\n      “我依然爱你”\n      “我爱你”`,
    media: [],
    tags: ["日常", "随想"],
    location: "天府",
    music: {
      title: "Sorrow Love",
      artist: "Someone",
      url: "https://example.com/music",
    },
  },
  {
    time: 1789445239000,
    content: "好的结果也可以是一种诅咒，而坏的结果也许是一种缓冲。",
    media: [],
    tags: ["日常", "随想"],
    location: "Estonia",
    music: {
      title: "Sorrow Love",
      artist: "Someone",
      url: "https://example.com/music",
    },
  },
  {
    time: 1789122720000,
    content: "今天出去走了走。",
    media: [
      {
        type: "img",
        url: "https://raw.githubusercontent.com/AndyCort/PicGo/master/img/0497B09F-1CD0-40F7-82A1-9F719F5223A1_1_105_c.jpeg",
      },
      {
        type: "vid",
        url: "https://www.pexels.com/download/video/38417492/",
      },
    ],
    tags: ["日常", "随想"],
    location: "东京",
    music: {
      title: "Sorrow Love",
      artist: "Someone",
      url: "https://example.com/music",
    },
  },
  {
    time: 1789110240000,
    content: `如果本就走在与众不同的道路\n那就不该期望自己会有什么传统意义上、或是流行文化中的那种功成名就。`,
    media: [],
    tags: ["日常", "随想"],
    location: "Tokyo",
    music: {
      title: "Sorrow Love",
      artist: "Someone",
      url: "https://example.com/music",
    },
  },
];

/**
 * Computes a deterministic revision SHA from a list of articles.
 * Ensures consistent version tracking across worker isolates and serverless instances.
 */
export function computeArticlesSha(articles: Article[]): string {
  if (!articles || articles.length === 0) return "d1-empty-v1";
  const count = articles.length;
  let hash = 0;
  for (let i = 0; i < articles.length; i++) {
    const a = articles[i];
    const itemStr = `${a.time}|${a.location || ""}|${(a.tags || []).join(",")}|${(a.media || []).map((m) => m.url).join(",")}|${a.content || ""}|${a.music?.title || ""}`;
    for (let j = 0; j < itemStr.length; j++) {
      hash = (hash << 5) - hash + itemStr.charCodeAt(j);
      hash |= 0;
    }
  }
  const newest = articles[0]?.time || 0;
  return `d1-${count}-${newest.toString(16)}-${Math.abs(hash).toString(36)}`;
}

let schemaInitialized = false;

/**
 * Automatically creates the articles table and indexes if not present.
 */
export async function ensureD1Schema(db: D1Database): Promise<void> {
  if (schemaInitialized) return;

  const createTableSql = `
    CREATE TABLE IF NOT EXISTS articles (
      time INTEGER PRIMARY KEY,
      content TEXT NOT NULL DEFAULT '',
      media TEXT NOT NULL DEFAULT '[]',
      tags TEXT NOT NULL DEFAULT '[]',
      location TEXT NOT NULL DEFAULT '',
      music TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `;
  const createIndexSql = `
    CREATE INDEX IF NOT EXISTS idx_articles_time ON articles(time DESC);
  `;

  try {
    await db.exec(createTableSql);
    await db.exec(createIndexSql);
    schemaInitialized = true;
  } catch (err) {
    console.warn("D1 schema init warning:", err);
  }
}

/**
 * Parse a SQLite database row into a structured Article object
 */
export function rowToArticle(row: D1ArticleRow): Article {
  let media = [];
  try {
    media = JSON.parse(row.media || "[]");
  } catch {}

  let tags = [];
  try {
    tags = JSON.parse(row.tags || "[]");
  } catch {}

  let music = undefined;
  if (row.music) {
    try {
      music = JSON.parse(row.music);
    } catch {}
  }

  return {
    time: Number(row.time),
    content: row.content || "",
    media,
    tags,
    location: row.location || "",
    music,
  };
}

/**
 * Fetch all articles from Cloudflare D1 (or in-memory mock if D1 is not bound)
 */
export async function getD1Articles(env: Record<string, any>): Promise<{
  articles: Article[];
  sha: string;
  isD1: boolean;
}> {
  const db: D1Database | undefined = env.DB;

  if (db && typeof db.prepare === "function") {
    await ensureD1Schema(db);

    const query = await db
      .prepare("SELECT * FROM articles ORDER BY time DESC")
      .all<D1ArticleRow>();

    const rows = query.results || [];

    // If database is completely empty on first launch, auto-seed with initial articles
    if (rows.length === 0 && inMemoryArticles.length > 0) {
      for (const a of inMemoryArticles) {
        await saveD1Article(env, a, true);
      }
      const seeded = [...inMemoryArticles].sort((a, b) => b.time - a.time);
      return {
        articles: seeded,
        sha: computeArticlesSha(seeded),
        isD1: true,
      };
    }

    const articles = rows.map(rowToArticle);

    return {
      articles,
      sha: computeArticlesSha(articles),
      isD1: true,
    };
  }

  // Fallback when D1 is not bound
  const fallback = [...inMemoryArticles].sort((a, b) => b.time - a.time);
  return {
    articles: fallback,
    sha: computeArticlesSha(fallback),
    isD1: false,
  };
}

/**
 * Save / Create an article in Cloudflare D1
 */
export async function saveD1Article(
  env: Record<string, any>,
  article: Article,
  isInsert = true
): Promise<string> {
  const db: D1Database | undefined = env.DB;
  const now = Date.now();

  const mediaJson = JSON.stringify(article.media || []);
  const tagsJson = JSON.stringify(article.tags || []);
  const musicJson = article.music ? JSON.stringify(article.music) : null;

  if (db && typeof db.prepare === "function") {
    await ensureD1Schema(db);

    if (isInsert) {
      await db
        .prepare(
          `INSERT OR REPLACE INTO articles 
           (time, content, media, tags, location, music, created_at, updated_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          article.time,
          article.content || "",
          mediaJson,
          tagsJson,
          article.location || "",
          musicJson,
          article.time,
          now
        )
        .run();
    } else {
      await db
        .prepare(
          `UPDATE articles 
           SET content = ?, media = ?, tags = ?, location = ?, music = ?, updated_at = ? 
           WHERE time = ?`
        )
        .bind(
          article.content || "",
          mediaJson,
          tagsJson,
          article.location || "",
          musicJson,
          now,
          article.time
        )
        .run();
    }

    const { sha } = await getD1Articles(env);
    return sha;
  }

  // In-memory fallback
  const existingIdx = inMemoryArticles.findIndex((a) => a.time === article.time);
  if (existingIdx >= 0) {
    inMemoryArticles[existingIdx] = article;
  } else {
    inMemoryArticles.unshift(article);
  }
  return computeArticlesSha(inMemoryArticles);
}

/**
 * Update an existing article in Cloudflare D1
 */
export async function updateD1Article(
  env: Record<string, any>,
  targetTime: number,
  article: Article
): Promise<string> {
  const db: D1Database | undefined = env.DB;
  const now = Date.now();

  const mediaJson = JSON.stringify(article.media || []);
  const tagsJson = JSON.stringify(article.tags || []);
  const musicJson = article.music ? JSON.stringify(article.music) : null;

  if (db && typeof db.prepare === "function") {
    await ensureD1Schema(db);

    // If the timestamp itself was updated, update all fields including time
    const updateResult = await db
      .prepare(
        `UPDATE articles 
         SET time = ?, content = ?, media = ?, tags = ?, location = ?, music = ?, updated_at = ? 
         WHERE time = ?`
      )
      .bind(
        article.time,
        article.content || "",
        mediaJson,
        tagsJson,
        article.location || "",
        musicJson,
        now,
        targetTime
      )
      .run();

    // If targetTime was not found in D1, fallback to insert/replace to prevent data loss
    if (updateResult.meta && updateResult.meta.changes === 0) {
      await saveD1Article(env, article, true);
    }

    const { sha } = await getD1Articles(env);
    return sha;
  }

  // In-memory fallback
  const existingIdx = inMemoryArticles.findIndex((a) => a.time === targetTime);
  if (existingIdx >= 0) {
    inMemoryArticles[existingIdx] = article;
  } else {
    inMemoryArticles.unshift(article);
  }
  return computeArticlesSha(inMemoryArticles);
}

/**
 * Delete an article in Cloudflare D1 by timestamp
 */
export async function deleteD1Article(
  env: Record<string, any>,
  targetTime: number
): Promise<string> {
  const db: D1Database | undefined = env.DB;

  if (db && typeof db.prepare === "function") {
    await ensureD1Schema(db);

    await db
      .prepare("DELETE FROM articles WHERE time = ?")
      .bind(targetTime)
      .run();

    const { sha } = await getD1Articles(env);
    return sha;
  }

  // In-memory fallback
  inMemoryArticles = inMemoryArticles.filter((a) => a.time !== targetTime);
  return computeArticlesSha(inMemoryArticles);
}

/**
 * Extract timestamp from fingerprint or numeric string
 */
export function extractTimeFromFingerprint(targetFingerprint: string): number {
  const match = targetFingerprint.match(/^(\d+)/);
  if (match) {
    return Number(match[1]);
  }
  const parsed = Number(targetFingerprint);
  return Number.isNaN(parsed) ? 0 : parsed;
}

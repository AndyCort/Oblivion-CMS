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

export class D1HttpClient implements D1Database {
  private accountId: string;
  private databaseId: string;
  private apiToken: string;

  constructor(accountId: string, databaseId: string, apiToken: string) {
    this.accountId = accountId;
    this.databaseId = databaseId;
    this.apiToken = apiToken;
  }

  private async querySql<T = unknown>(sql: string, params: unknown[] = []): Promise<D1Result<T>> {
    const url = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/d1/database/${this.databaseId}/query`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sql,
        params,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      let msg = errText;
      try {
        const json = JSON.parse(errText);
        msg = json.errors?.[0]?.message || errText;
      } catch {}
      throw new Error(`Cloudflare D1 API 错误 (${res.status}): ${msg}`);
    }

    const data: any = await res.json();
    if (!data.success) {
      const msg = data.errors?.[0]?.message || "D1 执行失败";
      throw new Error(`D1 API: ${msg}`);
    }

    const firstResult = data.result?.[0] || {};
    return {
      results: (firstResult.results as T[]) || [],
      success: true,
      meta: firstResult.meta,
    };
  }

  prepare(query: string): D1PreparedStatement {
    const self = this;
    let boundParams: unknown[] = [];

    const stmt: D1PreparedStatement = {
      bind(...values: unknown[]) {
        boundParams = values;
        return stmt;
      },
      async first<T = unknown>(colName?: string): Promise<T | null> {
        const res = await self.querySql<any>(query, boundParams);
        const first = res.results?.[0];
        if (!first) return null;
        if (colName) return first[colName] ?? null;
        return first;
      },
      async run<T = unknown>(): Promise<D1Result<T>> {
        return await self.querySql<T>(query, boundParams);
      },
      async all<T = unknown>(): Promise<D1Result<T>> {
        return await self.querySql<T>(query, boundParams);
      },
    };
    return stmt;
  }

  async batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]> {
    const results: D1Result<T>[] = [];
    for (const stmt of statements) {
      results.push(await stmt.run<T>());
    }
    return results;
  }

  async exec(query: string): Promise<D1ExecResult> {
    const statements = query
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    let count = 0;
    for (const sql of statements) {
      const res = await this.querySql(sql);
      count += Number(res.meta?.changes || 0);
    }
    return { count, duration: 0 };
  }
}

/**
 * Resolves the active D1 database connection (native binding or HTTP REST API direct client)
 */
export function getD1Database(env: Record<string, any>): {
  db: D1Database | null;
  mode: "native" | "http" | "mock";
  bindingName?: string;
} {
  // 1. Check standard uppercase env.DB first
  if (env.DB && typeof env.DB.prepare === "function") {
    return { db: env.DB, mode: "native", bindingName: "DB" };
  }

  // 2. Scan all environment keys for any object with .prepare (handles 'db', 'd1', 'D1', custom db names, etc.)
  for (const [key, val] of Object.entries(env)) {
    if (val && typeof val === "object" && typeof (val as any).prepare === "function") {
      return { db: val as D1Database, mode: "native", bindingName: key };
    }
  }

  // 3. Cloudflare D1 REST API direct connection (for local dev or remote direct connection)
  const accountId = env.CF_ACCOUNT_ID || env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = env.CF_D1_DATABASE_ID || env.D1_DATABASE_ID;
  const apiToken = env.CF_API_TOKEN || env.CLOUDFLARE_API_TOKEN;

  if (accountId && databaseId && apiToken) {
    return {
      db: new D1HttpClient(accountId, databaseId, apiToken),
      mode: "http",
      bindingName: "REST API",
    };
  }

  // 4. Fallback mock only for unit testing or when explicitly enabled
  return { db: null, mode: "mock" };
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

  try {
    await db
      .prepare(
        `CREATE TABLE IF NOT EXISTS articles (
          time INTEGER PRIMARY KEY,
          content TEXT NOT NULL DEFAULT '',
          media TEXT NOT NULL DEFAULT '[]',
          tags TEXT NOT NULL DEFAULT '[]',
          location TEXT NOT NULL DEFAULT '',
          music TEXT,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        )`
      )
      .run();

    await db
      .prepare(`CREATE INDEX IF NOT EXISTS idx_articles_time ON articles(time DESC)`)
      .run();

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
  d1Mode: "native" | "http" | "mock";
  bindingName?: string;
  warning?: string;
  envKeys?: string[];
}> {
  const { db, mode, bindingName } = getD1Database(env);

  const envKeys = Object.keys(env).filter(
    (k) =>
      !k.toLowerCase().includes("token") &&
      !k.toLowerCase().includes("secret") &&
      !k.toLowerCase().includes("password")
  );

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
        d1Mode: mode,
        bindingName,
      };
    }

    const articles = rows.map(rowToArticle);

    return {
      articles,
      sha: computeArticlesSha(articles),
      isD1: true,
      d1Mode: mode,
      bindingName,
    };
  }

  // Fallback when D1 is not bound
  const fallback = [...inMemoryArticles].sort((a, b) => b.time - a.time);
  return {
    articles: fallback,
    sha: computeArticlesSha(fallback),
    isD1: false,
    d1Mode: "mock",
    bindingName,
    envKeys,
    warning: "未检测到 Cloudflare D1 数据库绑定。当前处于只读模拟模式，数据不会写入真实 D1。",
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
  const { db } = getD1Database(env);
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

  // If in production mode and D1 is not bound, DO NOT fake success!
  if (env.DEV_MODE !== "true") {
    throw new Error(
      "未检测到 Cloudflare D1 数据库绑定！请在 Cloudflare Pages 控制台（Settings -> Functions -> D1 database bindings）将 D1 数据库绑定为变量名 'DB'，或在环境变量中配置 CF_D1_DATABASE_ID，然后重新部署。"
    );
  }

  // In-memory fallback ONLY for unit tests
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
  const { db } = getD1Database(env);
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

  // If in production mode and D1 is not bound, DO NOT fake success!
  if (env.DEV_MODE !== "true") {
    throw new Error(
      "未检测到 Cloudflare D1 数据库绑定！请在 Cloudflare Pages 控制台（Settings -> Functions -> D1 database bindings）将 D1 数据库绑定为变量名 'DB'，或在环境变量中配置 CF_D1_DATABASE_ID，然后重新部署。"
    );
  }

  // In-memory fallback ONLY for unit tests
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
  const { db } = getD1Database(env);

  if (db && typeof db.prepare === "function") {
    await ensureD1Schema(db);

    await db
      .prepare("DELETE FROM articles WHERE time = ?")
      .bind(targetTime)
      .run();

    const { sha } = await getD1Articles(env);
    return sha;
  }

  // If in production mode and D1 is not bound, DO NOT fake success!
  if (env.DEV_MODE !== "true") {
    throw new Error(
      "未检测到 Cloudflare D1 数据库绑定！请在 Cloudflare Pages 控制台（Settings -> Functions -> D1 database bindings）将 D1 数据库绑定为变量名 'DB'，或在环境变量中配置 CF_D1_DATABASE_ID，然后重新部署。"
    );
  }

  // In-memory fallback ONLY for unit tests
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

/**
 * Batch import articles into Cloudflare D1
 * @param env Cloudflare Pages env
 * @param articles Array of Article objects to import
 * @param mode "merge" (insert or update) | "overwrite" (wipe database first)
 */
export async function batchImportD1Articles(
  env: Record<string, any>,
  articles: Article[],
  mode: "merge" | "overwrite" = "merge"
): Promise<{ count: number; total: number; sha: string }> {
  const { db } = getD1Database(env);

  // Validate and sanitize articles
  const validArticles = articles.filter(
    (a) => a && typeof a.time === "number" && !isNaN(a.time) && a.time > 0
  );

  if (validArticles.length === 0) {
    throw new Error("没有有效的时间戳文章可供导入");
  }

  if (db && typeof db.prepare === "function") {
    await ensureD1Schema(db);

    if (mode === "overwrite") {
      await db.prepare("DELETE FROM articles").run();
    }

    // Cloudflare D1 batch has a limit of 100 statements per call. Chunk by 80.
    const CHUNK_SIZE = 80;
    const now = Date.now();
    for (let i = 0; i < validArticles.length; i += CHUNK_SIZE) {
      const chunk = validArticles.slice(i, i + CHUNK_SIZE);
      const statements = chunk.map((article) => {
        const mediaJson = JSON.stringify(article.media || []);
        const tagsJson = JSON.stringify(article.tags || []);
        const musicJson = article.music ? JSON.stringify(article.music) : null;
        return db
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
          );
      });
      await db.batch(statements);
    }

    const { articles: allArticles, sha } = await getD1Articles(env);
    return {
      count: validArticles.length,
      total: allArticles.length,
      sha,
    };
  }

  // If in production mode and D1 is not bound, reject!
  if (env.DEV_MODE !== "true") {
    throw new Error(
      "未检测到 Cloudflare D1 数据库绑定！请在 Cloudflare Pages 控制台（Settings -> Functions -> D1 database bindings）将 D1 数据库绑定为变量名 'DB'，或在环境变量中配置 CF_D1_DATABASE_ID，然后重新部署。"
    );
  }

  // In-memory fallback ONLY for unit tests
  if (mode === "overwrite") {
    inMemoryArticles = [...validArticles].sort((a, b) => b.time - a.time);
  } else {
    const map = new Map<number, Article>();
    for (const a of inMemoryArticles) {
      map.set(a.time, a);
    }
    for (const a of validArticles) {
      map.set(a.time, a);
    }
    inMemoryArticles = Array.from(map.values()).sort((a, b) => b.time - a.time);
  }

  return {
    count: validArticles.length,
    total: inMemoryArticles.length,
    sha: computeArticlesSha(inMemoryArticles),
  };
}

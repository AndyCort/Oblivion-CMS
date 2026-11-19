import {
  DEFAULT_MOCK_ARTICLES,
  type Article,
} from "../../src/types/article";

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

  private async querySql<T = unknown>(
    sql: string,
    params: unknown[] = [],
  ): Promise<D1Result<T>> {
    const url = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/d1/database/${this.databaseId}/query`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sql, params }),
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
        return colName ? (first[colName] ?? null) : first;
      },
      async run<T = unknown>(): Promise<D1Result<T>> {
        return self.querySql<T>(query, boundParams);
      },
      async all<T = unknown>(): Promise<D1Result<T>> {
        return self.querySql<T>(query, boundParams);
      },
    };
    return stmt;
  }

  async batch<T = unknown>(
    statements: D1PreparedStatement[],
  ): Promise<D1Result<T>[]> {
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
 * Safely verifies if an object is an actual Cloudflare D1 Database binding
 * and NOT a Service Binding (Worker RPC Proxy) or ASSETS fetcher.
 */
export function isD1DatabaseInstance(key: string, val: any): boolean {
  if (!val || typeof val !== "object") return false;

  const upperKey = key.toUpperCase();
  if (
    upperKey === "ASSETS" ||
    upperKey === "CF_PAGES" ||
    upperKey === "PAGES" ||
    upperKey === "STATIC_CONTENT" ||
    upperKey.startsWith("__")
  ) {
    return false;
  }

  // Service Bindings, Workers, and Asset fetchers expose .fetch; native D1 never does.
  if (typeof val.fetch === "function") return false;
  if (typeof val.prepare !== "function") return false;
  // Exclude R2 buckets (which expose .head)
  if (typeof val.head === "function") return false;

  return true;
}

function visibleEnvKeys(env: Record<string, any>): string[] {
  return Object.keys(env).filter(
    (k) =>
      !k.toLowerCase().includes("token") &&
      !k.toLowerCase().includes("secret") &&
      !k.toLowerCase().includes("password"),
  );
}

export function getD1UnboundErrorMessage(
  env: Record<string, any>,
  serviceBindingWarning?: string,
): string {
  if (serviceBindingWarning) return serviceBindingWarning;
  return `未检测到 Cloudflare D1 数据库绑定！当前容器检测到的配置键: [${visibleEnvKeys(env).join(", ")}]。请在 Cloudflare Pages 控制台（Settings -> Functions -> D1 database bindings）将 D1 数据库绑定为变量名 'DB'，并重新部署（Deployments -> Retry deployment）。`;
}

export function getD1Database(env: Record<string, any>): {
  db: D1Database | null;
  mode: "native" | "http" | "mock";
  bindingName?: string;
  serviceBindingWarning?: string;
} {
  let serviceBindingWarning: string | undefined;
  const candidateNames = [
    "DB",
    "db",
    "d1",
    "D1",
    "database",
    "DATABASE",
    "DB_PROD",
    "d1_db",
  ];

  for (const name of candidateNames.slice(0, 6)) {
    if (
      env[name] &&
      typeof env[name] === "object" &&
      typeof env[name].fetch === "function"
    ) {
      serviceBindingWarning = `检测到环境变量 '${name}' 绑定的是 Service binding (Worker RPC)，而非 D1 数据库绑定！请前往 Cloudflare Pages 设置中的 'D1 database bindings' 区域添加 D1 绑定，并删除该错误的 Service binding。`;
      break;
    }
  }

  for (const name of candidateNames) {
    if (isD1DatabaseInstance(name, env[name])) {
      return { db: env[name] as D1Database, mode: "native", bindingName: name };
    }
  }

  for (const [key, val] of Object.entries(env)) {
    if (key === "BLOG_DB") continue; // Reserved for Posts; never use it as Moments DB.
    if (isD1DatabaseInstance(key, val)) {
      return { db: val as D1Database, mode: "native", bindingName: key };
    }
  }

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

  return { db: null, mode: "mock", serviceBindingWarning };
}

let inMemoryArticles: Article[] = structuredClone(DEFAULT_MOCK_ARTICLES);

export function computeArticlesSha(articles: Article[]): string {
  if (!articles || articles.length === 0) return "d1-empty-v1";
  let hash = 0;
  for (const a of articles) {
    const itemStr = `${a.time}|${a.location || ""}|${(a.tags || []).join(",")}|${(a.media || []).map((m) => m.url).join(",")}|${a.content || ""}|${a.music?.title || ""}`;
    for (let j = 0; j < itemStr.length; j++) {
      hash = (hash << 5) - hash + itemStr.charCodeAt(j);
      hash |= 0;
    }
  }
  const newest = articles[0]?.time || 0;
  return `d1-${articles.length}-${newest.toString(16)}-${Math.abs(hash).toString(36)}`;
}

export type D1ArticleTable = "articles" | "oblivion_cms_moments";
const schemaInitializations = new WeakMap<D1Database, Promise<D1ArticleTable>>();
const requiredArticleColumns = [
  "time",
  "content",
  "media",
  "tags",
  "location",
  "music",
  "created_at",
  "updated_at",
];

export async function ensureD1Schema(db: D1Database): Promise<D1ArticleTable> {
  let initialization = schemaInitializations.get(db);
  if (!initialization) {
    initialization = initializeD1Schema(db);
    schemaInitializations.set(db, initialization);
  }
  try {
    return await initialization;
  } catch (err) {
    if (schemaInitializations.get(db) === initialization) {
      schemaInitializations.delete(db);
    }
    throw err;
  }
}

async function tableColumns(
  db: D1Database,
  table: D1ArticleTable,
): Promise<string[]> {
  const info = await db
    .prepare(`PRAGMA table_info(${table})`)
    .all<{ name: string }>();
  return (info.results || []).map((column) => column.name);
}

async function initializeD1Schema(db: D1Database): Promise<D1ArticleTable> {
  const dedicatedColumns = await tableColumns(db, "oblivion_cms_moments");
  const legacyColumns =
    dedicatedColumns.length === 0 ? await tableColumns(db, "articles") : [];
  const table: D1ArticleTable =
    dedicatedColumns.length === 0 &&
    requiredArticleColumns.every((name) => legacyColumns.includes(name))
      ? "articles"
      : "oblivion_cms_moments";

  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS ${table} (
        time INTEGER PRIMARY KEY,
        content TEXT NOT NULL DEFAULT '',
        media TEXT NOT NULL DEFAULT '[]',
        tags TEXT NOT NULL DEFAULT '[]',
        location TEXT NOT NULL DEFAULT '',
        music TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )`,
    )
    .run();

  const columns = await tableColumns(db, table);
  const missing = requiredArticleColumns.filter(
    (name) => !columns.includes(name),
  );
  if (missing.length > 0) {
    throw new Error(
      `D1 表 ${table} 结构不兼容，缺少字段: ${missing.join(", ")}。` +
        `现有字段: ${columns.join(", ") || "（无）"}。` +
        `请执行 PRAGMA table_info(${table}); 检查表结构后进行数据迁移。` +
        "重复执行 CREATE TABLE IF NOT EXISTS 不会更新已有表结构；现有数据未被修改。",
    );
  }

  await db
    .prepare(
      `CREATE INDEX IF NOT EXISTS idx_${table}_time ON ${table}(time DESC)`,
    )
    .run();
  return table;
}

function parseJsonField<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function rowToArticle(row: D1ArticleRow): Article {
  return {
    time: Number(row.time),
    content: row.content || "",
    media: parseJsonField(row.media, []),
    tags: parseJsonField(row.tags, []),
    location: row.location || "",
    music: parseJsonField(row.music, undefined),
  };
}

function serializeArticleFields(article: Article) {
  return {
    content: article.content || "",
    mediaJson: JSON.stringify(article.media || []),
    tagsJson: JSON.stringify(article.tags || []),
    location: article.location || "",
    musicJson: article.music ? JSON.stringify(article.music) : null,
  };
}

function assertDevModeForMockWrite(
  env: Record<string, any>,
  serviceBindingWarning?: string,
) {
  if (env.DEV_MODE !== "true") {
    throw new Error(getD1UnboundErrorMessage(env, serviceBindingWarning));
  }
}

async function upsertArticleRow(
  db: D1Database,
  table: D1ArticleTable,
  article: Article,
  now: number,
) {
  const { content, mediaJson, tagsJson, location, musicJson } =
    serializeArticleFields(article);
  await db
    .prepare(
      `INSERT OR REPLACE INTO ${table}
       (time, content, media, tags, location, music, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      article.time,
      content,
      mediaJson,
      tagsJson,
      location,
      musicJson,
      article.time,
      now,
    )
    .run();
}

export async function getD1Articles(env: Record<string, any>): Promise<{
  articles: Article[];
  sha: string;
  isD1: boolean;
  d1Mode: "native" | "http" | "mock";
  bindingName?: string;
  tableName?: D1ArticleTable;
  warning?: string;
  envKeys?: string[];
}> {
  const { db, mode, bindingName, serviceBindingWarning } = getD1Database(env);

  if (db && typeof db.prepare === "function") {
    const table = await ensureD1Schema(db);
    const query = await db
      .prepare(`SELECT * FROM ${table} ORDER BY time DESC`)
      .all<D1ArticleRow>();
    const articles = (query.results || []).map(rowToArticle);

    return {
      articles,
      sha: computeArticlesSha(articles),
      isD1: true,
      d1Mode: mode,
      bindingName,
      tableName: table,
    };
  }

  const fallback = [...inMemoryArticles].sort((a, b) => b.time - a.time);
  return {
    articles: fallback,
    sha: computeArticlesSha(fallback),
    isD1: false,
    d1Mode: "mock",
    bindingName,
    envKeys: visibleEnvKeys(env),
    warning:
      serviceBindingWarning ||
      "未检测到 Cloudflare D1 数据库绑定。当前处于只读模拟模式，数据不会写入真实 D1。",
  };
}

export async function saveD1Article(
  env: Record<string, any>,
  article: Article,
  isInsert = true,
): Promise<string> {
  const { db, serviceBindingWarning } = getD1Database(env);
  const now = Date.now();

  if (db && typeof db.prepare === "function") {
    const table = await ensureD1Schema(db);
    if (isInsert) {
      await upsertArticleRow(db, table, article, now);
    } else {
      const { content, mediaJson, tagsJson, location, musicJson } =
        serializeArticleFields(article);
      await db
        .prepare(
          `UPDATE ${table}
           SET content = ?, media = ?, tags = ?, location = ?, music = ?, updated_at = ?
           WHERE time = ?`,
        )
        .bind(content, mediaJson, tagsJson, location, musicJson, now, article.time)
        .run();
    }
    return (await getD1Articles(env)).sha;
  }

  assertDevModeForMockWrite(env, serviceBindingWarning);
  const existingIdx = inMemoryArticles.findIndex((a) => a.time === article.time);
  if (existingIdx >= 0) {
    inMemoryArticles[existingIdx] = article;
  } else {
    inMemoryArticles.unshift(article);
  }
  return computeArticlesSha(inMemoryArticles);
}

export async function updateD1Article(
  env: Record<string, any>,
  targetTime: number,
  article: Article,
): Promise<string> {
  const { db, serviceBindingWarning } = getD1Database(env);
  const now = Date.now();

  if (db && typeof db.prepare === "function") {
    const table = await ensureD1Schema(db);
    const { content, mediaJson, tagsJson, location, musicJson } =
      serializeArticleFields(article);
    const updateResult = await db
      .prepare(
        `UPDATE ${table}
         SET time = ?, content = ?, media = ?, tags = ?, location = ?, music = ?, updated_at = ?
         WHERE time = ?`,
      )
      .bind(
        article.time,
        content,
        mediaJson,
        tagsJson,
        location,
        musicJson,
        now,
        targetTime,
      )
      .run();

    if (updateResult.meta && updateResult.meta.changes === 0) {
      await upsertArticleRow(db, table, article, now);
    }
    return (await getD1Articles(env)).sha;
  }

  assertDevModeForMockWrite(env, serviceBindingWarning);
  const existingIdx = inMemoryArticles.findIndex((a) => a.time === targetTime);
  if (existingIdx >= 0) {
    inMemoryArticles[existingIdx] = article;
  } else {
    inMemoryArticles.unshift(article);
  }
  return computeArticlesSha(inMemoryArticles);
}

export async function deleteD1Article(
  env: Record<string, any>,
  targetTime: number,
): Promise<string> {
  const { db, serviceBindingWarning } = getD1Database(env);

  if (db && typeof db.prepare === "function") {
    const table = await ensureD1Schema(db);
    await db
      .prepare(`DELETE FROM ${table} WHERE time = ?`)
      .bind(targetTime)
      .run();
    return (await getD1Articles(env)).sha;
  }

  assertDevModeForMockWrite(env, serviceBindingWarning);
  inMemoryArticles = inMemoryArticles.filter((a) => a.time !== targetTime);
  return computeArticlesSha(inMemoryArticles);
}

export function extractTimeFromFingerprint(targetFingerprint: string): number {
  const match = targetFingerprint.match(/^(\d+)/);
  if (match) return Number(match[1]);
  const parsed = Number(targetFingerprint);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export async function batchImportD1Articles(
  env: Record<string, any>,
  articles: Article[],
  mode: "merge" | "overwrite" = "merge",
): Promise<{ count: number; total: number; sha: string }> {
  const { db, serviceBindingWarning } = getD1Database(env);
  const validArticles = articles.filter(
    (a) => a && typeof a.time === "number" && !isNaN(a.time) && a.time > 0,
  );

  if (validArticles.length === 0) {
    throw new Error("没有有效的时间戳文章可供导入");
  }

  if (db && typeof db.prepare === "function") {
    const table = await ensureD1Schema(db);
    if (mode === "overwrite") {
      await db.prepare(`DELETE FROM ${table}`).run();
    }

    // D1 RPC rejects db.batch(statements); use 10-row chunks (80 params <= 100 limit).
    const CHUNK_SIZE = 10;
    const now = Date.now();
    for (let i = 0; i < validArticles.length; i += CHUNK_SIZE) {
      const chunk = validArticles.slice(i, i + CHUNK_SIZE);
      const placeholders = chunk
        .map(() => "(?, ?, ?, ?, ?, ?, ?, ?)")
        .join(", ");
      const sql = `INSERT OR REPLACE INTO ${table}
        (time, content, media, tags, location, music, created_at, updated_at)
        VALUES ${placeholders}`;

      const params: unknown[] = [];
      for (const a of chunk) {
        const { content, mediaJson, tagsJson, location, musicJson } =
          serializeArticleFields(a);
        params.push(
          a.time,
          content,
          mediaJson,
          tagsJson,
          location,
          musicJson,
          a.time,
          now,
        );
      }

      try {
        await db.prepare(sql).bind(...params).run();
      } catch {
        for (const a of chunk) {
          await upsertArticleRow(db, table, a, now);
        }
      }
    }

    const { articles: allArticles, sha } = await getD1Articles(env);
    return { count: validArticles.length, total: allArticles.length, sha };
  }

  assertDevModeForMockWrite(env, serviceBindingWarning);
  if (mode === "overwrite") {
    inMemoryArticles = [...validArticles].sort((a, b) => b.time - a.time);
  } else {
    const map = new Map<number, Article>();
    for (const a of inMemoryArticles) map.set(a.time, a);
    for (const a of validArticles) map.set(a.time, a);
    inMemoryArticles = Array.from(map.values()).sort((a, b) => b.time - a.time);
  }

  return {
    count: validArticles.length,
    total: inMemoryArticles.length,
    sha: computeArticlesSha(inMemoryArticles),
  };
}

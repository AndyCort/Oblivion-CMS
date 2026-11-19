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

interface D1Result<T = unknown> {
  results?: T[];
  success: boolean;
  error?: string;
  meta?: Record<string, unknown>;
}

interface D1ExecResult {
  count: number;
  duration: number;
}

interface D1MomentRow {
  time: number;
  content: string;
  media: string;
  tags: string;
  location: string;
  music: string | null;
  updated_at?: number;
}

export class MomentHttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/** Rejects Service Bindings (.fetch), R2 buckets (.head), and non-D1 objects. */
export function isD1DatabaseInstance(key: string, val: unknown): boolean {
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
  const candidate = val as Record<string, unknown>;
  if (typeof candidate.fetch === "function") return false;
  if (typeof candidate.head === "function") return false;
  return typeof candidate.prepare === "function";
}

export function getMomentsDb(env: Record<string, any>): {
  db: D1Database | null;
  warning?: string;
} {
  if (env.DB === undefined || env.DB === null) {
    return { db: null };
  }
  if (
    typeof env.DB === "object" &&
    typeof env.DB.fetch === "function"
  ) {
    return {
      db: null,
      warning:
        "检测到 'DB' 绑定的是 Service binding (Worker RPC)，而非 D1 数据库绑定！请在 Cloudflare Pages 设置中将 D1 数据库绑定为 'DB'。",
    };
  }
  if (!isD1DatabaseInstance("DB", env.DB)) {
    return {
      db: null,
      warning: "环境变量 'DB' 不是有效的 Cloudflare D1 数据库绑定。",
    };
  }
  return { db: env.DB as D1Database };
}

const schemaReady = new WeakMap<D1Database, Promise<void>>();

export async function ensureMomentsSchema(db: D1Database): Promise<void> {
  let pending = schemaReady.get(db);
  if (!pending) {
    pending = (async () => {
      await db
        .prepare(
          `CREATE TABLE IF NOT EXISTS oblivion_cms_moments (
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
      await db
        .prepare(
          "CREATE INDEX IF NOT EXISTS idx_oblivion_cms_moments_time ON oblivion_cms_moments(time DESC)",
        )
        .run();
    })();
    schemaReady.set(db, pending);
  }
  try {
    await pending;
  } catch (err) {
    if (schemaReady.get(db) === pending) {
      schemaReady.delete(db);
    }
    throw err;
  }
}

function parseJsonField<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function rowToMoment(row: D1MomentRow): Article {
  return {
    time: Number(row.time),
    content: row.content || "",
    media: parseJsonField(row.media, []),
    tags: parseJsonField(row.tags, []),
    location: row.location || "",
    music: parseJsonField(row.music, undefined),
  };
}

function serializeMoment(moment: Article) {
  return {
    content: moment.content || "",
    mediaJson: JSON.stringify(moment.media || []),
    tagsJson: JSON.stringify(moment.tags || []),
    location: moment.location || "",
    musicJson: moment.music ? JSON.stringify(moment.music) : null,
  };
}

function isUniqueConstraintError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return /unique|constraint|primary key/i.test(msg);
}

const mockMoments = new Map<number, Article>();
let mockUpdatedAt = 0;

function requireMockWriteAllowed(env: Record<string, any>, warning?: string) {
  if (env.DEV_MODE !== "true") {
    throw new MomentHttpError(
      503,
      warning || "未检测到 Cloudflare D1 数据库绑定 'DB'，无法写入数据。",
    );
  }
}

export async function listMoments(env: Record<string, any>): Promise<{
  moments: Article[];
  isD1: boolean;
  total: number;
  revision: string;
  warning?: string;
}> {
  const { db, warning } = getMomentsDb(env);
  if (db) {
    await ensureMomentsSchema(db);
    const res = await db
      .prepare(
        "SELECT time, content, media, tags, location, music, updated_at FROM oblivion_cms_moments ORDER BY time DESC",
      )
      .all<D1MomentRow>();
    const rows = res.results || [];
    const maxUpdated = rows.reduce(
      (max, r) => Math.max(max, Number(r.updated_at) || 0),
      0,
    );
    return {
      moments: rows.map(rowToMoment),
      isD1: true,
      total: rows.length,
      revision: `d1-${rows.length}-${maxUpdated}`,
    };
  }

  if (env.DEV_MODE === "true") {
    const sorted = [...mockMoments.values()].sort((a, b) => b.time - a.time);
    return {
      moments: sorted,
      isD1: false,
      total: sorted.length,
      revision: `mock-${sorted.length}-${mockUpdatedAt}`,
      warning: warning || "当前处于本地模拟模式，说说仅保存在服务端临时内存中。",
    };
  }

  return {
    moments: [],
    isD1: false,
    total: 0,
    revision: "d1-unbound",
    warning:
      warning || "未检测到 Cloudflare D1 数据库绑定 'DB'。请前往 Pages 设置绑定后重新部署。",
  };
}

export async function upsertMoment(
  env: Record<string, any>,
  moment: Article,
  originalTime?: number,
): Promise<{ moment: Article; total: number }> {
  const { db, warning } = getMomentsDb(env);
  const now = Date.now();

  if (db) {
    await ensureMomentsSchema(db);
    const { content, mediaJson, tagsJson, location, musicJson } =
      serializeMoment(moment);

    try {
      if (originalTime === undefined) {
        await db
          .prepare(
            `INSERT INTO oblivion_cms_moments
             (time, content, media, tags, location, music, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          )
          .bind(
            moment.time,
            content,
            mediaJson,
            tagsJson,
            location,
            musicJson,
            moment.time,
            now,
          )
          .run();
      } else {
        const result = await db
          .prepare(
            `UPDATE oblivion_cms_moments
             SET time = ?, content = ?, media = ?, tags = ?, location = ?, music = ?, updated_at = ?
             WHERE time = ?`,
          )
          .bind(
            moment.time,
            content,
            mediaJson,
            tagsJson,
            location,
            musicJson,
            now,
            originalTime,
          )
          .run();
        if (result.meta && Number(result.meta.changes) === 0) {
          throw new MomentHttpError(404, "目标说说不存在，可能已被删除");
        }
      }
    } catch (err) {
      if (err instanceof MomentHttpError) throw err;
      if (isUniqueConstraintError(err)) {
        throw new MomentHttpError(409, "相同时间的说说已存在");
      }
      throw err;
    }

    const countRow = await db
      .prepare("SELECT COUNT(*) AS total FROM oblivion_cms_moments")
      .first<{ total: number }>();
    return { moment, total: Number(countRow?.total || 0) };
  }

  requireMockWriteAllowed(env, warning);

  if (originalTime === undefined) {
    if (mockMoments.has(moment.time)) {
      throw new MomentHttpError(409, "相同时间的说说已存在");
    }
    mockMoments.set(moment.time, structuredClone(moment));
  } else {
    if (!mockMoments.has(originalTime)) {
      throw new MomentHttpError(404, "目标说说不存在，可能已被删除");
    }
    if (moment.time !== originalTime && mockMoments.has(moment.time)) {
      throw new MomentHttpError(409, "相同时间的说说已存在");
    }
    if (moment.time !== originalTime) {
      mockMoments.delete(originalTime);
    }
    mockMoments.set(moment.time, structuredClone(moment));
  }
  mockUpdatedAt = now;
  return { moment, total: mockMoments.size };
}

export async function deleteMoment(
  env: Record<string, any>,
  time: number,
): Promise<{ total: number }> {
  const { db, warning } = getMomentsDb(env);

  if (db) {
    await ensureMomentsSchema(db);
    const result = await db
      .prepare("DELETE FROM oblivion_cms_moments WHERE time = ?")
      .bind(time)
      .run();
    if (result.meta && Number(result.meta.changes) === 0) {
      throw new MomentHttpError(404, "目标说说不存在，可能已被删除");
    }
    const countRow = await db
      .prepare("SELECT COUNT(*) AS total FROM oblivion_cms_moments")
      .first<{ total: number }>();
    return { total: Number(countRow?.total || 0) };
  }

  requireMockWriteAllowed(env, warning);
  if (!mockMoments.delete(time)) {
    throw new MomentHttpError(404, "目标说说不存在，可能已被删除");
  }
  mockUpdatedAt = Date.now();
  return { total: mockMoments.size };
}

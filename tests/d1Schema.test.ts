import { DatabaseSync } from "node:sqlite";
import { afterEach, describe, expect, it } from "vitest";
import { ensureD1Schema, getD1Articles, saveD1Article, updateD1Article, deleteD1Article, batchImportD1Articles, type D1Database, type D1PreparedStatement } from "../functions/lib/d1";
import { onRequestGet } from "../functions/api/articles";
import { onRequestPost } from "../functions/api/publish";

const connections: DatabaseSync[] = [];
function database() {
  const sqlite = new DatabaseSync(":memory:");
  connections.push(sqlite);
  const queries: string[] = [];
  const db: D1Database = {
    prepare(sql) {
      queries.push(sql);
      let params: any[] = [];
      const statement: D1PreparedStatement = {
        bind(...values) { params = values; return statement; },
        async run() {
          const result = sqlite.prepare(sql).run(...params);
          return { success: true, meta: { changes: Number(result.changes) } };
        },
        async all<T>() {
          return { success: true, results: sqlite.prepare(sql).all(...params) as T[] };
        },
        async first<T>(column?: string) {
          const row = sqlite.prepare(sql).get(...params);
          return (column ? row?.[column] : row) as T ?? null;
        },
      };
      return statement;
    },
    async batch(statements) { return Promise.all(statements.map((stmt) => stmt.run())); },
    async exec(sql) { sqlite.exec(sql); return { count: 0, duration: 0 }; },
  };
  return { db, sqlite, queries };
}

afterEach(() => { for (const db of connections.splice(0)) db.close(); });

const cmsColumns = "time INTEGER PRIMARY KEY, content TEXT, media TEXT, tags TEXT, location TEXT, music TEXT, created_at INTEGER, updated_at INTEGER";
const blogSchema = `CREATE TABLE articles (
  id TEXT PRIMARY KEY, title TEXT NOT NULL DEFAULT '', summary TEXT NOT NULL DEFAULT '',
  author TEXT NOT NULL DEFAULT '', date TEXT NOT NULL DEFAULT '', tags TEXT NOT NULL DEFAULT '[]',
  cover TEXT NOT NULL DEFAULT '', pinned INTEGER NOT NULL DEFAULT 0, content TEXT NOT NULL DEFAULT '',
  chars INTEGER NOT NULL DEFAULT 0, updated_at TEXT NOT NULL DEFAULT (datetime('now')), source_path TEXT
)`;

describe("D1 schema compatibility using SQLite", () => {
  it("creates an empty dedicated table and shares concurrent checks", async () => {
    const { db, sqlite, queries } = database();
    expect(await Promise.all([ensureD1Schema(db), ensureD1Schema(db)])).toEqual(["oblivion_cms_moments", "oblivion_cms_moments"]);
    expect(sqlite.prepare("PRAGMA table_info(oblivion_cms_moments)").all().map((row) => row.name)).toContain("time");
    expect(queries.filter((sql) => sql.startsWith("CREATE TABLE"))).toHaveLength(1);
    expect((await getD1Articles({ DB: db })).articles).toEqual([]);
  });

  it("reproduces the reported error and preserves blog data throughout CMS CRUD and overwrite import", async () => {
    const { db, sqlite } = database();
    sqlite.exec(blogSchema);
    sqlite.exec("INSERT INTO articles (id, title, content, source_path) VALUES ('blog-1', 'My blog', 'Keep me', 'posts/blog.md')");
    const original = sqlite.prepare("SELECT * FROM articles").all();
    expect(() => sqlite.prepare("SELECT * FROM articles ORDER BY time DESC").all()).toThrow("no such column: time");
    const env = { DB: db };
    expect((await getD1Articles(env)).articles).toEqual([]);
    const moment = { time: 123, content: "moment", media: [], tags: [], location: "" };
    await saveD1Article(env, moment);
    expect((await getD1Articles(env)).articles[0].content).toBe("moment");
    await updateD1Article(env, 123, { ...moment, time: 456, content: "edited" });
    expect((await getD1Articles(env)).articles[0].time).toBe(456);
    await batchImportD1Articles(env, [{ ...moment, time: 789 }], "overwrite");
    expect((await getD1Articles(env)).articles.map((a) => a.time)).toEqual([789]);
    await deleteD1Article(env, 789);
    expect((await getD1Articles(env)).articles).toEqual([]);
    expect(sqlite.prepare("SELECT * FROM articles").all()).toEqual(original);
  });

  it("continues using a compatible legacy CMS table", async () => {
    const { db, sqlite } = database();
    sqlite.exec(`CREATE TABLE articles (${cmsColumns}); INSERT INTO articles (time, content) VALUES (123, 'legacy')`);
    expect(await ensureD1Schema(db)).toBe("articles");
    expect((await getD1Articles({ DB: db })).articles[0].content).toBe("legacy");
    expect(sqlite.prepare("PRAGMA table_info(oblivion_cms_moments)").all()).toEqual([]);
  });

  it("checks each database independently", async () => {
    const first = database();
    first.sqlite.exec(`CREATE TABLE articles (${cmsColumns})`);
    expect(await ensureD1Schema(first.db)).toBe("articles");
    const second = database();
    second.sqlite.exec(blogSchema);
    expect(await ensureD1Schema(second.db)).toBe("oblivion_cms_moments");
  });

  it("retries a failed check after the dedicated schema has been repaired", async () => {
    const { db, sqlite } = database();
    sqlite.exec(`CREATE TABLE oblivion_cms_moments (${cmsColumns.replace(', updated_at INTEGER', '')})`);
    await expect(ensureD1Schema(db)).rejects.toThrow("缺少字段: updated_at");
    sqlite.exec("ALTER TABLE oblivion_cms_moments ADD COLUMN updated_at INTEGER");
    await expect(ensureD1Schema(db)).resolves.toBe("oblivion_cms_moments");
  });

  it("returns JSON diagnostics if the dedicated table itself is incompatible", async () => {
    const { db, sqlite } = database();
    sqlite.exec("CREATE TABLE oblivion_cms_moments (id INTEGER PRIMARY KEY)");
    const env = { DB: db, DEV_MODE: "true", ALLOW_LOCAL_MOCK_AUTH: "true" };
    const read = await onRequestGet({ env, request: new Request("http://localhost/api/articles") });
    expect(read.status).toBe(500);
    expect((await read.json()).error).toContain("PRAGMA table_info(oblivion_cms_moments)");
    const write = await onRequestPost({ env, request: new Request("http://localhost/api/publish", {
      method: "POST", body: JSON.stringify({ action: "create", baseSha: "", article: { time: 123, content: "new" } }),
    }) });
    expect(write.status).toBe(500);
    expect((await write.json()).error).toContain("缺少字段: time");
  });
});

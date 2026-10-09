import { DatabaseSync } from 'node:sqlite';
import { afterEach, expect, it } from 'vitest';
import { handlePosts } from '../functions/lib/posts';
import { saveD1Article, getD1Articles, type D1Database, type D1PreparedStatement } from '../functions/lib/d1';
const connections: DatabaseSync[] = [];
afterEach(() => connections.splice(0).forEach(db => db.close()));
function database() {
  const sqlite = new DatabaseSync(':memory:'); connections.push(sqlite);
  const db: D1Database = {
    prepare(sql) {
      let params: any[] = [];
      const stmt: D1PreparedStatement = {
        bind(...args) { params = args; return stmt; },
        async run() { const result = sqlite.prepare(sql).run(...params); return { success: true, meta: { changes: Number(result.changes) } }; },
        async all<T>() { return { success: true, results: sqlite.prepare(sql).all(...params) as T[] }; },
        async first<T>(column?: string) { const row = sqlite.prepare(sql).get(...params); return (column ? row?.[column] : row) as T ?? null; },
      }; return stmt;
    },
    async batch(statements) { return Promise.all(statements.map(s => s.run())); },
    async exec(sql) { sqlite.exec(sql); return { count: 0, duration: 0 }; },
  }; return { db, sqlite };
}
it('blog D1 CRUD leaves Moments intact and preserves source paths on upsert', async () => {
  const { db, sqlite } = database();
  const env = { DB: db, DEV_MODE: 'true' };
  const request = (body?: unknown) => new Request('http://localhost/api/posts', body ? { method: 'POST', body: JSON.stringify(body) } : {});
  const post = { id: 'first-post', title: 'first', summary: '', content: 'Body', date: '2026-10-09', tags: ['tag'] };
  expect((await handlePosts({ env, request: request({ post }) }, 'publish')).status).toBe(200);
  await saveD1Article(env, { time: 123, content: 'Moment', media: [], tags: [], location: '' });
  sqlite.prepare('UPDATE articles SET source_path = ? WHERE id = ?').run('posts/first.md', post.id);
  expect((await handlePosts({ env, request: request({ post: { ...post, title: 'Changed' }, originalId: post.id }) }, 'publish')).status).toBe(200);
  const list = await handlePosts({ env, request: request() }, 'list');
  expect(await list.json()).toMatchObject({ total: 1, mode: 'd1' });
  const get = await handlePosts({ env, request: request(), params: { id: post.id } }, 'get');
  const data = await get.json();
  expect(data).toMatchObject({ title: 'Changed', tags: ['tag'], chars: 4 });
  expect(data).not.toHaveProperty('source_path');
  expect(sqlite.prepare('SELECT source_path FROM articles').get()?.source_path).toBe('posts/first.md');
  expect((await handlePosts({ env, request: request(), params: { id: post.id } }, 'delete')).status).toBe(200);
  expect(sqlite.prepare('SELECT COUNT(*) AS count FROM articles').get()?.count).toBe(0);
  expect((await getD1Articles(env)).articles).toHaveLength(1);
});
it('refuses a legacy moment articles table without changing rows', async () => {
  const { db, sqlite } = database();
  sqlite.exec("CREATE TABLE articles (time INTEGER PRIMARY KEY, content TEXT); INSERT INTO articles VALUES (1,'keep')");
  const response = await handlePosts({ env: { DB: db, DEV_MODE: 'true' }, request: new Request('http://localhost/api/posts') }, 'list');
  expect(response.status).toBe(503);
  expect(sqlite.prepare('SELECT content FROM articles').get()?.content).toBe('keep');
});
it('round-trips bilingual JSON through D1, editing only one language and retaining source_path', async () => {
  const { db, sqlite } = database();
  const env = { DB: db, DEV_MODE: 'true' };
  const post = { id: 'bilingual', title: { zh: '中文标题', en: 'English' }, summary: { zh: '中文摘要', en: '' }, content: { zh: '中文内容', en: 'English body', ja: '本文' }, date: '2026-07-24 15:07:59', tags: [] };
  const request = (body?: unknown) => new Request('http://localhost/api/posts', body ? { method: 'POST', body: JSON.stringify(body) } : {});
  expect((await handlePosts({ env, request: request({ post }) }, 'publish')).status).toBe(200);
  sqlite.prepare('UPDATE articles SET source_path = ? WHERE id = ?').run('blog/bi.md', post.id);
  const list = await handlePosts({ env, request: request() }, 'list');
  expect((await list.json()).posts[0].title).toEqual(post.title);
  const get = await handlePosts({ env, request: request(), params: { id: post.id } }, 'get');
  const data = await get.json(); expect(data).toMatchObject(post);
  data.content.en = 'Updated English';
  expect((await handlePosts({ env, request: request({ post: data, originalId: post.id }) }, 'publish')).status).toBe(200);
  const stored = sqlite.prepare('SELECT * FROM articles WHERE id = ?').get(post.id)!;
  expect(JSON.parse(String(stored.content))).toEqual({ ...post.content, en: 'Updated English' });
  expect(stored.date).toBe(post.date);
  expect(stored.source_path).toBe('blog/bi.md');
});

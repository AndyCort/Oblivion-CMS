import { verifyBlogAccess } from './access';
import { getD1Database, type D1Database } from './d1';
import { validatePost, type BlogPost } from '../../src/types/post';

type Env = Record<string, any>;
type Context = { request: Request; env: Env; params?: Record<string, string | string[]> };
class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) { super(message); this.status = status; }
}
const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
const mockPosts = new Map<string, BlogPost>();
export const postSchema = `CREATE TABLE IF NOT EXISTS articles (
 id TEXT PRIMARY KEY, source_path TEXT, title TEXT NOT NULL DEFAULT '', summary TEXT NOT NULL DEFAULT '',
 content TEXT NOT NULL DEFAULT '', date TEXT NOT NULL DEFAULT '', tags TEXT NOT NULL DEFAULT '[]',
 cover TEXT NOT NULL DEFAULT '', author TEXT NOT NULL DEFAULT '', pinned INTEGER NOT NULL DEFAULT 0,
 chars INTEGER NOT NULL DEFAULT 0, updated_at TEXT NOT NULL DEFAULT (datetime('now')))`;
function normalize(row: any): BlogPost {
  // Do not silently flatten localized content: it cannot be safely round-tripped by this editor.
  for (const key of ['title', 'summary', 'content']) {
    if (row[key] !== undefined && (typeof row[key] !== 'string' || /^\s*\{\s*"(?:zh|en)"\s*:/.test(row[key]))) throw new HttpError(422, '此文章包含多语言字段，请使用博客原有发布工具编辑');
  }
  return { ...row, content: row.content ?? '', tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags || [], pinned: !!row.pinned };
}
async function worker(env: Env, path: string, body?: unknown): Promise<any> {
  const url = new URL(path, String(env.BLOG_WORKER_URL).replace(/\/+$/, '') + '/');
  if (url.protocol !== 'https:' && !['localhost', '127.0.0.1'].includes(url.hostname)) throw new HttpError(503, 'BLOG_WORKER_URL 必须使用 HTTPS');
  // Unique read URLs avoid a stale activeIds snapshot from an edge cache.
  if (!body) url.searchParams.set('_cms', crypto.randomUUID());
  const res = await fetch(url, { method: body ? 'POST' : 'GET', redirect: 'error', signal: AbortSignal.timeout(20000), headers: { Accept: 'application/json', ...(body ? { 'Content-Type': 'application/json', 'x-publish-secret': env.BLOG_PUBLISH_SECRET } : { 'Cache-Control': 'no-cache' }) }, ...(body ? { body: JSON.stringify(body) } : {}) });
  if (!res.ok) throw new HttpError(res.status === 404 ? 404 : 502, `博客 Worker 请求失败 (${res.status})`);
  const data = await res.json() as any;
  if (body && data.ok !== true && data.success !== true) throw new HttpError(502, '博客 Worker 未确认发布成功');
  return data;
}
async function database(env: Env): Promise<D1Database | null> {
  const { db } = getD1Database(env);
  if (db) {
    await db.prepare(postSchema).run();
    const columns = await db.prepare('PRAGMA table_info(articles)').all<{ name: string }>();
    if (!columns.results?.some(c => c.name === 'id')) throw new HttpError(503, 'articles 表仍为旧动态结构，请先迁移动态数据');
  }
  return db;
}
export async function handlePosts(context: Context, action: 'list' | 'get' | 'publish' | 'delete'): Promise<Response> {
  const { request, env } = context;
  const auth = await verifyBlogAccess(request, env);
  if (!auth.user || auth.error) return json({ error: auth.error || 'Unauthorized' }, auth.status);
  try {
    const remote = !!env.BLOG_WORKER_URL;
    if (remote && (action === 'publish' || action === 'delete') && !env.BLOG_PUBLISH_SECRET) throw new HttpError(503, '请配置 BLOG_PUBLISH_SECRET');
    const db = remote ? null : await database(env);
    const mock = !remote && !db;
    if (mock && !auth.user.isMock) throw new HttpError(503, '请配置博客 Worker 或 D1 数据库');
    const list = async (): Promise<any[]> => remote ? (await worker(env, '/api/articles')).articles : db ? (await db.prepare('SELECT * FROM articles ORDER BY pinned DESC, date DESC, id ASC').all()).results || [] : [...mockPosts.values()];
    const detail = async (id: string): Promise<BlogPost> => {
      const row = remote ? await worker(env, `/api/articles/${encodeURIComponent(id)}`) : db ? await db.prepare('SELECT * FROM articles WHERE id = ?').bind(id).first() : mockPosts.get(id);
      if (!row) throw new HttpError(404, '文章不存在');
      return normalize(row);
    };
    if (action === 'list') {
      const url = new URL(request.url);
      const rawPage = Number(url.searchParams.get('page'));
      const page = Number.isFinite(rawPage) ? Math.max(1, Math.floor(rawPage) || 1) : 1;
      const rawSize = Number(url.searchParams.get('pageSize'));
      const pageSize = Number.isFinite(rawSize) ? Math.min(50, Math.max(1, Math.floor(rawSize) || 20)) : 20;
      const q = (url.searchParams.get('q') || '').toLowerCase();
      const rows = (await list()).filter(p => JSON.stringify([p.id, p.title, p.summary, p.tags]).toLowerCase().includes(q)).sort((a,b) => Number(b.pinned) - Number(a.pinned) || String(b.date).localeCompare(String(a.date)) || a.id.localeCompare(b.id));
      return json({ posts: rows.slice((page - 1) * pageSize, page * pageSize).map(p => ({ ...p, content: undefined, source_path: undefined })), total: rows.length, page, pageSize, mode: remote ? 'worker' : mock ? 'mock' : 'd1', warning: mock ? '本地模拟：发布数据仅在内存中，刷新或重启可能丢失。' : !remote ? 'D1 直连模式不会清除博客 Worker 边缘缓存。' : undefined });
    }
    const id = String(context.params?.id || '');
    if (action === 'get') { const p = await detail(id); return json({ ...p, source_path: undefined }); }
    let post: BlogPost | undefined;
    let originalId: string | undefined;
    if (action === 'publish') {
      let body: any;
      try { body = await request.json(); post = validatePost(body.post); } catch (err) { throw new HttpError(400, err instanceof Error ? err.message : '无效 JSON'); }
      originalId = body.originalId;
      if (originalId !== undefined && (typeof originalId !== 'string' || originalId !== post.id)) throw new HttpError(400, '已发布文章的 Slug 不可更改，请新建文章');
    }
    const rows = await list();
    const target = action === 'delete' ? id : post!.id;
    const exists = rows.some(p => p.id === target);
    if ((action === 'delete' || originalId) && !exists) throw new HttpError(404, '文章不存在');
    if (post && !originalId && exists) throw new HttpError(409, 'Slug 已存在，请更换链接 ID');
    if (remote) {
      // This Worker has full-sync semantics; sending only the current ID would delete other posts.
      const activeIds = rows.map(p => p.id).filter(v => action !== 'delete' || v !== id);
      if (post && !activeIds.includes(post.id)) activeIds.push(post.id);
      // Existing source_path is private in Worker responses. Recover it from the same D1 binding
      // when available, otherwise block edits of existing posts to avoid breaking raw-file mappings.
      let sourcePath: string | undefined;
      if (post && exists) {
        const binding = getD1Database(env).db;
        if (!binding) throw new HttpError(503, '编辑现有文章需要绑定博客同一 D1，以保留 source_path 文件映射');
        const row = await binding.prepare('SELECT source_path FROM articles WHERE id = ?').bind(post.id).first<{ source_path: string | null }>();
        if (!row) throw new HttpError(409, 'D1 绑定与博客 Worker 数据不一致');
        sourcePath = row.source_path || undefined;
      }
      await worker(env, '/api/publish', { articles: post ? [{ ...post, ...(sourcePath ? { sourcePath } : {}) }] : [], activeIds });
    } else if (db) {
      const stmt = post ? db.prepare(`INSERT INTO articles (id,title,summary,content,date,tags,cover,author,pinned,chars,updated_at)
        VALUES (?,?,?,?,?,?,?,?,?,?,datetime('now')) ON CONFLICT(id) DO UPDATE SET title=excluded.title,summary=excluded.summary,content=excluded.content,date=excluded.date,tags=excluded.tags,cover=excluded.cover,author=excluded.author,pinned=excluded.pinned,chars=excluded.chars,updated_at=datetime('now')`).bind(post.id,post.title,post.summary,post.content,post.date,JSON.stringify(post.tags),post.cover,post.author,post.pinned ? 1 : 0,post.chars) : db.prepare('DELETE FROM articles WHERE id = ?').bind(id);
      const result = await stmt.run();
      if (!result.success) throw new HttpError(500, 'D1 写入失败');
    } else if (post) mockPosts.set(post.id, post); else mockPosts.delete(id);
    return json({ success: true, post, mode: remote ? 'worker' : mock ? 'mock' : 'd1' });
  } catch (err) {
    return json({ error: err instanceof HttpError ? err.message : '博客操作失败，请检查 Worker / D1 配置后重试' }, err instanceof HttpError ? err.status : 500);
  }
}

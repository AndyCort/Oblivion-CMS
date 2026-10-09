import { filterPosts, postTagCounts } from '../../src/lib/postsList';
import { verifyBlogAccess } from './access';
import { getD1Database, isD1DatabaseInstance, type D1Database } from './d1';
import { validatePost, decodePostText, postTextFields, type PostText, type BlogPost } from '../../src/types/post';

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
  row = { ...row };
  try {
    for (const field of postTextFields) row[field] = decodePostText(row[field] ?? '');
  } catch {
    throw new HttpError(422, '文章标题、摘要或正文格式无效：需要文本或语言到文本的映射');
  }
  let tags: unknown = row.tags || [];
  if (typeof tags === 'string') {
    try { tags = JSON.parse(tags); } catch { throw new HttpError(422, '文章 tags 字段不是有效 JSON，请修复该文章的标签数据'); }
  }
  if (!Array.isArray(tags) || tags.some(t => typeof t !== 'string')) throw new HttpError(422, '文章 tags 字段必须为字符串数组');
  return { ...row, content: row.content ?? '', tags, pinned: !!row.pinned };
}
async function worker(env: Env, path: string, body?: unknown): Promise<any> {
  let url: URL;
  try {
    url = new URL(String(env.BLOG_WORKER_URL).trim());
  } catch {
    throw new HttpError(503, 'BLOG_WORKER_URL 格式无效，请填写完整的 https:// Worker 根地址');
  }
  if (url.username || url.password || url.search || url.hash || !['', '/'].includes(url.pathname)) {
    throw new HttpError(503, 'BLOG_WORKER_URL 应为 Worker 根地址，不要包含 /api 路径、查询参数或账号密码');
  }
  if (url.protocol !== 'https:' && !(url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname))) throw new HttpError(503, 'BLOG_WORKER_URL 必须使用 HTTPS');
  url.pathname = path;
  // Unique read URLs avoid a stale activeIds snapshot from an edge cache.
  if (!body) url.searchParams.set('_cms', crypto.randomUUID());
  let res: Response;
  let data: any;
  try {
    res = await fetch(url, { method: body ? 'POST' : 'GET', redirect: 'manual', signal: AbortSignal.timeout(20000), headers: { Accept: 'application/json', ...(body ? { 'Content-Type': 'application/json', 'x-publish-secret': env.BLOG_PUBLISH_SECRET } : { 'Cache-Control': 'no-cache' }) }, ...(body ? { body: JSON.stringify(body) } : {}) });
    if (res.status >= 300 && res.status < 400) throw new HttpError(502, '博客 Worker 返回重定向，请检查 Worker 地址及其 Cloudflare Access 登录保护；CMS 不会将发布密钥转发到重定向地址');
    if (!res.ok) {
      const hint = res.status === 401 || res.status === 403
        ? body ? '请核对 BLOG_PUBLISH_SECRET 与 Worker 的 PUBLISH_SECRET，并检查 Worker 的 Access 策略' : '读取文章不使用发布密钥，请检查 Worker 的 Access 或访问限制'
        : res.status === 404 ? '请确认地址指向 oblivion-content，且已部署 /api/articles 和 /api/publish 接口'
        : '请查看 oblivion-content 的运行日志及 D1 绑定';
      throw new HttpError(res.status === 404 ? 404 : 502, `博客 Worker 请求失败 (${res.status})：${hint}`);
    }
    if (!(res.headers.get('Content-Type') || '').toLowerCase().includes('json')) throw new HttpError(502, '博客 Worker 返回了网页而非 JSON，请检查 BLOG_WORKER_URL 是否误填为博客前台或 CMS 地址，以及 Worker 是否要求 Access 登录');
    try { data = await res.json(); } catch (err) {
      if (err instanceof Error && ['TimeoutError', 'AbortError'].includes(err.name)) throw err;
      throw new HttpError(502, '博客 Worker 返回了无效 JSON，请检查已部署的 Worker 接口');
    }
  } catch (err) {
    if (err instanceof HttpError) throw err;
    if (err instanceof Error && ['TimeoutError', 'AbortError'].includes(err.name)) throw new HttpError(504, '博客 Worker 请求超时（20 秒），请检查 Worker 是否可访问；若正在发布，请先刷新列表确认结果');
    throw new HttpError(502, '无法连接博客 Worker，请检查 BLOG_WORKER_URL 的域名、DNS、证书和 Worker 是否已部署');
  }
  if (!data || typeof data !== 'object') throw new HttpError(502, '博客 Worker 响应格式不兼容：预期 JSON 对象');
  if (!body && path === '/api/articles' && (!Array.isArray(data.articles) || data.articles.some((p: any) => !p || typeof p.id !== 'string'))) throw new HttpError(502, '博客 Worker 列表格式不兼容：预期 { articles: [...] }，且每篇文章必须包含字符串 id');
  if (body && data.ok !== true && data.success !== true) throw new HttpError(502, '博客 Worker 未确认发布成功');
  return data;
}
const storeText = (value: PostText) => typeof value === 'string' ? value : JSON.stringify(value);
function blogDatabase(env: Env): D1Database | null {
  // A dedicated blog binding must never silently fall back to the Moments DB.
  if (env.BLOG_DB !== undefined) {
    if (!isD1DatabaseInstance('BLOG_DB', env.BLOG_DB)) throw new HttpError(503, 'BLOG_DB 必须是 D1 数据库绑定，不能是文本环境变量或 Worker Service binding');
    return env.BLOG_DB;
  }
  return getD1Database(env).db;
}
async function originalSourcePath(db: D1Database, id: string): Promise<string | undefined> {
  let row: { source_path: string | null } | null;
  try {
    row = await db.prepare('SELECT source_path FROM articles WHERE id = ?').bind(id).first<{ source_path: string | null }>();
  } catch (err) {
    const message = err instanceof Error ? err.message : '';
    if (/no such table/i.test(message)) throw new HttpError(503, '博客 D1 绑定中没有 articles 表。请在 CMS 的 D1 绑定中添加 BLOG_DB，选择 oblivion-content Worker 实际使用的同一数据库，然后重新部署；不要选择说说数据库');
    if (/no such column|has no column/i.test(message)) throw new HttpError(503, '博客 D1 的 articles 表缺少 id 或 source_path 字段。请先核对 BLOG_DB 是否指向 Worker 同一数据库；若确为同库，请核对博客 Worker 的表结构迁移。CMS 已停止发布，避免丢失原始文件映射');
    throw err;
  }
  if (!row) throw new HttpError(409, '博客 D1 中找不到 Worker 返回的文章，请确认 BLOG_DB 与 Worker 绑定的是同一数据库');
  return row.source_path || undefined;
}
async function database(env: Env): Promise<D1Database | null> {
  const db = blogDatabase(env);
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
  let stage = '读取博客配置';
  try {
    const remote = !!env.BLOG_WORKER_URL;
    if (remote && (action === 'publish' || action === 'delete') && !env.BLOG_PUBLISH_SECRET) throw new HttpError(503, '请配置 BLOG_PUBLISH_SECRET');
    stage = '检查博客 D1 表结构';
    const db = remote ? null : await database(env);
    const mock = !remote && !db;
    if (mock && !auth.user.isMock) throw new HttpError(503, '请配置博客 Worker 或 D1 数据库');
    const list = async (): Promise<any[]> => {
      stage = remote ? '读取 Worker 文章列表' : '读取 D1 文章列表';
      return remote ? (await worker(env, '/api/articles')).articles : db ? (await db.prepare('SELECT * FROM articles ORDER BY pinned DESC, date DESC, id ASC').all()).results || [] : [...mockPosts.values()];
    };
    const detail = async (id: string): Promise<BlogPost> => {
      stage = remote ? '读取 Worker 文章详情' : '读取 D1 文章详情';
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
      const all = (await list()).map(normalize);
      const rows = filterPosts(all, q, {
        tag: url.searchParams.get('tag') || undefined,
        coverOnly: url.searchParams.get('cover') === '1',
        sortOrder: url.searchParams.get('sort') === 'asc' ? 'asc' : 'desc',
      });
      return json({ posts: rows.slice((page - 1) * pageSize, page * pageSize).map(p => ({ ...p, content: undefined, source_path: undefined })), total: rows.length, tags: postTagCounts(all), page, pageSize, mode: remote ? 'worker' : mock ? 'mock' : 'd1', warning: mock ? '本地模拟：发布数据仅在内存中，刷新或重启可能丢失。' : !remote ? 'D1 直连模式不会清除博客 Worker 边缘缓存。' : undefined });
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
        const binding = blogDatabase(env);
        if (!binding) throw new HttpError(503, '编辑现有文章需要添加 BLOG_DB D1 绑定，选择博客 Worker 同一数据库，以保留 source_path 文件映射');
        stage = '读取 D1 原始文件映射';
        sourcePath = await originalSourcePath(binding, post.id);
      }
      stage = '发布到博客 Worker';
      await worker(env, '/api/publish', { articles: post ? [{ ...post, ...(sourcePath ? { sourcePath } : {}) }] : [], activeIds });
    } else if (db) {
      stage = '写入博客 D1';
      const stmt = post ? db.prepare(`INSERT INTO articles (id,title,summary,content,date,tags,cover,author,pinned,chars,updated_at)
        VALUES (?,?,?,?,?,?,?,?,?,?,datetime('now')) ON CONFLICT(id) DO UPDATE SET title=excluded.title,summary=excluded.summary,content=excluded.content,date=excluded.date,tags=excluded.tags,cover=excluded.cover,author=excluded.author,pinned=excluded.pinned,chars=excluded.chars,updated_at=datetime('now')`).bind(post.id,storeText(post.title),storeText(post.summary),storeText(post.content),post.date,JSON.stringify(post.tags),post.cover,post.author,post.pinned ? 1 : 0,post.chars) : db.prepare('DELETE FROM articles WHERE id = ?').bind(id);
      const result = await stmt.run();
      if (!result.success) throw new HttpError(500, 'D1 写入失败');
    } else if (post) mockPosts.set(post.id, post); else mockPosts.delete(id);
    return json({ success: true, post, mode: remote ? 'worker' : mock ? 'mock' : 'd1' });
  } catch (err) {
    if (err instanceof HttpError) return json({ error: err.message }, err.status);
    // Classify known driver errors without exposing upstream bodies, credentials or SQL values.
    const message = err instanceof Error ? err.message : '';
    const reason = /no such table|no such column|has no column/i.test(message)
      ? 'D1 表或字段缺失，请确认绑定的是博客同一数据库，且 articles 为博客表结构（包含 id、title、date、source_path 等字段）'
      : /unauthorized|forbidden|authentication|authorization|\b401\b|\b403\b/i.test(message)
      ? 'D1 访问被拒绝，请检查 D1 绑定或 REST API Token 的权限'
      : /constraint|unique/i.test(message)
      ? 'D1 数据约束冲突，请检查文章 ID 或原始文件映射是否重复'
      : '请检查对应 Worker / D1 的配置和运行日志';
    return json({ error: `${stage}失败：${reason}` }, 500);
  }
}

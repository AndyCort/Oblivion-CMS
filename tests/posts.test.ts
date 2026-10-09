import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { handlePosts } from '../functions/lib/posts';
import { validatePost, countChars, type BlogPost } from '../src/types/post';
import { verifyBlogAccess } from '../functions/lib/access';
const post: BlogPost = { id: 'hello-world', title: '你好', summary: '摘要', content: '# Hello\n你好世界 🌍', date: '2026-10-09', tags: ['博客'], pinned: false };
const env = { DEV_MODE: 'true', BLOG_WORKER_URL: 'https://content.example', BLOG_PUBLISH_SECRET: 'secret-server-only' };
const context = (action: string, body?: unknown, settings: Record<string, unknown> = env, id = '') => ({ request: new Request(`http://localhost/api/posts${action}`, { method: body ? 'POST' : action.startsWith('?') || !id ? 'GET' : 'DELETE', ...(body ? { body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } } : {}) }), env: settings, params: { id } });
afterEach(() => vi.unstubAllGlobals());
describe('blog validation', () => {
  it('normalizes tags and calculates Unicode character counts', () => {
    expect(countChars('你 好 🌍')).toBe(3);
    expect(validatePost({ ...post, tags: ['博客', ' 博客 '] })).toMatchObject({ chars: countChars(post.content), tags: ['博客'] });
  });
  it.each([{ id: '../bad' }, { date: '2026-02-30' }, { content: '' }, { title: '' }, { cover: 'javascript:alert(1)' }, { tags: [5] }, { pinned: 'false' }])('rejects invalid fields %j', patch => expect(() => validatePost({ ...post, ...patch })).toThrow());
});
describe('Worker bridge', () => {
  it('preserves every unrelated ID and sends the secret only on server-side publish', async () => {
    const calls: { url: string; options?: RequestInit }[] = [];
    vi.stubGlobal('fetch', vi.fn(async (url, options) => {
      calls.push({ url: String(url), options });
      return Response.json(options.method === 'POST' ? { ok: true, published: 1 } : { articles: [{ ...post, id: 'other-post' }] });
    }));
    const response = await handlePosts(context('/publish', { post }), 'publish');
    expect(response.status).toBe(200);
    const payload = JSON.parse(String(calls[1].options?.body));
    expect(payload.activeIds).toEqual(['other-post', 'hello-world']);
    expect(payload.articles).toHaveLength(1);
    expect(calls[0].url).toContain('_cms=');
    expect(calls[0].options?.headers).not.toHaveProperty('x-publish-secret');
    expect(calls[1].options?.headers).toHaveProperty('x-publish-secret', env.BLOG_PUBLISH_SECRET);
    expect(calls[1].options?.redirect).toBe('error');
    expect(await response.text()).not.toContain(env.BLOG_PUBLISH_SECRET);
  });
  it('deletes only the target through publish, including the last article', async () => {
    const fetcher = vi.fn(async (_url, options) => Response.json(options.method === 'POST' ? { ok: true } : { articles: [post] }));
    vi.stubGlobal('fetch', fetcher);
    expect((await handlePosts(context('', undefined, env, post.id), 'delete')).status).toBe(200);
    expect(JSON.parse(fetcher.mock.calls[1][1].body)).toEqual({ articles: [], activeIds: [] });
  });
  it('preserves private source_path when editing an imported article', async () => {
    const fetcher = vi.fn(async (_url, options) => Response.json(options.method === 'POST' ? { ok: true } : { articles: [post] }));
    vi.stubGlobal('fetch', fetcher);
    const db = { prepare: () => ({ bind: () => ({ first: async () => ({ source_path: 'blog/hello.md' }) }) }), batch: vi.fn(), exec: vi.fn() };
    const response = await handlePosts(context('/publish', { post, originalId: post.id }, { ...env, DB: db }), 'publish');
    expect(response.status).toBe(200);
    expect(JSON.parse(fetcher.mock.calls[1][1].body).articles[0].sourcePath).toBe('blog/hello.md');
  });
  it('does not downgrade failed Worker writes into mock success', async () => {
    vi.stubGlobal('fetch', vi.fn(async (_url, options) => options.method === 'POST' ? new Response('secret internal error', { status: 500 }) : Response.json({ articles: [] })));
    const response = await handlePosts(context('/publish', { post }), 'publish');
    expect(response.status).toBe(502);
    expect(await response.text()).not.toContain('secret internal error');
  });
  it('requires a secret before writing and rejects duplicate slugs', async () => {
    const fetcher = vi.fn(async () => Response.json({ articles: [post] }));
    vi.stubGlobal('fetch', fetcher);
    expect((await handlePosts(context('/publish', { post }, { ...env, BLOG_PUBLISH_SECRET: '' }), 'publish')).status).toBe(503);
    expect(fetcher).not.toHaveBeenCalled();
    expect((await handlePosts(context('/publish', { post }), 'publish')).status).toBe(409);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it('searches and paginates the Worker metadata', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => Response.json({ articles: Array.from({ length: 25 }, (_, i) => ({ ...post, id: `post-${i}` })) })));
    const response = await handlePosts(context('?page=2&pageSize=10&q=博客'), 'list');
    expect(await response.json()).toMatchObject({ total: 25, page: 2, pageSize: 10, posts: expect.any(Array) });
  });
  it('never accepts an unverified edge email as blog authorization', async () => {
    const result = await verifyBlogAccess(new Request('https://cms.example/api/posts', { headers: { 'cf-access-authenticated-user-email': 'spoof@example.com' } }), { CF_ACCESS_TEAM_DOMAIN: 'team', CF_ACCESS_AUD: 'aud' });
    expect(result.status).toBe(401);
  });
  it('does not allow a production host to enable mock auth', async () => {
    const response = await handlePosts({ request: new Request('https://cms.example/api/posts'), env: { DEV_MODE: 'true' } }, 'list');
    expect(response.status).toBe(503);
  });
});
describe('local mock lifecycle', () => {
  beforeEach(() => vi.unstubAllGlobals());
  it('creates, reads, edits, searches and deletes locally', async () => {
    const settings = { DEV_MODE: 'true' };
    expect((await handlePosts(context('/publish', { post }, settings), 'publish')).status).toBe(200);
    const read = await handlePosts(context('', undefined, settings, post.id), 'get');
    expect(await read.json()).toMatchObject(post);
    expect((await handlePosts(context('/publish', { post: { ...post, title: '修改后' }, originalId: post.id }, settings), 'publish')).status).toBe(200);
    const list = await handlePosts(context('?q=修改', undefined, settings), 'list');
    expect(await list.json()).toMatchObject({ total: 1, mode: 'mock' });
    expect((await handlePosts(context('', undefined, settings, post.id), 'delete')).status).toBe(200);
    expect((await handlePosts(context('', undefined, settings, post.id), 'get')).status).toBe(404);
  });
});

import { getDevMockToken } from './client';
import { validatePost, type BlogPost } from '../../types/post';
export interface PostList { posts: BlogPost[]; total: number; page: number; pageSize: number; mode: string; warning?: string }
const localPosts = new Map<string, BlogPost>();
async function request(path: string, method = 'GET', body?: unknown) {
  const token = getDevMockToken();
  const res = await fetch(`/api/posts${path}`, { method, headers: { Accept: 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(body ? { 'Content-Type': 'application/json' } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) });
  const type = res.headers.get('Content-Type') || '';
  if (['localhost', '127.0.0.1'].includes(window.location.hostname) && ((res.ok && type.includes('text/html')) || (res.status === 404 && !type.includes('json')))) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `请求失败 (${res.status})`);
  return data;
}
export async function fetchPosts(page = 1, q = ''): Promise<PostList> {
  const result = await request(`?page=${page}&q=${encodeURIComponent(q)}`);
  if (result) return result;
  const rows = [...localPosts.values()].filter(p => JSON.stringify([p.id, p.title, p.summary, p.tags]).toLowerCase().includes(q.toLowerCase())).sort((a,b) => Number(b.pinned) - Number(a.pinned) || b.date.localeCompare(a.date));
  return { posts: rows.slice((page-1)*20,page*20), total: rows.length, page, pageSize: 20, mode: 'mock', warning: '本地模拟：发布仅写入临时内存，刷新后丢失；草稿保存在此浏览器。' };
}
export async function fetchPost(id: string): Promise<BlogPost> {
  const result = await request(`/${encodeURIComponent(id)}`);
  if (result) return result;
  const p = localPosts.get(id);
  if (!p) throw new Error('文章不存在');
  return structuredClone(p);
}
export async function publishPost(post: BlogPost, originalId?: string): Promise<{ post: BlogPost; mode: string }> {
  const validated = validatePost(post);
  const result = await request('/publish', 'POST', { post: validated, originalId });
  if (result) return result;
  if (originalId && originalId !== validated.id) throw new Error('已发布文章的 Slug 不可更改');
  if (originalId && !localPosts.has(originalId)) throw new Error('文章不存在，模拟内存可能已重置');
  if (!originalId && localPosts.has(validated.id)) throw new Error('Slug 已存在');
  localPosts.set(validated.id, validated);
  return { post: validated, mode: 'mock' };
}
export async function deletePost(id: string): Promise<void> {
  if (!await request(`/${encodeURIComponent(id)}`, 'DELETE')) localPosts.delete(id);
}

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  tags: string[];
  cover?: string;
  author?: string;
  pinned?: boolean;
  chars?: number;
  updated_at?: string;
}
export interface PostDraft {
  id: string;
  post: BlogPost;
  originalId?: string;
  baseline: BlogPost;
  updatedAt: number;
}
export function countChars(content: string): number {
  return Array.from(content.replace(/\s/g, '')).length;
}
export function emptyPost(): BlogPost {
  const now = new Date();
  const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  return { id: '', title: '', summary: '', content: '', date, tags: [], pinned: false };
}
export function validatePost(value: unknown): BlogPost {
  const p = value as BlogPost;
  if (!p || typeof p !== 'object' || typeof p.id !== 'string' || !/^[a-z0-9]+(?:[-_][a-z0-9]+)*$/.test(p.id) || p.id.length > 150) throw new Error('Slug 必须为英文小写、数字、连字符或下划线，最多 150 字符');
  if (typeof p.title !== 'string' || !p.title.trim() || p.title.length > 300) throw new Error('请输入标题（最多 300 字符）');
  if (typeof p.content !== 'string' || !p.content.trim() || p.content.length > 2_000_000) throw new Error('请输入正文（最多 200 万字符）');
  if (typeof p.summary !== 'string' || !Array.isArray(p.tags) || p.tags.length > 50 || p.tags.some(t => typeof t !== 'string' || !t.trim() || t.length > 100)) throw new Error('摘要或标签格式不正确');
  if (typeof p.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(p.date) || !Number.isFinite(Date.parse(p.date)) || new Date(p.date).toISOString().slice(0, 10) !== p.date) throw new Error('发布日期无效');
  if (p.cover && (typeof p.cover !== 'string' || !/^https?:\/\//i.test(p.cover))) throw new Error('封面必须使用 HTTP(S) 地址');
  if (p.author !== undefined && typeof p.author !== 'string') throw new Error('作者格式不正确');
  if (p.pinned !== undefined && typeof p.pinned !== 'boolean') throw new Error('置顶格式不正确');
  return { id: p.id, title: p.title.trim(), summary: p.summary, content: p.content, date: p.date, tags: [...new Set(p.tags.map(t => t.trim()))], cover: p.cover || '', author: p.author || '', pinned: !!p.pinned, chars: countChars(p.content) };
}

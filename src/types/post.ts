export type PostText = string | Record<string, string>;
export type PostTextField = 'title' | 'summary' | 'content';
export const postTextFields: PostTextField[] = ['title', 'summary', 'content'];
export const isLanguageCode = (key: string) => /^[a-z]{2,3}(?:-[a-z0-9]{2,8})*$/i.test(key);
export function isLocalizedText(value: unknown): value is Record<string, string> {
  return !!value && typeof value === 'object' && !Array.isArray(value) &&
    Object.entries(value).every(([key, text]) => isLanguageCode(key) && typeof text === 'string');
}
// D1 stores language maps as JSON; ordinary Markdown/JSON examples remain strings.
export function decodePostText(value: unknown): PostText {
  if (typeof value === 'string') {
    try {
      const parsed: unknown = JSON.parse(value);
      if (isLocalizedText(parsed) && Object.keys(parsed).length) return parsed;
    } catch { /* ordinary text */ }
    return value;
  }
  if (isLocalizedText(value)) return value;
  throw new Error('标题、摘要和正文必须是文本或语言到文本的映射');
}
// Editors use exact selection, never a fallback that might overwrite another language.
export function textForLanguage(value: PostText, language: string): string {
  return typeof value === 'string' ? value : value[language] ?? '';
}
export function displayPostText(value: PostText, preferred = 'zh'): string {
  if (typeof value === 'string') return value;
  return value[preferred] || value.zh || value['zh-CN'] || value.en || Object.values(value).find(v => v.trim()) || '';
}
export function postLanguages(post: Pick<BlogPost, PostTextField>): string[] {
  return [...new Set(postTextFields.flatMap(field => typeof post[field] === 'string' ? [] : Object.keys(post[field])))];
}
export function preferredPostLanguage(post: Pick<BlogPost, PostTextField>): string {
  const languages = postLanguages(post);
  return ['zh', 'zh-CN', 'en'].find(code => languages.includes(code)) || languages[0] || 'zh';
}
export function updatePostText(value: PostText, language: string, text: string): PostText {
  return typeof value === 'string' ? text : { ...value, [language]: text };
}
export function addPostLanguage(post: BlogPost, language: string, sourceLanguage: string): BlogPost {
  if (!isLanguageCode(language)) throw new Error('请输入语言代码，如 zh、en、ja、zh-TW');
  const next = { ...post };
  for (const field of postTextFields) {
    const value = post[field];
    const map = typeof value === 'string' ? Object.fromEntries([...new Set([...postLanguages(post), sourceLanguage])].map(code => [code, value])) : value;
    next[field] = Object.hasOwn(map, language) ? { ...map } : { ...map, [language]: '' };
  }
  return next;
}
export function replacePostDateDay(date: string, day: string): string {
  return day ? day + date.slice(10) : '';
}
export function isPostDate(date: unknown): date is string {
  if (typeof date !== 'string') return false;
  const match = date.match(/^(\d{4}-\d{2}-\d{2})(?:[ T]([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d)(?:\.\d{1,3})?)?(?:Z|[+-](?:0\d|1[0-4]):[0-5]\d)?)?$/);
  if (!match) return false;
  const time = Date.parse(match[1]);
  return Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === match[1];
}
export interface BlogPost {
  id: string;
  title: PostText;
  summary: PostText;
  content: PostText;
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
export function countChars(content: PostText): number {
  return typeof content === 'string' ? Array.from(content.replace(/\s/g, '')).length : Object.values(content).reduce((sum, text) => sum + countChars(text), 0);
}
export function emptyPost(): BlogPost {
  const now = new Date();
  const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  return { id: '', title: '', summary: '', content: '', date, tags: [], pinned: false };
}
export function validatePost(value: unknown): BlogPost {
  const p = value as BlogPost;
  if (!p || typeof p !== 'object' || typeof p.id !== 'string' || !/^[a-z0-9]+(?:[-_][a-z0-9]+)*$/.test(p.id) || p.id.length > 150) throw new Error('Slug 必须为英文小写、数字、连字符或下划线，最多 150 字符');
  for (const field of postTextFields) {
    const value = p[field];
    if (typeof value !== 'string' && !isLocalizedText(value)) throw new Error(`${field} 必须是文本或语言到文本的映射`);
    const texts = typeof value === 'string' ? [value] : Object.values(value);
    if (texts.length > 30 || texts.some(text => text.length > (field === 'title' ? 300 : 2_000_000)) || texts.reduce((n, text) => n + text.length, 0) > 2_000_000) throw new Error(`${field} 超出长度限制`);
  }
  const languages = postLanguages(p);
  if (!(languages.length ? languages : ['zh']).some(language => textForLanguage(p.title, language).trim() && textForLanguage(p.content, language).trim())) throw new Error('至少一个语言版本需要同时填写标题和正文');
  if (!Array.isArray(p.tags) || p.tags.length > 50 || p.tags.some(t => typeof t !== 'string' || !t.trim() || t.length > 100)) throw new Error('标签格式不正确');
  if (!isPostDate(p.date)) throw new Error('发布日期无效');
  if (p.cover && (typeof p.cover !== 'string' || !/^https?:\/\//i.test(p.cover))) throw new Error('封面必须使用 HTTP(S) 地址');
  if (p.author !== undefined && typeof p.author !== 'string') throw new Error('作者格式不正确');
  if (p.pinned !== undefined && typeof p.pinned !== 'boolean') throw new Error('置顶格式不正确');
  return { id: p.id, title: typeof p.title === 'string' ? p.title.trim() : { ...p.title }, summary: p.summary, content: p.content, date: p.date, tags: [...new Set(p.tags.map(t => t.trim()))], cover: p.cover || '', author: p.author || '', pinned: !!p.pinned, chars: countChars(p.content) };
}

import type { BlogPost } from '../types/post';
export interface PostFilters { tag?: string; coverOnly?: boolean; sortOrder?: 'asc' | 'desc' }
export function matchesPost(post: BlogPost, query = '', filters: PostFilters = {}) {
  return (!filters.tag || post.tags.includes(filters.tag)) &&
    (!filters.coverOnly || Boolean(post.cover?.trim())) &&
    JSON.stringify([post.id, post.title, post.summary, post.tags]).toLowerCase().includes(query.trim().toLowerCase());
}
export function filterPosts(posts: BlogPost[], query = '', filters: PostFilters = {}) {
  return posts.filter(post => matchesPost(post, query, filters)).sort((a, b) =>
    Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)) ||
    (filters.sortOrder === 'asc' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)) || a.id.localeCompare(b.id));
}
export function postTagCounts(posts: BlogPost[]) {
  const counts = new Map<string, number>();
  for (const post of posts) for (const tag of new Set(post.tags)) counts.set(tag, (counts.get(tag) || 0) + 1);
  return [...counts].map(([tag, count]) => ({ tag, count })).sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

import { expect, it } from 'vitest';
import { filterPosts, postTagCounts } from '../src/lib/postsList';
import type { BlogPost } from '../src/types/post';
const posts: BlogPost[] = [
  { id: 'new', title: { zh: '春日', en: 'Spring' }, summary: '散步', content: '', date: '2026-03-02', tags: ['生活'], cover: 'https://example.com/a.jpg' },
  { id: 'old', title: '旧文', summary: '', content: '', date: '2026-01-01', tags: ['生活记录'] },
  { id: 'middle', title: '随笔', summary: '', content: '', date: '2026-02-01', tags: ['生活'] },
];
it('combines multilingual search, exact tag and cover filters', () => {
  expect(filterPosts(posts, ' SPRING ', { tag: '生活', coverOnly: true }).map(p => p.id)).toEqual(['new']);
  expect(filterPosts(posts, '', { tag: '生活' }).map(p => p.id)).toEqual(['new', 'middle']);
});
it('sorts the filtered collection without mutating it', () => {
  expect(filterPosts(posts, '', { sortOrder: 'asc' }).map(p => p.id)).toEqual(['old', 'middle', 'new']);
  expect(posts.map(p => p.id)).toEqual(['new', 'old', 'middle']);
});
it('keeps pinned articles first and counts tag facets across the collection', () => {
  expect(filterPosts([{ ...posts[2], pinned: true }, ...posts.slice(0, 2)])[0].id).toBe('middle');
  expect(postTagCounts(posts)).toEqual([{ tag: '生活', count: 2 }, { tag: '生活记录', count: 1 }]);
});

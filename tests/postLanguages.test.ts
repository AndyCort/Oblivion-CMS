import { expect, it } from 'vitest';
import { addPostLanguage, decodePostText, displayPostText, emptyPost, isPostDate, textForLanguage, updatePostText, validatePost, replacePostDateDay } from '../src/types/post';
const post = { ...emptyPost(), id: 'bilingual', title: { zh: '中文标题', en: 'English title' }, content: { zh: '中文正文', en: 'English body', ja: '本文' }, summary: { zh: '摘要', en: '' }, date: '2026-07-24 15:07:59' };
it('validates localized posts and preserves empty translations, whitespace and timestamps', () => {
  const result = validatePost(post);
  expect(result).toMatchObject(post);
  expect(result.chars).toBe(17);
  const padded = { ...post, title: { ...post.title, en: ' English title ' } };
  expect(validatePost(padded).title).toEqual(padded.title);
});
it('does not use display fallback in the editor or overwrite sibling languages', () => {
  expect(displayPostText({ en: 'English title' })).toBe('English title');
  expect(textForLanguage({ en: 'English title' }, 'zh')).toBe('');
  expect(updatePostText(post.content, 'en', 'New English')).toEqual({ zh: '中文正文', en: 'New English', ja: '本文' });
  expect(post.content.en).toBe('English body');
});
it('decodes language-map JSON from D1 without parsing ordinary JSON examples', () => {
  expect(decodePostText(JSON.stringify(post.title))).toEqual(post.title);
  expect(decodePostText('{"example":"code"}')).toBe('{"example":"code"}');
  expect(decodePostText('```json\n{"zh":"text"}\n```')).toBe('```json\n{"zh":"text"}\n```');
});
it('adds a language without overwriting existing translations or shared text', () => {
  const mixed = { ...post, summary: 'Shared summary' };
  const result = addPostLanguage(mixed, 'fr', 'en');
  expect(result.summary).toEqual({ zh: 'Shared summary', en: 'Shared summary', ja: 'Shared summary', fr: '' });
  expect(result.content).toEqual({ ...post.content, fr: '' });
  expect(addPostLanguage(post, 'en', 'zh').title).toEqual(post.title);
  const plain = { ...emptyPost(), title: 'Original', content: 'Plain' };
  expect(addPostLanguage(plain, 'en', 'zh').title).toEqual({ zh: 'Original', en: '' });
});
it.each([null, ['text'], { zh: 2 }, { zh: { en: 'nested' } }, JSON.parse('{"__proto__":"bad"}')])('rejects malformed localization maps: %j', content => {
  expect(() => validatePost({ ...post, content })).toThrow();
});
it('requires a title and body in at least one matching language', () => {
  expect(() => validatePost({ ...post, title: { en: 'English' }, content: { zh: '中文' } })).toThrow();
  expect(validatePost({ ...post, content: { zh: '中文', en: '' } }).content).toEqual({ zh: '中文', en: '' });
});
it.each(['2026-07-24', '2026-07-24 15:07:59', '2026-07-24T15:07:59.123Z', '2026-07-24T15:07:59+08:00'])('accepts and preserves supported date %s', date => {
  expect(isPostDate(date)).toBe(true);
  expect(validatePost({ ...post, date }).date).toBe(date);
  expect(replacePostDateDay(date, '2026-07-25')).toBe('2026-07-25' + date.slice(10));
});
it.each(['2026-02-30', '2026-07-24 25:00:00', '2026-07-24 12:99:00', 'bad-date'])('rejects invalid date %s', date => expect(isPostDate(date)).toBe(false));

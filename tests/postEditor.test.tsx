// @vitest-environment jsdom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import PostsWorkspace from '../src/components/posts/PostsWorkspace';
import { savePostDraft, deletePostDraft } from '../src/lib/storage/draftStore';
vi.mock('../src/lib/storage/draftStore', () => ({ getPostDrafts: vi.fn(async () => []), savePostDraft: vi.fn(async () => {}), deletePostDraft: vi.fn(async () => {}) }));
vi.mock('../src/lib/api/posts', () => ({ fetchPosts: vi.fn(async () => ({ posts: [], total: 0, mode: 'mock' })), fetchPost: vi.fn(), publishPost: vi.fn(async (post) => ({ post, mode: 'mock' })), deletePost: vi.fn() }));
let host: HTMLDivElement;
let root: Root;
beforeEach(async () => {
  vi.useFakeTimers(); vi.clearAllMocks();
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  host = document.createElement('div'); document.body.append(host); root = createRoot(host);
  await act(async () => root.render(<PostsWorkspace/>));
});
afterEach(async () => { await act(async () => root.unmount()); host.remove(); vi.useRealTimers(); });
async function fill(label: string, value: string) {
  await act(async () => {
    const input = host.querySelector(`[aria-label="${label}"]`)!;
    const proto = input instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, 'value')!.set!.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
}
async function click(text: string) { await act(async () => { const button = [...host.querySelectorAll('button')].find(b => b.textContent === text || b.getAttribute('aria-label') === text)!; button.click(); }); }
it('debounces saves for 700ms and flushes the old draft before changing articles', async () => {
  await fill('文章标题', 'First draft');
  await act(async () => { vi.advanceTimersByTime(699); });
  expect(savePostDraft).not.toHaveBeenCalled();
  await fill('文章标题', 'Latest draft');
  await click('新建文章');
  expect(savePostDraft).toHaveBeenCalledTimes(1);
  expect(vi.mocked(savePostDraft).mock.calls[0][0].post.title).toBe('Latest draft');
  expect((host.querySelector('[aria-label="文章标题"]') as HTMLInputElement).value).toBe('');
  await act(async () => { vi.advanceTimersByTime(1000); });
  expect(savePostDraft).toHaveBeenCalledTimes(1);
});
it('serializes pending saves before publishing and never recreates the cleared draft', async () => {
  await fill('文章标题', 'Publish test');
  await fill('Markdown 正文', 'Publish body');
  await click('发布文章');
  expect(savePostDraft).toHaveBeenCalledTimes(1);
  expect(deletePostDraft).toHaveBeenCalledTimes(1);
  await act(async () => { vi.advanceTimersByTime(1000); });
  expect(savePostDraft).toHaveBeenCalledTimes(1);
  expect(host.textContent).toContain('已发布到本地临时内存');
});
it('retains and retries a draft after a failed commit instead of switching away', async () => {
  vi.mocked(savePostDraft).mockRejectedValueOnce(new Error('disk full'));
  await fill('文章标题', 'Do not lose this');
  await click('新建文章');
  expect((host.querySelector('[aria-label="文章标题"]') as HTMLInputElement).value).toBe('Do not lose this');
  expect(host.textContent).toContain('disk full');
  await click('新建文章');
  expect(savePostDraft).toHaveBeenCalledTimes(2);
  expect(vi.mocked(savePostDraft).mock.calls[1][0].post.title).toBe('Do not lose this');
  expect((host.querySelector('[aria-label="文章标题"]') as HTMLInputElement).value).toBe('');
});

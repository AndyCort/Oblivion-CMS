import { beforeEach, afterEach, it, expect, vi } from 'vitest';
import { IDBFactory } from 'fake-indexeddb';
import { saveDraft, getAllDrafts, getDraft, deleteDraft, savePostDraft, getPostDrafts, deletePostDraft } from '../src/lib/storage/draftStore';
import { emptyPost } from '../src/types/post';
beforeEach(() => { const indexedDB = new IDBFactory(); vi.stubGlobal('window', { indexedDB }); vi.stubGlobal('indexedDB', indexedDB); });
afterEach(() => vi.unstubAllGlobals());
it('isolates same-ID moment and post drafts and commits deletion', async () => {
  const article = { time: 1, content: 'moment', media: [], tags: [], location: '' };
  const post = { ...emptyPost(), title: 'blog', content: 'post' };
  await saveDraft({ id: 'same', article, isNew: true, updatedAt: 0 });
  await savePostDraft({ id: 'same', post, baseline: emptyPost(), updatedAt: 0 });
  expect(await getAllDrafts()).toHaveLength(1);
  expect((await getDraft('same'))?.article.content).toBe('moment');
  expect((await getPostDrafts())[0].post.content).toBe('post');
  await deleteDraft('same');
  expect(await getAllDrafts()).toEqual([]);
  expect(await getPostDrafts()).toHaveLength(1);
  await deletePostDraft('same');
  expect(await getPostDrafts()).toEqual([]);
});
it('reads legacy moments and prefers namespaced drafts over legacy duplicates', async () => {
  const legacy = { id: 'legacy', article: { time: 1, content: 'old', media: [], tags: [], location: '' }, isNew: true, updatedAt: 1 };
  await getAllDrafts();
  await new Promise<void>((resolve, reject) => {
    const req = indexedDB.open('oblivion_cms_db', 1);
    req.onsuccess = () => { const db = req.result; const tx = db.transaction('drafts', 'readwrite'); tx.objectStore('drafts').put(legacy); tx.oncomplete = () => { db.close(); resolve(); }; tx.onerror = () => reject(tx.error); };
  });
  expect(await getDraft('legacy')).toMatchObject(legacy);
  await saveDraft({ ...legacy, article: { ...legacy.article, content: 'new' } });
  expect((await getAllDrafts()).map(d => d.article.content)).toEqual(['new']);
  await deleteDraft('legacy');
  expect(await getDraft('legacy')).toBeNull();
});

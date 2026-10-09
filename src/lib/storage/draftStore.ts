import type { PostDraft } from "../../types/post";
import type { ArticleDraft } from "../../types/article";

const DB_NAME = "oblivion_cms_db";
const DB_VERSION = 1;
const STORE_NAME = "drafts";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("当前环境不支持 IndexedDB"));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("打开 IndexedDB 失败"));
  });
}

// Request success does not imply commit: a transaction may still abort.
// Await completion and release the connection on every terminal path.
async function runRequest<T>(
  mode: IDBTransactionMode,
  request: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  const db = await openDB();
  try {
    return await new Promise<T>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, mode);
      let result: T;
      tx.oncomplete = () => resolve(result);
      tx.onabort = () => reject(tx.error || new Error("草稿存储事务已中止"));
      tx.onerror = () => reject(tx.error || new Error("草稿存储事务失败"));
      const req = request(tx.objectStore(STORE_NAME));
      req.onsuccess = () => { result = req.result; };
      req.onerror = () => reject(req.error || new Error("草稿存储请求失败"));
    });
  } finally {
    db.close();
  }
}

export async function saveDraft(draft: ArticleDraft): Promise<void> {
  try {
    await runRequest("readwrite", (store) => store.put({ ...draft, id: `moment:${draft.id}`, updatedAt: Date.now() }));
  } catch (err) {
    console.error("IndexedDB saveDraft error:", err);
    throw new Error(`本地草稿保存失败（请检查浏览器存储权限）: ${err instanceof Error ? err.message : err}`);
  }
}

export async function getDraft(id: string): Promise<ArticleDraft | null> {
  try {
    const draft = await runRequest<ArticleDraft>("readonly", (store) => store.get(`moment:${id}`)) || await runRequest<ArticleDraft>("readonly", (store) => store.get(id));
    return draft ? { ...draft, id: draft.id.replace(/^moment:/, "") } : null;
  } catch (err) {
    console.error("IndexedDB getDraft error:", err);
    return null;
  }
}

export async function getAllDrafts(): Promise<ArticleDraft[]> {
  try {
    const drafts = await runRequest<(ArticleDraft | PostDraft)[]>("readonly", (store) => store.getAll());
    const moments = drafts.filter((d): d is ArticleDraft => !d.id.startsWith("post:") && "article" in d);
    const map = new Map<string, ArticleDraft>();
    for (const d of moments.sort((a, b) => Number(a.id.startsWith("moment:")) - Number(b.id.startsWith("moment:")))) {
      const id = d.id.replace(/^moment:/, "");
      map.set(id, { ...d, id });
    }
    return [...map.values()];
  } catch (err) {
    console.error("IndexedDB getAllDrafts error:", err);
    return [];
  }
}

export async function deleteDraft(id: string): Promise<void> {
  try {
    await runRequest("readwrite", (store) => (store.delete(id), store.delete(`moment:${id}`)));
  } catch (err) {
    console.error("IndexedDB deleteDraft error:", err);
  }
}

// Post keys use a stable editor identity, independent of an editable slug.
export async function savePostDraft(draft: PostDraft): Promise<void> {
  await runRequest("readwrite", store => store.put({ ...draft, id: `post:${draft.id}`, updatedAt: Date.now() }));
}
export async function getPostDrafts(): Promise<PostDraft[]> {
  const drafts = await runRequest<(ArticleDraft | PostDraft)[]>("readonly", store => store.getAll());
  return drafts.filter((d): d is PostDraft => d.id.startsWith("post:") && "post" in d)
    .map(d => ({ ...d, id: d.id.slice(5) }));
}
export async function deletePostDraft(id: string): Promise<void> {
  await runRequest("readwrite", store => store.delete(`post:${id}`));
}

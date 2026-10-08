import type { ArticleDraft, Article } from "../../types/article";

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

export async function saveDraft(draft: ArticleDraft): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.put({
        ...draft,
        updatedAt: Date.now(),
      });

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error || new Error("保存草稿失败"));
    });
  } catch (err: any) {
    console.error("IndexedDB saveDraft error:", err);
    throw new Error(`本地草稿保存失败（请检查浏览器存储权限）: ${err?.message || err}`);
  }
}

export async function getDraft(id: string): Promise<ArticleDraft | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);

      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error || new Error("读取草稿失败"));
    });
  } catch (err) {
    console.error("IndexedDB getDraft error:", err);
    return null;
  }
}

export async function getAllDrafts(): Promise<ArticleDraft[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();

      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error || new Error("获取全部草稿失败"));
    });
  } catch (err) {
    console.error("IndexedDB getAllDrafts error:", err);
    return [];
  }
}

export async function deleteDraft(id: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error || new Error("删除草稿失败"));
    });
  } catch (err) {
    console.error("IndexedDB deleteDraft error:", err);
  }
}

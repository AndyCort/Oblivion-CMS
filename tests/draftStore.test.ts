import { afterEach, describe, expect, it, vi } from "vitest";
import { saveDraft, getDraft, getAllDrafts, deleteDraft } from "../src/lib/storage/draftStore";
import type { ArticleDraft } from "../src/types/article";

const draft: ArticleDraft = {
  id: "new-draft", isNew: true, updatedAt: 0,
  article: { time: 123, content: "draft", media: [], tags: [], location: "" },
};

function mockDatabase(result: unknown = undefined) {
  const request = { result, onsuccess: null as (() => void) | null, onerror: null as (() => void) | null };
  const store = { put: () => request, get: () => request, getAll: () => request, delete: () => request };
  const tx = { objectStore: () => store, oncomplete: null as (() => void) | null, onabort: null as (() => void) | null, onerror: null as (() => void) | null, error: null as Error | null };
  const db = { transaction: vi.fn(() => tx), close: vi.fn() };
  const indexedDB = { open: () => {
    const open = { result: db, onsuccess: null as (() => void) | null };
    queueMicrotask(() => open.onsuccess?.());
    return open;
  } };
  vi.stubGlobal("window", { indexedDB });
  vi.stubGlobal("indexedDB", indexedDB);
  return { request, tx, db };
}

afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });

describe("draft transaction lifecycle", () => {
  it("does not mark a draft saved until the transaction commits", async () => {
    const { tx, request, db } = mockDatabase();
    let saved = false;
    const operation = saveDraft(draft).then(() => { saved = true; });
    await vi.waitFor(() => expect(tx.oncomplete).toBeTypeOf("function"));
    request.onsuccess?.();
    await Promise.resolve();
    expect(saved).toBe(false);
    expect(db.close).not.toHaveBeenCalled();
    tx.oncomplete?.();
    await operation;
    expect(saved).toBe(true);
    expect(db.close).toHaveBeenCalledOnce();
  });

  it("reports an abort after request success and closes the connection", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { tx, request, db } = mockDatabase();
    const operation = saveDraft(draft);
    const rejected = expect(operation).rejects.toThrow("disk full");
    await vi.waitFor(() => expect(tx.onabort).toBeTypeOf("function"));
    request.onsuccess?.();
    tx.error = new Error("disk full");
    tx.onabort?.();
    await rejected;
    expect(db.close).toHaveBeenCalledOnce();
  });

  it.each([
    { run: () => getDraft(draft.id), result: draft },
    { run: () => getAllDrafts(), result: [draft] },
    { run: () => deleteDraft(draft.id), result: undefined },
  ])("closes connections after reads and deletes", async ({ run, result }) => {
    const { tx, request, db } = mockDatabase(result);
    const operation = run();
    await vi.waitFor(() => expect(tx.oncomplete).toBeTypeOf("function"));
    request.onsuccess?.();
    tx.oncomplete?.();
    expect(await operation).toEqual(result);
    expect(db.close).toHaveBeenCalledOnce();
  });
});

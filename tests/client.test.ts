import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { generateArticleFingerprint, type Article } from "../src/types/article";
import { batchImportArticles, computeClientFallbackSha, fetchArticles, publishArticleToServer } from "../src/lib/api/client";

const article = (time: number): Article => ({ time, content: "正文", location: "", tags: [], media: [] });

beforeEach(() => {
  vi.stubGlobal("localStorage", { getItem: () => null });
  vi.stubGlobal("window", { location: { hostname: "localhost" } });
  vi.stubGlobal("fetch", vi.fn(async () => new Response("<!doctype html>", {
    headers: { "Content-Type": "text/html" },
  })));
});
afterEach(() => vi.unstubAllGlobals());

describe("local API adapter", () => {
  it.each([400, 404, 500])("preserves JSON API errors (%s) instead of reporting mock success", async (status) => {
    vi.mocked(fetch).mockImplementation(async () => new Response(JSON.stringify({ error: "server failure" }), {
      status, headers: { "Content-Type": "application/json" },
    }));
    await expect(fetchArticles()).rejects.toThrow("server failure");
    await expect(publishArticleToServer({ action: "create", article: article(42), baseSha: "" })).rejects.toThrow("server failure");
    await expect(batchImportArticles([article(42)], "overwrite")).rejects.toThrow("server failure");
  });

  it("does not report success when the server disconnects", async () => {
    vi.mocked(fetch).mockRejectedValue(new TypeError("Failed to fetch"));
    await expect(publishArticleToServer({ action: "create", article: article(42), baseSha: "" })).rejects.toThrow("Failed to fetch");
    await expect(batchImportArticles([], "overwrite")).rejects.toThrow("Failed to fetch");
    await expect(fetchArticles()).rejects.toThrow("Failed to fetch");
  });

  it("updates and deletes only the exact target, even when timestamps share a prefix", async () => {
    const first = article(123);
    const second = article(1234);
    await batchImportArticles([first, second], "overwrite");
    await publishArticleToServer({ action: "update", article: { ...second, content: "changed" }, targetFingerprint: generateArticleFingerprint(second), baseSha: "" });
    const updated = await fetchArticles();
    expect(updated.articles.find((a) => a.time === 123)?.content).toBe("正文");
    const target = updated.articles.find((a) => a.time === 1234)!;
    await publishArticleToServer({ action: "delete", targetFingerprint: generateArticleFingerprint(target), baseSha: updated.sha });
    expect((await fetchArticles()).articles).toEqual([first]);
    await expect(publishArticleToServer({ action: "delete", targetFingerprint: "missing", baseSha: "" })).rejects.toThrow("目标文章不存在");
  });

  it("retains conflict protection and permits an explicit forced retry", async () => {
    const original = article(123);
    const initial = await batchImportArticles([original], "overwrite");
    await publishArticleToServer({ action: "update", article: { ...original, content: "remote change" }, targetFingerprint: generateArticleFingerprint(original), baseSha: initial.newSha });
    const request = { action: "update" as const, article: { ...original, content: "local change" }, targetFingerprint: generateArticleFingerprint(original), baseSha: initial.newSha };
    await expect(publishArticleToServer(request)).rejects.toMatchObject({ isConflict: true });
    await publishArticleToServer({ ...request, force: true });
    expect((await fetchArticles()).articles[0].content).toBe("local change");
  });

  it("detects media-only and music-only changes in version tokens", () => {
    const base = article(123);
    const sha = computeClientFallbackSha([base]);
    expect(computeClientFallbackSha([{ ...base, media: [{ type: "img", url: "x" }] }])).not.toBe(sha);
    expect(computeClientFallbackSha([{ ...base, music: { title: "song", artist: "artist", url: "x" } }])).not.toBe(sha);
    expect(computeClientFallbackSha([{ ...base, tags: ["a,b"] }])).not.toBe(computeClientFallbackSha([{ ...base, tags: ["a", "b"] }]));
  });

  it("isolates stored articles from caller edits", async () => {
    const source = article(456);
    await batchImportArticles([source], "overwrite");
    source.content = "mutated input";
    const response = await fetchArticles();
    response.articles[0].content = "mutated response";
    expect((await fetchArticles()).articles[0].content).toBe("正文");
  });

  it("rejects duplicate timestamps", async () => {
    await batchImportArticles([article(123), article(456)], "overwrite");
    await expect(publishArticleToServer({ action: "create", article: article(123), baseSha: "" })).rejects.toThrow("相同时间");
    await expect(publishArticleToServer({ action: "update", article: article(123), targetFingerprint: generateArticleFingerprint(article(456)), baseSha: "" })).rejects.toThrow("相同时间");
  });

  it("never enables the adapter for production HTML responses", async () => {
    vi.stubGlobal("window", { location: { hostname: "cms.example.com" } });
    await expect(fetchArticles()).rejects.toThrow();
  });
});

import { describe, it, expect } from "vitest";
import {
  generateArticleFingerprint,
  Article,
  ArticleMedia,
} from "../src/types/article";
import { formatArticleToTS } from "../src/lib/ast/articleParser";

describe("Frontend Fingerprints & Formats", () => {
  it("generates deterministic fingerprint for the same article", () => {
    const article1: Article = {
      time: 1789122720000,
      content: "今天出去走了走。",
      media: [
        { type: "img", url: "https://example.com/1.jpg" },
        { type: "vid", url: "https://example.com/2.mp4" },
      ],
      tags: ["日常", "随想"],
      location: "东京",
    };

    const fp1 = generateArticleFingerprint(article1);
    const fp2 = generateArticleFingerprint({ ...article1 });
    expect(fp1).toBe(fp2);
    expect(fp1).toContain("1789122720000");
  });

  it("changes fingerprint when content or location is modified", () => {
    const base: Article = {
      time: 1789122720000,
      content: "今天出去走了走。",
      media: [],
      tags: [],
      location: "东京",
    };
    const modified: Article = {
      ...base,
      content: "今天出去走了走，买了一杯咖啡。",
    };

    expect(generateArticleFingerprint(base)).not.toBe(
      generateArticleFingerprint(modified)
    );
  });
});

describe("Nine Grid Media Logic (>9 items & mixed media)", () => {
  it("handles 13 media items with mixed img and vid without truncating", () => {
    const mixedMedia: ArticleMedia[] = Array.from({ length: 13 }, (_, i) => ({
      type: i % 2 === 0 ? "img" : "vid",
      url: `https://example.com/item-${i + 1}.${i % 2 === 0 ? "jpg" : "mp4"}`,
    }));

    expect(mixedMedia.length).toBe(13);

    // Verify grid rows calculation: 13 items + 1 add card = 14 slots = 5 rows (in 3-column grid)
    const totalSlots = mixedMedia.length + 1;
    const rows = Math.ceil(totalSlots / 3);
    expect(rows).toBe(5);

    // Formats into valid TS with all 13 items
    const article: Article = {
      time: 1789122720000,
      content: "13 media test",
      media: mixedMedia,
      tags: ["九宫格突破"],
      location: "Elysium",
    };

    const ts = formatArticleToTS(article);
    expect(ts).toContain("media: [");
    expect(ts).toContain("https://example.com/item-13.jpg");
  });

  it("supports reordering media elements smoothly", () => {
    const list: ArticleMedia[] = [
      { type: "img", url: "https://example.com/a.jpg" },
      { type: "vid", url: "https://example.com/b.mp4" },
      { type: "img", url: "https://example.com/c.jpg" },
    ];

    // Move index 0 to index 2
    const reordered = [...list];
    const [moved] = reordered.splice(0, 1);
    reordered.splice(2, 0, moved);

    expect(reordered[0].url).toBe("https://example.com/b.mp4");
    expect(reordered[1].url).toBe("https://example.com/c.jpg");
    expect(reordered[2].url).toBe("https://example.com/a.jpg");
  });
});

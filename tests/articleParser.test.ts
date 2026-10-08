import { describe, it, expect } from "vitest";
import {
  parseArticlesFromSource,
  updateArticleInSource,
  insertArticleIntoSource,
  deleteArticleFromSource,
  formatArticleToTS,
} from "../src/lib/ast/articleParser";
import { generateArticleFingerprint, Article } from "../src/types/article";

const SAMPLE_TS_FILE = `// Original comments preserved
import type { Moment } from "./types";

/* Top-level comment
 * header section
 */
export const moments: Moment[] = [
  {
    time: 1789122720000,
    content: "今天出去走了走。",
    media: [
      {
        type: "img",
        url: "https://example.com/photo1.jpg",
      },
      {
        type: "vid",
        url: "https://example.com/video1.mp4",
      },
    ],
    tags: ["日常", "随想"],
    location: "东京",
    music: {
      title: "Sorrow Love",
      artist: "Someone",
      url: "https://example.com/music",
    },
  },
  {
    time: 1789110240000,
    content: \`多行文本测试：
第一行内容
第二行内容包含特殊符号: " ' \${test} \\\\
第三行\`,
    media: [],
    tags: ["旅行"],
    location: "Elysium",
  },
];

export const otherHelper = 42;
`;

describe("articleParser", () => {
  it("correctly parses static article objects from TypeScript file", () => {
    const result = parseArticlesFromSource(SAMPLE_TS_FILE);
    expect(result.articles).toHaveLength(2);
    expect(result.exportName).toBe("moments");

    const first = result.articles[0];
    expect(first.time).toBe(1789122720000);
    expect(first.content).toBe("今天出去走了走。");
    expect(first.location).toBe("东京");
    expect(first.tags).toEqual(["日常", "随想"]);
    expect(first.media).toHaveLength(2);
    expect(first.media[0]).toEqual({
      type: "img",
      url: "https://example.com/photo1.jpg",
    });
    expect(first.media[1]).toEqual({
      type: "vid",
      url: "https://example.com/video1.mp4",
    });
    expect(first.music).toEqual({
      title: "Sorrow Love",
      artist: "Someone",
      url: "https://example.com/music",
    });

    const second = result.articles[1];
    expect(second.time).toBe(1789110240000);
    expect(second.content).toContain("多行文本测试：");
    expect(second.location).toBe("Elysium");
    expect(second.tags).toEqual(["旅行"]);
    expect(second.media).toEqual([]);
    expect(second.music).toBeUndefined();
  });

  it("updates an article and preserves comments and unrelated code", () => {
    const parse1 = parseArticlesFromSource(SAMPLE_TS_FILE);
    const targetFingerprint = parse1.articleNodes[0].fingerprint;

    const updatedArticle: Article = {
      ...parse1.articles[0],
      content: "更新后的正文：今天阳光明媚，微风不燥。",
      location: "京都",
      tags: ["日常", "摄影", "生活"],
    };

    const { newCode, newFingerprint } = updateArticleInSource(
      SAMPLE_TS_FILE,
      targetFingerprint,
      updatedArticle
    );

    // Verify top comments and trailing code remain
    expect(newCode).toContain("// Original comments preserved");
    expect(newCode).toContain("/* Top-level comment");
    expect(newCode).toContain("export const otherHelper = 42;");

    // Re-parse and verify changes
    const parse2 = parseArticlesFromSource(newCode);
    expect(parse2.articles).toHaveLength(2);
    expect(parse2.articles[0].content).toBe("更新后的正文：今天阳光明媚，微风不燥。");
    expect(parse2.articles[0].location).toBe("京都");
    expect(parse2.articles[0].tags).toEqual(["日常", "摄影", "生活"]);

    // Second article remains untouched!
    expect(parse2.articles[1].time).toBe(1789110240000);
    expect(parse2.articles[1].location).toBe("Elysium");
  });

  it("inserts a new article cleanly at the beginning of the array", () => {
    const newArticle: Article = {
      time: 1799999999000,
      content: "这是一篇全新的说说！",
      media: [
        {
          type: "img",
          url: "https://example.com/new.png",
        },
      ],
      tags: ["新动态"],
      location: "上海",
    };

    const { newCode } = insertArticleIntoSource(SAMPLE_TS_FILE, newArticle);

    const recheck = parseArticlesFromSource(newCode);
    expect(recheck.articles).toHaveLength(3);
    expect(recheck.articles[0].time).toBe(1799999999000);
    expect(recheck.articles[0].content).toBe("这是一篇全新的说说！");
    expect(recheck.articles[0].location).toBe("上海");

    // Original articles are preserved
    expect(recheck.articles[1].time).toBe(1789122720000);
    expect(recheck.articles[2].time).toBe(1789110240000);
  });

  it("deletes an article cleanly without corrupting array syntax", () => {
    const parse1 = parseArticlesFromSource(SAMPLE_TS_FILE);
    const targetFingerprint = parse1.articleNodes[0].fingerprint;

    const { newCode } = deleteArticleFromSource(SAMPLE_TS_FILE, targetFingerprint);

    const recheck = parseArticlesFromSource(newCode);
    expect(recheck.articles).toHaveLength(1);
    expect(recheck.articles[0].time).toBe(1789110240000);
    expect(recheck.articles[0].location).toBe("Elysium");
  });

  it("safely escapes quotes, backslashes, and multiline content", () => {
    const article: Article = {
      time: 123456789,
      content: 'Line 1: "quoted"\nLine 2: backslash \\ and template ${dynamic}\nLine 3: 🚀 emoji',
      media: [],
      tags: ['tag "1"'],
      location: "Safe 'Location'",
    };

    const formatted = formatArticleToTS(article);
    expect(formatted).toContain('"Line 1: \\"quoted\\"\\nLine 2: backslash \\\\ and template ${dynamic}\\nLine 3: 🚀 emoji"');
  });

  it("rejects destructive overwrite of dynamic expressions", () => {
    const dynamicCode = `export const moments = [
      {
        time: Date.now(),
        content: someExternalVariable,
      }
    ];`;

    const parseRes = parseArticlesFromSource(dynamicCode);
    expect(parseRes.articleNodes[0].isDynamic).toBe(true);

    expect(() => {
      updateArticleInSource(dynamicCode, parseRes.articleNodes[0].fingerprint, {
        time: 123,
        content: "test",
        media: [],
        tags: [],
        location: "",
      });
    }).toThrow(/无法安全修改包含动态表达式的文章/);
  });
});

import fs from "node:fs";

describe("real moments.ts validation", () => {
  it("parses the actual Oblivion-dashboard moments.ts file", () => {
    const realPath = "/Volumes/T7/Development/Oblivion-dashboard/src/components/data/moments.ts";
    if (!fs.existsSync(realPath)) return;

    const source = fs.readFileSync(realPath, "utf-8");
    const result = parseArticlesFromSource(source);

    expect(result.articles.length).toBe(4);
    expect(result.exportName).toBe("moments");

    // Check first article
    const first = result.articles[0];
    expect(first.time).toBe(1789122720000);
    expect(first.content).toBe("今天出去走了走。");
    expect(first.location).toBe("东京");
    expect(first.media.length).toBe(2);
    expect(first.media[0].type).toBe("img");
    expect(first.media[1].type).toBe("vid");

    // Check Sorrow Love
    const fourth = result.articles[3];
    expect(fourth.location).toBe("天府");
    expect(fourth.music?.title).toBe("Sorrow Love");

    // Test updating an article without corrupting the file
    const targetFingerprint = result.articleNodes[0].fingerprint;
    const { newCode } = updateArticleInSource(source, targetFingerprint, {
      ...first,
      content: "测试更新：今天阳光很好。",
    });

    const reparsed = parseArticlesFromSource(newCode);
    expect(reparsed.articles.length).toBe(4);
    expect(reparsed.articles[0].content).toBe("测试更新：今天阳光很好。");
    // Ensure 2nd, 3rd, 4th articles are completely unchanged
    expect(reparsed.articles[1].time).toBe(result.articles[1].time);
    expect(reparsed.articles[2].time).toBe(result.articles[2].time);
    expect(reparsed.articles[3].time).toBe(result.articles[3].time);
  });
});

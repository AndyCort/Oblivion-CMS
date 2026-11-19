import fs from "node:fs";
import { describe, it, expect } from "vitest";
import { parseArticlesFromSource } from "../src/lib/ast/articleParser";

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

  it("flags dynamic expressions in article objects", () => {
    const dynamicCode = `export const moments = [
      {
        time: Date.now(),
        content: someExternalVariable,
      }
    ];`;

    const parseRes = parseArticlesFromSource(dynamicCode);
    expect(parseRes.articleNodes[0].isDynamic).toBe(true);
    expect(parseRes.articleNodes[0].dynamicReason).toBeTruthy();
  });
});

describe("real moments.ts validation", () => {
  it("parses the actual Oblivion-dashboard moments.ts file", () => {
    const realPath =
      "/Volumes/T7/Development/Oblivion-dashboard/src/components/data/moments.ts";
    if (!fs.existsSync(realPath)) return;

    const source = fs.readFileSync(realPath, "utf-8");
    const result = parseArticlesFromSource(source);

    expect(result.articles.length).toBe(4);
    expect(result.exportName).toBe("moments");

    const first = result.articles[0];
    expect(first.time).toBe(1789122720000);
    expect(first.content).toBe("今天出去走了走。");
    expect(first.location).toBe("东京");
    expect(first.media.length).toBe(2);
    expect(first.media[0].type).toBe("img");
    expect(first.media[1].type).toBe("vid");

    const fourth = result.articles[3];
    expect(["天府", "Elysium"]).toContain(fourth.location);
    expect(fourth.music?.title).toBe("Sorrow Love");
  });
});

import { describe, it, expect } from "vitest";
import {
  parseImportSource,
  normalizeArticle,
  calculateImportStats,
} from "../src/lib/importer/importParser";

describe("Import Parser", () => {
  it("parses pure JSON array with articles", () => {
    const json = JSON.stringify([
      {
        time: 1789122720000,
        content: "第一篇说说",
        tags: ["日常", "旅行"],
        location: "东京",
        media: ["https://example.com/1.jpg"],
      },
      {
        time: 1789110240000,
        content: "第二篇说说",
        tags: ["随想"],
      },
    ]);

    const result = parseImportSource(json);
    expect(result.articles).toHaveLength(2);
    expect(result.articles[0].content).toBe("第一篇说说");
    expect(result.articles[0].media).toEqual([
      { type: "img", url: "https://example.com/1.jpg" },
    ]);
    expect(result.stats.total).toBe(2);
    expect(result.stats.mediaCount).toBe(1);
    expect(result.stats.uniqueTags).toContain("日常");
    expect(result.stats.uniqueTags).toContain("旅行");
    expect(result.stats.uniqueTags).toContain("随想");
  });

  it("parses JSON object with wrapped moments / articles array", () => {
    const json = JSON.stringify({
      version: "1.0",
      moments: [
        {
          time: 1789122720000,
          content: "包裹在moments中的内容",
        },
      ],
    });

    const result = parseImportSource(json);
    expect(result.articles).toHaveLength(1);
    expect(result.articles[0].content).toBe("包裹在moments中的内容");
  });

  it("normalizes unix timestamp in seconds and ISO date string", () => {
    const json = JSON.stringify([
      {
        time: 1714546800, // 10 digits seconds
        content: "秒级时间戳",
      },
      {
        date: "2024-05-01T12:00:00Z", // ISO string
        content: "ISO日期字符串",
      },
    ]);

    const result = parseImportSource(json);
    expect(result.articles).toHaveLength(2);
    const secItem = result.articles.find((a) => a.content === "秒级时间戳");
    const isoItem = result.articles.find((a) => a.content === "ISO日期字符串");
    expect(secItem?.time).toBe(1714546800000);
    expect(isoItem?.time).toBe(Date.parse("2024-05-01T12:00:00Z"));
  });

  it("parses TypeScript moments.ts source code", () => {
    const tsCode = `
      import type { Moment } from "@/types";
      export const moments: Moment[] = [
        {
          time: 1789122720000,
          content: "来自 TS 代码的说说",
          media: [
            { type: "img", url: "https://example.com/pic.jpg" },
            { type: "vid", url: "https://example.com/vid.mp4" }
          ],
          tags: ["测试"],
          location: "上海",
          music: {
            title: "Song",
            artist: "Artist",
            url: "https://music.163.com"
          }
        }
      ];
    `;

    const result = parseImportSource(tsCode);
    expect(result.articles).toHaveLength(1);
    expect(result.articles[0].content).toBe("来自 TS 代码的说说");
    expect(result.articles[0].location).toBe("上海");
    expect(result.articles[0].media).toHaveLength(2);
    expect(result.articles[0].music?.title).toBe("Song");
  });

  it("parses naked array string in JS format", () => {
    const nakedArray = `[
      {
        time: 1789122720000,
        content: "直接复制粘贴的数组",
        tags: ["随笔"]
      }
    ]`;

    const result = parseImportSource(nakedArray);
    expect(result.articles).toHaveLength(1);
    expect(result.articles[0].content).toBe("直接复制粘贴的数组");
  });

  it("throws friendly error for invalid or empty input", () => {
    expect(() => parseImportSource("")).toThrow("请粘贴数据或选择要导入的文件内容");
    expect(() => parseImportSource("hello world plain text without data")).toThrow();
  });
});

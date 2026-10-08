import { verifyCloudflareAccess } from "../lib/access";
import { getFileFromGitHub, GitHubConfig } from "../lib/github";
import { parseArticlesFromSource } from "../../src/lib/ast/articleParser";
import { Article } from "../../src/types/article";

// Mock store for local testing without GitHub credentials
let mockSourceCode = `export type MomentContent = string | { zh: string; en: string };
export interface Media {
  type: "img" | "vid";
  url: string;
}

export interface Music {
  title: string;
  artist: string;
  url: string;
}

export interface Moment {
  time: number;
  content?: MomentContent;
  media?: Media[];
  tags?: string[];
  location?: string;
  music?: Music;
}

export const moments: Moment[] = [
  {
    time: 1789122720000,
    content: "今天出去走了走。",
    media: [
      {
        type: "img",
        url: "https://raw.githubusercontent.com/AndyCort/PicGo/master/img/0497B09F-1CD0-40F7-82A1-9F719F5223A1_1_105_c.jpeg",
      },
      {
        type: "vid",
        url: "https://www.pexels.com/download/video/38417492/",
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
    content: \`如果本就走在与众不同的道路\\n那就不该期望自己会有什么传统意义上、或是流行文化中的那种功成名就。\\n    \`,
    media: [],
    tags: ["日常", "随想"],
    location: "Tokyo",
    music: {
      title: "Sorrow Love",
      artist: "Someone",
      url: "https://example.com/music",
    },
  },

  {
    time: 1789445239000,
    content: "好的结果也可以是一种诅咒，而坏的结果也许是一种缓冲。",
    media: [],
    tags: ["日常", "随想"],
    location: "Estonia",
    music: {
      title: "Sorrow Love",
      artist: "Someone",
      url: "https://example.com/music",
    },
  },
  {
    time: 1791400876000,
    content: \`我从来都不是为了和谁在一起\\n      我想要的是你能真心实意地告诉我\\n      “我曾爱你”\\n      “我依然爱你”\\n      “我爱你”\`,
    media: [],
    tags: ["日常", "随想"],
    location: "天府",
    music: {
      title: "Sorrow Love",
      artist: "Someone",
      url: "https://example.com/music",
    },
  },
];
`;
let mockSha = "mock-sha-" + Date.now().toString(16);

export function getMockState() {
  return { code: mockSourceCode, sha: mockSha };
}

export function setMockState(newCode: string) {
  mockSourceCode = newCode;
  mockSha = "mock-sha-" + Date.now().toString(16);
  return mockSha;
}

export const onRequestGet = async (context: {
  request: Request;
  env: Record<string, string | undefined>;
}) => {
  const { request, env } = context;

  // 1. Authenticate with Cloudflare Access
  const auth = await verifyCloudflareAccess(request, env);
  if (auth.error || !auth.user) {
    return new Response(
      JSON.stringify({ error: auth.error || "Unauthorized" }),
      {
        status: auth.status,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // 2. Read configuration
  const owner = env.GITHUB_OWNER || "AndyCort";
  const repo = env.GITHUB_REPO || "oblivion-dashboard";
  const branch = env.GITHUB_BRANCH || "main";
  const path = env.GITHUB_DATA_PATH || "src/components/data/moments.ts";
  const token = env.GITHUB_TOKEN;

  let sourceCode = "";
  let sha = "";
  let isMock = false;

  // 3. Fetch data from GitHub or Local Mock
  if (token && owner && repo) {
    try {
      const result = await getFileFromGitHub({
        owner,
        repo,
        branch,
        path,
        token,
      });
      sourceCode = result.content;
      sha = result.sha;
    } catch (err: any) {
      return new Response(
        JSON.stringify({
          error: `无法从 GitHub 获取文件: ${err.message}`,
        }),
        {
          status: 502,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } else {
    // In local dev without token, use mock state
    sourceCode = mockSourceCode;
    sha = mockSha;
    isMock = true;
  }

  // 4. Parse articles with AST
  try {
    const parseResult = parseArticlesFromSource(sourceCode);
    return new Response(
      JSON.stringify({
        articles: parseResult.articles,
        sha,
        path,
        branch,
        owner: owner || "local",
        repo: repo || "local",
        isMock,
        total: parseResult.articles.length,
        user: auth.user,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        error: `AST 解析文章数据失败: ${err.message}`,
        rawContentSnippet: sourceCode.slice(0, 300),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

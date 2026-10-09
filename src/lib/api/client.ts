import type { Article, PublishRequest, PublishResponse, ConflictErrorResponse } from "../../types/article";

export interface UserSession {
  email: string;
  sub: string;
  name?: string;
  isMock?: boolean;
}

export interface FetchArticlesResponse {
  articles: Article[];
  sha: string;
  path: string;
  branch: string;
  owner: string;
  repo: string;
  isMock: boolean;
  isD1?: boolean;
  d1Mode?: "native" | "http" | "mock";
  bindingName?: string;
  envKeys?: string[];
  warning?: string;
  total: number;
  user?: UserSession;
}

const DEV_MOCK_TOKEN_KEY = "oblivion_cf_mock_token";

export function getDevMockToken(): string | null {
  try {
    return localStorage.getItem(DEV_MOCK_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setDevMockToken(token: string): void {
  try {
    localStorage.setItem(DEV_MOCK_TOKEN_KEY, token);
  } catch {}
}

export function clearDevMockToken(): void {
  try {
    localStorage.removeItem(DEV_MOCK_TOKEN_KEY);
  } catch {}
}

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  const mockToken = getDevMockToken();
  if (mockToken) {
    headers["Authorization"] = `Bearer ${mockToken}`;
  }
  return headers;
}

// Fallback in-memory state for client-only dev mode
const FALLBACK_MOCK_ARTICLES: Article[] = [
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
    content: `如果本就走在与众不同的道路\n那就不该期望自己会有什么传统意义上、或是流行文化中的那种功成名就。`,
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
    content: `我从来都不是为了和谁在一起\n      我想要的是你能真心实意地告诉我\n      “我曾爱你”\n      “我依然爱你”\n      “我爱你”`,
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

export function computeClientFallbackSha(articles: Article[]): string {
  if (!articles || articles.length === 0) return "local-sha-empty";
  let hash = 0;
  for (let i = 0; i < articles.length; i++) {
    const a = articles[i];
    const itemStr = `${a.time}|${a.location || ""}|${(a.tags || []).join(",")}|${a.content || ""}`;
    for (let j = 0; j < itemStr.length; j++) {
      hash = (hash << 5) - hash + itemStr.charCodeAt(j);
      hash |= 0;
    }
  }
  return `local-sha-${articles.length}-${Math.abs(hash).toString(36)}`;
}

let localFallbackArticles: Article[] = [...FALLBACK_MOCK_ARTICLES];

/**
 * Trigger Cloudflare Access login flow or local dev mock login
 */
export async function loginWithCloudflareAccess(): Promise<UserSession> {
  const isLocalHost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  if (isLocalHost) {
    setDevMockToken("mock-dev-token");
    return {
      email: "developer@oblivion.local",
      sub: "dev-local-user",
      name: "本地模拟认证 (CF Access)",
      isMock: true,
    };
  }

  // In production, first verify if session is already active
  const status = await checkAuthStatus();
  if (status.user) {
    return status.user;
  }

  // If there is a backend 500 configuration issue, throw to display to user
  if (status.error && status.error.includes("服务器错误")) {
    throw new Error(status.error);
  }

  // Navigate to Cloudflare Access login endpoint
  window.location.assign("/cdn-cgi/access/login");
  await new Promise((resolve) => setTimeout(resolve, 2500));
  throw new Error("正在跳转至 Cloudflare Access 验证页面，若未自动跳转请刷新页面重试。");
}

export async function logoutUser(): Promise<void> {
  clearDevMockToken();
  try {
    const res = await fetch("/api/auth/logout", { method: "POST" });
    const data = await res.json().catch(() => ({}));
    if (data.logoutUrl && !data.logoutUrl.includes("localhost")) {
      window.location.href = data.logoutUrl;
      return;
    }
  } catch {}
}

export async function checkAuthStatus(): Promise<{ user: UserSession | null; error?: string }> {
  const isLocalHost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  try {
    const res = await fetch("/api/auth/me", {
      headers: getAuthHeaders(),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.authenticated && data.user) {
        return { user: data.user };
      }
    }

    if (res.status === 404 && isLocalHost) {
      const mockToken = getDevMockToken();
      if (mockToken) {
        return {
          user: {
            email: "developer@oblivion.local",
            sub: "dev-local-user",
            name: "本地开发模拟 (CF Access)",
            isMock: true,
          },
        };
      }
      return { user: null };
    }

    const errData = await res.json().catch(() => ({}));
    return {
      user: null,
      error: errData.error || `身份验证未通过 (${res.status})`,
    };
  } catch (err: any) {
    if (isLocalHost && getDevMockToken()) {
      return {
        user: {
          email: "developer@oblivion.local",
          sub: "dev-local-user",
          name: "本地开发模拟 (CF Access)",
          isMock: true,
        },
      };
    }
    return { user: null, error: err?.message || "网络请求失败" };
  }
}

export async function fetchArticles(): Promise<FetchArticlesResponse> {
  try {
    const res = await fetch("/api/articles", {
      headers: getAuthHeaders(),
    });

    if (res.ok) {
      return await res.json();
    }

    if (res.status === 401 || res.status === 403) {
      const data = await res.json().catch(() => ({}));
      const err = new Error(data.error || "Cloudflare Access 权限验证失败，未授权访问");
      (err as any).isAuthError = true;
      throw err;
    }

    if (res.status === 404 && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
      return {
        articles: [...localFallbackArticles],
        sha: computeClientFallbackSha(localFallbackArticles),
        path: "本地离线模拟环境 (未连接 D1)",
        branch: "离线开发",
        owner: "Cloudflare",
        repo: "D1 Database",
        isMock: true,
        isD1: false,
        d1Mode: "mock",
        warning: "当前运行于 Vite 本地开发模式，未连接 Cloudflare D1 数据库。",
        total: localFallbackArticles.length,
        user: {
          email: "developer@oblivion.local",
          sub: "dev-local",
          name: "本地开发模式",
          isMock: true,
        },
      };
    }

    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `请求失败 (${res.status})`);
  } catch (err: any) {
    if (err.isAuthError) throw err;
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      return {
        articles: [...localFallbackArticles],
        sha: computeClientFallbackSha(localFallbackArticles),
        path: "本地离线模拟环境 (未连接 D1)",
        branch: "离线开发",
        owner: "Cloudflare",
        repo: "D1 Database",
        isMock: true,
        isD1: false,
        d1Mode: "mock",
        warning: "当前运行于 Vite 本地开发模式，未连接 Cloudflare D1 数据库。",
        total: localFallbackArticles.length,
        user: {
          email: "developer@oblivion.local",
          sub: "dev-local",
          name: "本地开发模式",
          isMock: true,
        },
      };
    }
    throw err;
  }
}

export async function publishArticleToServer(
  request: PublishRequest
): Promise<PublishResponse> {
  try {
    const headers = getAuthHeaders();
    headers["Content-Type"] = "application/json";

    const res = await fetch("/api/publish", {
      method: "POST",
      headers,
      body: JSON.stringify(request),
    });

    if (res.status === 401 || res.status === 403) {
      const data = await res.json().catch(() => ({}));
      const err = new Error(data.error || "未通过 Cloudflare Access 验证");
      (err as any).isAuthError = true;
      throw err;
    }

    if (res.status === 409) {
      const conflict: ConflictErrorResponse = await res.json();
      const err = new Error(conflict.message || "远程版本冲突");
      (err as any).isConflict = true;
      (err as any).conflictData = conflict;
      throw err;
    }

    if (!res.ok) {
      if (res.status === 404 && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
        return handleLocalFallbackPublish(request);
      }
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || `发布失败 (${res.status})`);
    }

    return await res.json();
  } catch (err: any) {
    if (err.isAuthError || err.isConflict) throw err;
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      return handleLocalFallbackPublish(request);
    }
    throw err;
  }
}

function handleLocalFallbackPublish(req: PublishRequest): PublishResponse {
  const currentSha = computeClientFallbackSha(localFallbackArticles);
  if (!req.force && req.baseSha && req.baseSha !== currentSha) {
    const err = new Error("版本冲突：本地数据已被更改，请刷新后重试");
    (err as any).isConflict = true;
    (err as any).conflictData = {
      error: "CONFLICT",
      message: "本地版本基准不一致",
      remoteSha: currentSha,
      clientBaseSha: req.baseSha,
    };
    throw err;
  }

  if (req.action === "create" && req.article) {
    localFallbackArticles = [req.article, ...localFallbackArticles];
  } else if (req.action === "update" && req.article && req.targetFingerprint) {
    localFallbackArticles = localFallbackArticles.map((a) => {
      const fp = `${a.time}`;
      return req.targetFingerprint?.startsWith(fp) ? req.article! : a;
    });
  } else if (req.action === "delete" && req.targetFingerprint) {
    localFallbackArticles = localFallbackArticles.filter(
      (a) => !req.targetFingerprint?.startsWith(`${a.time}`)
    );
  }

  const newSha = computeClientFallbackSha(localFallbackArticles);
  return {
    success: true,
    newSha,
    commitMessage: req.commitMessage || `content: ${req.action} article (local mock)`,
    articleCount: localFallbackArticles.length,
  };
}

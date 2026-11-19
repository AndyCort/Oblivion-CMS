import {
  DEFAULT_MOCK_ARTICLES,
  type Article,
  type PublishRequest,
  type PublishResponse,
  type ConflictErrorResponse,
} from "../../types/article";

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

function isLocalHostname(): boolean {
  return (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  );
}

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
  const headers: Record<string, string> = { Accept: "application/json" };
  const mockToken = getDevMockToken();
  if (mockToken) headers["Authorization"] = `Bearer ${mockToken}`;
  return headers;
}

export function computeClientFallbackSha(articles: Article[]): string {
  if (!articles || articles.length === 0) return "local-sha-empty";
  let hash = 0;
  const serialized = JSON.stringify(articles);
  for (let i = 0; i < serialized.length; i++) {
    hash = (hash << 5) - hash + serialized.charCodeAt(i);
    hash |= 0;
  }
  return `local-sha-${articles.length}-${Math.abs(hash).toString(36)}`;
}

let localFallbackArticles: Article[] = structuredClone(DEFAULT_MOCK_ARTICLES);

const DEV_MOCK_USER: UserSession = {
  email: "developer@oblivion.local",
  sub: "dev-local-user",
  name: "本地开发模拟 (CF Access)",
  isMock: true,
};

export async function loginWithCloudflareAccess(): Promise<UserSession> {
  if (isLocalHostname()) {
    setDevMockToken("mock-dev-token");
    return {
      ...DEV_MOCK_USER,
      name: "本地模拟认证 (CF Access)",
    };
  }

  const status = await checkAuthStatus();
  if (status.user) return status.user;
  if (status.error && status.error.includes("服务器错误")) {
    throw new Error(status.error);
  }

  window.location.assign("/cdn-cgi/access/login");
  await new Promise((resolve) => setTimeout(resolve, 2500));
  throw new Error(
    "正在跳转至 Cloudflare Access 验证页面，若未自动跳转请刷新页面重试。",
  );
}

export async function logoutUser(): Promise<void> {
  clearDevMockToken();
  try {
    const res = await fetch("/api/auth/logout", { method: "POST" });
    const data = await res.json().catch(() => ({}));
    if (data.logoutUrl && !data.logoutUrl.includes("localhost")) {
      window.location.href = data.logoutUrl;
    }
  } catch {}
}

export async function checkAuthStatus(): Promise<{
  user: UserSession | null;
  error?: string;
}> {
  const isLocalHost = isLocalHostname();
  try {
    const res = await fetch("/api/auth/me", { headers: getAuthHeaders() });
    if (res.ok) {
      const data = await res.json();
      if (data.authenticated && data.user) return { user: data.user };
    }

    if (res.status === 404 && isLocalHost) {
      return { user: getDevMockToken() ? { ...DEV_MOCK_USER } : null };
    }

    const errData = await res.json().catch(() => ({}));
    return {
      user: null,
      error: errData.error || `身份验证未通过 (${res.status})`,
    };
  } catch (err: any) {
    if (isLocalHost && getDevMockToken()) {
      return { user: { ...DEV_MOCK_USER } };
    }
    return { user: null, error: err?.message || "网络请求失败" };
  }
}

// Vite serves HTML for missing API routes; only explicit local HTML/404 enables mock fallback.
function isLocalFallbackResponse(res: Response): boolean {
  const contentType = res.headers.get("Content-Type") || "";
  return (
    isLocalHostname() &&
    ((res.status === 404 && !contentType.includes("json")) ||
      (res.ok && contentType.includes("text/html")))
  );
}

function getLocalFallbackArticles(): FetchArticlesResponse {
  return {
    articles: structuredClone(localFallbackArticles),
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

export async function fetchArticles(): Promise<FetchArticlesResponse> {
  const res = await fetch("/api/articles", { headers: getAuthHeaders() });
  if (isLocalFallbackResponse(res)) return getLocalFallbackArticles();
  if (!res.ok) await throwApiError(res, "请求失败");
  return await res.json();
}

async function throwApiError(res: Response, message: string): Promise<never> {
  const data = (await res.json().catch(() => null)) || {};
  const err = new Error(
    data.message || data.error || `${message} (${res.status})`,
  );
  if (res.status === 401 || res.status === 403) {
    Object.assign(err, { isAuthError: true });
  } else if (res.status === 409) {
    Object.assign(err, {
      isConflict: true,
      conflictData: data as ConflictErrorResponse,
    });
  }
  throw err;
}

export async function publishArticleToServer(
  request: PublishRequest,
): Promise<PublishResponse> {
  const res = await fetch("/api/publish", {
    method: "POST",
    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  if (isLocalFallbackResponse(res)) return handleLocalFallbackPublish(request);
  if (!res.ok) await throwApiError(res, "发布失败");
  return await res.json();
}

function handleLocalFallbackPublish(req: PublishRequest): PublishResponse {
  const currentSha = computeClientFallbackSha(localFallbackArticles);
  if (!req.force && req.baseSha && req.baseSha !== currentSha) {
    const err = new Error("版本冲突：本地数据已被更改，请刷新后重试");
    Object.assign(err, {
      isConflict: true,
      conflictData: {
        error: "CONFLICT",
        message: "本地版本基准不一致",
        remoteSha: currentSha,
        clientBaseSha: req.baseSha,
      },
    });
    throw err;
  }

  if (req.action === "create" && req.article) {
    if (localFallbackArticles.some((a) => a.time === req.article!.time)) {
      throw new Error("相同时间的文章已存在");
    }
    localFallbackArticles = [
      structuredClone(req.article),
      ...localFallbackArticles,
    ];
  } else if (
    (req.action === "update" && req.article) ||
    req.action === "delete"
  ) {
    const index = localFallbackArticles.findIndex((a) =>
      req.targetFingerprint?.startsWith(`${a.time}-`),
    );
    if (index === -1) throw new Error("目标文章不存在或已更改，请刷新后重试");
    if (req.action === "update") {
      if (
        localFallbackArticles.some(
          (a, i) => i !== index && a.time === req.article!.time,
        )
      ) {
        throw new Error("相同时间的文章已存在");
      }
      localFallbackArticles[index] = structuredClone(req.article!);
    } else {
      localFallbackArticles.splice(index, 1);
    }
  } else {
    throw new Error("无效的文章操作或缺少文章数据");
  }

  return {
    success: true,
    newSha: computeClientFallbackSha(localFallbackArticles),
    commitMessage:
      req.commitMessage || `content: ${req.action} article (local mock)`,
    articleCount: localFallbackArticles.length,
  };
}

export interface ImportArticlesRequest {
  articles: Article[];
  mode: "merge" | "overwrite";
}

export interface ImportArticlesResponse {
  success: boolean;
  count: number;
  total: number;
  newSha: string;
  mode: "merge" | "overwrite";
  message: string;
}

export async function batchImportArticles(
  articles: Article[],
  mode: "merge" | "overwrite",
): Promise<ImportArticlesResponse> {
  const res = await fetch("/api/import", {
    method: "POST",
    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ articles, mode }),
  });
  if (isLocalFallbackResponse(res))
    return handleLocalFallbackImport(articles, mode);
  if (!res.ok) await throwApiError(res, "导入失败");
  return await res.json();
}

function handleLocalFallbackImport(
  articles: Article[],
  mode: "merge" | "overwrite",
): ImportArticlesResponse {
  if (mode === "overwrite") {
    localFallbackArticles = structuredClone(articles).sort(
      (a, b) => b.time - a.time,
    );
  } else {
    const map = new Map<number, Article>();
    for (const a of localFallbackArticles) map.set(a.time, structuredClone(a));
    for (const a of articles) map.set(a.time, structuredClone(a));
    localFallbackArticles = Array.from(map.values()).sort(
      (a, b) => b.time - a.time,
    );
  }

  const modeLabel = mode === "overwrite" ? "全量覆盖" : "增量合并";
  return {
    success: true,
    count: articles.length,
    total: localFallbackArticles.length,
    newSha: computeClientFallbackSha(localFallbackArticles),
    mode,
    message: `成功${modeLabel}导入 ${articles.length} 篇文章（本地开发模拟，共计 ${localFallbackArticles.length} 篇）`,
  };
}

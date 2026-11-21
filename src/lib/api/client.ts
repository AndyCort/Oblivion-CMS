import type {
  Article,
  MomentMutationResponse,
  MomentSaveRequest,
} from "../../types/article";
import type { NeteaseSearchResponse } from "../../types/music";

export interface UserSession {
  email: string;
  sub: string;
  name?: string;
}

export interface FetchMomentsResponse {
  moments: Article[];
  isD1?: boolean;
  warning?: string;
  total: number;
  user?: UserSession;
}

/** Shared JSON fetch helper. */
export async function requestJson<T>(
  url: string,
  options: { method?: string; body?: unknown; signal?: AbortSignal } = {},
  fallbackError = "请求失败",
): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (options.body !== undefined) headers["Content-Type"] = "application/json";

  const res = await fetch(url, {
    method: options.method || "GET",
    headers,
    signal: options.signal,
    ...(options.body !== undefined ? { body: JSON.stringify(options.body) } : {}),
  });

  const contentType = res.headers.get("Content-Type") || "";
  if (res.ok && !contentType.includes("json")) {
    throw new Error("服务端返回了非 JSON 响应");
  }

  const data = (await res.json().catch(() => null)) || {};
  if (!res.ok) {
    const err = new Error(
      data.message || data.error || `${fallbackError} (${res.status})`,
    );
    if (res.status === 401 || res.status === 403) {
      Object.assign(err, { isAuthError: true });
    }
    throw err;
  }

  return data as T;
}

export async function checkAuthStatus(): Promise<{
  user: UserSession | null;
  d1Bound?: boolean;
  error?: string;
}> {
  try {
    const data = await requestJson<{
      authenticated?: boolean;
      user?: UserSession;
      d1Bound?: boolean;
    }>("/api/auth/me", {}, "身份验证未通过");
    if (data.authenticated && data.user) {
      return { user: data.user, d1Bound: data.d1Bound };
    }
    return { user: null, error: "身份验证未通过" };
  } catch (err: any) {
    return { user: null, error: err?.message || "网络请求失败" };
  }
}

export async function loginWithCloudflareAccess(): Promise<UserSession> {
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
  try {
    const res = await fetch("/api/auth/logout", { method: "POST" });
    const data = await res.json().catch(() => ({}));
    if (data.logoutUrl) {
      window.location.href = data.logoutUrl;
    }
  } catch {
    /* ignore logout network errors */
  }
}

export async function fetchMoments(): Promise<FetchMomentsResponse> {
  return requestJson<FetchMomentsResponse>("/api/moments");
}

export async function saveMoment(
  moment: Article,
  originalTime?: number,
): Promise<MomentMutationResponse> {
  const payload: MomentSaveRequest = { moment, originalTime };
  return requestJson<MomentMutationResponse>(
    "/api/moments",
    { method: "POST", body: payload },
    "发布失败",
  );
}

export async function deleteMoment(
  time: number,
): Promise<MomentMutationResponse> {
  return requestJson<MomentMutationResponse>(
    `/api/moments/${encodeURIComponent(String(time))}`,
    { method: "DELETE" },
    "删除失败",
  );
}

export async function searchNeteaseMusic(
  keyword: string,
  options: { limit?: number; offset?: number; signal?: AbortSignal } = {},
): Promise<NeteaseSearchResponse> {
  const params = new URLSearchParams({ q: keyword });
  if (options.limit !== undefined) params.set("limit", String(options.limit));
  if (options.offset !== undefined) params.set("offset", String(options.offset));
  return requestJson<NeteaseSearchResponse>(
    `/api/music/search?${params.toString()}`,
    { signal: options.signal },
    "搜索网易云音乐失败",
  );
}

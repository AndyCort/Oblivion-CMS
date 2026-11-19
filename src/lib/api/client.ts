import type {
  Article,
  MomentMutationResponse,
  MomentSaveRequest,
} from "../../types/article";

export interface UserSession {
  email: string;
  sub: string;
  name?: string;
  isMock?: boolean;
}

export interface FetchMomentsResponse {
  moments: Article[];
  isMock: boolean;
  isD1?: boolean;
  warning?: string;
  total: number;
  user?: UserSession;
}

const DEV_MOCK_TOKEN_KEY = "oblivion_cf_mock_token";

export function isLocalHostname(): boolean {
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

function setDevMockToken(token: string): void {
  try {
    localStorage.setItem(DEV_MOCK_TOKEN_KEY, token);
  } catch {
    /* restricted storage */
  }
}

function clearDevMockToken(): void {
  try {
    localStorage.removeItem(DEV_MOCK_TOKEN_KEY);
  } catch {
    /* restricted storage */
  }
}

function isViteHtmlFallback(res: Response): boolean {
  const contentType = res.headers.get("Content-Type") || "";
  return (
    import.meta.env.DEV &&
    isLocalHostname() &&
    ((res.status === 404 && !contentType.includes("json")) ||
      (res.ok && contentType.includes("text/html")))
  );
}

/** Shared JSON fetch helper; returns null only for explicit Vite local HTML/404 dev fallback. */
export async function requestJson<T>(
  url: string,
  options: { method?: string; body?: unknown } = {},
  fallbackError = "请求失败",
): Promise<T | null> {
  const headers: Record<string, string> = { Accept: "application/json" };
  const mockToken = getDevMockToken();
  if (mockToken) headers.Authorization = `Bearer ${mockToken}`;
  if (options.body !== undefined) headers["Content-Type"] = "application/json";

  const res = await fetch(url, {
    method: options.method || "GET",
    headers,
    ...(options.body !== undefined ? { body: JSON.stringify(options.body) } : {}),
  });

  if (isViteHtmlFallback(res)) return null;

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
    if (data === null && import.meta.env.DEV) {
      if (!getDevMockToken()) return { user: null };
      const { DEV_MOCK_USER } = await import("./localMock");
      return { user: { ...DEV_MOCK_USER }, d1Bound: false };
    }
    if (data?.authenticated && data.user) {
      return { user: data.user, d1Bound: data.d1Bound };
    }
    return { user: null, error: "身份验证未通过" };
  } catch (err: any) {
    if (import.meta.env.DEV && isLocalHostname() && getDevMockToken()) {
      const { DEV_MOCK_USER } = await import("./localMock");
      return { user: { ...DEV_MOCK_USER }, d1Bound: false };
    }
    return { user: null, error: err?.message || "网络请求失败" };
  }
}

export async function loginWithCloudflareAccess(): Promise<UserSession> {
  if (import.meta.env.DEV && isLocalHostname()) {
    setDevMockToken("mock-dev-token");
    const { DEV_MOCK_USER } = await import("./localMock");
    return { ...DEV_MOCK_USER, name: "本地模拟认证 (CF Access)" };
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
  } catch {
    /* ignore logout network errors */
  }
}

export async function fetchMoments(): Promise<FetchMomentsResponse> {
  const data = await requestJson<FetchMomentsResponse>("/api/moments");
  if (data !== null) return data;
  if (import.meta.env.DEV) {
    const { mockFetchMoments } = await import("./localMock");
    return mockFetchMoments();
  }
  throw new Error("无法加载说说列表");
}

export async function saveMoment(
  moment: Article,
  originalTime?: number,
): Promise<MomentMutationResponse> {
  const payload: MomentSaveRequest = { moment, originalTime };
  const data = await requestJson<MomentMutationResponse>(
    "/api/moments",
    { method: "POST", body: payload },
    "发布失败",
  );
  if (data !== null) return data;
  if (import.meta.env.DEV) {
    const { mockSaveMoment } = await import("./localMock");
    return mockSaveMoment(moment, originalTime);
  }
  throw new Error("无法保存说说");
}

export async function deleteMoment(
  time: number,
): Promise<MomentMutationResponse> {
  const data = await requestJson<MomentMutationResponse>(
    `/api/moments/${encodeURIComponent(String(time))}`,
    { method: "DELETE" },
    "删除失败",
  );
  if (data !== null) return data;
  if (import.meta.env.DEV) {
    const { mockDeleteMoment } = await import("./localMock");
    return mockDeleteMoment(time);
  }
  throw new Error("无法删除说说");
}

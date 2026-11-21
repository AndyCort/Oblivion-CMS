import { jsonResponse, verifyAccess } from "../../lib/access";
import type {
  NeteaseSearchResponse,
  NeteaseSongItem,
} from "../../../src/types/music";

const REQUEST_TIMEOUT_MS = 10_000;
const MAX_KEYWORD_LEN = 120;
const DEFAULT_LIMIT = 15;
const MAX_LIMIT = 30;

const NETEASE_HEADERS: Record<string, string> = {
  Accept: "application/json, text/plain, */*",
  "Content-Type": "application/x-www-form-urlencoded",
  Referer: "https://music.163.com/",
  Origin: "https://music.163.com",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
};

interface RawArtist {
  name?: string;
}

interface RawAlbum {
  name?: string;
  picUrl?: string;
}

interface RawSong {
  id?: number | string;
  name?: string;
  ar?: RawArtist[];
  artists?: RawArtist[];
  al?: RawAlbum;
  album?: RawAlbum;
  dt?: number;
  duration?: number;
  fee?: number;
}

interface RawNeteaseResponse {
  code?: number;
  message?: string;
  msg?: string;
  result?: {
    songs?: RawSong[];
    songCount?: number;
    hasMore?: boolean;
  };
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs = REQUEST_TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function normalizeCoverUrl(raw?: string): string | undefined {
  if (typeof raw !== "string") return undefined;
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  const secure = trimmed.replace(/^http:\/\//i, "https://");
  if (!/^https:\/\//i.test(secure)) return undefined;
  return secure.includes("?") ? secure : `${secure}?param=96y96`;
}

function normalizeSong(raw: RawSong): NeteaseSongItem | null {
  const id = Number(raw?.id);
  const title = typeof raw?.name === "string" ? raw.name.trim() : "";
  if (!Number.isFinite(id) || id <= 0 || !title) return null;

  const rawArtists = Array.isArray(raw.ar)
    ? raw.ar
    : Array.isArray(raw.artists)
      ? raw.artists
      : [];
  const artist = rawArtists
    .map((a) => (typeof a?.name === "string" ? a.name.trim() : ""))
    .filter(Boolean)
    .join(" / ");

  const rawAlbum = raw.al || raw.album;
  const album = typeof rawAlbum?.name === "string" ? rawAlbum.name.trim() : "";
  const coverUrl = normalizeCoverUrl(rawAlbum?.picUrl);
  const durationRaw =
    typeof raw.dt === "number"
      ? raw.dt
      : typeof raw.duration === "number"
        ? raw.duration
        : undefined;
  const durationMs =
    durationRaw !== undefined && Number.isFinite(durationRaw) && durationRaw > 0
      ? durationRaw
      : undefined;

  return {
    id,
    title,
    artist: artist || "未知歌手",
    album,
    ...(coverUrl ? { coverUrl } : {}),
    ...(durationMs ? { durationMs } : {}),
    url: `https://music.163.com/#/song?id=${id}`,
    isVip: raw.fee === 1 || raw.fee === 4,
  };
}

function parseNeteasePayload(
  data: RawNeteaseResponse,
  offset: number,
  source: "custom" | "netease",
): NeteaseSearchResponse {
  if (data.code !== 200) {
    throw new Error(
      data.message || data.msg || `网易云接口返回异常状态码 (${data.code ?? "unknown"})`,
    );
  }
  const rawSongs = Array.isArray(data.result?.songs) ? data.result.songs : [];
  const songs = rawSongs
    .map(normalizeSong)
    .filter((item): item is NeteaseSongItem => item !== null);
  const total =
    typeof data.result?.songCount === "number" &&
    Number.isFinite(data.result.songCount)
      ? Math.max(data.result.songCount, offset + songs.length)
      : offset + songs.length;
  const hasMore =
    typeof data.result?.hasMore === "boolean"
      ? data.result.hasMore
      : songs.length > 0 && offset + songs.length < total;

  return { songs, total, hasMore, source };
}

async function searchViaCustomApi(
  baseUrl: string,
  keyword: string,
  limit: number,
  offset: number,
): Promise<NeteaseSearchResponse> {
  const cleanBase = baseUrl.trim().replace(/\/+$/, "");
  if (!/^https?:\/\//i.test(cleanBase)) {
    throw new Error("NETEASE_API_URL 必须以 http:// 或 https:// 开头");
  }

  const query = new URLSearchParams({
    keywords: keyword,
    type: "1",
    limit: String(limit),
    offset: String(offset),
  }).toString();

  let res = await fetchWithTimeout(`${cleanBase}/cloudsearch?${query}`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (res.status === 404) {
    res = await fetchWithTimeout(`${cleanBase}/search?${query}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
  }

  if (!res.ok) {
    throw new Error(`自建网易云 API 请求失败 (${res.status})`);
  }

  const data = (await res.json().catch(() => null)) as RawNeteaseResponse | null;
  if (!data || typeof data !== "object") {
    throw new Error("自建网易云 API 返回了无效 JSON");
  }
  return parseNeteasePayload(data, offset, "custom");
}

async function fetchDirectEndpoint(
  endpoint: string,
  keyword: string,
  limit: number,
  offset: number,
): Promise<NeteaseSearchResponse> {
  const body = new URLSearchParams({
    s: keyword,
    type: "1",
    limit: String(limit),
    offset: String(offset),
  });

  const res = await fetchWithTimeout(endpoint, {
    method: "POST",
    headers: NETEASE_HEADERS,
    body: body.toString(),
  });

  if (!res.ok) {
    throw new Error(`网易云接口返回 HTTP ${res.status}`);
  }

  const data = (await res.json().catch(() => null)) as RawNeteaseResponse | null;
  if (!data || typeof data !== "object") {
    throw new Error("网易云接口返回了无效 JSON");
  }
  return parseNeteasePayload(data, offset, "netease");
}

async function searchViaDirectNetease(
  keyword: string,
  limit: number,
  offset: number,
): Promise<NeteaseSearchResponse> {
  try {
    return await fetchDirectEndpoint(
      "https://music.163.com/api/cloudsearch/pc",
      keyword,
      limit,
      offset,
    );
  } catch (primaryErr: any) {
    try {
      return await fetchDirectEndpoint(
        "https://music.163.com/api/search/get/web",
        keyword,
        limit,
        offset,
      );
    } catch {
      const reason = primaryErr?.message || "请求失败";
      throw new Error(
        `直连网易云搜索失败（${reason}）。若 Cloudflare 节点受限，可在 Pages 环境变量中配置 NETEASE_API_URL 指向自建 NeteaseCloudMusicApi。`,
      );
    }
  }
}

export const onRequestGet = async (context: {
  request: Request;
  env: Record<string, any>;
}) => {
  const auth = await verifyAccess(context.request, context.env);
  if (auth.error || !auth.user) {
    return jsonResponse({ error: auth.error || "Unauthorized" }, auth.status);
  }

  const url = new URL(context.request.url);
  const rawKeyword =
    url.searchParams.get("q") ?? url.searchParams.get("keywords") ?? "";
  const keyword = rawKeyword.trim();

  if (!keyword) {
    return jsonResponse({ error: "请输入搜索关键词" }, 400);
  }
  if (keyword.length > MAX_KEYWORD_LEN) {
    return jsonResponse(
      { error: `搜索关键词过长（最多 ${MAX_KEYWORD_LEN} 字）` },
      400,
    );
  }

  const rawLimit = Number(url.searchParams.get("limit"));
  const limit =
    Number.isFinite(rawLimit) && rawLimit > 0
      ? Math.min(Math.floor(rawLimit), MAX_LIMIT)
      : DEFAULT_LIMIT;

  const rawOffset = Number(url.searchParams.get("offset"));
  const offset =
    Number.isFinite(rawOffset) && rawOffset >= 0 ? Math.floor(rawOffset) : 0;

  const customApiUrl =
    typeof context.env.NETEASE_API_URL === "string"
      ? context.env.NETEASE_API_URL.trim()
      : "";

  try {
    const result = customApiUrl
      ? await searchViaCustomApi(customApiUrl, keyword, limit, offset)
      : await searchViaDirectNetease(keyword, limit, offset);

    return jsonResponse(result, 200, {
      "Cache-Control": "private, max-age=60",
    });
  } catch (err: any) {
    const message =
      err?.name === "AbortError"
        ? "搜索网易云音乐超时，请稍后重试"
        : err?.message || "搜索网易云音乐失败";
    return jsonResponse({ error: message }, 502);
  }
};

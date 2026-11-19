import { jwtVerify, createRemoteJWKSet } from "jose";

export function jsonResponse(
  data: unknown,
  status = 200,
  extraHeaders: HeadersInit = {},
): Response {
  const headers = new Headers(extraHeaders);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return new Response(JSON.stringify(data), { status, headers });
}

export interface AccessUser {
  email: string;
  sub: string;
  name?: string;
  isMock?: boolean;
}

const jwksCache = new Map<string, ReturnType<typeof createRemoteJWKSet>>();

function getJWKS(teamDomain: string) {
  let domain = teamDomain.trim().replace(/^https?:\/\//, "").replace(/\/+$/, "");
  if (!domain.includes(".")) {
    domain = `${domain}.cloudflareaccess.com`;
  }
  if (!jwksCache.has(domain)) {
    jwksCache.set(domain, createRemoteJWKSet(new URL(`https://${domain}/cdn-cgi/access/certs`)));
  }
  return {
    jwks: jwksCache.get(domain)!,
    issuer: `https://${domain}`,
  };
}

function extractToken(request: Request): string | null {
  const headerToken =
    request.headers.get("cf-access-jwt-assertion") ||
    request.headers.get("Cf-Access-Jwt-Assertion");
  if (headerToken) return headerToken.trim();

  const cookie = request.headers.get("Cookie") || "";
  const cookieMatch = cookie.match(/(?:^|;\s*)CF_Authorization=([^;]+)/);
  if (cookieMatch) return cookieMatch[1].trim();

  const authHeader = request.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7).trim();
  }
  return null;
}

/** Strict Cloudflare Access JWT verification; local mock is strictly limited to localhost + DEV_MODE=true. */
export async function verifyAccess(
  request: Request,
  env: Record<string, any>,
): Promise<{ user?: AccessUser; error?: string; status: number }> {
  const { hostname } = new URL(request.url);
  const isLocalHost =
    hostname === "localhost" || hostname === "127.0.0.1" || hostname === "0.0.0.0";

  if (isLocalHost && env.DEV_MODE === "true") {
    return {
      user: {
        email: "developer@oblivion.local",
        sub: "dev-user-local",
        name: "本地开发者",
        isMock: true,
      },
      status: 200,
    };
  }

  const teamDomain = typeof env.CF_ACCESS_TEAM_DOMAIN === "string" ? env.CF_ACCESS_TEAM_DOMAIN.trim() : "";
  const audience = typeof env.CF_ACCESS_AUD === "string" ? env.CF_ACCESS_AUD.trim() : "";

  if (!teamDomain || !audience) {
    return {
      status: 503,
      error: "服务器错误：未配置 Cloudflare Access (CF_ACCESS_TEAM_DOMAIN / CF_ACCESS_AUD)",
    };
  }

  const token = extractToken(request);
  if (!token) {
    return {
      status: 401,
      error: "未授权：未检测到 Cloudflare Access 身份凭证 (Cf-Access-Jwt-Assertion)",
    };
  }

  try {
    const { jwks, issuer } = getJWKS(teamDomain);
    const { payload } = await jwtVerify(token, jwks, { issuer, audience });
    return {
      status: 200,
      user: {
        email: String(payload.email || payload.sub || "access-user"),
        sub: String(payload.sub || "access-user"),
        name: typeof payload.name === "string" ? payload.name : undefined,
        isMock: false,
      },
    };
  } catch {
    return {
      status: 403,
      error: "Cloudflare Access 凭证无效或已过期",
    };
  }
}

import { jwtVerify, createRemoteJWKSet } from "jose";

export interface AccessUser {
  email: string;
  sub: string;
  name?: string;
  isMock?: boolean;
}

export interface AccessConfig {
  teamDomain?: string; // e.g. "your-team.cloudflareaccess.com"
  aud?: string;
  allowLocalMock?: boolean;
  environment?: string;
}

// In-memory cached remote JWK sets by team domain
const jwksCache = new Map<string, ReturnType<typeof createRemoteJWKSet>>();

function getJWKS(teamDomain: string) {
  const normalized = teamDomain.includes(".")
    ? teamDomain
    : `${teamDomain}.cloudflareaccess.com`;

  if (!jwksCache.has(normalized)) {
    const certsUrl = new URL(`https://${normalized}/cdn-cgi/access/certs`);
    jwksCache.set(normalized, createRemoteJWKSet(certsUrl));
  }
  return {
    jwks: jwksCache.get(normalized)!,
    issuer: `https://${normalized}`,
  };
}

/**
 * Pure Cloudflare Access JWT verification
 */
export async function verifyCloudflareAccess(
  request: Request,
  env: Record<string, string | undefined>
): Promise<{ user?: AccessUser; error?: string; status: number }> {
  const url = new URL(request.url);
  const isLocalHost =
    url.hostname === "localhost" ||
    url.hostname === "127.0.0.1" ||
    url.hostname === "0.0.0.0";

  const allowLocalMock =
    (env.ALLOW_LOCAL_MOCK_AUTH === "true" || env.DEV_MODE === "true") &&
    isLocalHost;

  // Retrieve Access token from header or cookie
  let token = request.headers.get("Cf-Access-Jwt-Assertion");
  if (!token) {
    const cookieHeader = request.headers.get("Cookie") || "";
    const match = cookieHeader.match(/CF_Authorization=([^;]+)/);
    if (match) {
      token = match[1];
    }
  }

  // Also support custom bearer header for API test clients
  if (!token) {
    const authHeader = request.headers.get("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const candidate = authHeader.slice(7).trim();
      if (candidate.startsWith("mock-dev") && allowLocalMock) {
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
      token = candidate;
    }
  }

  // If no token is provided
  if (!token) {
    if (allowLocalMock) {
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

    return {
      error: "未授权：未检测到 Cloudflare Access 身份凭证 (Cf-Access-Jwt-Assertion)",
      status: 401,
    };
  }

  const teamDomain = env.CF_ACCESS_TEAM_DOMAIN;
  const expectedAud = env.CF_ACCESS_AUD;

  // In production, missing Access credentials triggers 500 error
  if (!teamDomain || !expectedAud) {
    if (allowLocalMock) {
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

    return {
      error: "服务器错误：Cloudflare Access 生产配置缺失 (CF_ACCESS_TEAM_DOMAIN / CF_ACCESS_AUD)",
      status: 500,
    };
  }

  try {
    const { jwks, issuer } = getJWKS(teamDomain);
    const { payload } = await jwtVerify(token, jwks, {
      issuer,
      audience: expectedAud,
    });

    const email = (payload.email as string) || (payload.sub as string) || "authenticated-user";
    const sub = (payload.sub as string) || "";
    const name = (payload.name as string) || undefined;

    return {
      user: {
        email,
        sub,
        name,
        isMock: false,
      },
      status: 200,
    };
  } catch (err: any) {
    return {
      error: `Cloudflare Access 凭证无效或已过期: ${err?.message || "Invalid JWT"}`,
      status: 403,
    };
  }
}

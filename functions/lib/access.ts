import { jwtVerify, createRemoteJWKSet, SignJWT } from "jose";

export interface AccessUser {
  email: string;
  sub: string;
  name?: string;
  isMock?: boolean;
}

export interface AccessConfig {
  teamDomain?: string;
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

function getJwtSecretKey(env: Record<string, string | undefined>): Uint8Array {
  const secret = env.JWT_SECRET || env.ADMIN_PASSWORD || "oblivion-default-secret-key-change-me";
  return new TextEncoder().encode(secret);
}

/**
 * Sign a session JWT for password-based admin login
 */
export async function createAdminSessionToken(
  user: { email: string; name: string },
  env: Record<string, string | undefined>
): Promise<string> {
  const secretKey = getJwtSecretKey(env);
  return await new SignJWT({
    email: user.email,
    name: user.name,
    sub: "admin",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);
}

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

  // 1. Check custom admin session token from Authorization header or cookie
  let sessionToken: string | null = null;
  const authHeader = request.headers.get("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    sessionToken = authHeader.slice(7).trim();
  } else {
    const cookieHeader = request.headers.get("Cookie") || "";
    const match = cookieHeader.match(/oblivion_token=([^;]+)/);
    if (match) {
      sessionToken = match[1];
    }
  }

  if (sessionToken) {
    try {
      const secretKey = getJwtSecretKey(env);
      const { payload } = await jwtVerify(sessionToken, secretKey);
      return {
        user: {
          email: (payload.email as string) || "admin@oblivion",
          sub: (payload.sub as string) || "admin",
          name: (payload.name as string) || "管理员",
          isMock: false,
        },
        status: 200,
      };
    } catch {
      // Session token invalid or expired, continue to check Cloudflare Access
    }
  }

  // 2. Check Cloudflare Access JWT Assertion header or cookie
  let cfToken = request.headers.get("Cf-Access-Jwt-Assertion");
  if (!cfToken) {
    const cookieHeader = request.headers.get("Cookie") || "";
    const match = cookieHeader.match(/CF_Authorization=([^;]+)/);
    if (match) {
      cfToken = match[1];
    }
  }

  if (cfToken) {
    const teamDomain = env.CF_ACCESS_TEAM_DOMAIN;
    const expectedAud = env.CF_ACCESS_AUD;

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
      const { payload } = await jwtVerify(cfToken, jwks, {
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

  // 3. Local development fallback if allowed
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

  // 4. Default: Unauthorized
  return {
    error: "未授权：请先登录管理员账户",
    status: 401,
  };
}

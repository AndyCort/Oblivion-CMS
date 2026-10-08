import { jwtVerify, createRemoteJWKSet } from "jose";

export interface AccessUser {
  email: string;
  sub: string;
  name?: string;
  isMock?: boolean;
}

// In-memory cached remote JWK sets by team domain
const jwksCache = new Map<string, ReturnType<typeof createRemoteJWKSet>>();

function getJWKS(teamDomain: string) {
  let domain = teamDomain.trim().replace(/^https?:\/\//, "").replace(/\/+$/, "");
  if (!domain.includes(".")) {
    domain = `${domain}.cloudflareaccess.com`;
  }

  if (!jwksCache.has(domain)) {
    const certsUrl = new URL(`https://${domain}/cdn-cgi/access/certs`);
    jwksCache.set(domain, createRemoteJWKSet(certsUrl));
  }
  return {
    jwks: jwksCache.get(domain)!,
    issuer: `https://${domain}`,
  };
}

/**
 * Pure Cloudflare Access JWT & Edge header verification
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

  // Retrieve edge-injected headers (Cloudflare Edge injects these after successful Access login)
  const edgeEmail =
    request.headers.get("cf-access-authenticated-user-email") ||
    request.headers.get("Cf-Access-Authenticated-User-Email");
  const edgeUserId =
    request.headers.get("cf-access-user-id") ||
    request.headers.get("Cf-Access-User-Id");

  // Retrieve Access JWT assertion from header or cookie
  let token =
    request.headers.get("cf-access-jwt-assertion") ||
    request.headers.get("Cf-Access-Jwt-Assertion");

  if (!token) {
    const cookieHeader = request.headers.get("Cookie") || "";
    const match = cookieHeader.match(/CF_Authorization=([^;]+)/);
    if (match) {
      token = match[1];
    }
  }

  // Support local bearer token for dev/test
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

  // 1. If we have a JWT token, verify it
  if (token) {
    const teamDomain = env.CF_ACCESS_TEAM_DOMAIN;
    const expectedAud = env.CF_ACCESS_AUD;

    if (teamDomain) {
      try {
        const { jwks } = getJWKS(teamDomain);
        const verifyOptions: any = {};
        if (expectedAud) {
          verifyOptions.audience = expectedAud.trim();
        }

        const { payload } = await jwtVerify(token, jwks, verifyOptions);

        const email =
          (payload.email as string) ||
          edgeEmail ||
          (payload.sub as string) ||
          "authenticated-user";
        const sub = (payload.sub as string) || edgeUserId || "access-user";
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
        // If JWT validation threw, but Cloudflare Edge has already verified the user
        if (edgeEmail) {
          return {
            user: {
              email: edgeEmail,
              sub: edgeUserId || "access-user",
              isMock: false,
            },
            status: 200,
          };
        }

        return {
          error: `Cloudflare Access 凭证无效或已过期: ${err?.message || "Invalid JWT"}`,
          status: 403,
        };
      }
    } else if (edgeEmail) {
      // If teamDomain is not yet configured, but Edge forwarded an authenticated user
      return {
        user: {
          email: edgeEmail,
          sub: edgeUserId || "access-user",
          isMock: false,
        },
        status: 200,
      };
    } else {
      // Production without teamDomain and without edgeEmail
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
        error: "服务器错误：Cloudflare Access 生产配置缺失 (未配置 CF_ACCESS_TEAM_DOMAIN 环境变量)",
        status: 500,
      };
    }
  }

  // 2. If no token, but Edge has authenticated header
  if (edgeEmail) {
    return {
      user: {
        email: edgeEmail,
        sub: edgeUserId || "access-user",
        isMock: false,
      },
      status: 200,
    };
  }

  // 3. Local development fallback
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

  // 4. Unauthorized
  return {
    error: "未授权：未检测到 Cloudflare Access 身份凭证 (Cf-Access-Jwt-Assertion)",
    status: 401,
  };
}

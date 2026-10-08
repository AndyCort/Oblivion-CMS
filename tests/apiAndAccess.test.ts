import { describe, it, expect } from "vitest";
import { verifyCloudflareAccess, createAdminSessionToken } from "../functions/lib/access";
import { encodeBase64Utf8, decodeBase64Utf8 } from "../functions/lib/github";
import { onRequestGet as getArticles } from "../functions/api/articles";
import { onRequestPost as publishArticle } from "../functions/api/publish";
import { onRequestPost as loginPost } from "../functions/api/auth/login";

describe("Base64 UTF-8 encoding & decoding", () => {
  it("correctly encodes and decodes Chinese characters and emojis without data loss", () => {
    const original = "好的结果也可以是一种诅咒，而坏的结果也许是一种缓冲。✨🚀\n换行测试：'\"`";
    const encoded = encodeBase64Utf8(original);
    const decoded = decodeBase64Utf8(encoded);
    expect(decoded).toBe(original);
  });
});

describe("Cloudflare Access Verification", () => {
  it("rejects requests without token in production mode", async () => {
    const req = new Request("https://cms.oblivion.com/api/articles", {
      headers: {},
    });
    const env = {
      DEV_MODE: "false",
      ALLOW_LOCAL_MOCK_AUTH: "false",
      CF_ACCESS_TEAM_DOMAIN: "my-team",
      CF_ACCESS_AUD: "test-aud",
    };

    const result = await verifyCloudflareAccess(req, env);
    expect(result.status).toBe(401);
    expect(result.error).toContain("未授权");
  });

  it("permits local development mock user on localhost when enabled", async () => {
    const req = new Request("http://localhost:5173/api/articles", {
      headers: {},
    });
    const env = {
      DEV_MODE: "true",
      ALLOW_LOCAL_MOCK_AUTH: "true",
    };

    const result = await verifyCloudflareAccess(req, env);
    expect(result.status).toBe(200);
    expect(result.user?.email).toBe("developer@oblivion.local");
    expect(result.user?.isMock).toBe(true);
  });

  it("fails safely when Access config is missing in production", async () => {
    const req = new Request("https://cms.oblivion.com/api/articles", {
      headers: {
        "Cf-Access-Jwt-Assertion": "some-token",
      },
    });
    const env = {
      DEV_MODE: "false",
      ALLOW_LOCAL_MOCK_AUTH: "false",
    };

    const result = await verifyCloudflareAccess(req, env);
    expect(result.status).toBe(500);
    expect(result.error).toContain("生产配置缺失");
  });
});

describe("API Endpoints & Conflict Detection", () => {
  const localEnv = {
    DEV_MODE: "true",
    ALLOW_LOCAL_MOCK_AUTH: "true",
  };

  it("GET /api/articles returns articles list and SHA in mock mode", async () => {
    const req = new Request("http://localhost:5173/api/articles");
    const res = await getArticles({ request: req, env: localEnv });

    expect(res.status).toBe(200);
    const data: any = await res.json();
    expect(data.articles).toBeDefined();
    expect(data.articles.length).toBeGreaterThan(0);
    expect(data.sha).toBeDefined();
    expect(data.isMock).toBe(true);
  });

  it("POST /api/publish detects conflict when baseSha is mismatched", async () => {
    // 1. Get current articles to get valid SHA
    const getReq = new Request("http://localhost:5173/api/articles");
    const getRes = await getArticles({ request: getReq, env: localEnv });
    const getData: any = await getRes.json();

    // 2. Attempt publish with outdated SHA
    const postReq = new Request("http://localhost:5173/api/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "create",
        article: {
          time: Date.now(),
          content: "Conflict test",
          media: [],
          tags: ["test"],
          location: "test",
        },
        baseSha: "outdated-sha-12345",
      }),
    });

    const postRes = await publishArticle({ request: postReq, env: localEnv });
    expect(postRes.status).toBe(409);
    const errorData: any = await postRes.json();
    expect(errorData.error).toBe("CONFLICT");
    expect(errorData.remoteSha).toBe(getData.sha);
  });

  it("POST /api/publish successfully creates a new article with matching SHA", async () => {
    // 1. Get current SHA
    const getReq = new Request("http://localhost:5173/api/articles");
    const getRes = await getArticles({ request: getReq, env: localEnv });
    const getData: any = await getRes.json();
    const currentSha = getData.sha;
    const initialCount = getData.articles.length;

    // 2. Publish new article
    const postReq = new Request("http://localhost:5173/api/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "create",
        article: {
          time: 1800000000000,
          content: "API created article! 🚀",
          media: [
            {
              type: "img",
              url: "https://example.com/test.jpg",
            },
          ],
          tags: ["API测试"],
          location: "API云端",
        },
        baseSha: currentSha,
        commitMessage: "content: test add from integration test",
      }),
    });

    const postRes = await publishArticle({ request: postReq, env: localEnv });
    expect(postRes.status).toBe(200);
    const postData: any = await postRes.json();
    expect(postData.success).toBe(true);
    expect(postData.newSha).toBeDefined();
    expect(postData.articleCount).toBe(initialCount + 1);

    // 3. Verify via GET
    const verifyReq = new Request("http://localhost:5173/api/articles");
    const verifyRes = await getArticles({ request: verifyReq, env: localEnv });
    const verifyData: any = await verifyRes.json();
    expect(verifyData.articles[0].content).toBe("API created article! 🚀");
  });
});

describe("Admin Password Authentication & Session Tokens", () => {
  const envWithPassword = {
    ADMIN_PASSWORD: "secret-super-password-123",
    DEV_MODE: "false",
    ALLOW_LOCAL_MOCK_AUTH: "false",
  };

  it("POST /api/auth/login rejects incorrect passwords with 401", async () => {
    const req = new Request("https://cms.oblivion.com/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: "wrong-password" }),
    });

    const res = await loginPost({ request: req, env: envWithPassword });
    expect(res.status).toBe(401);
    const data: any = await res.json();
    expect(data.error).toContain("密码错误");
  });

  it("POST /api/auth/login successfully logs in with correct password and sets session token", async () => {
    const req = new Request("https://cms.oblivion.com/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: "secret-super-password-123" }),
    });

    const res = await loginPost({ request: req, env: envWithPassword });
    expect(res.status).toBe(200);
    const data: any = await res.json();
    expect(data.success).toBe(true);
    expect(data.token).toBeDefined();

    // Verify session token enables access in verifyCloudflareAccess
    const authenticatedReq = new Request("https://cms.oblivion.com/api/articles", {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    });

    const authCheck = await verifyCloudflareAccess(authenticatedReq, envWithPassword);
    expect(authCheck.status).toBe(200);
    expect(authCheck.user?.email).toBe("admin@oblivion");
  });
});

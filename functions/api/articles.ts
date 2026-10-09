import { verifyCloudflareAccess } from "../lib/access";
import { getD1Articles } from "../lib/d1";

export const onRequestGet = async (context: {
  request: Request;
  env: Record<string, any>;
}) => {
  const { request, env } = context;

  // 1. Authenticate with Cloudflare Access
  const auth = await verifyCloudflareAccess(request, env);
  if (auth.error || !auth.user) {
    return new Response(
      JSON.stringify({ error: auth.error || "Unauthorized" }),
      {
        status: auth.status,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // 2. Fetch data from Cloudflare D1 (or fallback)
  try {
    const { articles, sha, isD1, d1Mode, warning } = await getD1Articles(env);

    return new Response(
      JSON.stringify({
        articles,
        sha,
        path: isD1 ? "Cloudflare D1: articles 表" : "离线只读模拟环境",
        branch: isD1 ? (d1Mode === "native" ? "D1 原生绑定 (env.DB)" : "D1 REST API 直连") : "未绑定 D1",
        owner: "Cloudflare",
        repo: "D1 Database",
        isD1,
        isMock: !isD1,
        d1Mode,
        warning,
        total: articles.length,
        user: auth.user,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        error: `读取 Cloudflare D1 数据库失败: ${err.message}`,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

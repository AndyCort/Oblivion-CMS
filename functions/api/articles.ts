import { jsonResponse, verifyCloudflareAccess } from "../lib/access";
import { getD1Articles } from "../lib/d1";

export const onRequestGet = async (context: {
  request: Request;
  env: Record<string, any>;
}) => {
  const { request, env } = context;

  const auth = await verifyCloudflareAccess(request, env);
  if (auth.error || !auth.user) {
    return jsonResponse({ error: auth.error || "Unauthorized" }, auth.status);
  }

  try {
    const {
      articles,
      sha,
      isD1,
      d1Mode,
      bindingName,
      tableName,
      warning,
      envKeys,
    } = await getD1Articles(env);

    return jsonResponse(
      {
        articles,
        sha,
        path: isD1 ? `Cloudflare D1: ${tableName} 表` : "离线只读模拟环境",
        branch: isD1
          ? d1Mode === "native"
            ? `D1 原生绑定 (env.${bindingName || "DB"})`
            : "D1 REST API 直连"
          : "未绑定 D1",
        owner: "Cloudflare",
        repo: "D1 Database",
        isD1,
        isMock: !isD1,
        d1Mode,
        bindingName,
        envKeys,
        warning,
        total: articles.length,
        user: auth.user,
      },
      200,
      { "Cache-Control": "no-store, no-cache, must-revalidate" },
    );
  } catch (err: any) {
    return jsonResponse(
      { error: `读取 Cloudflare D1 数据库失败: ${err.message}` },
      500,
    );
  }
};

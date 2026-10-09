import { verifyCloudflareAccess } from "../lib/access";
import type { Article } from "../../src/types/article";
import { batchImportD1Articles } from "../lib/d1";

export interface ImportRequest {
  articles: Article[];
  mode?: "merge" | "overwrite";
}

export interface ImportResponse {
  success: boolean;
  count: number;
  total: number;
  newSha: string;
  mode: "merge" | "overwrite";
  message: string;
}

export const onRequestPost = async (context: {
  request: Request;
  env: Record<string, any>;
}) => {
  const { request, env } = context;

  // 1. Authenticate with Cloudflare Access
  const auth = await verifyCloudflareAccess(request, env);
  if (auth.error || !auth.user) {
    return new Response(
      JSON.stringify({ error: auth.error || "未授权访问" }),
      {
        status: auth.status,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // 2. Parse request payload
  let payload: ImportRequest;
  try {
    payload = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "无效的 JSON 请求体" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { articles, mode = "merge" } = payload;

  if (!Array.isArray(articles) || articles.length === 0) {
    return new Response(
      JSON.stringify({ error: "待导入的文章列表不能为空" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  if (mode !== "merge" && mode !== "overwrite") {
    return new Response(
      JSON.stringify({ error: "导入模式必须为 merge 或 overwrite" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // 3. Execute batch import in D1
  try {
    const result = await batchImportD1Articles(env, articles, mode);
    const modeLabel = mode === "overwrite" ? "全量覆盖" : "增量合并";

    const responseData: ImportResponse = {
      success: true,
      count: result.count,
      total: result.total,
      newSha: result.sha,
      mode,
      message: `成功${modeLabel}导入 ${result.count} 篇文章（当前云端数据库共计 ${result.total} 篇）`,
    };

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: `批量导入到 Cloudflare D1 失败: ${err.message}` }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

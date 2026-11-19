import { jsonResponse, verifyCloudflareAccess } from "../lib/access";
import type { Article } from "../../src/types/article";
import { batchImportD1Articles } from "../lib/d1";

interface ImportRequest {
  articles: Article[];
  mode?: "merge" | "overwrite";
}

interface ImportResponse {
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

  const auth = await verifyCloudflareAccess(request, env);
  if (auth.error || !auth.user) {
    return jsonResponse({ error: auth.error || "未授权访问" }, auth.status);
  }

  let payload: ImportRequest;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: "无效的 JSON 请求体" }, 400);
  }

  const { articles, mode = "merge" } = payload;

  if (!Array.isArray(articles) || articles.length === 0) {
    return jsonResponse({ error: "待导入的文章列表不能为空" }, 400);
  }

  if (mode !== "merge" && mode !== "overwrite") {
    return jsonResponse({ error: "导入模式必须为 merge 或 overwrite" }, 400);
  }

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

    return jsonResponse(responseData);
  } catch (err: any) {
    return jsonResponse(
      { error: `批量导入到 Cloudflare D1 失败: ${err.message}` },
      500,
    );
  }
};

import { verifyCloudflareAccess } from "../lib/access";
import type { PublishRequest, PublishResponse } from "../../src/types/article";
import {
  saveD1Article,
  updateD1Article,
  deleteD1Article,
  extractTimeFromFingerprint,
  getD1Articles,
} from "../lib/d1";

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
  let payload: PublishRequest;
  try {
    payload = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "无效的 JSON 请求体" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { action, article, targetFingerprint, baseSha, commitMessage, force } = payload;

  if (!action || !["create", "update", "delete"].includes(action)) {
    return new Response(
      JSON.stringify({ error: "action 必须为 create, update 或 delete" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Include schema/read failures in the API JSON error response.
  try {
    // Check optimistic locking version if baseSha provided and not forced
    const { sha: currentSha } = await getD1Articles(env);
    if (!force && baseSha && baseSha !== currentSha) {
      return new Response(
        JSON.stringify({
          error: "CONFLICT",
          message: "检测到版本冲突：数据在此期间已被更新。请刷新数据并合并您的改动后再发布。",
          remoteSha: currentSha,
          clientBaseSha: baseSha,
        }),
        {
          status: 409,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if ((action === "create" || action === "update") && !article) {
      return new Response(JSON.stringify({ error: "缺少 article 数据" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if ((action === "update" || action === "delete") && !targetFingerprint) {
      return new Response(
        JSON.stringify({ error: "操作已有文章时必须提供 targetFingerprint" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 3. Execute database operation in Cloudflare D1
    let newSha = "";
    let summaryMsg = "";

    if (action === "create") {
      newSha = await saveD1Article(env, article!, true);
      summaryMsg =
        commitMessage?.trim() ||
        `D1: 发表文章 (${new Date(article!.time).toISOString().slice(0, 10)})`;
    } else if (action === "update") {
      const targetTime = extractTimeFromFingerprint(targetFingerprint!);
      newSha = await updateD1Article(env, targetTime, article!);
      summaryMsg = commitMessage?.trim() || `D1: 更新文章 (${targetTime})`;
    } else if (action === "delete") {
      const targetTime = extractTimeFromFingerprint(targetFingerprint!);
      newSha = await deleteD1Article(env, targetTime);
      summaryMsg = commitMessage?.trim() || `D1: 删除文章 (${targetTime})`;
    }

    const { articles, sha: currentDbSha } = await getD1Articles(env);

    const responseData: PublishResponse = {
      success: true,
      newSha: currentDbSha || newSha,
      commitMessage: summaryMsg,
      articleCount: articles.length,
    };

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        error: `保存到 Cloudflare D1 失败: ${err.message}`,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

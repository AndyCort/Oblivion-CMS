import { jsonResponse, verifyCloudflareAccess } from "../lib/access";
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

  const auth = await verifyCloudflareAccess(request, env);
  if (auth.error || !auth.user) {
    return jsonResponse({ error: auth.error || "未授权访问" }, auth.status);
  }

  let payload: PublishRequest;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: "无效的 JSON 请求体" }, 400);
  }

  const { action, article, targetFingerprint, baseSha, commitMessage, force } =
    payload;

  if (!action || !["create", "update", "delete"].includes(action)) {
    return jsonResponse(
      { error: "action 必须为 create, update 或 delete" },
      400,
    );
  }

  try {
    const { sha: currentSha } = await getD1Articles(env);
    if (!force && baseSha && baseSha !== currentSha) {
      return jsonResponse(
        {
          error: "CONFLICT",
          message:
            "检测到版本冲突：数据在此期间已被更新。请刷新数据并合并您的改动后再发布。",
          remoteSha: currentSha,
          clientBaseSha: baseSha,
        },
        409,
      );
    }

    if ((action === "create" || action === "update") && !article) {
      return jsonResponse({ error: "缺少 article 数据" }, 400);
    }

    if ((action === "update" || action === "delete") && !targetFingerprint) {
      return jsonResponse(
        { error: "操作已有文章时必须提供 targetFingerprint" },
        400,
      );
    }

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
    } else {
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

    return jsonResponse(responseData);
  } catch (err: any) {
    return jsonResponse(
      { error: `保存到 Cloudflare D1 失败: ${err.message}` },
      500,
    );
  }
};

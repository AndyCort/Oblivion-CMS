import { jsonResponse, verifyAccess } from "../../lib/access";
import { listMoments, MomentHttpError, upsertMoment } from "../../lib/d1";
import type { Article, MomentSaveRequest } from "../../../src/types/article";

function isValidMoment(value: unknown): value is Article {
  if (!value || typeof value !== "object") return false;
  const item = value as Article;
  return (
    typeof item.time === "number" &&
    Number.isFinite(item.time) &&
    item.time > 0 &&
    typeof item.content === "string" &&
    Array.isArray(item.media) &&
    Array.isArray(item.tags) &&
    typeof item.location === "string"
  );
}

export const onRequestGet = async (context: {
  request: Request;
  env: Record<string, any>;
}) => {
  const auth = await verifyAccess(context.request, context.env);
  if (auth.error || !auth.user) {
    return jsonResponse({ error: auth.error || "Unauthorized" }, auth.status);
  }

  try {
    const data = await listMoments(context.env);
    return jsonResponse(
      {
        moments: data.moments,
        isD1: data.isD1,
        total: data.total,
        warning: data.warning,
        user: auth.user,
      },
      200,
      { "Cache-Control": "no-store" },
    );
  } catch (err: any) {
    return jsonResponse(
      { error: `读取说说数据库失败: ${err?.message || "未知错误"}` },
      500,
    );
  }
};

export const onRequestPost = async (context: {
  request: Request;
  env: Record<string, any>;
}) => {
  const auth = await verifyAccess(context.request, context.env);
  if (auth.error || !auth.user) {
    return jsonResponse({ error: auth.error || "Unauthorized" }, auth.status);
  }

  let body: MomentSaveRequest;
  try {
    body = await context.request.json();
  } catch {
    return jsonResponse({ error: "无效的 JSON 请求体" }, 400);
  }

  if (!isValidMoment(body?.moment)) {
    return jsonResponse({ error: "说说数据格式无效或缺少合法时间戳" }, 400);
  }
  if (
    body.originalTime !== undefined &&
    (typeof body.originalTime !== "number" ||
      !Number.isFinite(body.originalTime) ||
      body.originalTime <= 0)
  ) {
    return jsonResponse({ error: "originalTime 必须为正整数时间戳" }, 400);
  }

  try {
    const res = await upsertMoment(context.env, body.moment, body.originalTime);
    return jsonResponse({ success: true, ...res });
  } catch (err: any) {
    if (err instanceof MomentHttpError) {
      return jsonResponse({ error: err.message }, err.status);
    }
    return jsonResponse(
      { error: `保存说说到 D1 失败: ${err?.message || "未知错误"}` },
      500,
    );
  }
};

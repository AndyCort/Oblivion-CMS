import { jsonResponse, verifyAccess } from "../../lib/access";
import { deleteMoment, MomentHttpError } from "../../lib/d1";

export const onRequestDelete = async (context: {
  request: Request;
  env: Record<string, any>;
  params?: Record<string, string | string[]>;
}) => {
  const auth = await verifyAccess(context.request, context.env);
  if (auth.error || !auth.user) {
    return jsonResponse({ error: auth.error || "Unauthorized" }, auth.status);
  }

  const rawTime = String(context.params?.time || "");
  const time = Number(rawTime);
  if (!Number.isInteger(time) || time <= 0) {
    return jsonResponse({ error: "无效的说说时间戳参数" }, 400);
  }

  try {
    const res = await deleteMoment(context.env, time);
    return jsonResponse({ success: true, total: res.total });
  } catch (err: any) {
    if (err instanceof MomentHttpError) {
      return jsonResponse({ error: err.message }, err.status);
    }
    return jsonResponse(
      { error: `删除说说失败: ${err?.message || "未知错误"}` },
      500,
    );
  }
};

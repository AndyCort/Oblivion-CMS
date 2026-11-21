import { jsonResponse, verifyAccess } from "../../lib/access";
import { getMomentsDb } from "../../lib/d1";

export const onRequestGet = async (context: {
  request: Request;
  env: Record<string, any>;
}) => {
  const auth = await verifyAccess(context.request, context.env);
  if (auth.error || !auth.user) {
    return jsonResponse(
      { authenticated: false, error: auth.error || "未登录" },
      auth.status,
    );
  }

  const { db } = getMomentsDb(context.env);
  return jsonResponse({
    authenticated: true,
    user: auth.user,
    d1Bound: Boolean(db),
    storage: db ? "Cloudflare D1" : "Unbound",
  });
};

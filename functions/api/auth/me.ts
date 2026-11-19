import { jsonResponse, verifyCloudflareAccess } from "../../lib/access";

export const onRequestGet = async (context: {
  request: Request;
  env: Record<string, any>;
}) => {
  const { request, env } = context;
  const auth = await verifyCloudflareAccess(request, env);

  if (auth.error || !auth.user) {
    return jsonResponse(
      { authenticated: false, error: auth.error || "未登录" },
      auth.status,
    );
  }

  return jsonResponse({
    authenticated: true,
    user: auth.user,
    configured: true,
    d1Bound: Boolean(env.DB),
    storage: env.DB ? "Cloudflare D1" : "Local Mock Store",
  });
};

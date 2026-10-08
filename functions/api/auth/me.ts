import { verifyCloudflareAccess } from "../../lib/access";

export const onRequestGet = async (context: {
  request: Request;
  env: Record<string, string | undefined>;
}) => {
  const { request, env } = context;
  const auth = await verifyCloudflareAccess(request, env);

  if (auth.error || !auth.user) {
    return new Response(
      JSON.stringify({
        authenticated: false,
        error: auth.error || "未登录",
      }),
      {
        status: auth.status,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return new Response(
    JSON.stringify({
      authenticated: true,
      user: auth.user,
      configured: Boolean(env.GITHUB_TOKEN && env.GITHUB_OWNER && env.GITHUB_REPO),
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
};

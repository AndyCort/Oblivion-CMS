import { jsonResponse } from "../../lib/access";

export const onRequestPost = async (context: {
  env: Record<string, string | undefined>;
}) => {
  const teamDomain = context.env.CF_ACCESS_TEAM_DOMAIN;
  const logoutRedirect = teamDomain
    ? `https://${teamDomain}/cdn-cgi/access/logout`
    : "/cdn-cgi/access/logout";

  return jsonResponse(
    {
      success: true,
      message: "已退出 Cloudflare Access 登录",
      logoutUrl: logoutRedirect,
    },
    200,
    {
      "Set-Cookie":
        "CF_Authorization=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0",
    },
  );
};

export const onRequestPost = async (context: {
  env: Record<string, string | undefined>;
}) => {
  const { env } = context;
  const teamDomain = env.CF_ACCESS_TEAM_DOMAIN;
  const logoutRedirect = teamDomain
    ? `https://${teamDomain}/cdn-cgi/access/logout`
    : "/cdn-cgi/access/logout";

  const headers = new Headers({
    "Content-Type": "application/json",
    "Set-Cookie": "CF_Authorization=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0",
  });

  return new Response(
    JSON.stringify({
      success: true,
      message: "已退出 Cloudflare Access 登录",
      logoutUrl: logoutRedirect,
    }),
    {
      status: 200,
      headers,
    }
  );
};

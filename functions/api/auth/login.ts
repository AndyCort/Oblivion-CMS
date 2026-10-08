import { createAdminSessionToken } from "../../lib/access";

export const onRequestPost = async (context: {
  request: Request;
  env: Record<string, string | undefined>;
}) => {
  const { request, env } = context;

  let body: { password?: string } = {};
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "请求格式错误，应为 JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { password } = body;
  if (!password) {
    return new Response(JSON.stringify({ error: "请输入密码" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Expected password from environment variable
  const expectedPassword = env.ADMIN_PASSWORD || (env.DEV_MODE === "true" || env.ALLOW_LOCAL_MOCK_AUTH === "true" ? "admin" : "");

  if (!expectedPassword) {
    return new Response(
      JSON.stringify({
        error: "服务端未配置 ADMIN_PASSWORD 环境变量，请在 Cloudflare Pages 设置中配置",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  if (password !== expectedPassword) {
    return new Response(JSON.stringify({ error: "密码错误，请重新输入" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const user = {
    email: "admin@oblivion",
    name: "管理员",
  };

  const token = await createAdminSessionToken(user, env);

  const responseHeaders = new Headers({
    "Content-Type": "application/json",
    "Set-Cookie": `oblivion_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`,
  });

  return new Response(
    JSON.stringify({
      success: true,
      token,
      user,
    }),
    {
      status: 200,
      headers: responseHeaders,
    }
  );
};

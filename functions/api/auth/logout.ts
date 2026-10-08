export const onRequestPost = async () => {
  const headers = new Headers({
    "Content-Type": "application/json",
    "Set-Cookie": "oblivion_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0",
  });

  return new Response(JSON.stringify({ success: true, message: "已安全登出" }), {
    status: 200,
    headers,
  });
};

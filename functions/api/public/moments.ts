import { getD1Articles } from "../../lib/d1";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

export const onRequestOptions = async () => {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
};

export const onRequestGet = async (context: {
  request: Request;
  env: Record<string, any>;
}) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const isWrapped = url.searchParams.get("format") === "wrapped";

  try {
    const { articles, sha } = await getD1Articles(env);

    const body = isWrapped
      ? JSON.stringify({
          moments: articles,
          total: articles.length,
          revision: sha,
          source: "Cloudflare D1 Database",
        })
      : JSON.stringify(articles);

    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=15, s-maxage=60, stale-while-revalidate=120",
        ...CORS_HEADERS,
      },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        error: "Failed to fetch moments from database",
        message: err.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...CORS_HEADERS,
        },
      }
    );
  }
};

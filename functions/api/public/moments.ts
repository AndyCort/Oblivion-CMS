import { jsonResponse } from "../../lib/access";
import { getD1Articles } from "../../lib/d1";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

export const onRequestOptions = async () =>
  new Response(null, { status: 204, headers: CORS_HEADERS });

export const onRequestGet = async (context: {
  request: Request;
  env: Record<string, any>;
}) => {
  const { request, env } = context;
  const isWrapped =
    new URL(request.url).searchParams.get("format") === "wrapped";

  try {
    const { articles, sha } = await getD1Articles(env);
    const payload = isWrapped
      ? {
          moments: articles,
          total: articles.length,
          revision: sha,
          source: "Cloudflare D1 Database",
        }
      : articles;

    return jsonResponse(payload, 200, {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control":
        "public, max-age=15, s-maxage=60, stale-while-revalidate=120",
      ...CORS_HEADERS,
    });
  } catch (err: any) {
    return jsonResponse(
      {
        error: "Failed to fetch moments from database",
        message: err.message,
      },
      500,
      CORS_HEADERS,
    );
  }
};

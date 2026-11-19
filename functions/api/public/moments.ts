import { jsonResponse } from "../../lib/access";
import { listMoments } from "../../lib/d1";

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
  const isWrapped =
    new URL(context.request.url).searchParams.get("format") === "wrapped";

  try {
    const { moments, revision } = await listMoments(context.env);
    const payload = isWrapped
      ? {
          moments,
          total: moments.length,
          revision,
          source: "Cloudflare D1 Database",
        }
      : moments;

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
        message: err?.message || "Unknown error",
      },
      500,
      CORS_HEADERS,
    );
  }
};

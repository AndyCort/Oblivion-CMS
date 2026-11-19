import * as babelParser from "@babel/parser";
import type {
  Article,
  ArticleMedia,
  ArticleMusic,
} from "../../types/article";
import { generateArticleFingerprint } from "../../types/article";

interface ArticleNodeInfo {
  start: number;
  end: number;
  fingerprint: string;
  article: Article;
  isDynamic: boolean;
  dynamicReason?: string;
}

interface ParseResult {
  code: string;
  articles: Article[];
  articleNodes: ArticleNodeInfo[];
  exportName: string;
}

/**
 * Extract a static value from an AST node.
 * Returns { ok: true, value } or { ok: false, reason, value? }
 */
function extractStaticValue(
  node: any,
  code: string,
): { ok: boolean; value?: any; reason?: string } {
  if (!node) return { ok: true, value: undefined };

  switch (node.type) {
    case "StringLiteral":
    case "NumericLiteral":
    case "BooleanLiteral":
      return { ok: true, value: node.value };
    case "NullLiteral":
      return { ok: true, value: null };
    case "TemplateLiteral": {
      if (node.expressions && node.expressions.length > 0) {
        return {
          ok: false,
          reason: "Template literal contains dynamic expressions (${...})",
          value: code.slice(node.start, node.end),
        };
      }
      const raw = node.quasis
        .map((q: any) => q.value.cooked ?? q.value.raw)
        .join("");
      return { ok: true, value: raw };
    }
    case "ArrayExpression": {
      const arr: any[] = [];
      let allStatic = true;
      let firstReason = "";
      for (const el of node.elements) {
        if (!el) continue;
        const res = extractStaticValue(el, code);
        if (!res.ok) {
          allStatic = false;
          if (!firstReason) firstReason = res.reason || "";
        }
        arr.push(res.value);
      }
      return allStatic
        ? { ok: true, value: arr }
        : { ok: false, reason: firstReason, value: arr };
    }
    case "ObjectExpression": {
      const obj: Record<string, any> = {};
      let allStatic = true;
      let firstReason = "";
      for (const prop of node.properties) {
        if (prop.type === "SpreadElement") {
          return { ok: false, reason: "Spread element (...obj) not supported" };
        }
        if (prop.type === "ObjectMethod") {
          return { ok: false, reason: "Object methods not supported" };
        }
        const key =
          prop.key.type === "Identifier" ? prop.key.name : prop.key.value;
        const res = extractStaticValue(prop.value, code);
        if (!res.ok) {
          allStatic = false;
          if (!firstReason) firstReason = res.reason || "";
        }
        obj[key] = res.value;
      }
      return allStatic
        ? { ok: true, value: obj }
        : { ok: false, reason: firstReason, value: obj };
    }
    case "UnaryExpression":
      if (node.operator === "-" && node.argument?.type === "NumericLiteral") {
        return { ok: true, value: -node.argument.value };
      }
      return { ok: false, reason: `Unsupported unary operator: ${node.operator}` };
    case "TSAsExpression":
      return extractStaticValue(node.expression, code);
    default:
      return {
        ok: false,
        reason: `Dynamic node type: ${node.type}`,
        value: code.slice(node.start, node.end),
      };
  }
}

/**
 * Parse an AST ObjectExpression or CallExpression into Article
 */
function parseArticleObject(
  node: any,
  code: string,
): { article: Article; isDynamic: boolean; reason?: string } {
  let targetObjectNode = node;
  let isDynamic = false;
  let dynamicReason = "";

  if (
    node.type === "CallExpression" &&
    node.arguments?.[0]?.type === "ObjectExpression"
  ) {
    targetObjectNode = node.arguments[0];
  }

  if (targetObjectNode.type !== "ObjectExpression") {
    return {
      article: {
        time: 0,
        content: code.slice(node.start, node.end),
        media: [],
        tags: [],
        location: "",
      },
      isDynamic: true,
      reason: `Expected ObjectExpression, got ${targetObjectNode.type}`,
    };
  }

  const propMap = new Map<string, any>();
  for (const prop of targetObjectNode.properties) {
    if (prop.type === "ObjectProperty") {
      const key =
        prop.key.type === "Identifier" ? prop.key.name : prop.key.value;
      propMap.set(key, prop.value);
    } else {
      isDynamic = true;
      dynamicReason = `Article contains unsupported property syntax: ${prop.type}`;
    }
  }

  const timeNode = propMap.get("time");
  let time = 0;
  if (timeNode) {
    const timeRes = extractStaticValue(timeNode, code);
    if (!timeRes.ok || typeof timeRes.value !== "number") {
      isDynamic = true;
      dynamicReason =
        dynamicReason ||
        `Field 'time' is dynamic: ${timeRes.reason || "not a number"}`;
    } else {
      time = timeRes.value;
    }
  }

  const contentNode = propMap.get("content");
  let content = "";
  if (contentNode) {
    const contentRes = extractStaticValue(contentNode, code);
    if (!contentRes.ok) {
      isDynamic = true;
      dynamicReason =
        dynamicReason || `Field 'content' is dynamic: ${contentRes.reason}`;
      content = typeof contentRes.value === "string" ? contentRes.value : "";
    } else if (typeof contentRes.value === "string") {
      content = contentRes.value;
    } else if (
      typeof contentRes.value === "object" &&
      contentRes.value !== null
    ) {
      content =
        contentRes.value.zh ||
        contentRes.value.en ||
        JSON.stringify(contentRes.value);
    }
  }

  const mediaNode = propMap.get("media");
  const media: ArticleMedia[] = [];
  if (mediaNode) {
    const mediaRes = extractStaticValue(mediaNode, code);
    if (!mediaRes.ok || !Array.isArray(mediaRes.value)) {
      isDynamic = true;
      dynamicReason =
        dynamicReason ||
        `Field 'media' is dynamic or invalid: ${mediaRes.reason}`;
    }
    if (Array.isArray(mediaRes.value)) {
      for (const item of mediaRes.value) {
        if (
          item &&
          (item.type === "img" || item.type === "vid") &&
          typeof item.url === "string"
        ) {
          media.push({ type: item.type, url: item.url });
        }
      }
    }
  }

  const tagsNode = propMap.get("tags");
  const tags: string[] = [];
  if (tagsNode) {
    const tagsRes = extractStaticValue(tagsNode, code);
    if (!tagsRes.ok || !Array.isArray(tagsRes.value)) {
      isDynamic = true;
      dynamicReason =
        dynamicReason ||
        `Field 'tags' is dynamic or invalid: ${tagsRes.reason}`;
    }
    if (Array.isArray(tagsRes.value)) {
      for (const t of tagsRes.value) {
        if (typeof t === "string") tags.push(t);
      }
    }
  }

  const locationNode = propMap.get("location");
  let location = "";
  if (locationNode) {
    const locRes = extractStaticValue(locationNode, code);
    if (!locRes.ok || typeof locRes.value !== "string") {
      isDynamic = true;
      dynamicReason =
        dynamicReason || `Field 'location' is dynamic: ${locRes.reason}`;
    } else {
      location = locRes.value;
    }
  }

  const musicNode = propMap.get("music");
  let music: ArticleMusic | undefined;
  if (musicNode) {
    const musicRes = extractStaticValue(musicNode, code);
    if (!musicRes.ok) {
      isDynamic = true;
      dynamicReason =
        dynamicReason || `Field 'music' is dynamic: ${musicRes.reason}`;
    }
    if (musicRes.value && typeof musicRes.value === "object") {
      music = {
        title: String(musicRes.value.title || ""),
        artist: String(musicRes.value.artist || ""),
        url: String(musicRes.value.url || ""),
      };
    }
  }

  return {
    article: {
      time,
      content,
      media,
      tags,
      location,
      ...(music ? { music } : {}),
    },
    isDynamic,
    reason: dynamicReason,
  };
}

function unwrapAs(node: any) {
  return node?.type === "TSAsExpression" ? node.expression : node;
}

/**
 * Locate the article array AST node from a source file
 */
function findArticleArrayNode(
  ast: any,
): { arrayNode: any; exportName: string } | null {
  let candidateArray: any = null;
  let candidateName = "";

  for (const statement of ast.program.body) {
    if (statement.type === "ExportNamedDeclaration" && statement.declaration) {
      const decl = statement.declaration;
      if (decl.type === "VariableDeclaration") {
        for (const v of decl.declarations) {
          const init = unwrapAs(v.init);
          if (init?.type === "ArrayExpression") {
            const name = v.id?.name || "";
            if (
              name === "moments" ||
              name === "articles" ||
              name === "posts" ||
              !candidateArray
            ) {
              candidateArray = init;
              candidateName = name;
              if (name === "moments" || name === "articles") {
                return { arrayNode: candidateArray, exportName: candidateName };
              }
            }
          }
        }
      }
    }

    if (statement.type === "ExportDefaultDeclaration") {
      const decl = unwrapAs(statement.declaration);
      if (decl?.type === "ArrayExpression") {
        return { arrayNode: decl, exportName: "default" };
      }
    }

    if (statement.type === "VariableDeclaration") {
      for (const v of statement.declarations) {
        const init = unwrapAs(v.init);
        if (init?.type === "ArrayExpression") {
          const name = v.id?.name || "";
          if (
            name === "moments" ||
            name === "articles" ||
            name === "posts" ||
            !candidateArray
          ) {
            candidateArray = init;
            candidateName = name;
          }
        }
      }
    }

    if (statement.type === "ExpressionStatement") {
      const expr = unwrapAs(statement.expression);
      if (expr?.type === "ArrayExpression" && !candidateArray) {
        candidateArray = expr;
        candidateName = "moments";
      }
    }
  }

  return candidateArray
    ? { arrayNode: candidateArray, exportName: candidateName || "moments" }
    : null;
}

/**
 * Parse TypeScript/JavaScript source into articles and AST metadata
 */
export function parseArticlesFromSource(code: string): ParseResult {
  const ast = babelParser.parse(code, {
    sourceType: "module",
    plugins: ["typescript"],
  });

  const arrayResult = findArticleArrayNode(ast);
  if (!arrayResult) {
    throw new Error(
      "未能定位到导出的文章数组（例如 export const moments 或 articles）",
    );
  }

  const { arrayNode, exportName } = arrayResult;
  const articles: Article[] = [];
  const articleNodes: ArticleNodeInfo[] = [];

  for (const el of arrayNode.elements) {
    if (!el) continue;
    const { article, isDynamic, reason } = parseArticleObject(el, code);
    articles.push(article);
    articleNodes.push({
      start: el.start!,
      end: el.end!,
      fingerprint: generateArticleFingerprint(article),
      article,
      isDynamic,
      dynamicReason: reason,
    });
  }

  return { code, articles, articleNodes, exportName };
}

import * as babelParser from "@babel/parser";
import type {
  Article,
  ArticleMedia,
  ArticleMusic,
} from "../../types/article";
import { generateArticleFingerprint } from "../../types/article";

export interface ArticleNodeInfo {
  start: number;
  end: number;
  fingerprint: string;
  article: Article;
  isDynamic: boolean;
  dynamicReason?: string;
}

export interface ParseResult {
  code: string;
  articles: Article[];
  articleNodes: ArticleNodeInfo[];
  exportName: string;
  arrayStartOffset: number;
  arrayEndOffset: number;
  detectedIndent: string;
}

/**
 * Detect indentation used for array elements
 */
function detectIndentation(code: string, arrayNode: any): string {
  if (arrayNode.elements && arrayNode.elements.length > 0) {
    const firstEl = arrayNode.elements[0];
    if (firstEl && typeof firstEl.start === "number") {
      const lineStart = code.lastIndexOf("\n", firstEl.start - 1);
      if (lineStart !== -1) {
        const indentStr = code.slice(lineStart + 1, firstEl.start);
        if (/^\s+$/.test(indentStr)) {
          return indentStr;
        }
      }
    }
  }
  return "  ";
}

/**
 * Extract a static value from an AST node.
 * Returns { ok: true, value } or { ok: false, reason, fallbackValue? }
 */
function extractStaticValue(
  node: any,
  code: string
): { ok: boolean; value?: any; reason?: string } {
  if (!node) return { ok: true, value: undefined };

  switch (node.type) {
    case "StringLiteral":
      return { ok: true, value: node.value };
    case "NumericLiteral":
      return { ok: true, value: node.value };
    case "BooleanLiteral":
      return { ok: true, value: node.value };
    case "NullLiteral":
      return { ok: true, value: null };
    case "TemplateLiteral": {
      if (node.expressions && node.expressions.length > 0) {
        // Contains ${...} expressions
        const rawCode = code.slice(node.start, node.end);
        return {
          ok: false,
          reason: "Template literal contains dynamic expressions (${...})",
          value: rawCode,
        };
      }
      const raw = node.quasis.map((q: any) => q.value.cooked ?? q.value.raw).join("");
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
      if (!allStatic) {
        return { ok: false, reason: firstReason, value: arr };
      }
      return { ok: true, value: arr };
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
        const key = prop.key.type === "Identifier" ? prop.key.name : prop.key.value;
        const res = extractStaticValue(prop.value, code);
        if (!res.ok) {
          allStatic = false;
          if (!firstReason) firstReason = res.reason || "";
        }
        obj[key] = res.value;
      }
      if (!allStatic) {
        return { ok: false, reason: firstReason, value: obj };
      }
      return { ok: true, value: obj };
    }
    case "UnaryExpression": {
      if (node.operator === "-" && node.argument?.type === "NumericLiteral") {
        return { ok: true, value: -node.argument.value };
      }
      return { ok: false, reason: `Unsupported unary operator: ${node.operator}` };
    }
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
  code: string
): { article: Article; isDynamic: boolean; reason?: string } {
  let targetObjectNode = node;
  let isDynamic = false;
  let dynamicReason = "";

  // Handle defineMoment({...}) or similar wrapper calls
  if (node.type === "CallExpression" && node.arguments && node.arguments[0]?.type === "ObjectExpression") {
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
      const key = prop.key.type === "Identifier" ? prop.key.name : prop.key.value;
      propMap.set(key, prop.value);
    } else {
      isDynamic = true;
      dynamicReason = `Article contains unsupported property syntax: ${prop.type}`;
    }
  }

  // Parse time
  const timeNode = propMap.get("time");
  let time = 0;
  if (timeNode) {
    const timeRes = extractStaticValue(timeNode, code);
    if (!timeRes.ok || typeof timeRes.value !== "number") {
      isDynamic = true;
      dynamicReason = dynamicReason || `Field 'time' is dynamic: ${timeRes.reason || "not a number"}`;
    } else {
      time = timeRes.value;
    }
  }

  // Parse content
  const contentNode = propMap.get("content");
  let content = "";
  if (contentNode) {
    const contentRes = extractStaticValue(contentNode, code);
    if (!contentRes.ok) {
      isDynamic = true;
      dynamicReason = dynamicReason || `Field 'content' is dynamic: ${contentRes.reason}`;
      content = typeof contentRes.value === "string" ? contentRes.value : "";
    } else if (typeof contentRes.value === "string") {
      content = contentRes.value;
    } else if (typeof contentRes.value === "object" && contentRes.value !== null) {
      // Bilingual object: { zh: string, en: string }
      content = contentRes.value.zh || contentRes.value.en || JSON.stringify(contentRes.value);
    }
  }

  // Parse media
  const mediaNode = propMap.get("media");
  const media: ArticleMedia[] = [];
  if (mediaNode) {
    const mediaRes = extractStaticValue(mediaNode, code);
    if (!mediaRes.ok || !Array.isArray(mediaRes.value)) {
      isDynamic = true;
      dynamicReason = dynamicReason || `Field 'media' is dynamic or invalid: ${mediaRes.reason}`;
    }
    if (Array.isArray(mediaRes.value)) {
      for (const item of mediaRes.value) {
        if (item && (item.type === "img" || item.type === "vid") && typeof item.url === "string") {
          media.push({
            type: item.type,
            url: item.url,
          });
        }
      }
    }
  }

  // Parse tags
  const tagsNode = propMap.get("tags");
  const tags: string[] = [];
  if (tagsNode) {
    const tagsRes = extractStaticValue(tagsNode, code);
    if (!tagsRes.ok || !Array.isArray(tagsRes.value)) {
      isDynamic = true;
      dynamicReason = dynamicReason || `Field 'tags' is dynamic or invalid: ${tagsRes.reason}`;
    }
    if (Array.isArray(tagsRes.value)) {
      for (const t of tagsRes.value) {
        if (typeof t === "string") {
          tags.push(t);
        }
      }
    }
  }

  // Parse location
  const locationNode = propMap.get("location");
  let location = "";
  if (locationNode) {
    const locRes = extractStaticValue(locationNode, code);
    if (!locRes.ok || typeof locRes.value !== "string") {
      isDynamic = true;
      dynamicReason = dynamicReason || `Field 'location' is dynamic: ${locRes.reason}`;
    } else {
      location = locRes.value;
    }
  }

  // Parse music (optional)
  const musicNode = propMap.get("music");
  let music: ArticleMusic | undefined = undefined;
  if (musicNode) {
    const musicRes = extractStaticValue(musicNode, code);
    if (!musicRes.ok) {
      isDynamic = true;
      dynamicReason = dynamicReason || `Field 'music' is dynamic: ${musicRes.reason}`;
    }
    if (musicRes.value && typeof musicRes.value === "object") {
      music = {
        title: String(musicRes.value.title || ""),
        artist: String(musicRes.value.artist || ""),
        url: String(musicRes.value.url || ""),
      };
    }
  }

  const article: Article = {
    time,
    content,
    media,
    tags,
    location,
    ...(music ? { music } : {}),
  };

  return { article, isDynamic, reason: dynamicReason };
}

/**
 * Locate the article array AST node from a source file
 */
function findArticleArrayNode(ast: any): { arrayNode: any; exportName: string } | null {
  let candidateArray: any = null;
  let candidateName = "";

  for (const statement of ast.program.body) {
    // 1. export const moments = [...]
    if (statement.type === "ExportNamedDeclaration" && statement.declaration) {
      const decl = statement.declaration;
      if (decl.type === "VariableDeclaration") {
        for (const v of decl.declarations) {
          const init = v.init?.type === "TSAsExpression" ? v.init.expression : v.init;
          if (init?.type === "ArrayExpression") {
            const name = v.id?.name || "";
            if (name === "moments" || name === "articles" || name === "posts" || !candidateArray) {
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

    // 2. export default [...]
    if (statement.type === "ExportDefaultDeclaration") {
      const decl = statement.declaration?.type === "TSAsExpression"
        ? statement.declaration.expression
        : statement.declaration;
      if (decl?.type === "ArrayExpression") {
        return { arrayNode: decl, exportName: "default" };
      }
    }

    // 3. const moments = [...] (top-level variable declaration)
    if (statement.type === "VariableDeclaration") {
      for (const v of statement.declarations) {
        const init = v.init?.type === "TSAsExpression" ? v.init.expression : v.init;
        if (init?.type === "ArrayExpression") {
          const name = v.id?.name || "";
          if (name === "moments" || name === "articles" || name === "posts" || !candidateArray) {
            candidateArray = init;
            candidateName = name;
          }
        }
      }
    }

    // 4. Naked array expression: [ { ... } ]
    if (statement.type === "ExpressionStatement") {
      const expr = statement.expression?.type === "TSAsExpression"
        ? statement.expression.expression
        : statement.expression;
      if (expr?.type === "ArrayExpression" && !candidateArray) {
        candidateArray = expr;
        candidateName = "moments";
      }
    }
  }

  if (candidateArray) {
    return { arrayNode: candidateArray, exportName: candidateName || "moments" };
  }

  return null;
}

/**
 * Parse TypeScript code into articles and AST metadata
 */
export function parseArticlesFromSource(code: string): ParseResult {
  const ast = babelParser.parse(code, {
    sourceType: "module",
    plugins: ["typescript"],
  });

  const arrayResult = findArticleArrayNode(ast);
  if (!arrayResult) {
    throw new Error("未能定位到导出的文章数组（例如 export const moments 或 articles）");
  }

  const { arrayNode, exportName } = arrayResult;
  const detectedIndent = detectIndentation(code, arrayNode);

  const articles: Article[] = [];
  const articleNodes: ArticleNodeInfo[] = [];

  for (const el of arrayNode.elements) {
    if (!el) continue;
    const start = el.start!;
    const end = el.end!;
    const { article, isDynamic, reason } = parseArticleObject(el, code);

    const fingerprint = generateArticleFingerprint(article);
    articles.push(article);
    articleNodes.push({
      start,
      end,
      fingerprint,
      article,
      isDynamic,
      dynamicReason: reason,
    });
  }

  return {
    code,
    articles,
    articleNodes,
    exportName,
    arrayStartOffset: arrayNode.start!,
    arrayEndOffset: arrayNode.end!,
    detectedIndent,
  };
}

/**
 * Format an Article object into standard TypeScript object literal code
 */
export function formatArticleToTS(article: Article, indent = "  "): string {
  const i1 = indent;
  const i2 = indent + "  ";
  const i3 = indent + "    ";

  const lines: string[] = [];
  lines.push(`${i1}{`);
  lines.push(`${i2}time: ${article.time},`);

  // Safe content string:
  // Using JSON.stringify ensures all special chars, quotes, backslashes and unicode are escaped
  lines.push(`${i2}content: ${JSON.stringify(article.content)},`);

  // Media
  if (!article.media || article.media.length === 0) {
    lines.push(`${i2}media: [],`);
  } else {
    lines.push(`${i2}media: [`);
    for (const m of article.media) {
      lines.push(`${i3}{`);
      lines.push(`${i3}  type: ${JSON.stringify(m.type)},`);
      lines.push(`${i3}  url: ${JSON.stringify(m.url)},`);
      lines.push(`${i3}},`);
    }
    lines.push(`${i2}],`);
  }

  // Tags
  if (!article.tags || article.tags.length === 0) {
    lines.push(`${i2}tags: [],`);
  } else {
    const formattedTags = article.tags.map((t) => JSON.stringify(t)).join(", ");
    lines.push(`${i2}tags: [${formattedTags}],`);
  }

  // Location
  lines.push(`${i2}location: ${JSON.stringify(article.location || "")},`);

  // Music
  if (article.music && (article.music.title || article.music.artist || article.music.url)) {
    lines.push(`${i2}music: {`);
    lines.push(`${i3}title: ${JSON.stringify(article.music.title || "")},`);
    lines.push(`${i3}artist: ${JSON.stringify(article.music.artist || "")},`);
    lines.push(`${i3}url: ${JSON.stringify(article.music.url || "")},`);
    lines.push(`${i2}},`);
  }

  lines.push(`${i1}}`);
  return lines.join("\n");
}

/**
 * Update an existing article by exact source range replacement
 */
export function updateArticleInSource(
  sourceCode: string,
  targetFingerprint: string,
  updatedArticle: Article
): { newCode: string; newFingerprint: string } {
  const parseResult = parseArticlesFromSource(sourceCode);
  const targetNode = parseResult.articleNodes.find((n) => n.fingerprint === targetFingerprint);

  if (!targetNode) {
    throw new Error(`目标文章不存在或已被修改（指纹未匹配: ${targetFingerprint}）`);
  }

  if (targetNode.isDynamic) {
    throw new Error(`无法安全修改包含动态表达式的文章: ${targetNode.dynamicReason}`);
  }

  const formatted = formatArticleToTS(updatedArticle, parseResult.detectedIndent);
  const newCode =
    sourceCode.slice(0, targetNode.start) +
    formatted.trimStart() +
    sourceCode.slice(targetNode.end);

  // Validate the resulting code
  parseArticlesFromSource(newCode);
  const newFingerprint = generateArticleFingerprint(updatedArticle);

  return { newCode, newFingerprint };
}

/**
 * Insert a new article into the source code array (at index 0 by default)
 */
export function insertArticleIntoSource(
  sourceCode: string,
  newArticle: Article
): { newCode: string; newFingerprint: string } {
  const parseResult = parseArticlesFromSource(sourceCode);
  const indent = parseResult.detectedIndent;
  const formatted = formatArticleToTS(newArticle, indent);

  let newCode = "";
  if (parseResult.articleNodes.length === 0) {
    // Empty array: replace between '[' and ']'
    const openBracket = parseResult.arrayStartOffset;
    const closeBracket = parseResult.arrayEndOffset;
    newCode =
      sourceCode.slice(0, openBracket + 1) +
      `\n${formatted},\n` +
      sourceCode.slice(closeBracket - 1);
  } else {
    // Insert at index 0 (before the first element)
    const firstNode = parseResult.articleNodes[0];
    const insertionPoint = firstNode.start;
    newCode =
      sourceCode.slice(0, insertionPoint) +
      formatted.trimStart() +
      ",\n\n" +
      indent +
      sourceCode.slice(insertionPoint);
  }

  // Validate the resulting code
  parseArticlesFromSource(newCode);
  const newFingerprint = generateArticleFingerprint(newArticle);

  return { newCode, newFingerprint };
}

/**
 * Delete an article from the source code by exact source range removal
 */
export function deleteArticleFromSource(
  sourceCode: string,
  targetFingerprint: string
): { newCode: string } {
  const parseResult = parseArticlesFromSource(sourceCode);
  const nodeIndex = parseResult.articleNodes.findIndex((n) => n.fingerprint === targetFingerprint);

  if (nodeIndex === -1) {
    throw new Error(`未找到待删除的文章（指纹: ${targetFingerprint}）`);
  }

  const targetNode = parseResult.articleNodes[nodeIndex];
  let startOffset = targetNode.start;
  let endOffset = targetNode.end;

  // Clean up preceding whitespace/indent on the line
  const lineStart = sourceCode.lastIndexOf("\n", startOffset - 1);
  if (lineStart !== -1 && /^\s*$/.test(sourceCode.slice(lineStart + 1, startOffset))) {
    startOffset = lineStart + 1;
  }

  // Clean up following comma and trailing newline
  let afterEnd = sourceCode.slice(endOffset);
  const commaMatch = afterEnd.match(/^\s*,[ \t]*(\r?\n)?/);
  if (commaMatch) {
    endOffset += commaMatch[0].length;
  }

  const newCode = sourceCode.slice(0, startOffset) + sourceCode.slice(endOffset);

  // Validate that the resulting code is syntactically sound
  parseArticlesFromSource(newCode);

  return { newCode };
}

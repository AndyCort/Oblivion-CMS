import { verifyCloudflareAccess } from "../lib/access";
import { getFileFromGitHub, putFileToGitHub } from "../lib/github";
import {
  parseArticlesFromSource,
  insertArticleIntoSource,
  updateArticleInSource,
  deleteArticleFromSource,
} from "../../src/lib/ast/articleParser";
import { PublishRequest, PublishResponse, Article } from "../../src/types/article";
import { getMockState, setMockState } from "./articles";

export const onRequestPost = async (context: {
  request: Request;
  env: Record<string, string | undefined>;
}) => {
  const { request, env } = context;

  // 1. Authenticate with Cloudflare Access
  const auth = await verifyCloudflareAccess(request, env);
  if (auth.error || !auth.user) {
    return new Response(
      JSON.stringify({ error: auth.error || "Unauthorized" }),
      {
        status: auth.status,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // 2. Parse and validate request body
  let body: PublishRequest;
  try {
    body = (await request.json()) as PublishRequest;
  } catch {
    return new Response(JSON.stringify({ error: "请求格式无效，应为 JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { action, article, targetFingerprint, baseSha, commitMessage } = body;

  if (!action || !["create", "update", "delete"].includes(action)) {
    return new Response(JSON.stringify({ error: "无效的 action 操作" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if ((action === "create" || action === "update") && !article) {
    return new Response(JSON.stringify({ error: "缺少 article 数据" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if ((action === "update" || action === "delete") && !targetFingerprint) {
    return new Response(
      JSON.stringify({ error: "操作已有文章时必须提供 targetFingerprint" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // 3. Configuration
  const owner = env.GITHUB_OWNER;
  const repo = env.GITHUB_REPO;
  const branch = env.GITHUB_BRANCH || "main";
  const path = env.GITHUB_DATA_PATH || "src/components/data/moments.ts";
  const token = env.GITHUB_TOKEN;

  let currentSource = "";
  let currentSha = "";
  const isMock = !(token && owner && repo);

  // 4. Fetch latest file & detect conflicts
  if (!isMock) {
    try {
      const remote = await getFileFromGitHub({
        owner: owner!,
        repo: repo!,
        branch,
        path,
        token: token!,
      });
      currentSource = remote.content;
      currentSha = remote.sha;
    } catch (err: any) {
      return new Response(
        JSON.stringify({ error: `读取远程文件失败: ${err.message}` }),
        {
          status: 502,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } else {
    const mock = getMockState();
    currentSource = mock.code;
    currentSha = mock.sha;
  }

  // Conflict detection: if baseSha is provided and doesn't match currentSha
  if (baseSha && baseSha !== currentSha) {
    return new Response(
      JSON.stringify({
        error: "CONFLICT",
        message: "检测到版本冲突：远程文件在此期间已被更新。请刷新数据并合并您的改动后再发布。",
        remoteSha: currentSha,
        clientBaseSha: baseSha,
      }),
      {
        status: 409,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // 5. Apply AST transformation
  let updatedCode = "";
  let defaultMsg = "";

  try {
    if (action === "create") {
      const res = insertArticleIntoSource(currentSource, article!);
      updatedCode = res.newCode;
      defaultMsg = `content: add article (${new Date(article!.time).toISOString().slice(0, 10)})`;
    } else if (action === "update") {
      const res = updateArticleInSource(currentSource, targetFingerprint!, article!);
      updatedCode = res.newCode;
      defaultMsg = `content: update article (${new Date(article!.time).toISOString().slice(0, 10)})`;
    } else if (action === "delete") {
      const res = deleteArticleFromSource(currentSource, targetFingerprint!);
      updatedCode = res.newCode;
      defaultMsg = `content: delete article`;
    }
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        error: `AST 修改失败: ${err.message}`,
      }),
      {
        status: 422,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const finalCommitMessage = commitMessage?.trim() || defaultMsg;

  // 6. Commit to GitHub or update Mock State
  let newSha = "";
  let commitUrl: string | undefined;

  if (!isMock) {
    try {
      const commitRes = await putFileToGitHub(
        {
          owner: owner!,
          repo: repo!,
          branch,
          path,
          token: token!,
        },
        {
          content: updatedCode,
          sha: currentSha,
          message: finalCommitMessage,
        }
      );
      newSha = commitRes.newSha;
      commitUrl = commitRes.commitUrl;
    } catch (err: any) {
      if (err.message.includes("409 CONFLICT")) {
        return new Response(
          JSON.stringify({
            error: "CONFLICT",
            message: "提交时发生远程并发冲突，请刷新后重试。",
            remoteSha: currentSha,
          }),
          {
            status: 409,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
      return new Response(
        JSON.stringify({ error: `提交到 GitHub 失败: ${err.message}` }),
        {
          status: 502,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } else {
    newSha = setMockState(updatedCode);
    commitUrl = `https://github.com/mock/commit/${newSha}`;
  }

  // Count articles in new code
  const recheck = parseArticlesFromSource(updatedCode);

  const responsePayload: PublishResponse = {
    success: true,
    newSha,
    commitUrl,
    commitMessage: finalCommitMessage,
    articleCount: recheck.articles.length,
  };

  return new Response(JSON.stringify(responsePayload), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

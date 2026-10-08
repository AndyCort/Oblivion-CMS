export interface GitHubConfig {
  owner: string;
  repo: string;
  branch: string;
  path: string;
  token: string;
}

export function decodeBase64Utf8(base64: string): string {
  // Strip newlines that GitHub API may include in base64
  const cleaned = base64.replace(/\s/g, "");
  const binaryString = atob(cleaned);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

export function encodeBase64Utf8(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function getFileFromGitHub(config: GitHubConfig): Promise<{
  content: string;
  sha: string;
  url: string;
}> {
  const apiUrl = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${config.path}?ref=${config.branch}`;
  const res = await fetch(apiUrl, {
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: `Bearer ${config.token}`,
      "User-Agent": "Oblivion-CMS",
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    let parsed: any;
    try {
      parsed = JSON.parse(errorText);
    } catch {}
    throw new Error(
      `GitHub API 错误 (${res.status}): ${parsed?.message || errorText || res.statusText}`
    );
  }

  const data: any = await res.json();
  if (!data.content || !data.sha) {
    throw new Error("GitHub 返回的数据缺少 content 或 sha");
  }

  const content = decodeBase64Utf8(data.content);
  return {
    content,
    sha: data.sha,
    url: data.html_url,
  };
}

export async function putFileToGitHub(
  config: GitHubConfig,
  params: {
    content: string;
    sha: string;
    message: string;
  }
): Promise<{
  newSha: string;
  commitSha: string;
  commitUrl?: string;
}> {
  const apiUrl = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${config.path}`;
  const res = await fetch(apiUrl, {
    method: "PUT",
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
      "User-Agent": "Oblivion-CMS",
    },
    body: JSON.stringify({
      message: params.message,
      content: encodeBase64Utf8(params.content),
      sha: params.sha,
      branch: config.branch,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    let parsed: any;
    try {
      parsed = JSON.parse(errorText);
    } catch {}

    if (res.status === 409) {
      throw new Error(`409 CONFLICT: 远程版本发生变化，预期的 SHA 与远程不匹配`);
    }

    throw new Error(
      `GitHub 提交失败 (${res.status}): ${parsed?.message || errorText || res.statusText}`
    );
  }

  const data: any = await res.json();
  return {
    newSha: data.content?.sha || "",
    commitSha: data.commit?.sha || "",
    commitUrl: data.commit?.html_url,
  };
}

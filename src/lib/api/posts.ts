import type { PostFilters } from "../postsList";
import { validatePost, type BlogPost } from "../../types/post";
import { requestJson } from "./client";

export interface PostList {
  posts: BlogPost[];
  total: number;
  page: number;
  pageSize: number;
  mode: string;
  warning?: string;
  tags?: { tag: string; count: number }[];
}

export async function fetchPosts(
  page = 1,
  q = "",
  filters: PostFilters = {},
): Promise<PostList> {
  const params = new URLSearchParams({ page: String(page), q });
  if (filters.tag) params.set("tag", filters.tag);
  if (filters.coverOnly) params.set("cover", "1");
  if (filters.sortOrder) params.set("sort", filters.sortOrder);

  const data = await requestJson<PostList>(`/api/posts?${params}`);
  if (data !== null) return data;
  if (import.meta.env.DEV) {
    const { mockFetchPosts } = await import("./localMock");
    return mockFetchPosts(page, q, filters);
  }
  throw new Error("无法加载文章列表");
}

export async function fetchPost(id: string): Promise<BlogPost> {
  const data = await requestJson<BlogPost>(`/api/posts/${encodeURIComponent(id)}`);
  if (data !== null) return data;
  if (import.meta.env.DEV) {
    const { mockFetchPost } = await import("./localMock");
    return mockFetchPost(id);
  }
  throw new Error("无法加载文章详情");
}

export async function publishPost(
  post: BlogPost,
  originalId?: string,
): Promise<{ post: BlogPost; mode: string }> {
  const validated = validatePost(post);
  const data = await requestJson<{ post: BlogPost; mode: string }>(
    "/api/posts/publish",
    { method: "POST", body: { post: validated, originalId } },
    "发布失败",
  );
  if (data !== null) return data;
  if (import.meta.env.DEV) {
    const { mockPublishPost } = await import("./localMock");
    return mockPublishPost(validated, originalId);
  }
  throw new Error("无法发布文章");
}

export async function deletePost(id: string): Promise<void> {
  const data = await requestJson(
    `/api/posts/${encodeURIComponent(id)}`,
    { method: "DELETE" },
    "删除失败",
  );
  if (data === null && import.meta.env.DEV) {
    const { mockDeletePost } = await import("./localMock");
    mockDeletePost(id);
  }
}

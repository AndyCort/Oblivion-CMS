import type { PostFilters } from "../postsList";
import { validatePost, type BlogPost } from "../../types/post";
import { requestJson } from "./client";

export interface PostList {
  posts: BlogPost[];
  total: number;
  page: number;
  pageSize: number;
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

  return requestJson<PostList>(`/api/posts?${params}`);
}

export async function fetchPost(id: string): Promise<BlogPost> {
  return requestJson<BlogPost>(`/api/posts/${encodeURIComponent(id)}`);
}

export async function publishPost(
  post: BlogPost,
  originalId?: string,
): Promise<{ post: BlogPost }> {
  const validated = validatePost(post);
  return requestJson<{ post: BlogPost }>(
    "/api/posts/publish",
    { method: "POST", body: { post: validated, originalId } },
    "发布失败",
  );
}

export async function deletePost(id: string): Promise<void> {
  await requestJson(
    `/api/posts/${encodeURIComponent(id)}`,
    { method: "DELETE" },
    "删除失败",
  );
}

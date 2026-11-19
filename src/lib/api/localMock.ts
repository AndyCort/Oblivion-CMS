import { filterPosts, postTagCounts, type PostFilters } from "../postsList";
import type { Article, MomentMutationResponse } from "../../types/article";
import { validatePost, type BlogPost } from "../../types/post";
import type { FetchMomentsResponse, UserSession } from "./client";
import type { PostList } from "./posts";

export const DEV_MOCK_USER: UserSession = {
  email: "developer@oblivion.local",
  sub: "dev-local-user",
  name: "本地开发模式 (CF Access)",
  isMock: true,
};

const DEFAULT_MOCK_ARTICLES: Article[] = [
  {
    time: 1791400876000,
    content:
      "我从来都不是为了和谁在一起\n我想要的是你能真心实意地告诉我\n“我曾爱你”\n“我依然爱你”\n“我爱你”",
    media: [],
    tags: ["日常", "随想"],
    location: "天府",
    music: {
      title: "Sorrow Love",
      artist: "Someone",
      url: "https://example.com/music",
    },
  },
  {
    time: 1789445239000,
    content: "好的结果也可以是一种诅咒，而坏的结果也许是一种缓冲。",
    media: [],
    tags: ["日常", "随想"],
    location: "Estonia",
  },
  {
    time: 1789122720000,
    content: "今天出去走了走。",
    media: [
      {
        type: "img",
        url: "https://raw.githubusercontent.com/AndyCort/PicGo/master/img/0497B09F-1CD0-40F7-82A1-9F719F5223A1_1_105_c.jpeg",
      },
      {
        type: "vid",
        url: "https://www.pexels.com/download/video/38417492/",
      },
    ],
    tags: ["日常", "随想"],
    location: "东京",
  },
];

let localMoments: Article[] = structuredClone(DEFAULT_MOCK_ARTICLES);
const localPosts = new Map<string, BlogPost>();

export function mockFetchMoments(): FetchMomentsResponse {
  const sorted = structuredClone(localMoments).sort((a, b) => b.time - a.time);
  return {
    moments: sorted,
    isMock: true,
    isD1: false,
    warning: "当前运行于 Vite 本地开发模式，未连接 Cloudflare D1 数据库。",
    total: sorted.length,
    user: DEV_MOCK_USER,
  };
}

export function mockSaveMoment(
  moment: Article,
  originalTime?: number,
): MomentMutationResponse {
  const cloned = structuredClone(moment);
  if (originalTime === undefined) {
    if (localMoments.some((m) => m.time === cloned.time)) {
      throw new Error("相同时间的说说已存在");
    }
    localMoments.unshift(cloned);
  } else {
    const index = localMoments.findIndex((m) => m.time === originalTime);
    if (index === -1) {
      throw new Error("目标说说不存在或已更改，请刷新后重试");
    }
    if (
      cloned.time !== originalTime &&
      localMoments.some((m, i) => i !== index && m.time === cloned.time)
    ) {
      throw new Error("相同时间的说说已存在");
    }
    localMoments[index] = cloned;
  }

  return {
    success: true,
    moment: cloned,
    total: localMoments.length,
  };
}

export function mockDeleteMoment(time: number): MomentMutationResponse {
  const before = localMoments.length;
  localMoments = localMoments.filter((m) => m.time !== time);
  if (localMoments.length === before) {
    throw new Error("目标说说不存在");
  }
  return {
    success: true,
    total: localMoments.length,
  };
}

export function mockFetchPosts(
  page = 1,
  q = "",
  filters: PostFilters = {},
): PostList {
  const all = [...localPosts.values()];
  const rows = filterPosts(all, q, filters);
  return {
    posts: rows.slice((page - 1) * 20, page * 20),
    total: rows.length,
    tags: postTagCounts(all),
    page,
    pageSize: 20,
    mode: "mock",
    warning: "本地模拟：发布仅写入临时内存，刷新后丢失；草稿保存在此浏览器。",
  };
}

export function mockFetchPost(id: string): BlogPost {
  const found = localPosts.get(id);
  if (!found) throw new Error("文章不存在");
  return structuredClone(found);
}

export function mockPublishPost(
  post: BlogPost,
  originalId?: string,
): { post: BlogPost; mode: string } {
  const validated = validatePost(post);
  if (originalId && originalId !== validated.id) {
    throw new Error("已发布文章的 Slug 不可更改");
  }
  if (originalId && !localPosts.has(originalId)) {
    throw new Error("文章不存在，模拟内存可能已重置");
  }
  if (!originalId && localPosts.has(validated.id)) {
    throw new Error("Slug 已存在");
  }
  localPosts.set(validated.id, validated);
  return { post: validated, mode: "mock" };
}

export function mockDeletePost(id: string): void {
  localPosts.delete(id);
}

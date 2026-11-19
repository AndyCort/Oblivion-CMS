export type ArticleMediaType = "img" | "vid";

export interface ArticleMedia {
  type: ArticleMediaType;
  url: string;
}

export interface ArticleMusic {
  title: string;
  artist: string;
  url: string;
}

export interface Article {
  time: number;
  content: string;
  media: ArticleMedia[];
  tags: string[];
  location: string;
  music?: ArticleMusic;
}

export interface ArticleDraft {
  id: string; // "new" or "article-{fingerprint}"
  article: Article;
  baseSha?: string;
  originalFingerprint?: string;
  updatedAt: number;
  isNew: boolean;
}

export interface PublishRequest {
  action: "create" | "update" | "delete";
  article?: Article;
  targetFingerprint?: string;
  baseSha: string;
  commitMessage?: string;
  force?: boolean;
}

export interface PublishResponse {
  success: boolean;
  newSha: string;
  commitUrl?: string;
  commitMessage: string;
  articleCount: number;
}

export interface ConflictErrorResponse {
  error: "CONFLICT";
  message: string;
  remoteSha: string;
  clientBaseSha: string;
}

export const DEFAULT_MOCK_ARTICLES: Article[] = [
  {
    time: 1791400876000,
    content: `我从来都不是为了和谁在一起\n      我想要的是你能真心实意地告诉我\n      “我曾爱你”\n      “我依然爱你”\n      “我爱你”`,
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
    music: {
      title: "Sorrow Love",
      artist: "Someone",
      url: "https://example.com/music",
    },
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
    music: {
      title: "Sorrow Love",
      artist: "Someone",
      url: "https://example.com/music",
    },
  },
  {
    time: 1789110240000,
    content: `如果本就走在与众不同的道路\n那就不该期望自己会有什么传统意义上、或是流行文化中的那种功成名就。`,
    media: [],
    tags: ["日常", "随想"],
    location: "Tokyo",
    music: {
      title: "Sorrow Love",
      artist: "Someone",
      url: "https://example.com/music",
    },
  },
];

/**
 * Generates a stable deterministic fingerprint for an article to identify it
 * even if order or time is changed, based on initial creation signature.
 */
export function generateArticleFingerprint(article: Article): string {
  const mediaUrls = (article.media || []).map((m) => m.url).join(",");
  const tagsStr = (article.tags || []).join(",");
  const base = `${article.time}_${article.content.trim().slice(0, 40)}_${article.location}_${mediaUrls}_${tagsStr}`;
  let hash = 0;
  for (let i = 0; i < base.length; i++) {
    const char = base.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `${article.time}-${Math.abs(hash).toString(36)}`;
}

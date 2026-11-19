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
  id: string; // "new" or String(time)
  article: Article;
  updatedAt: number;
  isNew: boolean;
}

export interface MomentSaveRequest {
  moment: Article;
  originalTime?: number;
}

export interface MomentMutationResponse {
  success: true;
  moment?: Article;
  total: number;
}

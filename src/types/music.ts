export interface NeteaseSongItem {
  id: number;
  title: string;
  artist: string;
  album: string;
  coverUrl?: string;
  durationMs?: number;
  url: string;
  isVip?: boolean;
}

export interface NeteaseSearchResponse {
  songs: NeteaseSongItem[];
  total: number;
  hasMore: boolean;
  source: "custom" | "netease";
}

import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import {
  Check,
  ExternalLink,
  Loader2,
  Music,
  Search,
  Trash2,
  X,
} from "lucide-react";
import type { ArticleMusic } from "../../types/article";
import type { NeteaseSongItem } from "../../types/music";
import { searchNeteaseMusic } from "../../lib/api/client";
import { BaseModal, ModalButton } from "../workspace/BaseModal";

const PAGE_SIZE = 15;

const SearchForm = styled.form`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SearchField = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 7px;
  height: 36px;
  padding: 0 11px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--bg-input);
  color: var(--text-muted);
  transition: border-color 150ms, box-shadow 150ms, background 150ms;

  &:focus-within {
    border-color: var(--accent);
    background: var(--bg-surface);
    box-shadow: 0 0 0 2px var(--accent-ring);
  }

  input {
    flex: 1;
    min-width: 0;
    font-size: 13px;
    color: var(--text);
    outline: none;
  }
`;

const ClearInputBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 9999px;
  color: var(--text-faint);

  &:hover {
    background: var(--bg-subtle);
    color: var(--text);
  }
`;

const StatusRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 11.5px;
  color: var(--text-muted);
`;

const ErrorBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 10px;
  background: var(--danger-soft);
  color: var(--danger);
  font-size: 12px;
  line-height: 1.5;

  button {
    flex-shrink: 0;
    font-weight: 500;
    text-decoration: underline;
  }
`;

const ResultList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const SongCard = styled.div<{ $selected?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 12px;
  border: 1px solid
    ${(p) => (p.$selected ? "var(--accent)" : "var(--border)")};
  background: ${(p) =>
    p.$selected ? "var(--accent-soft)" : "var(--bg-input)"};
  cursor: pointer;
  transition: border-color 140ms, background 140ms;

  &:hover {
    border-color: var(--accent);
    background: ${(p) =>
      p.$selected ? "var(--accent-soft)" : "var(--bg-hover)"};
  }
`;

const CoverBox = styled.div`
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border);
  background: var(--bg-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-faint);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const SongMeta = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
`;

const SongTitle = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const VipBadge = styled.span`
  flex-shrink: 0;
  padding: 1px 5px;
  border-radius: 5px;
  background: var(--warning-soft);
  color: var(--warning);
  font-size: 10px;
  font-weight: 600;
  line-height: 1.4;
`;

const SubRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  font-size: 11.5px;
  color: var(--text-muted);

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const Actions = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const DurationText = styled.span`
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  color: var(--text-faint);
`;

const IconLink = styled.a`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  transition: background 140ms, color 140ms;

  &:hover {
    background: var(--bg-surface);
    color: var(--accent-text);
  }
`;

const SelectedBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  height: 24px;
  padding: 0 8px;
  border-radius: 9999px;
  background: var(--accent);
  color: #fff;
  font-size: 11px;
  font-weight: 500;
`;

const EmptyBox = styled.div`
  padding: 36px 16px;
  text-align: center;
  font-size: 12.5px;
  color: var(--text-muted);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const LoadMoreWrap = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 4px;
`;

const FooterRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const Spinner = styled(Loader2)`
  animation: spin 0.9s linear infinite;
`;

function formatDuration(ms?: number): string {
  if (!ms || !Number.isFinite(ms) || ms <= 0) return "";
  const totalSec = Math.round(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${String(sec).padStart(2, "0")}`;
}

interface MusicSearchModalProps {
  isOpen: boolean;
  currentMusic?: ArticleMusic;
  onClose: () => void;
  onSelect: (song: NeteaseSongItem) => void;
  onClear?: () => void;
  onAuthExpired: () => void;
}

export function MusicSearchModal({
  isOpen,
  currentMusic,
  onClose,
  onSelect,
  onClear,
  onAuthExpired,
}: MusicSearchModalProps) {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [songs, setSongs] = useState<NeteaseSongItem[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [source, setSource] = useState<"custom" | "netease" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!isOpen) {
      abortRef.current?.abort();
      abortRef.current = null;
      return;
    }

    setErrorMsg(null);
    const initial = currentMusic?.title?.trim() || "";
    setQuery((prev) => (prev ? prev : initial));

    const raf = requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
    return () => cancelAnimationFrame(raf);
  }, [isOpen, currentMusic?.title]);

  const executeSearch = useCallback(
    async (keyword: string, offset = 0, append = false) => {
      const trimmed = keyword.trim();
      if (!trimmed) {
        setErrorMsg("请输入歌名、歌手或专辑关键词");
        return;
      }

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setErrorMsg(null);
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
        setSubmittedQuery(trimmed);
      }

      try {
        const res = await searchNeteaseMusic(trimmed, {
          limit: PAGE_SIZE,
          offset,
          signal: controller.signal,
        });
        if (controller.signal.aborted) return;

        setSongs((prev) => {
          if (!append) return res.songs;
          const seen = new Set(prev.map((item) => item.id));
          return [...prev, ...res.songs.filter((item) => !seen.has(item.id))];
        });
        setTotal(res.total);
        setHasMore(res.hasMore);
        setSource(res.source);
      } catch (err: any) {
        if (err?.name === "AbortError" || controller.signal.aborted) return;
        if (err?.isAuthError) {
          onAuthExpired();
          onClose();
          return;
        }
        setErrorMsg(err?.message || "搜索失败，请稍后重试");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
          setIsLoadingMore(false);
        }
      }
    },
    [onAuthExpired, onClose],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void executeSearch(query, 0, false);
  };

  const hasCurrentMusic = Boolean(
    currentMusic?.title?.trim() ||
      currentMusic?.artist?.trim() ||
      currentMusic?.url?.trim(),
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="搜索网易云音乐"
      subtitle="选择歌曲后将自动填入歌名、歌手与网易云歌曲详情链接"
      icon={<Music size={18} />}
      maxWidth="560px"
      height="min(620px, calc(100dvh - 32px))"
      footer={
        <FooterRow>
          <div>
            {hasCurrentMusic && onClear && (
              <ModalButton type="button" onClick={onClear}>
                <Trash2 size={13} />
                清除当前音乐
              </ModalButton>
            )}
          </div>
          <ModalButton type="button" onClick={onClose}>
            关闭
          </ModalButton>
        </FooterRow>
      }
    >
      <SearchForm onSubmit={handleSubmit}>
        <SearchField>
          <Search size={14} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="输入歌名、歌手或专辑，按回车搜索…"
            aria-label="网易云音乐搜索关键词"
          />
          {query && (
            <ClearInputBtn
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              aria-label="清空关键词"
            >
              <X size={13} />
            </ClearInputBtn>
          )}
        </SearchField>
        <ModalButton
          type="submit"
          $tone="primary"
          disabled={isLoading || !query.trim()}
        >
          {isLoading ? <Spinner size={14} /> : <Search size={14} />}
          {isLoading ? "搜索中…" : "搜索"}
        </ModalButton>
      </SearchForm>

      {errorMsg && (
        <ErrorBanner role="alert">
          <span>{errorMsg}</span>
          {query.trim() && (
            <button
              type="button"
              onClick={() => void executeSearch(query, 0, false)}
            >
              重试
            </button>
          )}
        </ErrorBanner>
      )}

      {submittedQuery && !isLoading && !errorMsg && (
        <StatusRow>
          <span>
            「{submittedQuery}」共找到约 {total} 首歌曲
          </span>
          {source && (
            <span>{source === "custom" ? "自建 API" : "网易云直连"}</span>
          )}
        </StatusRow>
      )}

      {isLoading ? (
        <EmptyBox>
          <Spinner size={20} />
          <span>正在搜索网易云曲库…</span>
        </EmptyBox>
      ) : songs.length > 0 ? (
        <ResultList>
          {songs.map((song) => {
            const isSelected = currentMusic?.url?.trim() === song.url;
            const duration = formatDuration(song.durationMs);
            return (
              <SongCard
                key={song.id}
                $selected={isSelected}
                role="button"
                tabIndex={0}
                onClick={() => onSelect(song)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect(song);
                  }
                }}
              >
                <CoverBox>
                  {song.coverUrl ? (
                    <img
                      src={song.coverUrl}
                      alt={song.album || song.title}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <Music size={16} />
                  )}
                </CoverBox>

                <SongMeta>
                  <TitleRow>
                    <SongTitle title={song.title}>{song.title}</SongTitle>
                    {song.isVip && <VipBadge>VIP</VipBadge>}
                  </TitleRow>
                  <SubRow>
                    <span
                      title={
                        song.album
                          ? `${song.artist} · ${song.album}`
                          : song.artist
                      }
                    >
                      {song.artist}
                      {song.album ? ` · ${song.album}` : ""}
                    </span>
                  </SubRow>
                </SongMeta>

                <Actions>
                  {duration && <DurationText>{duration}</DurationText>}
                  <IconLink
                    href={song.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="在网易云音乐中打开"
                    aria-label={`在网易云音乐中打开 ${song.title}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink size={14} />
                  </IconLink>
                  {isSelected && (
                    <SelectedBadge>
                      <Check size={12} />
                      已选
                    </SelectedBadge>
                  )}
                </Actions>
              </SongCard>
            );
          })}

          {hasMore && (
            <LoadMoreWrap>
              <ModalButton
                type="button"
                disabled={isLoadingMore}
                onClick={() =>
                  void executeSearch(submittedQuery, songs.length, true)
                }
              >
                {isLoadingMore && <Spinner size={13} />}
                {isLoadingMore ? "加载中…" : "加载更多"}
              </ModalButton>
            </LoadMoreWrap>
          )}
        </ResultList>
      ) : submittedQuery && !errorMsg ? (
        <EmptyBox>
          <Music size={22} />
          <span>未找到与「{submittedQuery}」匹配的歌曲，换个关键词试试</span>
        </EmptyBox>
      ) : (
        <EmptyBox>
          <Music size={22} />
          <span>输入歌名或歌手搜索网易云音乐，点击条目即可一键填入说说</span>
        </EmptyBox>
      )}
    </BaseModal>
  );
}

import * as S from "./MomentsWorkspace.styles";
import { useEffect, useImperativeHandle, useState, type Ref } from "react";
import { Clock, Hash, MapPin, Music, Search } from "lucide-react";
import { useMomentsWorkspace } from "../../hooks/useMomentsWorkspace";
import {
  resolveEditorFontCss,
  type CmsSettings,
  type EditorViewMode,
} from "../../lib/settings/cmsSettings";
import { parseTagList } from "../../lib/utils";
import { DeleteConfirmModal } from "../modals/DeleteConfirmModal";
import { MusicSearchModal } from "../modals/MusicSearchModal";
import {
  DockButton,
  DockDivider,
  DockPill,
  FloatingMetaDock,
} from "../workspace/FloatingMetaDock";
import {
  WorkspaceHeader,
  type WorkspaceHandle,
} from "../workspace/WorkspaceHeader";
import { MomentListSidebar } from "./MomentListSidebar";
import { MomentPreview } from "./MomentPreview";
import { NineGridMedia } from "./NineGridMedia";

function formatLocalDateTime(ts: number): string {
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

interface MomentsWorkspaceViewProps {
  ref?: Ref<WorkspaceHandle>;
  visible: boolean;
  sidebarOpen: boolean;
  onSidebarOpenChange: (open: boolean) => void;
  settings: CmsSettings;
  onToast: (type: "success" | "error" | "info", text: string) => void;
  onAuthExpired: () => void;
  onAfterNavigate?: () => void;
  onOpenSettings: () => void;
  onConnectionChange?: (isD1: boolean) => void;
}

export function MomentsWorkspaceView({
  ref,
  visible,
  sidebarOpen,
  onSidebarOpenChange,
  settings,
  onToast,
  onAuthExpired,
  onAfterNavigate,
  onOpenSettings,
  onConnectionChange,
}: MomentsWorkspaceViewProps) {
  const [view, setView] = useState<EditorViewMode>(settings.defaultView);
  const [tagsInput, setTagsInput] = useState("");
  const [musicSearchOpen, setMusicSearchOpen] = useState(false);

  useEffect(() => {
    setView(settings.defaultView);
  }, [settings.defaultView]);

  const moments = useMomentsWorkspace({
    enabled: visible,
    settings,
    showToast: onToast,
    onAuthExpired,
    onAfterNavigate,
  });

  useEffect(() => {
    if (moments.serverData) {
      onConnectionChange?.(Boolean(moments.serverData.isD1));
    }
  }, [moments.serverData, onConnectionChange]);

  useEffect(() => {
    if (
      parseTagList(tagsInput).join(",") !==
      moments.currentArticle.tags.join(",")
    ) {
      setTagsInput(moments.currentArticle.tags.join(", "));
    }
  }, [moments.currentArticle.tags]);

  useImperativeHandle(
    ref,
    () => ({
      createNew: () => {
        void moments.handleNewArticle();
      },
      saveNow: () => {
        void moments.saveDraftImmediately();
      },
      publishNow: () => {
        if (!moments.isPublishing && moments.serverData) {
          void moments.handlePublish();
        }
      },
      refreshDrafts: () => {
        void moments.refreshDrafts();
      },
    }),
    [moments],
  );

  return (
    <S.WorkspaceRoot $visible={visible}>
      <WorkspaceHeader
        modeLabel={moments.isNewArticle ? "新说说" : "说说动态"}
        statusText={`${moments.autoSaveStatus} · ${moments.currentArticle.content.length} 字`}
        dirty={moments.isDirty}
        warning={
          moments.serverData && !moments.serverData.isD1
            ? "未连接 D1"
            : undefined
        }
        onWarningClick={onOpenSettings}
        view={view}
        onChangeView={setView}
        onRevert={() => void moments.handleRevertChanges()}
        revertDisabled={!moments.isDirty}
        onDelete={() => {
          if (!moments.isNewArticle && moments.selectedTime !== null) {
            const target = moments.serverData?.moments.find(
              (m) => m.time === moments.selectedTime,
            );
            moments.setDeleteTarget(target || moments.currentArticle);
          }
        }}
        deleteDisabled={moments.isNewArticle || moments.selectedTime === null}
        deleteLabel="删除当前说说"
        onPublish={() => void moments.handlePublish()}
        publishDisabled={moments.isPublishing || !moments.serverData}
        publishLabel="发布说说"
        isPublishing={moments.isPublishing}
        showMobileBack={!sidebarOpen}
        onMobileBack={() => onSidebarOpenChange(true)}
      />

      {moments.isLoading && <S.Banner role="status">正在加载说说…</S.Banner>}
      {moments.serverData?.warning && !moments.errorMsg && (
        <S.Banner role="status">
          <span>{moments.serverData.warning}</span>
          <button type="button" onClick={onOpenSettings}>
            查看状态
          </button>
        </S.Banner>
      )}
      {moments.errorMsg && (
        <S.Banner $error role="alert">
          <span>{moments.errorMsg}</span>
          <button type="button" onClick={() => void moments.loadMoments()}>
            重新加载
          </button>
        </S.Banner>
      )}

      <S.Body>
        <MomentListSidebar
          open={sidebarOpen}
          articles={moments.serverData?.moments || []}
          selectedTime={moments.selectedTime}
          onSelectArticle={(time) => void moments.handleSelectArticle(time)}
          onNewArticle={() => void moments.handleNewArticle()}
          onCloneArticle={(article) => void moments.handleCloneArticle(article)}
          onDeleteArticle={(article) => moments.setDeleteTarget(article)}
          drafts={moments.draftsMap}
          defaultSortOrder={settings.defaultSortOrder}
          compactList={settings.compactList}
        />

        <S.CanvasWrap $sidebarOpen={sidebarOpen}>
          <S.SplitGrid data-single={view !== "split"}>
            {view !== "preview" && (
              <S.PaneCard>
                <S.PaneHeader>
                  <strong>
                    {moments.isNewArticle ? "撰写新说说" : "正文内容"}
                  </strong>
                  <span>{moments.currentArticle.content.length} 字</span>
                </S.PaneHeader>

                <S.EditorScroll>
                  <S.Textarea
                    value={moments.currentArticle.content}
                    onChange={(e) => {
                      const val = e.target.value;
                      moments.updateArticle((prev) => ({
                        ...prev,
                        content: val,
                      }));
                    }}
                    placeholder="分享此刻的所思所想…"
                    rows={8}
                    style={{
                      fontFamily: resolveEditorFontCss(
                        settings.editorFontFamily,
                        "moments",
                      ),
                      fontSize: `${settings.editorFontSize}px`,
                    }}
                  />
                  <S.MediaSection>
                    <NineGridMedia
                      media={moments.currentArticle.media}
                      onChange={(newMedia) =>
                        moments.updateArticle((prev) => ({
                          ...prev,
                          media: newMedia,
                        }))
                      }
                    />
                  </S.MediaSection>
                </S.EditorScroll>
              </S.PaneCard>
            )}

            {view !== "edit" && (
              <S.PaneCard>
                <S.PaneHeader>
                  <strong>实时前台预览</strong>
                  <span>Moments</span>
                </S.PaneHeader>
                <S.PreviewScroll>
                  <MomentPreview
                    article={moments.currentArticle}
                    authorName={settings.momentAuthorName}
                    authorAvatar={settings.momentAuthorAvatar}
                  />
                </S.PreviewScroll>
              </S.PaneCard>
            )}
          </S.SplitGrid>

          <FloatingMetaDock label="说说元信息">
            <DockPill>
              <Clock size={12} />
              <input
                type="datetime-local"
                aria-label="发布时间"
                value={formatLocalDateTime(moments.currentArticle.time)}
                onChange={(e) => {
                  const parsed = new Date(e.target.value).getTime();
                  if (!Number.isNaN(parsed)) {
                    moments.updateArticle((prev) => ({
                      ...prev,
                      time: parsed,
                    }));
                  }
                }}
                style={{ minWidth: "148px" }}
              />
              <DockButton
                type="button"
                onClick={() =>
                  moments.updateArticle((prev) => ({
                    ...prev,
                    time: Date.now(),
                  }))
                }
              >
                此刻
              </DockButton>
            </DockPill>

            <DockDivider />

            <DockPill>
              <MapPin size={12} />
              <input
                type="text"
                list="moments-location-list"
                aria-label="发布地点"
                value={moments.currentArticle.location || ""}
                onChange={(e) => {
                  const location = e.target.value;
                  moments.updateArticle((prev) => ({ ...prev, location }));
                }}
                placeholder="地点"
                style={{ width: "84px" }}
              />
            </DockPill>

            <DockPill>
              <Hash size={12} />
              <input
                type="text"
                list="moments-tag-list"
                aria-label="说说标签"
                value={tagsInput}
                onChange={(e) => {
                  const raw = e.target.value;
                  setTagsInput(raw);
                  moments.updateArticle((prev) => ({
                    ...prev,
                    tags: parseTagList(raw),
                  }));
                }}
                placeholder="标签 (逗号分隔)"
                style={{ width: "120px" }}
              />
            </DockPill>

            <DockDivider />

            <DockPill>
              <Music size={12} />
              <input
                type="text"
                aria-label="音乐名称"
                value={moments.currentArticle.music?.title || ""}
                onChange={(e) =>
                  moments.updateMusicField("title", e.target.value)
                }
                placeholder="歌名"
                style={{ width: "84px" }}
              />
              <span>·</span>
              <input
                type="text"
                aria-label="歌手"
                value={moments.currentArticle.music?.artist || ""}
                onChange={(e) =>
                  moments.updateMusicField("artist", e.target.value)
                }
                placeholder="歌手"
                style={{ width: "68px" }}
              />
              <span>·</span>
              <input
                type="url"
                aria-label="音频链接"
                value={moments.currentArticle.music?.url || ""}
                onChange={(e) =>
                  moments.updateMusicField("url", e.target.value)
                }
                placeholder="音频 URL"
                style={{ width: "116px" }}
              />
              <DockButton
                type="button"
                onClick={() => setMusicSearchOpen(true)}
                title="搜索网易云音乐"
              >
                <Search size={11} />
                网易云
              </DockButton>
            </DockPill>
          </FloatingMetaDock>

          <datalist id="moments-location-list">
            {moments.historicalLocations.map((loc) => (
              <option key={loc} value={loc} />
            ))}
          </datalist>
          <datalist id="moments-tag-list">
            {moments.availableTags.map(({ tag }) => (
              <option key={tag} value={tag} />
            ))}
          </datalist>
        </S.CanvasWrap>
      </S.Body>

      <DeleteConfirmModal
        isOpen={moments.deleteTarget !== null}
        article={moments.deleteTarget}
        title="确认删除该说说？"
        description="此操作将直接从 Cloudflare D1 数据库中删除该说说。"
        onClose={() => moments.setDeleteTarget(null)}
        onConfirm={() => void moments.handleConfirmDelete()}
        isDeleting={moments.isDeleting}
      />

      <MusicSearchModal
        isOpen={musicSearchOpen}
        currentMusic={moments.currentArticle.music}
        onClose={() => setMusicSearchOpen(false)}
        onSelect={(song) => {
          moments.setMusic({
            title: song.title,
            artist: song.artist,
            url: song.url,
          });
          setMusicSearchOpen(false);
          onToast("success", `已选择音乐：${song.title} - ${song.artist}`);
        }}
        onClear={() => {
          moments.setMusic(undefined);
          setMusicSearchOpen(false);
          onToast("info", "已清除当前说说音乐");
        }}
        onAuthExpired={onAuthExpired}
      />
    </S.WorkspaceRoot>
  );
}

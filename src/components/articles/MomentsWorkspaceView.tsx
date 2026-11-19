import * as S from "../../App.styles";
import {
  PenLine,
  Columns2,
  Eye,
  RotateCcw,
  Trash2,
  UploadCloud,
  Undo2,
  Redo2,
  Clock,
  MapPin,
  Hash,
  Music,
  GitCommitHorizontal,
} from "lucide-react";
import type { Article } from "../../types/article";
import { generateArticleFingerprint } from "../../types/article";
import { ArticleListSidebar } from "./ArticleListSidebar";
import { NineGridMedia } from "../media/NineGridMedia";
import { MomentPreview } from "../preview/MomentPreview";
import { handleDockWheel, parseTagList } from "../../styles/workspace";
import {
  resolveEditorFontCss,
  type CmsSettings,
  type EditorViewMode,
} from "../../lib/settings/cmsSettings";
import type { useMomentsWorkspace } from "../../lib/hooks/useMomentsWorkspace";

function formatLocalDateTime(ts: number): string {
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

interface MomentsWorkspaceViewProps {
  visible: boolean;
  sidebarOpen: boolean;
  momentsView: EditorViewMode;
  onChangeView: (view: EditorViewMode) => void;
  settings: CmsSettings;
  onOpenSettings: () => void;
  moments: ReturnType<typeof useMomentsWorkspace>;
}

export function MomentsWorkspaceView({
  visible,
  sidebarOpen,
  momentsView,
  onChangeView,
  settings,
  onOpenSettings,
  moments,
}: MomentsWorkspaceViewProps) {
  const {
    serverData,
    isLoading,
    errorMsg,
    draftsMap,
    selectedFingerprint,
    isNewArticle,
    currentArticle,
    tagsInput,
    setTagsInput,
    historyStack,
    historyIndex,
    isPublishing,
    autoSaveStatus,
    commitMessageInput,
    setCommitMessageInput,
    setDeleteModalArticle,
    availableTags,
    historicalLocations,
    isMomentsDirty,
    loadInitialData,
    updateArticle,
    updateMusicField,
    handleContentChange,
    handleUndo,
    handleRedo,
    handleSelectArticle,
    handleNewArticle,
    handleCloneArticle,
    handleRevertChanges,
    handlePublish,
  } = moments;

  return (
    <S.MomentsWorkspace $visible={visible}>
      <S.WorkspaceHeader>
        <S.HeaderLeft>
          {settings.siteIcon && (
            <S.BrandIconImg src={settings.siteIcon} alt="" />
          )}
          <S.BrandTitle>{settings.siteName}</S.BrandTitle>
          <S.ModePill>{isNewArticle ? "新说说" : "说说动态"}</S.ModePill>
          <S.StatusTextPill>
            {autoSaveStatus} · {currentArticle.content.length} 字
          </S.StatusTextPill>
          {isMomentsDirty && <S.DirtyBadge>未发布修改</S.DirtyBadge>}
          {serverData && !serverData.isD1 && (
            <S.HeaderModeButton
              type="button"
              onClick={onOpenSettings}
              title="未检测到 Cloudflare D1 绑定，点击查看配置"
            >
              离线模拟
            </S.HeaderModeButton>
          )}
        </S.HeaderLeft>

        <S.HeaderRight>
          <S.ViewGroup>
            {(
              [
                ["edit", "编辑", <PenLine size={12} key="i" />],
                ["split", "分屏", <Columns2 size={12} key="i" />],
                ["preview", "预览", <Eye size={12} key="i" />],
              ] as const
            ).map(([mode, label, icon]) => (
              <S.ViewButton
                key={mode}
                type="button"
                data-active={momentsView === mode}
                onClick={() => onChangeView(mode)}
              >
                {icon}
                {label}
              </S.ViewButton>
            ))}
          </S.ViewGroup>

          <S.GhostButton
            type="button"
            onClick={handleRevertChanges}
            disabled={!isMomentsDirty}
            aria-label="放弃未发布的本地修改"
            title="放弃未发布的本地修改"
          >
            <RotateCcw size={12} />
            <span className="btn-label">放弃</span>
          </S.GhostButton>

          <S.DangerIconButton
            type="button"
            onClick={() => {
              if (selectedFingerprint) {
                setDeleteModalArticle({
                  article: currentArticle,
                  fp: selectedFingerprint,
                });
              }
            }}
            disabled={isNewArticle || !selectedFingerprint}
            aria-label="删除当前说说"
            title="删除当前说说"
          >
            <Trash2 size={13} />
          </S.DangerIconButton>

          <S.PublishButton
            type="button"
            onClick={() => handlePublish()}
            disabled={isPublishing || !serverData}
          >
            <UploadCloud size={13} />
            {isPublishing ? "发布中…" : "发布"}
          </S.PublishButton>
        </S.HeaderRight>
      </S.WorkspaceHeader>

      {isLoading && (
        <S.LoadingNotice role="status">正在加载文章…</S.LoadingNotice>
      )}
      {errorMsg && (
        <S.ErrorNotice role="alert">
          <span>{errorMsg}</span>
          <S.RetryButton
            type="button"
            onClick={() => loadInitialData()}
            disabled={isLoading}
          >
            重新加载
          </S.RetryButton>
        </S.ErrorNotice>
      )}

      <S.MomentsBody>
        <S.MomentsSidebarWrap $open={sidebarOpen}>
          <ArticleListSidebar
            articles={serverData?.articles || []}
            selectedFingerprint={selectedFingerprint}
            onSelectArticle={handleSelectArticle}
            onNewArticle={handleNewArticle}
            onCloneArticle={handleCloneArticle}
            onDeleteArticle={(article: Article, fp: string) =>
              setDeleteModalArticle({ article, fp })
            }
            drafts={draftsMap}
            getFingerprint={generateArticleFingerprint}
            defaultSortOrder={settings.defaultSortOrder}
            compactList={settings.compactList}
          />
        </S.MomentsSidebarWrap>

        <S.MomentsCanvasWrap $sidebarOpen={sidebarOpen}>
          <S.MomentsSplitGrid data-single={momentsView !== "split"}>
            {momentsView !== "preview" && (
              <S.CanvasPaneCard>
                <S.PaneHeader>
                  <S.PaneTitle>
                    {isNewArticle ? "撰写新说说" : "正文内容"}
                  </S.PaneTitle>
                  <S.PaneMetaGroup>
                    <S.UndoRedoGroup>
                      <S.SmallIconButton
                        type="button"
                        onClick={handleUndo}
                        disabled={historyIndex <= 0}
                        title="撤回 (Undo)"
                      >
                        <Undo2 size={13} />
                      </S.SmallIconButton>
                      <S.SmallIconButton
                        type="button"
                        onClick={handleRedo}
                        disabled={historyIndex >= historyStack.length - 1}
                        title="重做 (Redo)"
                      >
                        <Redo2 size={13} />
                      </S.SmallIconButton>
                    </S.UndoRedoGroup>
                    <span>{currentArticle.content.length} 字</span>
                  </S.PaneMetaGroup>
                </S.PaneHeader>

                <S.EditorScrollBody>
                  <S.Textarea
                    value={currentArticle.content}
                    onChange={(e) => handleContentChange(e.target.value)}
                    placeholder="分享此刻的所思所想..."
                    rows={8}
                    spellCheck={settings.spellCheck}
                    style={{
                      fontFamily: resolveEditorFontCss(
                        settings.editorFontFamily,
                        "moments",
                      ),
                      fontSize: `${settings.editorFontSize}px`,
                      lineHeight: settings.editorLineHeight,
                    }}
                  />
                  <S.MediaSection>
                    <NineGridMedia
                      media={currentArticle.media}
                      onChange={(newMedia) =>
                        updateArticle((prev) => ({ ...prev, media: newMedia }))
                      }
                      defaultBatchMediaType={settings.defaultBatchMediaType}
                    />
                  </S.MediaSection>
                </S.EditorScrollBody>
              </S.CanvasPaneCard>
            )}

            {momentsView !== "edit" && (
              <S.CanvasPaneCard>
                <S.PaneHeader>
                  <S.PaneTitle>实时前台预览</S.PaneTitle>
                  <S.PaneMetaGroup>Moments</S.PaneMetaGroup>
                </S.PaneHeader>
                <S.PreviewScrollBody>
                  <MomentPreview
                    article={currentArticle}
                    authorName={settings.momentAuthorName}
                    authorAvatar={settings.momentAuthorAvatar}
                    dateFormat={settings.momentDateFormat}
                  />
                </S.PreviewScrollBody>
              </S.CanvasPaneCard>
            )}
          </S.MomentsSplitGrid>

          <S.FloatingDockWrap>
            <S.FloatingDockScroll onWheel={handleDockWheel}>
              <S.DockPill>
                <Clock size={12} />
                <input
                  type="datetime-local"
                  value={formatLocalDateTime(currentArticle.time)}
                  onChange={(e) => {
                    const parsed = new Date(e.target.value).getTime();
                    if (!Number.isNaN(parsed)) {
                      updateArticle((prev) => ({ ...prev, time: parsed }));
                    }
                  }}
                  aria-label="发布时间"
                  style={{ minWidth: "152px", width: "auto" }}
                />
                <S.DockNowButton
                  type="button"
                  onClick={() =>
                    updateArticle((prev) => ({ ...prev, time: Date.now() }))
                  }
                >
                  此刻
                </S.DockNowButton>
              </S.DockPill>

              <S.DockDivider />

              <S.DockPill>
                <MapPin size={12} />
                <input
                  type="text"
                  list="moments-location-list"
                  value={currentArticle.location || ""}
                  onChange={(e) =>
                    updateArticle((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  placeholder="地点"
                  aria-label="发布地点"
                  style={{ width: "84px" }}
                />
              </S.DockPill>

              <S.DockPill>
                <Hash size={12} />
                <input
                  type="text"
                  list="moments-tag-list"
                  value={tagsInput}
                  onChange={(e) => {
                    const raw = e.target.value;
                    setTagsInput(raw);
                    updateArticle((prev) => ({
                      ...prev,
                      tags: parseTagList(raw),
                    }));
                  }}
                  placeholder="标签 (逗号分隔)"
                  aria-label="说说标签"
                  style={{ width: "120px" }}
                />
              </S.DockPill>

              <S.DockDivider />

              <S.DockPill>
                <Music size={12} />
                <input
                  type="text"
                  value={currentArticle.music?.title || ""}
                  onChange={(e) => updateMusicField("title", e.target.value)}
                  placeholder="歌名"
                  aria-label="音乐名称"
                  style={{ width: "86px" }}
                />
                <span>·</span>
                <input
                  type="text"
                  value={currentArticle.music?.artist || ""}
                  onChange={(e) => updateMusicField("artist", e.target.value)}
                  placeholder="歌手"
                  aria-label="歌手"
                  style={{ width: "68px" }}
                />
                <span>·</span>
                <input
                  type="url"
                  value={currentArticle.music?.url || ""}
                  onChange={(e) => updateMusicField("url", e.target.value)}
                  placeholder="音频 URL"
                  aria-label="音频链接"
                  style={{ width: "120px" }}
                />
              </S.DockPill>

              <S.DockDivider />

              <S.DockPill>
                <GitCommitHorizontal size={12} />
                <input
                  type="text"
                  value={commitMessageInput}
                  onChange={(e) => setCommitMessageInput(e.target.value)}
                  placeholder={
                    isNewArticle ? "发布备注 (新说说)" : "发布备注 (可选)"
                  }
                  aria-label="发布备注"
                  style={{ width: "128px" }}
                />
              </S.DockPill>
            </S.FloatingDockScroll>
          </S.FloatingDockWrap>

          <datalist id="moments-location-list">
            {historicalLocations.map((loc) => (
              <option key={loc} value={loc} />
            ))}
          </datalist>
          <datalist id="moments-tag-list">
            {availableTags.map(({ tag }) => (
              <option key={tag} value={tag} />
            ))}
          </datalist>
        </S.MomentsCanvasWrap>
      </S.MomentsBody>
    </S.MomentsWorkspace>
  );
}

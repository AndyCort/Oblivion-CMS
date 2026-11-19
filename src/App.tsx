import * as S from "./App.styles";
import { useState, useEffect, useRef, lazy, Suspense, useCallback } from "react";
import {
  checkAuthStatus,
  logoutUser,
  type UserSession,
} from "./lib/api/client";
import { LoginPage } from "./components/auth/LoginPage";
import { getPostDrafts, deletePostDraft } from "./lib/storage/draftStore";
import type { PostDraft } from "./types/post";
import { DeleteConfirmModal } from "./components/modals/DeleteConfirmModal";
import { ConflictResolutionModal } from "./components/modals/ConflictResolutionModal";
import { LeftRail } from "./components/layout/LeftRail";
import { MomentsWorkspaceView } from "./components/articles/MomentsWorkspaceView";
import { isMobileViewport } from "./styles/workspace";
import {
  applySiteBrand,
  applyThemeAndAccent,
  loadCmsSettings,
  resetCmsSettings,
  saveCmsSettings,
  type CmsSettings,
} from "./lib/settings/cmsSettings";
import { useMomentsWorkspace } from "./lib/hooks/useMomentsWorkspace";

const PostsWorkspace = lazy(() => import("./components/posts/PostsWorkspace"));
const ConfigInfoModal = lazy(
  () => import("./components/modals/ConfigInfoModal"),
);

export function App() {
  const [settings, setSettings] = useState<CmsSettings>(() => loadCmsSettings());

  const [toastMsg, setToastMsg] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  const showToast = useCallback(
    (type: "success" | "error" | "info", text: string) => {
      setToastMsg({ type, text });
      setTimeout(() => {
        setToastMsg((prev) => (prev?.text === text ? null : prev));
      }, 4000);
    },
    [],
  );

  const updateSettings = (patch: Partial<CmsSettings>) => {
    setSettings((prev) => saveCmsSettings({ ...prev, ...patch }));
  };

  const [contentMode, setContentMode] = useState<"moments" | "posts">(() => {
    if (settings.startupMode === "moments" || settings.startupMode === "posts") {
      return settings.startupMode;
    }
    try {
      return localStorage.getItem("oblivion_content_mode") === "posts"
        ? "posts"
        : "moments";
    } catch {
      return "moments";
    }
  });
  const [postsOpened, setPostsOpened] = useState(contentMode === "posts");
  const [sidebarOpen, setSidebarOpen] = useState(() =>
    isMobileViewport() ? true : settings.defaultSidebarOpen,
  );
  const [momentsView, setMomentsView] = useState(settings.defaultMomentsView);
  const [newPostTrigger, setNewPostTrigger] = useState(0);
  const [postSaveTrigger, setPostSaveTrigger] = useState(0);
  const [postPublishTrigger, setPostPublishTrigger] = useState(0);
  const [postDraftSyncRev, setPostDraftSyncRev] = useState(0);
  const [modalPostDrafts, setModalPostDrafts] = useState<PostDraft[]>([]);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const shortcutHandlersRef = useRef({
    save: () => {},
    publish: () => {},
    toggleSidebar: () => {},
    enabled: true,
  });

  const handleAuthExpired = useCallback(() => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  }, []);

  const handleAfterNavigate = useCallback(() => {
    if (isMobileViewport() && settings.autoCloseSidebarOnMobile) {
      setSidebarOpen(false);
    }
  }, [settings.autoCloseSidebarOnMobile]);

  const moments = useMomentsWorkspace({
    settings,
    showToast,
    onAuthExpired: handleAuthExpired,
    onAfterNavigate: handleAfterNavigate,
  });

  const switchContentMode = (mode: "moments" | "posts") => {
    setContentMode(mode);
    if (mode === "posts") setPostsOpened(true);
    try {
      localStorage.setItem("oblivion_content_mode", mode);
    } catch {
      /* restricted storage */
    }
  };

  useEffect(() => {
    setMomentsView(settings.defaultMomentsView);
  }, [settings.defaultMomentsView]);

  useEffect(() => {
    if (!isMobileViewport()) {
      setSidebarOpen(settings.defaultSidebarOpen);
    }
  }, [settings.defaultSidebarOpen]);

  useEffect(() => {
    applySiteBrand(settings);
  }, [settings.siteName, settings.siteSubtitle, settings.siteIcon]);

  useEffect(() => {
    applyThemeAndAccent(settings);
    if (
      settings.theme !== "system" ||
      typeof window.matchMedia !== "function"
    ) {
      return;
    }
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => applyThemeAndAccent(settings);
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, [settings.theme, settings.accentColor]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const h = shortcutHandlersRef.current;
      if (!h.enabled || e.defaultPrevented || e.isComposing) return;
      if (!(e.metaKey || e.ctrlKey)) return;
      const key = e.key.toLowerCase();
      if (key === "b") {
        e.preventDefault();
        h.toggleSidebar();
      } else if (key === "s") {
        e.preventDefault();
        h.save();
      } else if (key === "enter") {
        e.preventDefault();
        h.publish();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const initAuth = async () => {
    setIsCheckingAuth(true);
    setAuthError(null);
    try {
      const res = await checkAuthStatus();
      if (res.user) {
        setIsAuthenticated(true);
        setCurrentUser(res.user);
        await moments.loadInitialData();
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
        if (res.error) setAuthError(res.error);
      }
    } catch (err: any) {
      setIsAuthenticated(false);
      setCurrentUser(null);
      setAuthError(err?.message || "网络请求失败");
    } finally {
      setIsCheckingAuth(false);
    }
  };

  useEffect(() => {
    void initAuth();
  }, []);

  const handleLoginSuccess = async (user: UserSession) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    setAuthError(null);
    showToast("success", `欢迎回来，${user.name || user.email}`);
    await moments.loadInitialData();
  };

  const handleLogout = async () => {
    await logoutUser();
    setIsAuthenticated(false);
    setCurrentUser(null);
    moments.setServerData(null);
    setAuthError(null);
    showToast("info", "已安全退出登录");
  };

  const refreshPostDrafts = async () => {
    try {
      setModalPostDrafts(await getPostDrafts());
    } catch {
      /* indexedDB unavailable */
    }
  };

  const handleDeletePostDraft = async (id: string) => {
    await deletePostDraft(id);
    await refreshPostDrafts();
    setPostDraftSyncRev((c) => c + 1);
    showToast("info", "已删除一条博客草稿");
  };

  const handleClearAllPostDrafts = async () => {
    for (const d of modalPostDrafts) {
      await deletePostDraft(d.id);
    }
    setModalPostDrafts([]);
    setPostDraftSyncRev((c) => c + 1);
    showToast("info", "已清空所有本地博客草稿");
  };

  const handleCycleTheme = () => {
    const next =
      settings.theme === "light"
        ? "dark"
        : settings.theme === "dark"
          ? "system"
          : "light";
    updateSettings({ theme: next });
  };

  const handleRailCreate = () => {
    if (contentMode === "moments") {
      moments.handleNewArticle();
    } else {
      setPostsOpened(true);
      setNewPostTrigger((c) => c + 1);
      handleAfterNavigate();
    }
  };

  shortcutHandlersRef.current = {
    enabled: settings.enableShortcuts,
    toggleSidebar: () => setSidebarOpen((prev) => !prev),
    save: () => {
      if (contentMode === "moments") {
        moments.saveDraftImmediately();
      } else {
        setPostsOpened(true);
        setPostSaveTrigger((c) => c + 1);
      }
    },
    publish: () => {
      if (contentMode === "moments") {
        if (!moments.isPublishing && moments.serverData) {
          void moments.handlePublish();
        }
      } else {
        setPostsOpened(true);
        setPostPublishTrigger((c) => c + 1);
      }
    },
  };

  if (isCheckingAuth) {
    return (
      <S.SessionScreen>
        <S.SessionSpinner />
        <S.SessionMessage>正在验证安全会话...</S.SessionMessage>
      </S.SessionScreen>
    );
  }

  if (!isAuthenticated) {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        initialError={authError}
        onRetry={initAuth}
      />
    );
  }

  return (
    <S.AppShell>
      <LeftRail
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        contentMode={contentMode}
        onSwitchMode={switchContentMode}
        onCreate={handleRailCreate}
        isD1={moments.serverData?.isD1}
        d1Mode={moments.serverData?.d1Mode}
        theme={settings.theme}
        onCycleTheme={handleCycleTheme}
        onOpenSettings={() => setIsConfigModalOpen(true)}
        onLogout={handleLogout}
      />

      <S.WorkspaceColumn>
        {toastMsg && (
          <S.Toast
            $variant={
              toastMsg.type === "success"
                ? "v0"
                : toastMsg.type === "error"
                  ? "v1"
                  : "v2"
            }
          >
            <S.ToastContent>
              {toastMsg.type === "success" ? (
                <S.CheckCircle />
              ) : toastMsg.type === "error" ? (
                <S.AlertTriangle />
              ) : (
                <S.Sparkles />
              )}
              <S.ToastText>{toastMsg.text}</S.ToastText>
            </S.ToastContent>
          </S.Toast>
        )}

        {postsOpened && (
          <S.PostsSlot $visible={contentMode === "posts"}>
            <Suspense fallback={<S.P role="status">正在载入博客编辑器…</S.P>}>
              <PostsWorkspace
                sidebarOpen={sidebarOpen}
                onSidebarOpenChange={setSidebarOpen}
                newPostTrigger={newPostTrigger}
                draftSyncRevision={postDraftSyncRev}
                saveTrigger={postSaveTrigger}
                publishTrigger={postPublishTrigger}
                settings={settings}
                onToast={showToast}
              />
            </Suspense>
          </S.PostsSlot>
        )}

        <MomentsWorkspaceView
          visible={contentMode === "moments"}
          sidebarOpen={sidebarOpen}
          momentsView={momentsView}
          onChangeView={setMomentsView}
          settings={settings}
          onOpenSettings={() => setIsConfigModalOpen(true)}
          moments={moments}
        />
      </S.WorkspaceColumn>

      <DeleteConfirmModal
        isOpen={moments.deleteModalArticle !== null}
        article={moments.deleteModalArticle?.article || null}
        onClose={() => moments.setDeleteModalArticle(null)}
        onConfirm={moments.handleConfirmDelete}
        isDeleting={moments.isDeleting}
      />

      <ConflictResolutionModal
        isOpen={moments.conflictModalData.isOpen}
        onClose={() => moments.setConflictModalData({ isOpen: false })}
        onReloadRemote={async () => {
          moments.setConflictModalData({ isOpen: false });
          await moments.loadInitialData();
          showToast("info", "已拉取最新远程版本，当前草稿已保留");
        }}
        onForcePublish={() => moments.handlePublish({ force: true })}
        localArticle={moments.currentArticle}
        remoteSha={moments.conflictModalData.remoteSha}
        clientBaseSha={moments.conflictModalData.clientBaseSha}
        isPublishing={moments.isPublishing}
      />

      {isConfigModalOpen && (
        <Suspense fallback={null}>
          <ConfigInfoModal
            isOpen={isConfigModalOpen}
            onClose={() => setIsConfigModalOpen(false)}
            settings={settings}
            onUpdateSettings={updateSettings}
            onResetSettings={() => {
              setSettings(resetCmsSettings());
              showToast("info", "已恢复全部默认设置");
            }}
            onReplaceSettings={(next) => setSettings(saveCmsSettings(next))}
            articles={moments.serverData?.articles || []}
            momentDrafts={Array.from(moments.draftsMap.values())}
            postDrafts={modalPostDrafts}
            onRefreshPostDrafts={refreshPostDrafts}
            onDeleteMomentDraft={moments.handleDeleteDraftById}
            onDeletePostDraft={handleDeletePostDraft}
            onClearAllMomentDrafts={moments.handleClearAllDrafts}
            onClearAllPostDrafts={handleClearAllPostDrafts}
            onImportComplete={moments.loadInitialData}
            onToast={showToast}
            onLogout={handleLogout}
            isD1={moments.serverData?.isD1}
            d1Mode={moments.serverData?.d1Mode}
            userEmail={currentUser?.email || moments.serverData?.user?.email}
          />
        </Suspense>
      )}
    </S.AppShell>
  );
}

export default App;

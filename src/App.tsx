import * as S from "./App.styles";
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { AlertTriangle, CheckCircle, Sparkles } from "lucide-react";
import { LoginPage } from "./components/auth/LoginPage";
import { LeftRail } from "./components/layout/LeftRail";
import { MomentsWorkspaceView } from "./components/moments/MomentsWorkspaceView";
import type { WorkspaceHandle } from "./components/workspace/WorkspaceHeader";
import {
  checkAuthStatus,
  logoutUser,
  type UserSession,
} from "./lib/api/client";
import {
  applyThemeAndAccent,
  loadCmsSettings,
  resetCmsSettings,
  saveCmsSettings,
  type CmsSettings,
} from "./lib/settings/cmsSettings";
import { isMobileViewport } from "./lib/utils";

const PostsWorkspace = lazy(() => import("./components/posts/PostsWorkspace"));
const SettingsModal = lazy(() => import("./components/settings/SettingsModal"));

export function App() {
  const [settings, setSettings] = useState<CmsSettings>(() => loadCmsSettings());
  const [toastMsg, setToastMsg] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  const [contentMode, setContentMode] = useState<"moments" | "posts">(() => {
    try {
      return localStorage.getItem("oblivion_content_mode") === "posts"
        ? "posts"
        : "moments";
    } catch {
      return "moments";
    }
  });
  const [postsOpened, setPostsOpened] = useState(contentMode === "posts");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [isD1, setIsD1] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const momentsRef = useRef<WorkspaceHandle>(null);
  const postsRef = useRef<WorkspaceHandle>(null);

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

  const activeWorkspace = () =>
    contentMode === "moments" ? momentsRef.current : postsRef.current;

  const shortcutRef = useRef({
    enabled: settings.enableShortcuts,
    mode: contentMode,
  });
  shortcutRef.current = { enabled: settings.enableShortcuts, mode: contentMode };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!shortcutRef.current.enabled || e.defaultPrevented || e.isComposing)
        return;
      if (!(e.metaKey || e.ctrlKey)) return;
      const key = e.key.toLowerCase();
      const ws =
        shortcutRef.current.mode === "moments"
          ? momentsRef.current
          : postsRef.current;
      if (key === "b") {
        e.preventDefault();
        setSidebarOpen((prev) => !prev);
      } else if (key === "s") {
        e.preventDefault();
        ws?.saveNow();
      } else if (key === "enter") {
        e.preventDefault();
        ws?.publishNow();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const initAuth = useCallback(async () => {
    setIsCheckingAuth(true);
    setAuthError(null);
    try {
      const res = await checkAuthStatus();
      if (res.user) {
        setIsAuthenticated(true);
        setCurrentUser(res.user);
        if (res.d1Bound !== undefined) setIsD1(res.d1Bound);
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
  }, []);

  useEffect(() => {
    void initAuth();
  }, [initAuth]);

  const handleLoginSuccess = (user: UserSession, d1Bound?: boolean) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    if (d1Bound !== undefined) setIsD1(d1Bound);
    setAuthError(null);
    showToast("success", `欢迎回来，${user.name || user.email}`);
  };

  const handleLogout = async () => {
    await logoutUser();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setAuthError(null);
    showToast("info", "已安全退出登录");
  };

  const switchMode = (mode: "moments" | "posts") => {
    setContentMode(mode);
    if (mode === "posts") setPostsOpened(true);
    try {
      localStorage.setItem("oblivion_content_mode", mode);
    } catch {
      /* restricted storage */
    }
  };

  const handleAfterNavigate = useCallback(() => {
    if (isMobileViewport()) setSidebarOpen(false);
  }, []);

  if (isCheckingAuth) {
    return (
      <S.SessionScreen>
        <S.SessionSpinner />
        <span>正在验证安全会话…</span>
      </S.SessionScreen>
    );
  }

  if (!isAuthenticated) {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        initialError={authError}
        onRetry={() => void initAuth()}
      />
    );
  }

  return (
    <S.AppShell>
      <LeftRail
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        contentMode={contentMode}
        onSwitchMode={switchMode}
        onCreate={() => activeWorkspace()?.createNew()}
        isD1={isD1}
        theme={settings.theme}
        onCycleTheme={() =>
          updateSettings({
            theme:
              settings.theme === "light"
                ? "dark"
                : settings.theme === "dark"
                  ? "system"
                  : "light",
          })
        }
        onOpenSettings={() => setIsSettingsOpen(true)}
        onLogout={() => void handleLogout()}
      />

      <S.WorkspaceColumn>
        {toastMsg && (
          <S.Toast $variant={toastMsg.type}>
            {toastMsg.type === "success" ? (
              <CheckCircle size={15} />
            ) : toastMsg.type === "error" ? (
              <AlertTriangle size={15} />
            ) : (
              <Sparkles size={15} />
            )}
            <span>{toastMsg.text}</span>
          </S.Toast>
        )}

        {postsOpened && (
          <S.WorkspaceSlot $visible={contentMode === "posts"}>
            <Suspense
              fallback={
                <S.FallbackText role="status">
                  正在载入博客编辑器…
                </S.FallbackText>
              }
            >
              <PostsWorkspace
                ref={postsRef}
                sidebarOpen={sidebarOpen}
                onSidebarOpenChange={setSidebarOpen}
                settings={settings}
                onToast={showToast}
              />
            </Suspense>
          </S.WorkspaceSlot>
        )}

        <MomentsWorkspaceView
          ref={momentsRef}
          visible={contentMode === "moments"}
          sidebarOpen={sidebarOpen}
          onSidebarOpenChange={setSidebarOpen}
          settings={settings}
          onToast={showToast}
          onAuthExpired={() => {
            setIsAuthenticated(false);
            setCurrentUser(null);
          }}
          onAfterNavigate={handleAfterNavigate}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onConnectionChange={setIsD1}
        />
      </S.WorkspaceColumn>

      {isSettingsOpen && (
        <Suspense fallback={null}>
          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            settings={settings}
            onUpdateSettings={updateSettings}
            onResetSettings={() => {
              setSettings(resetCmsSettings());
              showToast("info", "已恢复全部默认设置");
            }}
            onDraftsChanged={() => {
              momentsRef.current?.refreshDrafts();
              postsRef.current?.refreshDrafts();
            }}
            onToast={showToast}
            onLogout={handleLogout}
            isD1={isD1}
            userEmail={currentUser?.email}
          />
        </Suspense>
      )}
    </S.AppShell>
  );
}

export default App;

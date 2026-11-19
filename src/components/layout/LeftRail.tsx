import * as S from "../../App.styles";
import {
  PanelLeft,
  MessageCircle,
  FileText,
  Plus,
  Sun,
  Moon,
  Laptop,
  Settings,
  LogOut,
} from "lucide-react";
import type { CmsThemeMode } from "../../lib/settings/cmsSettings";

interface LeftRailProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  contentMode: "moments" | "posts";
  onSwitchMode: (mode: "moments" | "posts") => void;
  onCreate: () => void;
  isD1?: boolean;
  d1Mode?: "native" | "http" | "mock";
  theme: CmsThemeMode;
  onCycleTheme: () => void;
  onOpenSettings: () => void;
  onLogout: () => void;
}

export function LeftRail({
  sidebarOpen,
  onToggleSidebar,
  contentMode,
  onSwitchMode,
  onCreate,
  isD1,
  d1Mode,
  theme,
  onCycleTheme,
  onOpenSettings,
  onLogout,
}: LeftRailProps) {
  const themeTitle =
    theme === "light"
      ? "主题：浅色"
      : theme === "dark"
        ? "主题：深色"
        : "主题：跟随系统";

  const statusTitle = isD1
    ? d1Mode === "http"
      ? "Cloudflare D1 (REST 直连)"
      : "Cloudflare D1 已联机"
    : "未绑定 D1 (离线模拟模式)";

  return (
    <S.LeftRailColumn>
      <S.RailTopToggleSlot>
        <S.RailIconButton
          type="button"
          $active={sidebarOpen}
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? "收起列表" : "展开列表"}
          title={sidebarOpen ? "收起列表 (Ctrl+B)" : "展开列表 (Ctrl+B)"}
        >
          <PanelLeft size={15} />
        </S.RailIconButton>
      </S.RailTopToggleSlot>

      <S.RailNav>
        <S.RailGroup>
          <S.RailIconButton
            type="button"
            $active={contentMode === "moments"}
            onClick={() => onSwitchMode("moments")}
            aria-label="说说动态"
            title="说说动态"
          >
            <MessageCircle size={15} />
          </S.RailIconButton>
          <S.RailIconButton
            type="button"
            $active={contentMode === "posts"}
            onClick={() => onSwitchMode("posts")}
            aria-label="博客长文"
            title="博客长文"
          >
            <FileText size={15} />
          </S.RailIconButton>
          <S.RailMiniDivider />
          <S.RailIconButton
            type="button"
            $primary
            onClick={onCreate}
            aria-label={contentMode === "moments" ? "新建说说" : "新建文章"}
            title={contentMode === "moments" ? "新建说说" : "新建文章"}
          >
            <Plus size={15} />
          </S.RailIconButton>
        </S.RailGroup>

        <S.RailGroup>
          <S.RailIconButton
            type="button"
            onClick={onOpenSettings}
            aria-label="存储状态"
            title={statusTitle}
          >
            <S.StatusDot $connected={Boolean(isD1)} />
          </S.RailIconButton>
          <S.RailIconButton
            type="button"
            onClick={onCycleTheme}
            aria-label="切换主题"
            title={themeTitle}
          >
            {theme === "light" ? (
              <Sun size={15} />
            ) : theme === "dark" ? (
              <Moon size={15} />
            ) : (
              <Laptop size={15} />
            )}
          </S.RailIconButton>
          <S.RailIconButton
            type="button"
            onClick={onOpenSettings}
            aria-label="系统设置"
            title="CMS 设置"
          >
            <Settings size={15} />
          </S.RailIconButton>
          <S.RailIconButton
            type="button"
            $danger
            onClick={onLogout}
            aria-label="退出登录"
            title="退出登录"
          >
            <LogOut size={15} />
          </S.RailIconButton>
        </S.RailGroup>
      </S.RailNav>
    </S.LeftRailColumn>
  );
}

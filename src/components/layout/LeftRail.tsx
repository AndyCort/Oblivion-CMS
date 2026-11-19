import * as S from "./LeftRail.styles";
import {
  FileText,
  Laptop,
  LogOut,
  MessageCircle,
  Moon,
  PanelLeft,
  Plus,
  Settings,
  Sun,
} from "lucide-react";
import type { CmsThemeMode } from "../../lib/settings/cmsSettings";

interface LeftRailProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  contentMode: "moments" | "posts";
  onSwitchMode: (mode: "moments" | "posts") => void;
  onCreate: () => void;
  isD1: boolean;
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

  return (
    <S.RailColumn>
      <S.TopSlot>
        <S.IconBtn
          type="button"
          $active={sidebarOpen}
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? "收起列表" : "展开列表"}
          title={sidebarOpen ? "收起列表 (Ctrl+B)" : "展开列表 (Ctrl+B)"}
        >
          <PanelLeft size={15} />
        </S.IconBtn>
      </S.TopSlot>

      <S.Nav>
        <S.Group>
          <S.IconBtn
            type="button"
            $active={contentMode === "moments"}
            onClick={() => onSwitchMode("moments")}
            aria-label="说说动态"
            title="说说动态"
          >
            <MessageCircle size={15} />
          </S.IconBtn>
          <S.IconBtn
            type="button"
            $active={contentMode === "posts"}
            onClick={() => onSwitchMode("posts")}
            aria-label="博客长文"
            title="博客长文"
          >
            <FileText size={15} />
          </S.IconBtn>
          <S.Divider />
          <S.IconBtn
            type="button"
            $primary
            onClick={onCreate}
            aria-label={contentMode === "moments" ? "新建说说" : "新建文章"}
            title={contentMode === "moments" ? "新建说说" : "新建文章"}
          >
            <Plus size={15} />
          </S.IconBtn>
        </S.Group>

        <S.Group>
          <S.IconBtn
            type="button"
            onClick={onOpenSettings}
            aria-label="存储状态"
            title={isD1 ? "Cloudflare D1 已联机" : "未绑定 D1 (离线模拟模式)"}
          >
            <S.StatusDot $connected={isD1} />
          </S.IconBtn>
          <S.IconBtn
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
          </S.IconBtn>
          <S.IconBtn
            type="button"
            onClick={onOpenSettings}
            aria-label="系统设置"
            title="CMS 设置"
          >
            <Settings size={15} />
          </S.IconBtn>
          <S.IconBtn
            type="button"
            $danger
            onClick={onLogout}
            aria-label="退出登录"
            title="退出登录"
          >
            <LogOut size={15} />
          </S.IconBtn>
        </S.Group>
      </S.Nav>
    </S.RailColumn>
  );
}

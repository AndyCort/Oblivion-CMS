import * as S from "./ConfigInfoModal.styles";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Settings,
  X,
  Palette,
  PenTool,
  SlidersHorizontal,
  Zap,
  Database,
  RotateCcw,
  Trash2,
  Download,
  Upload,
  Check,
  Copy,
  LogOut,
  FileUp,
} from "lucide-react";
import type { Article, ArticleDraft } from "../../types/article";
import { displayPostText, type PostDraft } from "../../types/post";
import {
  ACCENT_PRESETS,
  DEFAULT_CMS_SETTINGS,
  DEFAULT_MOMENT_AVATAR,
  parseCmsSettingsImport,
  type AccentColorPreset,
  type CmsSettings,
} from "../../lib/settings/cmsSettings";
import {
  parseImportSource,
  type ParseImportResult,
} from "../../lib/importer/importParser";
import { batchImportArticles } from "../../lib/api/client";
import { parseTagList } from "../../styles/workspace";

type SettingsTab = "appearance" | "editor" | "defaults" | "workflow" | "data";

export interface ConfigInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: CmsSettings;
  onUpdateSettings: (patch: Partial<CmsSettings>) => void;
  onResetSettings: () => void;
  onReplaceSettings: (next: CmsSettings) => void;
  articles: Article[];
  momentDrafts: ArticleDraft[];
  postDrafts: PostDraft[];
  onRefreshPostDrafts: () => Promise<void>;
  onDeleteMomentDraft: (id: string) => Promise<void>;
  onDeletePostDraft: (id: string) => Promise<void>;
  onClearAllMomentDrafts: () => Promise<void>;
  onClearAllPostDrafts: () => Promise<void>;
  onImportComplete: () => Promise<void>;
  onToast: (type: "success" | "error" | "info", text: string) => void;
  onLogout: () => Promise<void>;
  isD1?: boolean;
  d1Mode?: "native" | "http" | "mock";
  userEmail?: string;
}

function Toggle({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (next: boolean) => void;
}) {
  return (
    <S.ToggleSwitch
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      $checked={checked}
      onClick={() => onChange(!checked)}
    >
      <S.ToggleKnob />
    </S.ToggleSwitch>
  );
}

function downloadJsonFile(filename: string, payload: unknown) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const ConfigInfoModal: React.FC<ConfigInfoModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetSettings,
  onReplaceSettings,
  articles,
  momentDrafts,
  postDrafts,
  onRefreshPostDrafts,
  onDeleteMomentDraft,
  onDeletePostDraft,
  onClearAllMomentDrafts,
  onClearAllPostDrafts,
  onImportComplete,
  onToast,
  onLogout,
  isD1,
  d1Mode,
  userEmail,
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("appearance");
  const [defaultTagsInput, setDefaultTagsInput] = useState(
    settings.defaultMomentTags.join(", "),
  );
  const [copiedApi, setCopiedApi] = useState(false);
  const [confirmAction, setConfirmAction] = useState<
    null | "clearMoments" | "clearPosts" | "overwriteImport" | "resetSettings"
  >(null);

  // Import state
  const [importText, setImportText] = useState("");
  const [parsedImport, setParsedImport] = useState<ParseImportResult | null>(
    null,
  );
  const [importError, setImportError] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const importFileRef = useRef<HTMLInputElement>(null);
  const settingsFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setConfirmAction(null);
      void onRefreshPostDrafts();
    }
  }, [isOpen]);

  useEffect(() => {
    if (
      parseTagList(defaultTagsInput).join(",") !==
      settings.defaultMomentTags.join(",")
    ) {
      setDefaultTagsInput(settings.defaultMomentTags.join(", "));
    }
  }, [settings.defaultMomentTags]);

  const mediaCount = useMemo(
    () => articles.reduce((sum, item) => sum + (item.media?.length || 0), 0),
    [articles],
  );

  if (!isOpen) return null;

  const publicApiUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/api/public/moments`
      : "/api/public/moments";

  const handleCopyApi = () => {
    void navigator.clipboard.writeText(publicApiUrl);
    setCopiedApi(true);
    setTimeout(() => setCopiedApi(false), 2000);
  };

  const handleExportMoments = () => {
    const day = new Date().toISOString().slice(0, 10);
    downloadJsonFile(`moments-backup-${day}.json`, articles);
    onToast("success", `已导出 ${articles.length} 条说说备份`);
  };

  const handleExportSettings = () => {
    const day = new Date().toISOString().slice(0, 10);
    downloadJsonFile(`oblivion-cms-settings-${day}.json`, settings);
    onToast("success", "已导出 CMS 设置配置文件");
  };

  const handleSettingsFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const text = await file.text();
      const imported = parseCmsSettingsImport(text);
      onReplaceSettings(imported);
      onToast("success", "已导入并应用 CMS 设置");
    } catch (err: any) {
      onToast("error", `导入设置失败: ${err?.message || "格式无效"}`);
    }
  };

  const handleParseImport = (sourceText = importText) => {
    setImportError("");
    try {
      const res = parseImportSource(sourceText);
      setParsedImport(res);
    } catch (err: any) {
      setParsedImport(null);
      setImportError(err?.message || "解析失败");
    }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const text = await file.text();
    setImportText(text);
    handleParseImport(text);
  };

  const handleExecuteImport = async (mode: "merge" | "overwrite") => {
    if (!parsedImport || parsedImport.articles.length === 0) return;
    setIsImporting(true);
    setImportError("");
    try {
      const res = await batchImportArticles(parsedImport.articles, mode);
      onToast("success", res.message);
      setImportText("");
      setParsedImport(null);
      setConfirmAction(null);
      await onImportComplete();
    } catch (err: any) {
      setImportError(err?.message || "导入失败");
      onToast("error", err?.message || "批量导入失败");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <S.Overlay onClick={onClose}>
      <S.Dialog
        role="dialog"
        aria-modal="true"
        aria-label="CMS 设置"
        onClick={(e) => e.stopPropagation()}
      >
        <S.Header>
          <S.HeaderTitleGroup>
            <S.HeaderIconBox>
              <Settings size={16} />
            </S.HeaderIconBox>
            <div>
              <S.HeaderTitle>CMS 设置中心</S.HeaderTitle>
              <S.HeaderSubtitle>
                所有偏好实时生效并自动保存至当前浏览器
              </S.HeaderSubtitle>
            </div>
          </S.HeaderTitleGroup>
          <S.CloseButton
            type="button"
            onClick={onClose}
            aria-label="关闭设置"
          >
            <X size={16} />
          </S.CloseButton>
        </S.Header>

        <S.TabBar role="tablist" aria-label="设置分类">
          {(
            [
              { id: "appearance", label: "站点与外观", icon: <Palette size={13} /> },
              { id: "editor", label: "写作与预览", icon: <PenTool size={13} /> },
              { id: "defaults", label: "资料与默认", icon: <SlidersHorizontal size={13} /> },
              { id: "workflow", label: "保护与快捷键", icon: <Zap size={13} /> },
              { id: "data", label: "数据与备份", icon: <Database size={13} /> },
            ] as const
          ).map((tab) => (
            <S.TabButton
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              $active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              {tab.label}
            </S.TabButton>
          ))}
        </S.TabBar>

        <S.Body>
          {activeTab === "appearance" && (
            <>
              <S.SectionCard>
                <S.SectionHeader>
                  <span>站点品牌（全站统一）</span>
                </S.SectionHeader>
                <S.SettingRow>
                  <S.SettingInfo>
                    <S.SettingLabel>网站名称</S.SettingLabel>
                    <S.SettingHint>
                      同步更新登录页、顶栏品牌名、浏览器标题与 iPhone 主屏幕标题
                    </S.SettingHint>
                  </S.SettingInfo>
                  <S.SettingControl>
                    <S.TextInput
                      aria-label="网站名称"
                      value={settings.siteName}
                      onChange={(e) =>
                        onUpdateSettings({ siteName: e.target.value })
                      }
                      onBlur={() => {
                        if (!settings.siteName.trim()) {
                          onUpdateSettings({
                            siteName: DEFAULT_CMS_SETTINGS.siteName,
                          });
                        }
                      }}
                    />
                  </S.SettingControl>
                </S.SettingRow>

                <S.SettingRow>
                  <S.SettingInfo>
                    <S.SettingLabel>网页标题后缀</S.SettingLabel>
                    <S.SettingHint>
                      用于拼接浏览器标签页标题，留空则仅显示网站名称
                    </S.SettingHint>
                  </S.SettingInfo>
                  <S.SettingControl>
                    <S.TextInput
                      aria-label="网页标题后缀"
                      value={settings.siteSubtitle}
                      placeholder="文章可视化编辑器"
                      onChange={(e) =>
                        onUpdateSettings({ siteSubtitle: e.target.value })
                      }
                    />
                  </S.SettingControl>
                </S.SettingRow>

                <S.SettingRow>
                  <S.SettingInfo>
                    <S.SettingLabel>站点图标 URL (Favicon)</S.SettingLabel>
                    <S.SettingHint>
                      支持相对路径（默认 /favicon.svg）或外链图片 URL
                    </S.SettingHint>
                  </S.SettingInfo>
                  <S.SettingControl>
                    <S.PreviewThumb
                      src={settings.siteIcon || DEFAULT_CMS_SETTINGS.siteIcon}
                      alt="站点图标预览"
                    />
                    <S.TextInput
                      aria-label="站点图标 URL"
                      value={settings.siteIcon}
                      onChange={(e) =>
                        onUpdateSettings({ siteIcon: e.target.value })
                      }
                    />
                    <S.ActionButton
                      type="button"
                      onClick={() =>
                        onUpdateSettings({
                          siteIcon: DEFAULT_CMS_SETTINGS.siteIcon,
                        })
                      }
                      title="还原默认图标"
                    >
                      还原
                    </S.ActionButton>
                  </S.SettingControl>
                </S.SettingRow>
              </S.SectionCard>

              <S.SectionCard>
                <S.SectionHeader>
                  <span>主题与强调色</span>
                </S.SectionHeader>
                <S.SettingRow>
                  <S.SettingInfo>
                    <S.SettingLabel>外观模式</S.SettingLabel>
                    <S.SettingHint>与左侧导轨主题按钮实时同步</S.SettingHint>
                  </S.SettingInfo>
                  <S.SettingControl>
                    <S.SegmentGroup>
                      {(
                        [
                          ["light", "浅色"],
                          ["dark", "深色"],
                          ["system", "跟随系统"],
                        ] as const
                      ).map(([val, label]) => (
                        <S.SegmentButton
                          key={val}
                          type="button"
                          $active={settings.theme === val}
                          onClick={() => onUpdateSettings({ theme: val })}
                        >
                          {label}
                        </S.SegmentButton>
                      ))}
                    </S.SegmentGroup>
                  </S.SettingControl>
                </S.SettingRow>

                <S.SettingRow>
                  <S.SettingInfo>
                    <S.SettingLabel>主题强调色</S.SettingLabel>
                    <S.SettingHint>
                      实时切换发布按钮、选中态与高亮元素色调
                    </S.SettingHint>
                  </S.SettingInfo>
                  <S.SettingControl>
                    {(Object.keys(ACCENT_PRESETS) as AccentColorPreset[]).map(
                      (key) => {
                        const preset = ACCENT_PRESETS[key];
                        return (
                          <S.AccentSwatchButton
                            key={key}
                            type="button"
                            $color={preset.swatch}
                            $active={settings.accentColor === key}
                            onClick={() =>
                              onUpdateSettings({ accentColor: key })
                            }
                          >
                            <S.AccentDot $color={preset.swatch} />
                            {preset.label}
                          </S.AccentSwatchButton>
                        );
                      },
                    )}
                  </S.SettingControl>
                </S.SettingRow>
              </S.SectionCard>

              <S.SectionCard>
                <S.SectionHeader>
                  <span>工作区布局与启动</span>
                </S.SectionHeader>
                <S.SettingRow>
                  <S.SettingInfo>
                    <S.SettingLabel>启动默认模块</S.SettingLabel>
                    <S.SettingHint>
                      打开 CMS 时优先显示的创作工作区
                    </S.SettingHint>
                  </S.SettingInfo>
                  <S.SettingControl>
                    <S.SegmentGroup>
                      {(
                        [
                          ["last", "记住上次"],
                          ["moments", "说说动态"],
                          ["posts", "博客长文"],
                        ] as const
                      ).map(([val, label]) => (
                        <S.SegmentButton
                          key={val}
                          type="button"
                          $active={settings.startupMode === val}
                          onClick={() =>
                            onUpdateSettings({ startupMode: val })
                          }
                        >
                          {label}
                        </S.SegmentButton>
                      ))}
                    </S.SegmentGroup>
                  </S.SettingControl>
                </S.SettingRow>

                <S.SettingRow>
                  <S.SettingInfo>
                    <S.SettingLabel>说说默认视图 / 博客默认视图</S.SettingLabel>
                    <S.SettingHint>控制启动后编辑区默认布局</S.SettingHint>
                  </S.SettingInfo>
                  <S.SettingControl>
                    <S.SelectInput
                      aria-label="说说默认视图"
                      value={settings.defaultMomentsView}
                      onChange={(e) =>
                        onUpdateSettings({
                          defaultMomentsView: e.target
                            .value as CmsSettings["defaultMomentsView"],
                        })
                      }
                    >
                      <option value="edit">说说：仅编辑</option>
                      <option value="split">说说：分屏</option>
                      <option value="preview">说说：仅预览</option>
                    </S.SelectInput>
                    <S.SelectInput
                      aria-label="博客默认视图"
                      value={settings.defaultPostsView}
                      onChange={(e) =>
                        onUpdateSettings({
                          defaultPostsView: e.target
                            .value as CmsSettings["defaultPostsView"],
                        })
                      }
                    >
                      <option value="edit">博客：仅编辑</option>
                      <option value="split">博客：分屏</option>
                      <option value="preview">博客：仅预览</option>
                    </S.SelectInput>
                  </S.SettingControl>
                </S.SettingRow>

                <S.SettingRow>
                  <S.SettingInfo>
                    <S.SettingLabel>启动时默认展开列表</S.SettingLabel>
                    <S.SettingHint>
                      桌面端进入写作界面时是否显示左侧文章列表
                    </S.SettingHint>
                  </S.SettingInfo>
                  <S.SettingControl>
                    <Toggle
                      checked={settings.defaultSidebarOpen}
                      label="启动时默认展开列表"
                      onChange={(v) =>
                        onUpdateSettings({ defaultSidebarOpen: v })
                      }
                    />
                  </S.SettingControl>
                </S.SettingRow>

                <S.SettingRow>
                  <S.SettingInfo>
                    <S.SettingLabel>移动端选文后自动进入画布</S.SettingLabel>
                    <S.SettingHint>
                      手机上点击文章或新建后自动收起列表栏
                    </S.SettingHint>
                  </S.SettingInfo>
                  <S.SettingControl>
                    <Toggle
                      checked={settings.autoCloseSidebarOnMobile}
                      label="移动端选文后自动进入画布"
                      onChange={(v) =>
                        onUpdateSettings({ autoCloseSidebarOnMobile: v })
                      }
                    />
                  </S.SettingControl>
                </S.SettingRow>

                <S.SettingRow>
                  <S.SettingInfo>
                    <S.SettingLabel>列表排序与紧凑密度</S.SettingLabel>
                    <S.SettingHint>
                      设置默认时间顺序及是否折叠过长列表摘要
                    </S.SettingHint>
                  </S.SettingInfo>
                  <S.SettingControl>
                    <S.SelectInput
                      aria-label="列表默认排序"
                      value={settings.defaultSortOrder}
                      onChange={(e) =>
                        onUpdateSettings({
                          defaultSortOrder: e.target.value as "desc" | "asc",
                        })
                      }
                    >
                      <option value="desc">最新优先</option>
                      <option value="asc">最早优先</option>
                    </S.SelectInput>
                    <Toggle
                      checked={settings.compactList}
                      label="紧凑列表"
                      onChange={(v) => onUpdateSettings({ compactList: v })}
                    />
                  </S.SettingControl>
                </S.SettingRow>
              </S.SectionCard>
            </>
          )}

          {activeTab === "editor" && (
            <>
              <S.SectionCard>
                <S.SectionHeader>
                  <span>编辑区排版</span>
                </S.SectionHeader>
                <S.SettingRow>
                  <S.SettingInfo>
                    <S.SettingLabel>编辑区字体</S.SettingLabel>
                    <S.SettingHint>
                      同步应用于说说与博客写作框，自动对齐博客行号
                    </S.SettingHint>
                  </S.SettingInfo>
                  <S.SettingControl>
                    <S.SegmentGroup>
                      {(
                        [
                          ["default", "默认"],
                          ["sans", "无衬线"],
                          ["serif", "衬线"],
                          ["mono", "等宽"],
                        ] as const
                      ).map(([val, label]) => (
                        <S.SegmentButton
                          key={val}
                          type="button"
                          $active={settings.editorFontFamily === val}
                          onClick={() =>
                            onUpdateSettings({ editorFontFamily: val })
                          }
                        >
                          {label}
                        </S.SegmentButton>
                      ))}
                    </S.SegmentGroup>
                  </S.SettingControl>
                </S.SettingRow>

                <S.SettingRow>
                  <S.SettingInfo>
                    <S.SettingLabel>正文字号与行高</S.SettingLabel>
                    <S.SettingHint>微调长时间写作的视觉舒适度</S.SettingHint>
                  </S.SettingInfo>
                  <S.SettingControl>
                    <S.SelectInput
                      aria-label="编辑器字号"
                      value={settings.editorFontSize}
                      onChange={(e) =>
                        onUpdateSettings({
                          editorFontSize: Number(e.target.value),
                        })
                      }
                    >
                      {[13, 14, 15, 16].map((size) => (
                        <option key={size} value={size}>
                          {size}px
                        </option>
                      ))}
                    </S.SelectInput>
                    <S.SelectInput
                      aria-label="编辑器行高"
                      value={settings.editorLineHeight}
                      onChange={(e) =>
                        onUpdateSettings({
                          editorLineHeight: Number(e.target.value),
                        })
                      }
                    >
                      <option value={1.6}>紧凑 1.6</option>
                      <option value={1.75}>标准 1.75</option>
                      <option value={1.9}>宽松 1.9</option>
                    </S.SelectInput>
                  </S.SettingControl>
                </S.SettingRow>
              </S.SectionCard>

              <S.SectionCard>
                <S.SectionHeader>
                  <span>Markdown 与预览</span>
                </S.SectionHeader>
                <S.SettingRow>
                  <S.SettingInfo>
                    <S.SettingLabel>显示 Markdown 行号栏</S.SettingLabel>
                    <S.SettingHint>
                      隐藏左侧行号可扩大正文区域并减少折行对齐运算
                    </S.SettingHint>
                  </S.SettingInfo>
                  <S.SettingControl>
                    <Toggle
                      checked={settings.showLineNumbers}
                      label="显示 Markdown 行号栏"
                      onChange={(v) =>
                        onUpdateSettings({ showLineNumbers: v })
                      }
                    />
                  </S.SettingControl>
                </S.SettingRow>

                <S.SettingRow>
                  <S.SettingInfo>
                    <S.SettingLabel>Tab 缩进宽度 / 拼写检查</S.SettingLabel>
                    <S.SettingHint>
                      按下 Tab 键插入的空格数量及浏览器原生拼写提示
                    </S.SettingHint>
                  </S.SettingInfo>
                  <S.SettingControl>
                    <S.SegmentGroup>
                      {([2, 4] as const).map((spaces) => (
                        <S.SegmentButton
                          key={spaces}
                          type="button"
                          $active={settings.tabIndentSpaces === spaces}
                          onClick={() =>
                            onUpdateSettings({ tabIndentSpaces: spaces })
                          }
                        >
                          {spaces} 空格
                        </S.SegmentButton>
                      ))}
                    </S.SegmentGroup>
                    <Toggle
                      checked={settings.spellCheck}
                      label="拼写检查"
                      onChange={(v) => onUpdateSettings({ spellCheck: v })}
                    />
                  </S.SettingControl>
                </S.SettingRow>

                <S.SettingRow>
                  <S.SettingInfo>
                    <S.SettingLabel>博客预览目录默认展开</S.SettingLabel>
                    <S.SettingHint>
                      控制 Markdown 预览顶部 TOC 目录的初始状态
                    </S.SettingHint>
                  </S.SettingInfo>
                  <S.SettingControl>
                    <Toggle
                      checked={settings.previewTocDefaultOpen}
                      label="博客预览目录默认展开"
                      onChange={(v) =>
                        onUpdateSettings({ previewTocDefaultOpen: v })
                      }
                    />
                  </S.SettingControl>
                </S.SettingRow>

                <S.SettingRow>
                  <S.SettingInfo>
                    <S.SettingLabel>阅读速度估算基准</S.SettingLabel>
                    <S.SettingHint>
                      用于计算博客顶部的预计阅读分钟数
                    </S.SettingHint>
                  </S.SettingInfo>
                  <S.SettingControl>
                    <S.SegmentGroup>
                      {[300, 400, 500].map((cpm) => (
                        <S.SegmentButton
                          key={cpm}
                          type="button"
                          $active={settings.readingSpeedCpm === cpm}
                          onClick={() =>
                            onUpdateSettings({ readingSpeedCpm: cpm })
                          }
                        >
                          {cpm} 字/分
                        </S.SegmentButton>
                      ))}
                    </S.SegmentGroup>
                  </S.SettingControl>
                </S.SettingRow>
              </S.SectionCard>

              <S.SectionCard>
                <S.SectionHeader>
                  <span>本地草稿策略</span>
                </S.SectionHeader>
                <S.SettingRow>
                  <S.SettingInfo>
                    <S.SettingLabel>自动保存防抖间隔</S.SettingLabel>
                    <S.SettingHint>
                      停止输入多久后自动写入 IndexedDB 本地草稿
                    </S.SettingHint>
                  </S.SettingInfo>
                  <S.SettingControl>
                    <S.SegmentGroup>
                      {[
                        [300, "300ms 极速"],
                        [700, "700ms 标准"],
                        [1500, "1.5s 节流"],
                      ].map(([ms, label]) => (
                        <S.SegmentButton
                          key={ms}
                          type="button"
                          $active={settings.autoSaveDelayMs === Number(ms)}
                          onClick={() =>
                            onUpdateSettings({ autoSaveDelayMs: Number(ms) })
                          }
                        >
                          {label}
                        </S.SegmentButton>
                      ))}
                    </S.SegmentGroup>
                  </S.SettingControl>
                </S.SettingRow>

                <S.SettingRow>
                  <S.SettingInfo>
                    <S.SettingLabel>恢复未发布草稿时弹出提示</S.SettingLabel>
                    <S.SettingHint>
                      切换文章检测到本地草稿时在右上角显示 Toast 提醒
                    </S.SettingHint>
                  </S.SettingInfo>
                  <S.SettingControl>
                    <Toggle
                      checked={settings.notifyOnDraftRestore}
                      label="恢复草稿提示"
                      onChange={(v) =>
                        onUpdateSettings({ notifyOnDraftRestore: v })
                      }
                    />
                  </S.SettingControl>
                </S.SettingRow>
              </S.SectionCard>
            </>
          )}

          {activeTab === "defaults" && (
            <>
              <S.SectionCard>
                <S.SectionHeader>
                  <span>Moments 预览个人资料</span>
                </S.SectionHeader>
                <S.SettingRow>
                  <S.SettingInfo>
                    <S.SettingLabel>预览卡片昵称</S.SettingLabel>
                    <S.SettingHint>
                      显示于说说实时预览卡片顶部
                    </S.SettingHint>
                  </S.SettingInfo>
                  <S.SettingControl>
                    <S.TextInput
                      aria-label="预览昵称"
                      value={settings.momentAuthorName}
                      onChange={(e) =>
                        onUpdateSettings({ momentAuthorName: e.target.value })
                      }
                    />
                  </S.SettingControl>
                </S.SettingRow>

                <S.SettingRow>
                  <S.SettingInfo>
                    <S.SettingLabel>预览卡片头像 URL</S.SettingLabel>
                    <S.SettingHint>
                      支持任意可直接访问的头像图片链接
                    </S.SettingHint>
                  </S.SettingInfo>
                  <S.SettingControl>
                    <S.PreviewThumb
                      $round
                      src={settings.momentAuthorAvatar || DEFAULT_MOMENT_AVATAR}
                      alt="预览头像"
                    />
                    <S.TextInput
                      aria-label="预览头像 URL"
                      value={settings.momentAuthorAvatar}
                      onChange={(e) =>
                        onUpdateSettings({ momentAuthorAvatar: e.target.value })
                      }
                    />
                    <S.ActionButton
                      type="button"
                      onClick={() =>
                        onUpdateSettings({
                          momentAuthorAvatar: DEFAULT_MOMENT_AVATAR,
                        })
                      }
                    >
                      默认
                    </S.ActionButton>
                  </S.SettingControl>
                </S.SettingRow>

                <S.SettingRow>
                  <S.SettingInfo>
                    <S.SettingLabel>预览卡片时间格式</S.SettingLabel>
                    <S.SettingHint>控制预览卡片左下角时间长度</S.SettingHint>
                  </S.SettingInfo>
                  <S.SettingControl>
                    <S.SegmentGroup>
                      <S.SegmentButton
                        type="button"
                        $active={settings.momentDateFormat === "full"}
                        onClick={() =>
                          onUpdateSettings({ momentDateFormat: "full" })
                        }
                      >
                        YYYY-MM-DD HH:mm
                      </S.SegmentButton>
                      <S.SegmentButton
                        type="button"
                        $active={settings.momentDateFormat === "short"}
                        onClick={() =>
                          onUpdateSettings({ momentDateFormat: "short" })
                        }
                      >
                        MM-DD HH:mm
                      </S.SegmentButton>
                    </S.SegmentGroup>
                  </S.SettingControl>
                </S.SettingRow>
              </S.SectionCard>

              <S.SectionCard>
                <S.SectionHeader>
                  <span>说说动态新建默认</span>
                </S.SectionHeader>
                <S.SettingRow>
                  <S.SettingInfo>
                    <S.SettingLabel>默认标签</S.SettingLabel>
                    <S.SettingHint>逗号分隔，留空则不预填标签</S.SettingHint>
                  </S.SettingInfo>
                  <S.SettingControl>
                    <S.TextInput
                      aria-label="新建说说默认标签"
                      value={defaultTagsInput}
                      placeholder="日常, 随想"
                      onChange={(e) => {
                        const raw = e.target.value;
                        setDefaultTagsInput(raw);
                        onUpdateSettings({
                          defaultMomentTags: parseTagList(raw),
                        });
                      }}
                    />
                  </S.SettingControl>
                </S.SettingRow>

                <S.SettingRow>
                  <S.SettingInfo>
                    <S.SettingLabel>默认地点</S.SettingLabel>
                    <S.SettingHint>新建说说时自动填入常用城市或地点</S.SettingHint>
                  </S.SettingInfo>
                  <S.SettingControl>
                    <S.TextInput
                      aria-label="新建说说默认地点"
                      value={settings.defaultMomentLocation}
                      placeholder="可选（如：上海）"
                      onChange={(e) =>
                        onUpdateSettings({
                          defaultMomentLocation: e.target.value,
                        })
                      }
                    />
                  </S.SettingControl>
                </S.SettingRow>

                <S.SettingRow>
                  <S.SettingInfo>
                    <S.SettingLabel>复制文章附加后缀</S.SettingLabel>
                    <S.SettingHint>
                      从列表克隆说说时是否在末尾自动追加提示文字
                    </S.SettingHint>
                  </S.SettingInfo>
                  <S.SettingControl>
                    <Toggle
                      checked={settings.cloneAppendSuffix}
                      label="复制附加后缀"
                      onChange={(v) =>
                        onUpdateSettings({ cloneAppendSuffix: v })
                      }
                    />
                    {settings.cloneAppendSuffix && (
                      <S.TextInput
                        aria-label="复制后缀文案"
                        value={settings.cloneSuffixText}
                        style={{ minWidth: "110px", width: "120px" }}
                        onChange={(e) =>
                          onUpdateSettings({ cloneSuffixText: e.target.value })
                        }
                      />
                    )}
                  </S.SettingControl>
                </S.SettingRow>

                <S.SettingRow>
                  <S.SettingInfo>
                    <S.SettingLabel>九宫格批量粘贴默认识别模式</S.SettingLabel>
                    <S.SettingHint>打开“批量粘贴导入”弹窗时的默认选项</S.SettingHint>
                  </S.SettingInfo>
                  <S.SettingControl>
                    <S.SegmentGroup>
                      {(
                        [
                          ["auto", "智能推测"],
                          ["img", "全部图片"],
                          ["vid", "全部视频"],
                        ] as const
                      ).map(([val, label]) => (
                        <S.SegmentButton
                          key={val}
                          type="button"
                          $active={settings.defaultBatchMediaType === val}
                          onClick={() =>
                            onUpdateSettings({ defaultBatchMediaType: val })
                          }
                        >
                          {label}
                        </S.SegmentButton>
                      ))}
                    </S.SegmentGroup>
                  </S.SettingControl>
                </S.SettingRow>
              </S.SectionCard>

              <S.SectionCard>
                <S.SectionHeader>
                  <span>博客长文新建默认</span>
                </S.SectionHeader>
                <S.SettingRow>
                  <S.SettingInfo>
                    <S.SettingLabel>默认作者</S.SettingLabel>
                    <S.SettingHint>新建博客文章时自动填入的作者名</S.SettingHint>
                  </S.SettingInfo>
                  <S.SettingControl>
                    <S.TextInput
                      aria-label="默认作者"
                      value={settings.defaultPostAuthor}
                      placeholder="可选"
                      onChange={(e) =>
                        onUpdateSettings({ defaultPostAuthor: e.target.value })
                      }
                    />
                  </S.SettingControl>
                </S.SettingRow>

                <S.SettingRow>
                  <S.SettingInfo>
                    <S.SettingLabel>默认原文语言</S.SettingLabel>
                    <S.SettingHint>进入新文章时的默认语言视角</S.SettingHint>
                  </S.SettingInfo>
                  <S.SettingControl>
                    <S.SelectInput
                      aria-label="默认原文语言"
                      value={settings.defaultPostLanguage}
                      onChange={(e) =>
                        onUpdateSettings({
                          defaultPostLanguage: e.target.value,
                        })
                      }
                    >
                      <option value="zh">zh (中文)</option>
                      <option value="en">en (English)</option>
                      <option value="ja">ja (日本語)</option>
                      <option value="zh-CN">zh-CN (简体中文)</option>
                      <option value="zh-TW">zh-TW (繁體中文)</option>
                    </S.SelectInput>
                  </S.SettingControl>
                </S.SettingRow>

                <S.SettingRow>
                  <S.SettingInfo>
                    <S.SettingLabel>输入标题时自动生成 Slug</S.SettingLabel>
                    <S.SettingHint>
                      仅对尚未发布且未手动修改过 Slug 的新文章生效
                    </S.SettingHint>
                  </S.SettingInfo>
                  <S.SettingControl>
                    <Toggle
                      checked={settings.autoGenerateSlug}
                      label="自动生成 Slug"
                      onChange={(v) =>
                        onUpdateSettings({ autoGenerateSlug: v })
                      }
                    />
                  </S.SettingControl>
                </S.SettingRow>
              </S.SectionCard>
            </>
          )}

          {activeTab === "workflow" && (
            <>
              <S.SectionCard>
                <S.SectionHeader>
                  <span>发布防误触保护</span>
                </S.SectionHeader>
                <S.SettingRow>
                  <S.SettingInfo>
                    <S.SettingLabel>发布前二次确认</S.SettingLabel>
                    <S.SettingHint>
                      点击顶栏「发布」按钮时弹出确认提示，降低手机端误触风险
                    </S.SettingHint>
                  </S.SettingInfo>
                  <S.SettingControl>
                    <Toggle
                      checked={settings.confirmBeforePublish}
                      label="发布前二次确认"
                      onChange={(v) =>
                        onUpdateSettings({ confirmBeforePublish: v })
                      }
                    />
                  </S.SettingControl>
                </S.SettingRow>

                <S.SettingRow>
                  <S.SettingInfo>
                    <S.SettingLabel>拦截空白说说发布</S.SettingLabel>
                    <S.SettingHint>
                      正文与媒体同时为空时禁止发布并给出提示
                    </S.SettingHint>
                  </S.SettingInfo>
                  <S.SettingControl>
                    <Toggle
                      checked={settings.preventEmptyPublish}
                      label="拦截空白说说"
                      onChange={(v) =>
                        onUpdateSettings({ preventEmptyPublish: v })
                      }
                    />
                  </S.SettingControl>
                </S.SettingRow>

                <S.SettingRow>
                  <S.SettingInfo>
                    <S.SettingLabel>默认发布备注</S.SettingLabel>
                    <S.SettingHint>
                      底部 Dock 发布备注未填写时自动使用的默认文本
                    </S.SettingHint>
                  </S.SettingInfo>
                  <S.SettingControl>
                    <S.TextInput
                      aria-label="默认发布备注"
                      value={settings.defaultCommitMessage}
                      placeholder="留空则由服务端自动生成"
                      onChange={(e) =>
                        onUpdateSettings({
                          defaultCommitMessage: e.target.value,
                        })
                      }
                    />
                  </S.SettingControl>
                </S.SettingRow>

                <S.SettingRow>
                  <S.SettingInfo>
                    <S.SettingLabel>发布成功后清空备注栏</S.SettingLabel>
                    <S.SettingHint>
                      关闭则保留上次填写的发布备注便于连续提交
                    </S.SettingHint>
                  </S.SettingInfo>
                  <S.SettingControl>
                    <Toggle
                      checked={settings.clearCommitAfterPublish}
                      label="发布后清空备注"
                      onChange={(v) =>
                        onUpdateSettings({ clearCommitAfterPublish: v })
                      }
                    />
                  </S.SettingControl>
                </S.SettingRow>
              </S.SectionCard>

              <S.SectionCard>
                <S.SectionHeader>
                  <span>快捷键控制</span>
                  <Toggle
                    checked={settings.enableShortcuts}
                    label="启用全局快捷键"
                    onChange={(v) => onUpdateSettings({ enableShortcuts: v })}
                  />
                </S.SectionHeader>
                <S.ShortcutTable>
                  <S.ShortcutRow>
                    <span>展开 / 收起文章列表</span>
                    <kbd>⌘ / Ctrl + B</kbd>
                  </S.ShortcutRow>
                  <S.ShortcutRow>
                    <span>立即保存当前本地草稿</span>
                    <kbd>⌘ / Ctrl + S</kbd>
                  </S.ShortcutRow>
                  <S.ShortcutRow>
                    <span>快捷发布当前内容</span>
                    <kbd>⌘ / Ctrl + Enter</kbd>
                  </S.ShortcutRow>
                  <S.ShortcutRow>
                    <span>Markdown 加粗 / 斜体</span>
                    <kbd>⌘ / Ctrl + B / I</kbd>
                  </S.ShortcutRow>
                  <S.ShortcutRow>
                    <span>Markdown 多行缩进</span>
                    <kbd>Tab</kbd>
                  </S.ShortcutRow>
                </S.ShortcutTable>
              </S.SectionCard>
            </>
          )}

          {activeTab === "data" && (
            <>
              <S.StatsGrid>
                <S.StatCard>
                  <strong>{articles.length}</strong>
                  <span>已加载说说</span>
                </S.StatCard>
                <S.StatCard>
                  <strong>{mediaCount}</strong>
                  <span>媒体附件总数</span>
                </S.StatCard>
                <S.StatCard>
                  <strong>{momentDrafts.length}</strong>
                  <span>本地说说草稿</span>
                </S.StatCard>
                <S.StatCard>
                  <strong>{postDrafts.length}</strong>
                  <span>本地博客草稿</span>
                </S.StatCard>
              </S.StatsGrid>

              <S.SectionCard>
                <S.SectionHeader>
                  <span>本地草稿管理 (IndexedDB)</span>
                  <S.SettingControl>
                    {confirmAction === "clearMoments" ? (
                      <>
                        <S.ActionButton
                          type="button"
                          $tone="danger"
                          onClick={async () => {
                            await onClearAllMomentDrafts();
                            setConfirmAction(null);
                          }}
                        >
                          确认清空说说草稿
                        </S.ActionButton>
                        <S.ActionButton
                          type="button"
                          onClick={() => setConfirmAction(null)}
                        >
                          取消
                        </S.ActionButton>
                      </>
                    ) : (
                      <S.ActionButton
                        type="button"
                        disabled={momentDrafts.length === 0}
                        onClick={() => setConfirmAction("clearMoments")}
                      >
                        清空说说 ({momentDrafts.length})
                      </S.ActionButton>
                    )}

                    {confirmAction === "clearPosts" ? (
                      <>
                        <S.ActionButton
                          type="button"
                          $tone="danger"
                          onClick={async () => {
                            await onClearAllPostDrafts();
                            setConfirmAction(null);
                          }}
                        >
                          确认清空博客草稿
                        </S.ActionButton>
                        <S.ActionButton
                          type="button"
                          onClick={() => setConfirmAction(null)}
                        >
                          取消
                        </S.ActionButton>
                      </>
                    ) : (
                      <S.ActionButton
                        type="button"
                        disabled={postDrafts.length === 0}
                        onClick={() => setConfirmAction("clearPosts")}
                      >
                        清空博客 ({postDrafts.length})
                      </S.ActionButton>
                    )}
                  </S.SettingControl>
                </S.SectionHeader>

                {momentDrafts.length === 0 && postDrafts.length === 0 ? (
                  <S.SettingRow>
                    <S.SettingHint>暂无尚未发布的本机草稿缓存</S.SettingHint>
                  </S.SettingRow>
                ) : (
                  <S.DraftList>
                    {momentDrafts.map((d) => (
                      <S.DraftItem key={`m-${d.id}`}>
                        <S.SettingControl style={{ minWidth: 0, flex: 1, flexWrap: "nowrap" }}>
                          <S.DraftBadge $kind="moment">说说</S.DraftBadge>
                          <S.SettingHint
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {d.article.content?.trim() || "（无文本说说草稿）"}
                          </S.SettingHint>
                        </S.SettingControl>
                        <S.ActionButton
                          type="button"
                          onClick={() => void onDeleteMomentDraft(d.id)}
                          aria-label={`删除说说草稿 ${d.id}`}
                        >
                          <Trash2 size={12} />
                        </S.ActionButton>
                      </S.DraftItem>
                    ))}
                    {postDrafts.map((d) => (
                      <S.DraftItem key={`p-${d.id}`}>
                        <S.SettingControl style={{ minWidth: 0, flex: 1, flexWrap: "nowrap" }}>
                          <S.DraftBadge $kind="post">博客</S.DraftBadge>
                          <S.SettingHint
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {displayPostText(d.post.title) || "未命名博客草稿"}
                          </S.SettingHint>
                        </S.SettingControl>
                        <S.ActionButton
                          type="button"
                          onClick={() => void onDeletePostDraft(d.id)}
                          aria-label={`删除博客草稿 ${d.id}`}
                        >
                          <Trash2 size={12} />
                        </S.ActionButton>
                      </S.DraftItem>
                    ))}
                  </S.DraftList>
                )}
              </S.SectionCard>

              <S.SectionCard>
                <S.SectionHeader>
                  <span>数据备份与设置迁移</span>
                </S.SectionHeader>
                <S.SettingRow>
                  <S.SettingInfo>
                    <S.SettingLabel>导出说说 JSON 备份</S.SettingLabel>
                    <S.SettingHint>
                      下载当前全部 {articles.length} 条说说为标准 JSON 文件
                    </S.SettingHint>
                  </S.SettingInfo>
                  <S.SettingControl>
                    <S.ActionButton type="button" onClick={handleExportMoments}>
                      <Download size={12} />
                      导出说说
                    </S.ActionButton>
                  </S.SettingControl>
                </S.SettingRow>

                <S.SettingRow>
                  <S.SettingInfo>
                    <S.SettingLabel>导出 / 导入 CMS 设置</S.SettingLabel>
                    <S.SettingHint>
                      在不同设备或浏览器间迁移您的所有 CMS 个人设置
                    </S.SettingHint>
                  </S.SettingInfo>
                  <S.SettingControl>
                    <S.ActionButton type="button" onClick={handleExportSettings}>
                      <Download size={12} />
                      导出设置
                    </S.ActionButton>
                    <S.ActionButton
                      type="button"
                      onClick={() => settingsFileRef.current?.click()}
                    >
                      <Upload size={12} />
                      导入设置
                    </S.ActionButton>
                    <input
                      ref={settingsFileRef}
                      type="file"
                      accept=".json,application/json"
                      hidden
                      onChange={(e) => void handleSettingsFile(e)}
                    />
                  </S.SettingControl>
                </S.SettingRow>
              </S.SectionCard>

              <S.SectionCard>
                <S.SectionHeader>
                  <span>批量导入说说 (.json / moments.ts)</span>
                  <S.ActionButton
                    type="button"
                    onClick={() => importFileRef.current?.click()}
                  >
                    <FileUp size={12} />
                    选择文件
                  </S.ActionButton>
                  <input
                    ref={importFileRef}
                    type="file"
                    accept=".json,.ts,.js,.txt"
                    hidden
                    onChange={(e) => void handleImportFile(e)}
                  />
                </S.SectionHeader>
                <S.ImportBox>
                  <S.ImportTextarea
                    value={importText}
                    onChange={(e) => {
                      setImportText(e.target.value);
                      setParsedImport(null);
                      setImportError("");
                    }}
                    placeholder="在此粘贴 JSON 数组或 moments.ts 源码，或点击右上角选择文件..."
                  />
                  {importError && (
                    <S.SettingHint style={{ color: "var(--color-rose-500)" }}>
                      {importError}
                    </S.SettingHint>
                  )}
                  {parsedImport && (
                    <S.SettingHint>
                      解析成功：共 <strong>{parsedImport.stats.total}</strong>{" "}
                      条说说，含 <strong>{parsedImport.stats.mediaCount}</strong>{" "}
                      个媒体、<strong>{parsedImport.stats.uniqueTags.length}</strong>{" "}
                      个标签。
                    </S.SettingHint>
                  )}
                  <S.SettingControl>
                    <S.ActionButton
                      type="button"
                      disabled={!importText.trim() || isImporting}
                      onClick={() => handleParseImport()}
                    >
                      解析预览
                    </S.ActionButton>
                    {parsedImport && parsedImport.articles.length > 0 && (
                      <>
                        <S.ActionButton
                          type="button"
                          $tone="primary"
                          disabled={isImporting}
                          onClick={() => void handleExecuteImport("merge")}
                        >
                          {isImporting ? "导入中…" : "增量合并"}
                        </S.ActionButton>
                        {confirmAction === "overwriteImport" ? (
                          <>
                            <S.ActionButton
                              type="button"
                              $tone="danger"
                              disabled={isImporting}
                              onClick={() =>
                                void handleExecuteImport("overwrite")
                              }
                            >
                              确认全量覆盖
                            </S.ActionButton>
                            <S.ActionButton
                              type="button"
                              onClick={() => setConfirmAction(null)}
                            >
                              取消
                            </S.ActionButton>
                          </>
                        ) : (
                          <S.ActionButton
                            type="button"
                            $tone="danger"
                            disabled={isImporting}
                            onClick={() => setConfirmAction("overwriteImport")}
                          >
                            全量覆盖
                          </S.ActionButton>
                        )}
                      </>
                    )}
                  </S.SettingControl>
                </S.ImportBox>
              </S.SectionCard>

              <S.SectionCard>
                <S.SectionHeader>
                  <span>当前运行状态与账号</span>
                </S.SectionHeader>
                <S.SettingRow>
                  <S.SettingInfo>
                    <S.SettingLabel>
                      数据连接：{isD1 ? `D1 (${d1Mode === "http" ? "REST 直连" : "已联机"})` : "本地离线模拟"}
                    </S.SettingLabel>
                    <S.SettingHint>
                      当前账号：{userEmail || "已验证会话"}
                    </S.SettingHint>
                  </S.SettingInfo>
                  <S.SettingControl>
                    <S.ActionButton
                      type="button"
                      onClick={handleCopyApi}
                      title={publicApiUrl}
                    >
                      {copiedApi ? <Check size={12} /> : <Copy size={12} />}
                      {copiedApi ? "已复制 API" : "复制 Public API"}
                    </S.ActionButton>
                    <S.ActionButton
                      type="button"
                      $tone="danger"
                      onClick={() => {
                        onClose();
                        void onLogout();
                      }}
                    >
                      <LogOut size={12} />
                      退出登录
                    </S.ActionButton>
                  </S.SettingControl>
                </S.SettingRow>
              </S.SectionCard>
            </>
          )}
        </S.Body>

        <S.Footer>
          <div>
            {confirmAction === "resetSettings" ? (
              <S.SettingControl>
                <S.ActionButton
                  type="button"
                  $tone="danger"
                  onClick={() => {
                    onResetSettings();
                    setConfirmAction(null);
                  }}
                >
                  确认恢复默认设置
                </S.ActionButton>
                <S.ActionButton
                  type="button"
                  onClick={() => setConfirmAction(null)}
                >
                  取消
                </S.ActionButton>
              </S.SettingControl>
            ) : (
              <S.ActionButton
                type="button"
                onClick={() => setConfirmAction("resetSettings")}
              >
                <RotateCcw size={12} />
                恢复全部默认设置
              </S.ActionButton>
            )}
          </div>
          <S.ActionButton type="button" $tone="primary" onClick={onClose}>
            完成
          </S.ActionButton>
        </S.Footer>
      </S.Dialog>
    </S.Overlay>
  );
};

export default ConfigInfoModal;

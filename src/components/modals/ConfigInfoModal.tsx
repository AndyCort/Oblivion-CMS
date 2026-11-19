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
type ConfirmKind =
  | "clearMoments"
  | "clearPosts"
  | "overwriteImport"
  | "resetSettings";

interface ConfigInfoModalProps {
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

function SettingItem({
  label,
  hint,
  children,
}: {
  label: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <S.SettingRow>
      <S.SettingInfo>
        <S.SettingLabel>{label}</S.SettingLabel>
        <S.SettingHint>{hint}</S.SettingHint>
      </S.SettingInfo>
      <S.SettingControl>{children}</S.SettingControl>
    </S.SettingRow>
  );
}

function Segmented<T extends string | number>({
  options,
  value,
  onChange,
}: {
  options: readonly (readonly [T, string])[];
  value: T;
  onChange: (next: T) => void;
}) {
  return (
    <S.SegmentGroup>
      {options.map(([opt, label]) => (
        <S.SegmentButton
          key={String(opt)}
          type="button"
          $active={value === opt}
          onClick={() => onChange(opt)}
        >
          {label}
        </S.SegmentButton>
      ))}
    </S.SegmentGroup>
  );
}

function InlineConfirm({
  active,
  confirmLabel,
  onConfirm,
  onCancel,
  trigger,
  disabled,
}: {
  active: boolean;
  confirmLabel: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  trigger: React.ReactNode;
  disabled?: boolean;
}) {
  if (!active) return <>{trigger}</>;
  return (
    <>
      <S.ActionButton
        type="button"
        $tone="danger"
        disabled={disabled}
        onClick={() => void onConfirm()}
      >
        {confirmLabel}
      </S.ActionButton>
      <S.ActionButton type="button" onClick={onCancel}>
        取消
      </S.ActionButton>
    </>
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

const TABS: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
  { id: "appearance", label: "站点与外观", icon: <Palette size={13} /> },
  { id: "editor", label: "写作与预览", icon: <PenTool size={13} /> },
  { id: "defaults", label: "资料与默认", icon: <SlidersHorizontal size={13} /> },
  { id: "workflow", label: "保护与快捷键", icon: <Zap size={13} /> },
  { id: "data", label: "数据与备份", icon: <Database size={13} /> },
];

const SHORTCUT_HINTS: [string, string][] = [
  ["展开 / 收起文章列表", "⌘ / Ctrl + B"],
  ["立即保存当前本地草稿", "⌘ / Ctrl + S"],
  ["快捷发布当前内容", "⌘ / Ctrl + Enter"],
  ["Markdown 加粗 / 斜体", "⌘ / Ctrl + B / I"],
  ["Markdown 多行缩进", "Tab"],
];

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
  const [confirmAction, setConfirmAction] = useState<ConfirmKind | null>(null);

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

  const handleExportJson = (prefix: string, payload: unknown, msg: string) => {
    const day = new Date().toISOString().slice(0, 10);
    downloadJsonFile(`${prefix}-${day}.json`, payload);
    onToast("success", msg);
  };

  const handleSettingsFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const imported = parseCmsSettingsImport(await file.text());
      onReplaceSettings(imported);
      onToast("success", "已导入并应用 CMS 设置");
    } catch (err: any) {
      onToast("error", `导入设置失败: ${err?.message || "格式无效"}`);
    }
  };

  const handleParseImport = (sourceText = importText) => {
    setImportError("");
    try {
      setParsedImport(parseImportSource(sourceText));
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
          <S.CloseButton type="button" onClick={onClose} aria-label="关闭设置">
            <X size={16} />
          </S.CloseButton>
        </S.Header>

        <S.TabBar role="tablist" aria-label="设置分类">
          {TABS.map((tab) => (
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
                <SettingItem
                  label="网站名称"
                  hint="同步更新登录页、顶栏品牌名、浏览器标题与 iPhone 主屏幕标题"
                >
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
                </SettingItem>

                <SettingItem
                  label="网页标题后缀"
                  hint="用于拼接浏览器标签页标题，留空则仅显示网站名称"
                >
                  <S.TextInput
                    aria-label="网页标题后缀"
                    value={settings.siteSubtitle}
                    placeholder="文章可视化编辑器"
                    onChange={(e) =>
                      onUpdateSettings({ siteSubtitle: e.target.value })
                    }
                  />
                </SettingItem>

                <SettingItem
                  label="站点图标 URL (Favicon)"
                  hint="支持相对路径（默认 /favicon.svg）或外链图片 URL"
                >
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
                </SettingItem>
              </S.SectionCard>

              <S.SectionCard>
                <S.SectionHeader>
                  <span>主题与强调色</span>
                </S.SectionHeader>
                <SettingItem
                  label="外观模式"
                  hint="与左侧导轨主题按钮实时同步"
                >
                  <Segmented
                    options={[
                      ["light", "浅色"],
                      ["dark", "深色"],
                      ["system", "跟随系统"],
                    ]}
                    value={settings.theme}
                    onChange={(theme) => onUpdateSettings({ theme })}
                  />
                </SettingItem>

                <SettingItem
                  label="主题强调色"
                  hint="实时切换发布按钮、选中态与高亮元素色调"
                >
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
                </SettingItem>
              </S.SectionCard>

              <S.SectionCard>
                <S.SectionHeader>
                  <span>工作区布局与启动</span>
                </S.SectionHeader>
                <SettingItem
                  label="启动默认模块"
                  hint="打开 CMS 时优先显示的创作工作区"
                >
                  <Segmented
                    options={[
                      ["last", "记住上次"],
                      ["moments", "说说动态"],
                      ["posts", "博客长文"],
                    ]}
                    value={settings.startupMode}
                    onChange={(startupMode) =>
                      onUpdateSettings({ startupMode })
                    }
                  />
                </SettingItem>

                <SettingItem
                  label="说说默认视图 / 博客默认视图"
                  hint="控制启动后编辑区默认布局"
                >
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
                </SettingItem>

                <SettingItem
                  label="启动时默认展开列表"
                  hint="桌面端进入写作界面时是否显示左侧文章列表"
                >
                  <Toggle
                    checked={settings.defaultSidebarOpen}
                    label="启动时默认展开列表"
                    onChange={(v) =>
                      onUpdateSettings({ defaultSidebarOpen: v })
                    }
                  />
                </SettingItem>

                <SettingItem
                  label="移动端选文后自动进入画布"
                  hint="手机上点击文章或新建后自动收起列表栏"
                >
                  <Toggle
                    checked={settings.autoCloseSidebarOnMobile}
                    label="移动端选文后自动进入画布"
                    onChange={(v) =>
                      onUpdateSettings({ autoCloseSidebarOnMobile: v })
                    }
                  />
                </SettingItem>

                <SettingItem
                  label="列表排序与紧凑密度"
                  hint="设置默认时间顺序及是否折叠过长列表摘要"
                >
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
                </SettingItem>
              </S.SectionCard>
            </>
          )}

          {activeTab === "editor" && (
            <>
              <S.SectionCard>
                <S.SectionHeader>
                  <span>编辑区排版</span>
                </S.SectionHeader>
                <SettingItem
                  label="编辑区字体"
                  hint="同步应用于说说与博客写作框，自动对齐博客行号"
                >
                  <Segmented
                    options={[
                      ["default", "默认"],
                      ["sans", "无衬线"],
                      ["serif", "衬线"],
                      ["mono", "等宽"],
                    ]}
                    value={settings.editorFontFamily}
                    onChange={(editorFontFamily) =>
                      onUpdateSettings({ editorFontFamily })
                    }
                  />
                </SettingItem>

                <SettingItem
                  label="正文字号与行高"
                  hint="微调长时间写作的视觉舒适度"
                >
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
                </SettingItem>
              </S.SectionCard>

              <S.SectionCard>
                <S.SectionHeader>
                  <span>Markdown 与预览</span>
                </S.SectionHeader>
                <SettingItem
                  label="显示 Markdown 行号栏"
                  hint="隐藏左侧行号可扩大正文区域并减少折行对齐运算"
                >
                  <Toggle
                    checked={settings.showLineNumbers}
                    label="显示 Markdown 行号栏"
                    onChange={(v) => onUpdateSettings({ showLineNumbers: v })}
                  />
                </SettingItem>

                <SettingItem
                  label="Tab 缩进宽度 / 拼写检查"
                  hint="按下 Tab 键插入的空格数量及浏览器原生拼写提示"
                >
                  <Segmented
                    options={[
                      [2, "2 空格"],
                      [4, "4 空格"],
                    ]}
                    value={settings.tabIndentSpaces}
                    onChange={(tabIndentSpaces) =>
                      onUpdateSettings({ tabIndentSpaces })
                    }
                  />
                  <Toggle
                    checked={settings.spellCheck}
                    label="拼写检查"
                    onChange={(v) => onUpdateSettings({ spellCheck: v })}
                  />
                </SettingItem>

                <SettingItem
                  label="博客预览目录默认展开"
                  hint="控制 Markdown 预览顶部 TOC 目录的初始状态"
                >
                  <Toggle
                    checked={settings.previewTocDefaultOpen}
                    label="博客预览目录默认展开"
                    onChange={(v) =>
                      onUpdateSettings({ previewTocDefaultOpen: v })
                    }
                  />
                </SettingItem>

                <SettingItem
                  label="阅读速度估算基准"
                  hint="用于计算博客顶部的预计阅读分钟数"
                >
                  <Segmented
                    options={[
                      [300, "300 字/分"],
                      [400, "400 字/分"],
                      [500, "500 字/分"],
                    ]}
                    value={settings.readingSpeedCpm}
                    onChange={(readingSpeedCpm) =>
                      onUpdateSettings({ readingSpeedCpm })
                    }
                  />
                </SettingItem>
              </S.SectionCard>

              <S.SectionCard>
                <S.SectionHeader>
                  <span>本地草稿策略</span>
                </S.SectionHeader>
                <SettingItem
                  label="自动保存防抖间隔"
                  hint="停止输入多久后自动写入 IndexedDB 本地草稿"
                >
                  <Segmented
                    options={[
                      [300, "300ms 极速"],
                      [700, "700ms 标准"],
                      [1500, "1.5s 节流"],
                    ]}
                    value={settings.autoSaveDelayMs}
                    onChange={(autoSaveDelayMs) =>
                      onUpdateSettings({ autoSaveDelayMs })
                    }
                  />
                </SettingItem>

                <SettingItem
                  label="恢复未发布草稿时弹出提示"
                  hint="切换文章检测到本地草稿时在右上角显示 Toast 提醒"
                >
                  <Toggle
                    checked={settings.notifyOnDraftRestore}
                    label="恢复草稿提示"
                    onChange={(v) =>
                      onUpdateSettings({ notifyOnDraftRestore: v })
                    }
                  />
                </SettingItem>
              </S.SectionCard>
            </>
          )}

          {activeTab === "defaults" && (
            <>
              <S.SectionCard>
                <S.SectionHeader>
                  <span>Moments 预览个人资料</span>
                </S.SectionHeader>
                <SettingItem
                  label="预览卡片昵称"
                  hint="显示于说说实时预览卡片顶部"
                >
                  <S.TextInput
                    aria-label="预览昵称"
                    value={settings.momentAuthorName}
                    onChange={(e) =>
                      onUpdateSettings({ momentAuthorName: e.target.value })
                    }
                  />
                </SettingItem>

                <SettingItem
                  label="预览卡片头像 URL"
                  hint="支持任意可直接访问的头像图片链接"
                >
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
                </SettingItem>

                <SettingItem
                  label="预览卡片时间格式"
                  hint="控制预览卡片左下角时间长度"
                >
                  <Segmented
                    options={[
                      ["full", "YYYY-MM-DD HH:mm"],
                      ["short", "MM-DD HH:mm"],
                    ]}
                    value={settings.momentDateFormat}
                    onChange={(momentDateFormat) =>
                      onUpdateSettings({ momentDateFormat })
                    }
                  />
                </SettingItem>
              </S.SectionCard>

              <S.SectionCard>
                <S.SectionHeader>
                  <span>说说动态新建默认</span>
                </S.SectionHeader>
                <SettingItem
                  label="默认标签"
                  hint="逗号分隔，留空则不预填标签"
                >
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
                </SettingItem>

                <SettingItem
                  label="默认地点"
                  hint="新建说说时自动填入常用城市或地点"
                >
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
                </SettingItem>

                <SettingItem
                  label="复制文章附加后缀"
                  hint="从列表克隆说说时是否在末尾自动追加提示文字"
                >
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
                </SettingItem>

                <SettingItem
                  label="九宫格批量粘贴默认识别模式"
                  hint="打开“批量粘贴导入”弹窗时的默认选项"
                >
                  <Segmented
                    options={[
                      ["auto", "智能推测"],
                      ["img", "全部图片"],
                      ["vid", "全部视频"],
                    ]}
                    value={settings.defaultBatchMediaType}
                    onChange={(defaultBatchMediaType) =>
                      onUpdateSettings({ defaultBatchMediaType })
                    }
                  />
                </SettingItem>
              </S.SectionCard>

              <S.SectionCard>
                <S.SectionHeader>
                  <span>博客长文新建默认</span>
                </S.SectionHeader>
                <SettingItem
                  label="默认作者"
                  hint="新建博客文章时自动填入的作者名"
                >
                  <S.TextInput
                    aria-label="默认作者"
                    value={settings.defaultPostAuthor}
                    placeholder="可选"
                    onChange={(e) =>
                      onUpdateSettings({ defaultPostAuthor: e.target.value })
                    }
                  />
                </SettingItem>

                <SettingItem
                  label="默认原文语言"
                  hint="进入新文章时的默认语言视角"
                >
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
                </SettingItem>

                <SettingItem
                  label="输入标题时自动生成 Slug"
                  hint="仅对尚未发布且未手动修改过 Slug 的新文章生效"
                >
                  <Toggle
                    checked={settings.autoGenerateSlug}
                    label="自动生成 Slug"
                    onChange={(v) => onUpdateSettings({ autoGenerateSlug: v })}
                  />
                </SettingItem>
              </S.SectionCard>
            </>
          )}

          {activeTab === "workflow" && (
            <>
              <S.SectionCard>
                <S.SectionHeader>
                  <span>发布防误触保护</span>
                </S.SectionHeader>
                <SettingItem
                  label="发布前二次确认"
                  hint="点击顶栏「发布」按钮时弹出确认提示，降低手机端误触风险"
                >
                  <Toggle
                    checked={settings.confirmBeforePublish}
                    label="发布前二次确认"
                    onChange={(v) =>
                      onUpdateSettings({ confirmBeforePublish: v })
                    }
                  />
                </SettingItem>

                <SettingItem
                  label="拦截空白说说发布"
                  hint="正文与媒体同时为空时禁止发布并给出提示"
                >
                  <Toggle
                    checked={settings.preventEmptyPublish}
                    label="拦截空白说说"
                    onChange={(v) =>
                      onUpdateSettings({ preventEmptyPublish: v })
                    }
                  />
                </SettingItem>

                <SettingItem
                  label="默认发布备注"
                  hint="底部 Dock 发布备注未填写时自动使用的默认文本"
                >
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
                </SettingItem>

                <SettingItem
                  label="发布成功后清空备注栏"
                  hint="关闭则保留上次填写的发布备注便于连续提交"
                >
                  <Toggle
                    checked={settings.clearCommitAfterPublish}
                    label="发布后清空备注"
                    onChange={(v) =>
                      onUpdateSettings({ clearCommitAfterPublish: v })
                    }
                  />
                </SettingItem>
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
                  {SHORTCUT_HINTS.map(([desc, keys]) => (
                    <S.ShortcutRow key={desc}>
                      <span>{desc}</span>
                      <kbd>{keys}</kbd>
                    </S.ShortcutRow>
                  ))}
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
                    <InlineConfirm
                      active={confirmAction === "clearMoments"}
                      confirmLabel="确认清空说说草稿"
                      onConfirm={async () => {
                        await onClearAllMomentDrafts();
                        setConfirmAction(null);
                      }}
                      onCancel={() => setConfirmAction(null)}
                      trigger={
                        <S.ActionButton
                          type="button"
                          disabled={momentDrafts.length === 0}
                          onClick={() => setConfirmAction("clearMoments")}
                        >
                          清空说说 ({momentDrafts.length})
                        </S.ActionButton>
                      }
                    />
                    <InlineConfirm
                      active={confirmAction === "clearPosts"}
                      confirmLabel="确认清空博客草稿"
                      onConfirm={async () => {
                        await onClearAllPostDrafts();
                        setConfirmAction(null);
                      }}
                      onCancel={() => setConfirmAction(null)}
                      trigger={
                        <S.ActionButton
                          type="button"
                          disabled={postDrafts.length === 0}
                          onClick={() => setConfirmAction("clearPosts")}
                        >
                          清空博客 ({postDrafts.length})
                        </S.ActionButton>
                      }
                    />
                  </S.SettingControl>
                </S.SectionHeader>

                {momentDrafts.length === 0 && postDrafts.length === 0 ? (
                  <S.SettingRow>
                    <S.SettingHint>暂无尚未发布的本机草稿缓存</S.SettingHint>
                  </S.SettingRow>
                ) : (
                  <S.DraftList>
                    {[
                      ...momentDrafts.map((d) => ({
                        key: `m-${d.id}`,
                        kind: "moment" as const,
                        badge: "说说",
                        title: d.article.content?.trim() || "（无文本说说草稿）",
                        ariaLabel: `删除说说草稿 ${d.id}`,
                        onDelete: () => onDeleteMomentDraft(d.id),
                      })),
                      ...postDrafts.map((d) => ({
                        key: `p-${d.id}`,
                        kind: "post" as const,
                        badge: "博客",
                        title: displayPostText(d.post.title) || "未命名博客草稿",
                        ariaLabel: `删除博客草稿 ${d.id}`,
                        onDelete: () => onDeletePostDraft(d.id),
                      })),
                    ].map((item) => (
                      <S.DraftItem key={item.key}>
                        <S.SettingControl
                          style={{ minWidth: 0, flex: 1, flexWrap: "nowrap" }}
                        >
                          <S.DraftBadge $kind={item.kind}>
                            {item.badge}
                          </S.DraftBadge>
                          <S.SettingHint
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item.title}
                          </S.SettingHint>
                        </S.SettingControl>
                        <S.ActionButton
                          type="button"
                          onClick={() => void item.onDelete()}
                          aria-label={item.ariaLabel}
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
                <SettingItem
                  label="导出说说 JSON 备份"
                  hint={`下载当前全部 ${articles.length} 条说说为标准 JSON 文件`}
                >
                  <S.ActionButton
                    type="button"
                    onClick={() =>
                      handleExportJson(
                        "moments-backup",
                        articles,
                        `已导出 ${articles.length} 条说说备份`,
                      )
                    }
                  >
                    <Download size={12} />
                    导出说说
                  </S.ActionButton>
                </SettingItem>

                <SettingItem
                  label="导出 / 导入 CMS 设置"
                  hint="在不同设备或浏览器间迁移您的所有 CMS 个人设置"
                >
                  <S.ActionButton
                    type="button"
                    onClick={() =>
                      handleExportJson(
                        "oblivion-cms-settings",
                        settings,
                        "已导出 CMS 设置配置文件",
                      )
                    }
                  >
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
                </SettingItem>
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
                      个媒体、
                      <strong>{parsedImport.stats.uniqueTags.length}</strong>{" "}
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
                        <InlineConfirm
                          active={confirmAction === "overwriteImport"}
                          confirmLabel="确认全量覆盖"
                          disabled={isImporting}
                          onConfirm={() => handleExecuteImport("overwrite")}
                          onCancel={() => setConfirmAction(null)}
                          trigger={
                            <S.ActionButton
                              type="button"
                              $tone="danger"
                              disabled={isImporting}
                              onClick={() =>
                                setConfirmAction("overwriteImport")
                              }
                            >
                              全量覆盖
                            </S.ActionButton>
                          }
                        />
                      </>
                    )}
                  </S.SettingControl>
                </S.ImportBox>
              </S.SectionCard>

              <S.SectionCard>
                <S.SectionHeader>
                  <span>当前运行状态与账号</span>
                </S.SectionHeader>
                <SettingItem
                  label={`数据连接：${isD1 ? `D1 (${d1Mode === "http" ? "REST 直连" : "已联机"})` : "本地离线模拟"}`}
                  hint={`当前账号：${userEmail || "已验证会话"}`}
                >
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
                </SettingItem>
              </S.SectionCard>
            </>
          )}
        </S.Body>

        <S.Footer>
          <div>
            <InlineConfirm
              active={confirmAction === "resetSettings"}
              confirmLabel="确认恢复默认设置"
              onConfirm={() => {
                onResetSettings();
                setConfirmAction(null);
              }}
              onCancel={() => setConfirmAction(null)}
              trigger={
                <S.ActionButton
                  type="button"
                  onClick={() => setConfirmAction("resetSettings")}
                >
                  <RotateCcw size={12} />
                  恢复全部默认设置
                </S.ActionButton>
              }
            />
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

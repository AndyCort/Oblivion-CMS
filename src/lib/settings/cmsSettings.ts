import { DEFAULT_SITE_BRAND, formatDocumentTitle } from "./siteBrand";

export type CmsThemeMode = "light" | "dark" | "system";
export type AccentColorPreset = "indigo" | "emerald" | "sky" | "amber" | "rose";
type StartupModuleMode = "last" | "moments" | "posts";
export type EditorViewMode = "edit" | "split" | "preview";
type EditorFontFamily = "default" | "sans" | "serif" | "mono";
type SortOrder = "desc" | "asc";
export type MomentDateFormat = "full" | "short";
type BatchMediaMode = "auto" | "img" | "vid";

export interface CmsSettings {
  // 1. 站点品牌 & 外观界面
  siteName: string;
  siteSubtitle: string;
  siteIcon: string;
  theme: CmsThemeMode;
  accentColor: AccentColorPreset;
  startupMode: StartupModuleMode;
  defaultMomentsView: EditorViewMode;
  defaultPostsView: EditorViewMode;
  defaultSidebarOpen: boolean;
  autoCloseSidebarOnMobile: boolean;
  defaultSortOrder: SortOrder;
  compactList: boolean;

  // 2. 编辑器与预览
  editorFontFamily: EditorFontFamily;
  editorFontSize: number;
  editorLineHeight: number;
  showLineNumbers: boolean;
  tabIndentSpaces: 2 | 4;
  spellCheck: boolean;
  previewTocDefaultOpen: boolean;
  readingSpeedCpm: number;
  autoSaveDelayMs: number;
  notifyOnDraftRestore: boolean;

  // 3. 个人资料 & 新建默认值
  momentAuthorName: string;
  momentAuthorAvatar: string;
  momentDateFormat: MomentDateFormat;
  defaultMomentTags: string[];
  defaultMomentLocation: string;
  cloneAppendSuffix: boolean;
  cloneSuffixText: string;
  defaultBatchMediaType: BatchMediaMode;
  defaultPostAuthor: string;
  defaultPostLanguage: string;
  autoGenerateSlug: boolean;

  // 4. 工作流保护 & 快捷键
  confirmBeforePublish: boolean;
  preventEmptyPublish: boolean;
  defaultCommitMessage: string;
  clearCommitAfterPublish: boolean;
  enableShortcuts: boolean;
}

export const CMS_SETTINGS_STORAGE_KEY = "oblivion_cms_settings";

export const DEFAULT_MOMENT_AVATAR =
  "https://raw.githubusercontent.com/AndyCort/PicGo/master/img/6C93394B-9A64-4DCE-BA19-3E6A316120D1_1_201_a.jpeg";

export const DEFAULT_CMS_SETTINGS: CmsSettings = {
  siteName: DEFAULT_SITE_BRAND.name,
  siteSubtitle: DEFAULT_SITE_BRAND.subtitle,
  siteIcon: DEFAULT_SITE_BRAND.icon,
  theme: "system",
  accentColor: "indigo",
  startupMode: "last",
  defaultMomentsView: "split",
  defaultPostsView: "split",
  defaultSidebarOpen: true,
  autoCloseSidebarOnMobile: true,
  defaultSortOrder: "desc",
  compactList: false,

  editorFontFamily: "default",
  editorFontSize: 14,
  editorLineHeight: 1.75,
  showLineNumbers: true,
  tabIndentSpaces: 2,
  spellCheck: false,
  previewTocDefaultOpen: true,
  readingSpeedCpm: 400,
  autoSaveDelayMs: 700,
  notifyOnDraftRestore: true,

  momentAuthorName: "Andy",
  momentAuthorAvatar: DEFAULT_MOMENT_AVATAR,
  momentDateFormat: "full",
  defaultMomentTags: ["日常"],
  defaultMomentLocation: "",
  cloneAppendSuffix: true,
  cloneSuffixText: "（副本）",
  defaultBatchMediaType: "auto",
  defaultPostAuthor: "",
  defaultPostLanguage: "zh",
  autoGenerateSlug: false,

  confirmBeforePublish: false,
  preventEmptyPublish: false,
  defaultCommitMessage: "",
  clearCommitAfterPublish: true,
  enableShortcuts: true,
};

const INDIGO_SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

export const ACCENT_PRESETS: Record<
  AccentColorPreset,
  {
    label: string;
    swatch: string;
    ramp?: Record<(typeof INDIGO_SHADES)[number], string>;
  }
> = {
  indigo: {
    label: "靛蓝",
    swatch: "#4f46e5",
  },
  emerald: {
    label: "翠绿",
    swatch: "#059669",
    ramp: {
      50: "oklch(97.9% 0.021 166.113)",
      100: "oklch(95% 0.052 163.051)",
      200: "oklch(90.5% 0.093 164.15)",
      300: "oklch(84.5% 0.143 164.978)",
      400: "oklch(76.5% 0.177 163.223)",
      500: "oklch(69.6% 0.17 162.48)",
      600: "oklch(59.6% 0.145 163.225)",
      700: "oklch(50.8% 0.118 165.612)",
      800: "oklch(43.2% 0.095 166.913)",
      900: "oklch(37.8% 0.077 168.94)",
      950: "oklch(26.2% 0.051 172.552)",
    },
  },
  sky: {
    label: "天青",
    swatch: "#0284c7",
    ramp: {
      50: "oklch(97.7% 0.013 236.62)",
      100: "oklch(95.1% 0.026 236.824)",
      200: "oklch(90.1% 0.058 230.902)",
      300: "oklch(82.8% 0.111 230.318)",
      400: "oklch(74.6% 0.16 232.661)",
      500: "oklch(68.5% 0.169 237.323)",
      600: "oklch(58.8% 0.158 241.966)",
      700: "oklch(50% 0.134 242.749)",
      800: "oklch(44.3% 0.11 240.79)",
      900: "oklch(39.1% 0.09 240.876)",
      950: "oklch(29.3% 0.066 243.157)",
    },
  },
  amber: {
    label: "琥珀",
    swatch: "#d97706",
    ramp: {
      50: "oklch(98.7% 0.022 95.277)",
      100: "oklch(96.2% 0.059 95.617)",
      200: "oklch(92.4% 0.12 95.746)",
      300: "oklch(87.9% 0.169 91.605)",
      400: "oklch(82.8% 0.189 84.429)",
      500: "oklch(76.9% 0.188 70.08)",
      600: "oklch(66.6% 0.179 58.318)",
      700: "oklch(55.5% 0.163 48.998)",
      800: "oklch(47.3% 0.137 46.201)",
      900: "oklch(41.4% 0.112 45.904)",
      950: "oklch(27.9% 0.077 45.635)",
    },
  },
  rose: {
    label: "玫瑰",
    swatch: "#e11d48",
    ramp: {
      50: "oklch(96.9% 0.015 12.422)",
      100: "oklch(94.1% 0.03 12.58)",
      200: "oklch(89.2% 0.058 10.001)",
      300: "oklch(81% 0.117 11.638)",
      400: "oklch(71.2% 0.194 13.428)",
      500: "oklch(64.5% 0.246 16.439)",
      600: "oklch(58.6% 0.253 17.585)",
      700: "oklch(51.4% 0.222 16.935)",
      800: "oklch(45.5% 0.188 13.697)",
      900: "oklch(41% 0.159 10.272)",
      950: "oklch(27.1% 0.105 12.094)",
    },
  },
};

function oneOf<T extends string>(val: unknown, allowed: readonly T[], fallback: T): T {
  return typeof val === "string" && (allowed as readonly string[]).includes(val)
    ? (val as T)
    : fallback;
}

function clampNumber(val: unknown, min: number, max: number, fallback: number): number {
  if (typeof val !== "number" || !Number.isFinite(val)) return fallback;
  return Math.min(max, Math.max(min, val));
}

function cleanString(val: unknown, fallback: string, allowEmpty = true): string {
  if (typeof val !== "string") return fallback;
  const trimmed = val.trim();
  return !allowEmpty && !trimmed ? fallback : trimmed;
}

function cleanBool(val: unknown, fallback: boolean): boolean {
  return typeof val === "boolean" ? val : fallback;
}

export function sanitizeCmsSettings(raw: unknown): CmsSettings {
  const input =
    raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const rawTags = Array.isArray(input.defaultMomentTags)
    ? input.defaultMomentTags
        .filter((t): t is string => typeof t === "string")
        .map((t) => t.trim())
        .filter(Boolean)
    : DEFAULT_CMS_SETTINGS.defaultMomentTags;

  return {
    siteName: cleanString(input.siteName, DEFAULT_CMS_SETTINGS.siteName, false),
    siteSubtitle: cleanString(
      input.siteSubtitle,
      DEFAULT_CMS_SETTINGS.siteSubtitle,
      true,
    ),
    siteIcon: cleanString(input.siteIcon, DEFAULT_CMS_SETTINGS.siteIcon, false),
    theme: oneOf(
      input.theme,
      ["light", "dark", "system"],
      DEFAULT_CMS_SETTINGS.theme,
    ),
    accentColor: oneOf(
      input.accentColor,
      ["indigo", "emerald", "sky", "amber", "rose"],
      DEFAULT_CMS_SETTINGS.accentColor,
    ),
    startupMode: oneOf(
      input.startupMode,
      ["last", "moments", "posts"],
      DEFAULT_CMS_SETTINGS.startupMode,
    ),
    defaultMomentsView: oneOf(
      input.defaultMomentsView,
      ["edit", "split", "preview"],
      DEFAULT_CMS_SETTINGS.defaultMomentsView,
    ),
    defaultPostsView: oneOf(
      input.defaultPostsView,
      ["edit", "split", "preview"],
      DEFAULT_CMS_SETTINGS.defaultPostsView,
    ),
    defaultSidebarOpen: cleanBool(
      input.defaultSidebarOpen,
      DEFAULT_CMS_SETTINGS.defaultSidebarOpen,
    ),
    autoCloseSidebarOnMobile: cleanBool(
      input.autoCloseSidebarOnMobile,
      DEFAULT_CMS_SETTINGS.autoCloseSidebarOnMobile,
    ),
    defaultSortOrder: oneOf(
      input.defaultSortOrder,
      ["desc", "asc"],
      DEFAULT_CMS_SETTINGS.defaultSortOrder,
    ),
    compactList: cleanBool(input.compactList, DEFAULT_CMS_SETTINGS.compactList),

    editorFontFamily: oneOf(
      input.editorFontFamily,
      ["default", "sans", "serif", "mono"],
      DEFAULT_CMS_SETTINGS.editorFontFamily,
    ),
    editorFontSize: clampNumber(
      input.editorFontSize,
      12,
      20,
      DEFAULT_CMS_SETTINGS.editorFontSize,
    ),
    editorLineHeight: clampNumber(
      input.editorLineHeight,
      1.3,
      2.2,
      DEFAULT_CMS_SETTINGS.editorLineHeight,
    ),
    showLineNumbers: cleanBool(
      input.showLineNumbers,
      DEFAULT_CMS_SETTINGS.showLineNumbers,
    ),
    tabIndentSpaces:
      input.tabIndentSpaces === 4 ? 4 : DEFAULT_CMS_SETTINGS.tabIndentSpaces,
    spellCheck: cleanBool(input.spellCheck, DEFAULT_CMS_SETTINGS.spellCheck),
    previewTocDefaultOpen: cleanBool(
      input.previewTocDefaultOpen,
      DEFAULT_CMS_SETTINGS.previewTocDefaultOpen,
    ),
    readingSpeedCpm: clampNumber(
      input.readingSpeedCpm,
      100,
      1200,
      DEFAULT_CMS_SETTINGS.readingSpeedCpm,
    ),
    autoSaveDelayMs: clampNumber(
      input.autoSaveDelayMs,
      150,
      5000,
      DEFAULT_CMS_SETTINGS.autoSaveDelayMs,
    ),
    notifyOnDraftRestore: cleanBool(
      input.notifyOnDraftRestore,
      DEFAULT_CMS_SETTINGS.notifyOnDraftRestore,
    ),

    momentAuthorName: cleanString(
      input.momentAuthorName,
      DEFAULT_CMS_SETTINGS.momentAuthorName,
      false,
    ),
    momentAuthorAvatar: cleanString(
      input.momentAuthorAvatar,
      DEFAULT_CMS_SETTINGS.momentAuthorAvatar,
      true,
    ),
    momentDateFormat: oneOf(
      input.momentDateFormat,
      ["full", "short"],
      DEFAULT_CMS_SETTINGS.momentDateFormat,
    ),
    defaultMomentTags: [...new Set(rawTags)],
    defaultMomentLocation: cleanString(
      input.defaultMomentLocation,
      DEFAULT_CMS_SETTINGS.defaultMomentLocation,
      true,
    ),
    cloneAppendSuffix: cleanBool(
      input.cloneAppendSuffix,
      DEFAULT_CMS_SETTINGS.cloneAppendSuffix,
    ),
    cloneSuffixText:
      typeof input.cloneSuffixText === "string"
        ? input.cloneSuffixText
        : DEFAULT_CMS_SETTINGS.cloneSuffixText,
    defaultBatchMediaType: oneOf(
      input.defaultBatchMediaType,
      ["auto", "img", "vid"],
      DEFAULT_CMS_SETTINGS.defaultBatchMediaType,
    ),
    defaultPostAuthor: cleanString(
      input.defaultPostAuthor,
      DEFAULT_CMS_SETTINGS.defaultPostAuthor,
      true,
    ),
    defaultPostLanguage:
      typeof input.defaultPostLanguage === "string" &&
      /^[a-z]{2,3}(?:-[a-z0-9]{2,8})*$/i.test(input.defaultPostLanguage.trim())
        ? input.defaultPostLanguage.trim()
        : DEFAULT_CMS_SETTINGS.defaultPostLanguage,
    autoGenerateSlug: cleanBool(
      input.autoGenerateSlug,
      DEFAULT_CMS_SETTINGS.autoGenerateSlug,
    ),

    confirmBeforePublish: cleanBool(
      input.confirmBeforePublish,
      DEFAULT_CMS_SETTINGS.confirmBeforePublish,
    ),
    preventEmptyPublish: cleanBool(
      input.preventEmptyPublish,
      DEFAULT_CMS_SETTINGS.preventEmptyPublish,
    ),
    defaultCommitMessage:
      typeof input.defaultCommitMessage === "string"
        ? input.defaultCommitMessage
        : DEFAULT_CMS_SETTINGS.defaultCommitMessage,
    clearCommitAfterPublish: cleanBool(
      input.clearCommitAfterPublish,
      DEFAULT_CMS_SETTINGS.clearCommitAfterPublish,
    ),
    enableShortcuts: cleanBool(
      input.enableShortcuts,
      DEFAULT_CMS_SETTINGS.enableShortcuts,
    ),
  };
}

export function loadCmsSettings(): CmsSettings {
  try {
    const raw = localStorage.getItem(CMS_SETTINGS_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_CMS_SETTINGS };
    return sanitizeCmsSettings(JSON.parse(raw));
  } catch {
    return { ...DEFAULT_CMS_SETTINGS };
  }
}

export function saveCmsSettings(settings: CmsSettings): CmsSettings {
  const sanitized = sanitizeCmsSettings(settings);
  try {
    localStorage.setItem(CMS_SETTINGS_STORAGE_KEY, JSON.stringify(sanitized));
  } catch {
    /* restricted storage */
  }
  return sanitized;
}

export function resetCmsSettings(): CmsSettings {
  const fresh = { ...DEFAULT_CMS_SETTINGS };
  saveCmsSettings(fresh);
  return fresh;
}

export function parseCmsSettingsImport(jsonText: string): CmsSettings {
  const parsed: unknown = JSON.parse(jsonText);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("无效的设置 JSON 格式：需要配置对象");
  }
  return sanitizeCmsSettings(parsed);
}

export function resolveEditorFontCss(font: EditorFontFamily, mode: "moments" | "posts"): string {
  if (font === "sans") return "var(--font-sans)";
  if (font === "serif") return "var(--font-serif)";
  if (font === "mono") return "var(--font-mono)";
  return mode === "posts" ? "var(--font-mono)" : "var(--font-sans)";
}

export function applySiteBrand(settings: Pick<CmsSettings, "siteName" | "siteSubtitle" | "siteIcon">) {
  if (typeof document === "undefined") return;

  const siteName = settings.siteName.trim() || DEFAULT_SITE_BRAND.name;
  document.title = formatDocumentTitle(siteName, settings.siteSubtitle);

  const webAppTitle = document.querySelector<HTMLMetaElement>(
    'meta[name="apple-mobile-web-app-title"]',
  );
  if (webAppTitle) {
    webAppTitle.content = siteName;
  }

  const iconUrl = settings.siteIcon.trim() || DEFAULT_SITE_BRAND.icon;
  let iconLink = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (!iconLink && document.head) {
    iconLink = document.createElement("link");
    iconLink.rel = "icon";
    document.head.appendChild(iconLink);
  }
  if (iconLink) {
    iconLink.href = iconUrl;
    if (/\.svg(\?|$)/i.test(iconUrl)) {
      iconLink.type = "image/svg+xml";
    } else {
      iconLink.removeAttribute("type");
    }
  }

  const appleLink = document.querySelector<HTMLLinkElement>('link[rel="apple-touch-icon"]');
  if (appleLink) {
    appleLink.href = /\.svg(\?|$)/i.test(iconUrl)
      ? DEFAULT_SITE_BRAND.appleTouchIcon
      : iconUrl;
  }
}

export function applyThemeAndAccent(settings: Pick<CmsSettings, "theme" | "accentColor">) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  if (settings.theme === "dark") {
    root.classList.add("dark");
  } else if (settings.theme === "light") {
    root.classList.remove("dark");
  } else if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }

  const preset = ACCENT_PRESETS[settings.accentColor];
  for (const shade of INDIGO_SHADES) {
    const varName = `--color-indigo-${shade}`;
    if (preset?.ramp) {
      root.style.setProperty(varName, preset.ramp[shade]);
    } else {
      root.style.removeProperty(varName);
    }
  }
}

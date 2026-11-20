export type CmsThemeMode = "light" | "dark" | "system";
export type AccentColorPreset = "indigo" | "emerald" | "sky" | "amber" | "rose";
export type EditorViewMode = "edit" | "split" | "preview";
export type EditorFontFamily = "default" | "sans" | "serif" | "mono";
export type SortOrder = "desc" | "asc";

export interface CmsSettings {
  theme: CmsThemeMode;
  accentColor: AccentColorPreset;
  defaultView: EditorViewMode;
  defaultSortOrder: SortOrder;
  compactList: boolean;
  editorFontFamily: EditorFontFamily;
  editorFontSize: number;
  tabIndentSpaces: 2 | 4;
  previewTocDefaultOpen: boolean;
  momentAuthorName: string;
  momentAuthorAvatar: string;
  defaultMomentTags: string[];
  defaultMomentLocation: string;
  defaultPostAuthor: string;
  confirmBeforePublish: boolean;
  enableShortcuts: boolean;
}

export const CMS_SETTINGS_STORAGE_KEY = "oblivion_cms_settings";

export const DEFAULT_MOMENT_AVATAR =
  "https://raw.githubusercontent.com/AndyCort/PicGo/master/img/6C93394B-9A64-4DCE-BA19-3E6A316120D1_1_201_a.jpeg";

export const DEFAULT_CMS_SETTINGS: CmsSettings = {
  theme: "system",
  accentColor: "indigo",
  defaultView: "split",
  defaultSortOrder: "desc",
  compactList: false,
  editorFontFamily: "default",
  editorFontSize: 14,
  tabIndentSpaces: 2,
  previewTocDefaultOpen: true,
  momentAuthorName: "Andy",
  momentAuthorAvatar: DEFAULT_MOMENT_AVATAR,
  defaultMomentTags: [],
  defaultMomentLocation: "",
  defaultPostAuthor: "",
  confirmBeforePublish: false,
  enableShortcuts: true,
};

interface AccentTokens {
  label: string;
  swatch: string;
  light?: Record<string, string>;
  dark?: Record<string, string>;
}

export const ACCENT_PRESETS: Record<AccentColorPreset, AccentTokens> = {
  indigo: {
    label: "靛蓝",
    swatch: "#4f46e5",
  },
  emerald: {
    label: "翠绿",
    swatch: "#059669",
    light: {
      "--accent": "#059669",
      "--accent-hover": "#10b981",
      "--accent-soft": "rgb(5 150 105 / 0.12)",
      "--accent-text": "#047857",
      "--accent-ring": "rgb(16 185 129 / 0.22)",
    },
    dark: {
      "--accent": "#059669",
      "--accent-hover": "#10b981",
      "--accent-soft": "rgb(16 185 129 / 0.2)",
      "--accent-text": "#6ee7b7",
      "--accent-ring": "rgb(52 211 153 / 0.24)",
    },
  },
  sky: {
    label: "天青",
    swatch: "#0284c7",
    light: {
      "--accent": "#0284c7",
      "--accent-hover": "#0ea5e9",
      "--accent-soft": "rgb(2 132 199 / 0.12)",
      "--accent-text": "#0369a1",
      "--accent-ring": "rgb(14 165 233 / 0.22)",
    },
    dark: {
      "--accent": "#0284c7",
      "--accent-hover": "#0ea5e9",
      "--accent-soft": "rgb(14 165 233 / 0.2)",
      "--accent-text": "#7dd3fc",
      "--accent-ring": "rgb(56 189 248 / 0.24)",
    },
  },
  amber: {
    label: "琥珀",
    swatch: "#d97706",
    light: {
      "--accent": "#d97706",
      "--accent-hover": "#f59e0b",
      "--accent-soft": "rgb(217 119 6 / 0.12)",
      "--accent-text": "#b45309",
      "--accent-ring": "rgb(245 158 11 / 0.22)",
    },
    dark: {
      "--accent": "#d97706",
      "--accent-hover": "#f59e0b",
      "--accent-soft": "rgb(245 158 11 / 0.2)",
      "--accent-text": "#fcd34d",
      "--accent-ring": "rgb(251 191 36 / 0.24)",
    },
  },
  rose: {
    label: "玫瑰",
    swatch: "#e11d48",
    light: {
      "--accent": "#e11d48",
      "--accent-hover": "#f43f5e",
      "--accent-soft": "rgb(225 29 72 / 0.12)",
      "--accent-text": "#be123c",
      "--accent-ring": "rgb(244 63 94 / 0.22)",
    },
    dark: {
      "--accent": "#e11d48",
      "--accent-hover": "#f43f5e",
      "--accent-soft": "rgb(244 63 94 / 0.2)",
      "--accent-text": "#fda4af",
      "--accent-ring": "rgb(251 113 133 / 0.24)",
    },
  },
};

const ACCENT_VAR_NAMES = [
  "--accent",
  "--accent-hover",
  "--accent-soft",
  "--accent-text",
  "--accent-ring",
] as const;

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
    theme: oneOf(input.theme, ["light", "dark", "system"], DEFAULT_CMS_SETTINGS.theme),
    accentColor: oneOf(
      input.accentColor,
      ["indigo", "emerald", "sky", "amber", "rose"],
      DEFAULT_CMS_SETTINGS.accentColor,
    ),
    defaultView: oneOf(
      input.defaultView ?? input.defaultMomentsView ?? input.defaultPostsView,
      ["edit", "split", "preview"],
      DEFAULT_CMS_SETTINGS.defaultView,
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
    tabIndentSpaces:
      input.tabIndentSpaces === 4 ? 4 : DEFAULT_CMS_SETTINGS.tabIndentSpaces,
    previewTocDefaultOpen: cleanBool(
      input.previewTocDefaultOpen,
      DEFAULT_CMS_SETTINGS.previewTocDefaultOpen,
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
    defaultMomentTags: [...new Set(rawTags)],
    defaultMomentLocation: cleanString(
      input.defaultMomentLocation,
      DEFAULT_CMS_SETTINGS.defaultMomentLocation,
      true,
    ),
    defaultPostAuthor: cleanString(
      input.defaultPostAuthor,
      DEFAULT_CMS_SETTINGS.defaultPostAuthor,
      true,
    ),
    confirmBeforePublish: cleanBool(
      input.confirmBeforePublish,
      DEFAULT_CMS_SETTINGS.confirmBeforePublish,
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

export function resolveEditorFontCss(font: EditorFontFamily, mode: "moments" | "posts"): string {
  if (font === "sans") return "var(--font-sans)";
  if (font === "serif") return "var(--font-serif)";
  if (font === "mono") return "var(--font-mono)";
  return mode === "posts" ? "var(--font-mono)" : "var(--font-sans)";
}

export function applyThemeAndAccent(settings: Pick<CmsSettings, "theme" | "accentColor">) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  const prefersDark =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark =
    settings.theme === "dark" || (settings.theme === "system" && prefersDark);

  root.classList.toggle("dark", isDark);

  const preset = ACCENT_PRESETS[settings.accentColor];
  const palette = isDark ? preset?.dark : preset?.light;
  for (const name of ACCENT_VAR_NAMES) {
    if (palette?.[name]) {
      root.style.setProperty(name, palette[name]);
    } else {
      root.style.removeProperty(name);
    }
  }
}

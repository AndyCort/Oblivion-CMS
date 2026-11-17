// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  CMS_SETTINGS_STORAGE_KEY,
  DEFAULT_CMS_SETTINGS,
  applySiteBrand,
  applyThemeAndAccent,
  loadCmsSettings,
  parseCmsSettingsImport,
  resetCmsSettings,
  sanitizeCmsSettings,
  saveCmsSettings,
} from "../src/lib/settings/cmsSettings";
import {
  DEFAULT_SITE_BRAND,
  formatDocumentTitle,
} from "../src/lib/settings/siteBrand";

function createMemoryStorage(): Storage {
  const store = new Map<string, string>();
  return {
    get length() {
      return store.size;
    },
    clear() {
      store.clear();
    },
    getItem(key: string) {
      return store.has(key) ? store.get(key)! : null;
    },
    key(index: number) {
      return Array.from(store.keys())[index] ?? null;
    },
    removeItem(key: string) {
      store.delete(key);
    },
    setItem(key: string, value: string) {
      store.set(key, String(value));
    },
  };
}

describe("CMS Settings & Unified Brand", () => {
  let memoryStorage: Storage;

  beforeEach(() => {
    memoryStorage = createMemoryStorage();
    vi.stubGlobal("localStorage", memoryStorage);
    document.title = "";
    document.head.innerHTML = "";
    document.documentElement.classList.remove("dark");
    document.documentElement.removeAttribute("style");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("formats document titles from unified site brand", () => {
    expect(
      formatDocumentTitle(DEFAULT_SITE_BRAND.name, DEFAULT_SITE_BRAND.subtitle),
    ).toBe("Oblivion-CMS — 文章可视化编辑器");
    expect(formatDocumentTitle("My Blog", "")).toBe("My Blog");
    expect(formatDocumentTitle("  ", "Custom")).toBe("Oblivion-CMS — Custom");
  });

  it("sanitizes invalid inputs and clamps numeric ranges", () => {
    const clean = sanitizeCmsSettings({
      siteName: "   ",
      theme: "invalid",
      accentColor: "neon",
      editorFontSize: 99,
      editorLineHeight: 0.2,
      tabIndentSpaces: 8,
      readingSpeedCpm: 5000,
      autoSaveDelayMs: 10,
      defaultMomentTags: ["日常", " 日常 ", "", 123],
      defaultPostLanguage: "bad language!",
    });

    expect(clean.siteName).toBe(DEFAULT_CMS_SETTINGS.siteName);
    expect(clean.theme).toBe("system");
    expect(clean.accentColor).toBe("indigo");
    expect(clean.editorFontSize).toBe(20);
    expect(clean.editorLineHeight).toBe(1.3);
    expect(clean.tabIndentSpaces).toBe(2);
    expect(clean.readingSpeedCpm).toBe(1200);
    expect(clean.autoSaveDelayMs).toBe(150);
    expect(clean.defaultMomentTags).toEqual(["日常"]);
    expect(clean.defaultPostLanguage).toBe("zh");
  });

  it("saves, loads, imports, and resets settings in localStorage", () => {
    saveCmsSettings({
      ...DEFAULT_CMS_SETTINGS,
      siteName: "Studio Notes",
      accentColor: "emerald",
      tabIndentSpaces: 4,
      confirmBeforePublish: true,
    });

    const loaded = loadCmsSettings();
    expect(loaded.siteName).toBe("Studio Notes");
    expect(loaded.accentColor).toBe("emerald");
    expect(loaded.tabIndentSpaces).toBe(4);
    expect(loaded.confirmBeforePublish).toBe(true);

    const parsed = parseCmsSettingsImport(
      JSON.stringify({ siteName: "Migrated CMS", autoGenerateSlug: true }),
    );
    expect(parsed.siteName).toBe("Migrated CMS");
    expect(parsed.autoGenerateSlug).toBe(true);
    expect(() => parseCmsSettingsImport("[1, 2, 3]")).toThrow();

    const reset = resetCmsSettings();
    expect(reset).toEqual(DEFAULT_CMS_SETTINGS);
    expect(JSON.parse(localStorage.getItem(CMS_SETTINGS_STORAGE_KEY) || "{}").siteName).toBe(
      DEFAULT_CMS_SETTINGS.siteName,
    );
  });

  it("applies site title, web-app title, and icons dynamically to document", () => {
    document.head.innerHTML = `
      <meta name="apple-mobile-web-app-title" content="Old" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    `;

    applySiteBrand({
      siteName: "Andy Journal",
      siteSubtitle: "Writing Space",
      siteIcon: "/favicon.svg",
    });

    expect(document.title).toBe("Andy Journal — Writing Space");
    expect(
      document.querySelector<HTMLMetaElement>('meta[name="apple-mobile-web-app-title"]')?.content,
    ).toBe("Andy Journal");
    expect(
      document.querySelector<HTMLLinkElement>('link[rel="apple-touch-icon"]')?.getAttribute("href"),
    ).toBe("/apple-touch-icon.png");

    applySiteBrand({
      siteName: "Andy Journal",
      siteSubtitle: "",
      siteIcon: "https://example.com/icon.png",
    });
    expect(document.title).toBe("Andy Journal");
    expect(
      document.querySelector<HTMLLinkElement>('link[rel="icon"]')?.getAttribute("href"),
    ).toBe("https://example.com/icon.png");
    expect(
      document.querySelector<HTMLLinkElement>('link[rel="apple-touch-icon"]')?.getAttribute("href"),
    ).toBe("https://example.com/icon.png");
  });

  it("applies dark theme class and accent CSS variable overrides", () => {
    applyThemeAndAccent({ theme: "dark", accentColor: "emerald" });
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(document.documentElement.style.getPropertyValue("--color-indigo-600")).toBe(
      "oklch(59.6% 0.145 163.225)",
    );

    applyThemeAndAccent({ theme: "light", accentColor: "indigo" });
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(document.documentElement.style.getPropertyValue("--color-indigo-600")).toBe("");
  });
});

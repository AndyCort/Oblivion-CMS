import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { DEFAULT_SITE_BRAND, formatDocumentTitle } from "./src/lib/settings/siteBrand.ts";

function siteBrandHtmlPlugin(): Plugin {
  const title = formatDocumentTitle(DEFAULT_SITE_BRAND.name, DEFAULT_SITE_BRAND.subtitle);
  const escapeAttr = (value: string) =>
    value
      .replaceAll("&", "&amp;")
      .replaceAll('"', "&quot;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");

  return {
    name: "oblivion-site-brand-html",
    transformIndexHtml(html) {
      return html
        .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(title)}</title>`)
        .replace(
          /__SITE_DESCRIPTION__/g,
          escapeAttr(DEFAULT_SITE_BRAND.description),
        )
        .replace(/__SITE_NAME__/g, escapeAttr(DEFAULT_SITE_BRAND.name))
        .replace(/__SITE_ICON__/g, escapeAttr(DEFAULT_SITE_BRAND.icon))
        .replace(
          /__SITE_APPLE_ICON__/g,
          escapeAttr(DEFAULT_SITE_BRAND.appleTouchIcon),
        );
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), siteBrandHtmlPlugin()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            /node_modules\/(react|react-dom|scheduler|styled-components|stylis|@emotion)\//.test(
              id,
            )
          ) {
            return "ui-runtime";
          }
        },
      },
    },
  },
  server: {
    port: 5173,
  },
});

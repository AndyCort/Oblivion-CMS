import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    border: 0 solid;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  *::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }

  :root {
    --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",
      "Noto Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
    --font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
    --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
      "Courier New", monospace;

    --bg-app: #f5f5f4;
    --bg-surface: #ffffff;
    --bg-canvas: #fafaf9;
    --bg-subtle: #f5f5f4;
    --bg-hover: rgb(231 229 228 / 0.6);
    --bg-input: #fafaf9;
    --bg-dock: rgb(255 255 255 / 0.88);
    --bg-overlay: rgb(0 0 0 / 0.58);

    --border: #e7e5e4;
    --border-subtle: #f5f5f4;
    --border-strong: #d6d3d1;

    --text: #1c1917;
    --text-secondary: #57534e;
    --text-muted: #78716c;
    --text-faint: #a8a29e;

    --accent: #4f46e5;
    --accent-hover: #6366f1;
    --accent-soft: rgb(79 70 229 / 0.11);
    --accent-text: #4338ca;
    --accent-ring: rgb(99 102 241 / 0.2);

    --danger: #e11d48;
    --danger-solid: #e11d48;
    --danger-hover: #f43f5e;
    --danger-soft: rgb(244 63 94 / 0.12);

    --warning: #b45309;
    --warning-soft: rgb(245 158 11 / 0.15);

    --success: #059669;
    --success-soft: rgb(16 185 129 / 0.13);
  }

  :root.dark {
    --bg-app: #0c0a09;
    --bg-surface: #1c1917;
    --bg-canvas: #121110;
    --bg-subtle: #292524;
    --bg-hover: rgb(41 37 36 / 0.72);
    --bg-input: #141210;
    --bg-dock: rgb(28 25 23 / 0.88);
    --bg-overlay: rgb(0 0 0 / 0.72);

    --border: #292524;
    --border-subtle: #292524;
    --border-strong: #44403c;

    --text: #f5f5f4;
    --text-secondary: #d6d3d1;
    --text-muted: #a8a29e;
    --text-faint: #78716c;

    --accent: #4f46e5;
    --accent-hover: #6366f1;
    --accent-soft: rgb(99 102 241 / 0.2);
    --accent-text: #a5b4fc;
    --accent-ring: rgb(129 140 248 / 0.24);

    --danger: #fb7185;
    --danger-solid: #e11d48;
    --danger-hover: #f43f5e;
    --danger-soft: rgb(244 63 94 / 0.18);

    --warning: #fbbf24;
    --warning-soft: rgb(245 158 11 / 0.18);

    --success: #34d399;
    --success-soft: rgb(16 185 129 / 0.18);
  }

  html {
    line-height: 1.5;
    -webkit-text-size-adjust: 100%;
    tab-size: 4;
    font-family: var(--font-sans);
    -webkit-tap-highlight-color: transparent;
  }

  body {
    min-height: 100dvh;
    background-color: var(--bg-app);
    color: var(--text);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body::selection,
  body *::selection {
    background-color: var(--accent-soft);
    color: var(--accent-text);
  }

  h1, h2, h3, h4, h5, h6 { font-size: inherit; font-weight: inherit; }
  a { color: inherit; text-decoration: inherit; }
  ol, ul, menu { list-style: none; }
  img, svg, video, canvas { display: block; vertical-align: middle; }
  img, video { max-width: 100%; height: auto; }
  table { border-collapse: collapse; }
  button, input, select, textarea {
    font: inherit;
    letter-spacing: inherit;
    color: inherit;
    background-color: transparent;
  }
  ::placeholder { color: var(--text-faint); opacity: 1; }
  button { cursor: pointer; }
  button:disabled { cursor: not-allowed; }
  :focus-visible { outline: 2px solid var(--accent-hover); outline-offset: 2px; }
  [hidden]:where(:not([hidden="until-found"])) { display: none !important; }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

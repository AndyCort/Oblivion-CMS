import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
:root, :host {
    --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",
      "Noto Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol", "Noto Color Emoji";
    --font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
    --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
      "Courier New", monospace;
    --color-amber-50: oklch(98.7% 0.022 95.277);
    --color-amber-100: oklch(96.2% 0.059 95.617);
    --color-amber-200: oklch(92.4% 0.12 95.746);
    --color-amber-300: oklch(87.9% 0.169 91.605);
    --color-amber-400: oklch(82.8% 0.189 84.429);
    --color-amber-500: oklch(76.9% 0.188 70.08);
    --color-amber-600: oklch(66.6% 0.179 58.318);
    --color-amber-700: oklch(55.5% 0.163 48.998);
    --color-amber-800: oklch(47.3% 0.137 46.201);
    --color-amber-900: oklch(41.4% 0.112 45.904);
    --color-amber-950: oklch(27.9% 0.077 45.635);
    --color-emerald-50: oklch(97.9% 0.021 166.113);
    --color-emerald-100: oklch(95% 0.052 163.051);
    --color-emerald-200: oklch(90.5% 0.093 164.15);
    --color-emerald-300: oklch(84.5% 0.143 164.978);
    --color-emerald-400: oklch(76.5% 0.177 163.223);
    --color-emerald-500: oklch(69.6% 0.17 162.48);
    --color-emerald-600: oklch(59.6% 0.145 163.225);
    --color-emerald-700: oklch(50.8% 0.118 165.612);
    --color-emerald-800: oklch(43.2% 0.095 166.913);
    --color-emerald-950: oklch(26.2% 0.051 172.552);
    --color-indigo-50: oklch(96.2% 0.018 272.314);
    --color-indigo-100: oklch(93% 0.034 272.788);
    --color-indigo-200: oklch(87% 0.065 274.039);
    --color-indigo-300: oklch(78.5% 0.115 274.713);
    --color-indigo-400: oklch(67.3% 0.182 276.935);
    --color-indigo-500: oklch(58.5% 0.233 277.117);
    --color-indigo-600: oklch(51.1% 0.262 276.966);
    --color-indigo-700: oklch(45.7% 0.24 277.023);
    --color-indigo-800: oklch(39.8% 0.195 277.366);
    --color-indigo-900: oklch(35.9% 0.144 278.697);
    --color-indigo-950: oklch(25.7% 0.09 281.288);
    --color-purple-500: oklch(62.7% 0.265 303.9);
    --color-purple-600: oklch(55.8% 0.288 302.321);
    --color-rose-50: oklch(96.9% 0.015 12.422);
    --color-rose-100: oklch(94.1% 0.03 12.58);
    --color-rose-200: oklch(89.2% 0.058 10.001);
    --color-rose-300: oklch(81% 0.117 11.638);
    --color-rose-400: oklch(71.2% 0.194 13.428);
    --color-rose-500: oklch(64.5% 0.246 16.439);
    --color-rose-600: oklch(58.6% 0.253 17.585);
    --color-rose-700: oklch(51.4% 0.222 16.935);
    --color-rose-800: oklch(45.5% 0.188 13.697);
    --color-rose-900: oklch(41% 0.159 10.272);
    --color-rose-950: oklch(27.1% 0.105 12.094);
    --color-stone-50: oklch(98.5% 0.001 106.423);
    --color-stone-100: oklch(97% 0.001 106.424);
    --color-stone-200: oklch(92.3% 0.003 48.717);
    --color-stone-300: oklch(86.9% 0.005 56.366);
    --color-stone-400: oklch(70.9% 0.01 56.259);
    --color-stone-500: oklch(55.3% 0.013 58.071);
    --color-stone-600: oklch(44.4% 0.011 73.639);
    --color-stone-700: oklch(37.4% 0.01 67.558);
    --color-stone-800: oklch(26.8% 0.007 34.298);
    --color-stone-900: oklch(21.6% 0.006 56.043);
    --color-stone-950: oklch(14.7% 0.004 49.25);
    --color-black: #000;
    --color-white: #fff;
    --spacing: 0.25rem;
    --container-sm: 24rem;
    --container-md: 28rem;
    --container-lg: 32rem;
    --container-xl: 36rem;
    --container-3xl: 48rem;
    --container-4xl: 56rem;
    --text-xs: 0.75rem;
    --text-xs--line-height: calc(1 / 0.75);
    --text-sm: 0.875rem;
    --text-sm--line-height: calc(1.25 / 0.875);
    --text-base: 1rem;
    --text-base--line-height: calc(1.5 / 1);
    --text-lg: 1.125rem;
    --text-lg--line-height: calc(1.75 / 1.125);
    --text-xl: 1.25rem;
    --text-xl--line-height: calc(1.75 / 1.25);
    --text-2xl: 1.5rem;
    --text-2xl--line-height: calc(2 / 1.5);
    --font-weight-normal: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;
    --tracking-tight: -0.025em;
    --tracking-wide: 0.025em;
    --tracking-wider: 0.05em;
    --leading-tight: 1.25;
    --leading-relaxed: 1.625;
    --radius-md: 0.375rem;
    --radius-lg: 0.5rem;
    --radius-xl: 0.75rem;
    --radius-2xl: 1rem;
    --radius-3xl: 1.5rem;
    --animate-spin: spin 1s linear infinite;
    --blur-xs: 4px;
    --blur-sm: 8px;
    --blur-md: 12px;
    --blur-xl: 24px;
    --blur-2xl: 40px;
    --aspect-video: 16 / 9;
    --default-transition-duration: 150ms;
    --default-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    --default-font-family: var(--font-sans);
    --default-mono-font-family: var(--font-mono);
  }
*, ::after, ::before, ::backdrop, ::file-selector-button {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    border: 0 solid;
  }
html, :host {
    line-height: 1.5;
    -webkit-text-size-adjust: 100%;
    tab-size: 4;
    font-family: var(--default-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji");
    font-feature-settings: var(--default-font-feature-settings, normal);
    font-variation-settings: var(--default-font-variation-settings, normal);
    -webkit-tap-highlight-color: transparent;
  }
hr {
    height: 0;
    color: inherit;
    border-top-width: 1px;
  }
abbr:where([title]) {
    -webkit-text-decoration: underline dotted;
    text-decoration: underline dotted;
  }
h1, h2, h3, h4, h5, h6 {
    font-size: inherit;
    font-weight: inherit;
  }
a {
    color: inherit;
    -webkit-text-decoration: inherit;
    text-decoration: inherit;
  }
b, strong {
    font-weight: bolder;
  }
code, kbd, samp, pre {
    font-family: var(--default-mono-font-family, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace);
    font-feature-settings: var(--default-mono-font-feature-settings, normal);
    font-variation-settings: var(--default-mono-font-variation-settings, normal);
    font-size: 1em;
  }
small {
    font-size: 80%;
  }
sub, sup {
    font-size: 75%;
    line-height: 0;
    position: relative;
    vertical-align: baseline;
  }
sub {
    bottom: -0.25em;
  }
sup {
    top: -0.5em;
  }
table {
    text-indent: 0;
    border-color: inherit;
    border-collapse: collapse;
  }
:-moz-focusring:where(:not(iframe)) {
    outline: auto;
  }
progress {
    vertical-align: baseline;
  }
summary {
    display: list-item;
  }
ol, ul, menu {
    list-style: none;
  }
img, svg, video, canvas, audio, iframe, embed, object {
    display: block;
    vertical-align: middle;
  }
img, video {
    max-width: 100%;
    height: auto;
  }
button, input, select, optgroup, textarea, ::file-selector-button {
    font: inherit;
    font-feature-settings: inherit;
    font-variation-settings: inherit;
    letter-spacing: inherit;
    color: inherit;
    border-radius: 0;
    background-color: transparent;
    opacity: 1;
  }
:where(select:is([multiple], [size])) optgroup {
    font-weight: bolder;
  }
:where(select:is([multiple], [size])) optgroup option {
    padding-inline-start: 20px;
  }
::file-selector-button {
    margin-inline-end: 4px;
  }
::placeholder {
    opacity: 1;
  }
@supports (not (-webkit-appearance: -apple-pay-button))  or (contain-intrinsic-size: 1px) {
    ::placeholder {
      color: currentcolor;
      @supports (color: color-mix(in lab, red, red)) {
        color: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }
  }
textarea {
    resize: vertical;
  }
::-webkit-search-decoration {
    -webkit-appearance: none;
  }
::-webkit-date-and-time-value {
    min-height: 1lh;
    text-align: inherit;
  }
::-webkit-datetime-edit {
    display: inline-flex;
  }
::-webkit-datetime-edit-fields-wrapper {
    padding: 0;
  }
::-webkit-datetime-edit, ::-webkit-datetime-edit-year-field, ::-webkit-datetime-edit-month-field, ::-webkit-datetime-edit-day-field, ::-webkit-datetime-edit-hour-field, ::-webkit-datetime-edit-minute-field, ::-webkit-datetime-edit-second-field, ::-webkit-datetime-edit-millisecond-field, ::-webkit-datetime-edit-meridiem-field {
    padding-block: 0;
  }
::-webkit-calendar-picker-indicator {
    line-height: 1;
  }
:-moz-ui-invalid {
    box-shadow: none;
  }
button, input:where([type="button"], [type="reset"], [type="submit"]), ::file-selector-button {
    appearance: button;
  }
::-webkit-inner-spin-button, ::-webkit-outer-spin-button {
    height: auto;
  }
[hidden]:where(:not([hidden="until-found"])) {
    display: none !important;
  }
:root {
    --safe-area-top: env(safe-area-inset-top, 0px);
    --safe-area-bottom: env(safe-area-inset-bottom, 0px);
    --safe-area-left: env(safe-area-inset-left, 0px);
    --safe-area-right: env(safe-area-inset-right, 0px);
  }
body {
    min-height: 100vh;
    background-color: var(--color-stone-50);
    color: var(--color-stone-900);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    & *::selection {
      background-color: color-mix(in srgb, oklch(58.5% 0.233 277.117) 20%, transparent);
      @supports (color: color-mix(in lab, red, red)) {
        background-color: color-mix(in oklab, var(--color-indigo-500) 20%, transparent);
      }
    }
    &::selection {
      background-color: color-mix(in srgb, oklch(58.5% 0.233 277.117) 20%, transparent);
      @supports (color: color-mix(in lab, red, red)) {
        background-color: color-mix(in oklab, var(--color-indigo-500) 20%, transparent);
      }
    }
    & *::selection {
      color: var(--color-indigo-600);
    }
    &::selection {
      color: var(--color-indigo-600);
    }
    &:where(.dark, .dark *) {
      background-color: var(--color-stone-950);
    }
    &:where(.dark, .dark *) {
      color: var(--color-stone-100);
    }
    &:where(.dark, .dark *) {
      & *::selection {
        background-color: color-mix(in srgb, oklch(67.3% 0.182 276.935) 20%, transparent);
        @supports (color: color-mix(in lab, red, red)) {
          background-color: color-mix(in oklab, var(--color-indigo-400) 20%, transparent);
        }
      }
      &::selection {
        background-color: color-mix(in srgb, oklch(67.3% 0.182 276.935) 20%, transparent);
        @supports (color: color-mix(in lab, red, red)) {
          background-color: color-mix(in oklab, var(--color-indigo-400) 20%, transparent);
        }
      }
    }
    &:where(.dark, .dark *) {
      & *::selection {
        color: var(--color-indigo-300);
      }
      &::selection {
        color: var(--color-indigo-300);
      }
    }
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    -webkit-tap-highlight-color: transparent;
  }
@property --cms-translate-x {
  syntax: "*";
  inherits: false;
  initial-value: 0;
}
@property --cms-translate-y {
  syntax: "*";
  inherits: false;
  initial-value: 0;
}
@property --cms-translate-z {
  syntax: "*";
  inherits: false;
  initial-value: 0;
}
@property --cms-scale-x {
  syntax: "*";
  inherits: false;
  initial-value: 1;
}
@property --cms-scale-y {
  syntax: "*";
  inherits: false;
  initial-value: 1;
}
@property --cms-scale-z {
  syntax: "*";
  inherits: false;
  initial-value: 1;
}
@property --cms-space-y-reverse {
  syntax: "*";
  inherits: false;
  initial-value: 0;
}
@property --cms-divide-y-reverse {
  syntax: "*";
  inherits: false;
  initial-value: 0;
}
@property --cms-border-style {
  syntax: "*";
  inherits: false;
  initial-value: solid;
}
@property --cms-gradient-position {
  syntax: "*";
  inherits: false;
}
@property --cms-gradient-from {
  syntax: "<color>";
  inherits: false;
  initial-value: #0000;
}
@property --cms-gradient-via {
  syntax: "<color>";
  inherits: false;
  initial-value: #0000;
}
@property --cms-gradient-to {
  syntax: "<color>";
  inherits: false;
  initial-value: #0000;
}
@property --cms-gradient-stops {
  syntax: "*";
  inherits: false;
}
@property --cms-gradient-via-stops {
  syntax: "*";
  inherits: false;
}
@property --cms-gradient-from-position {
  syntax: "<length-percentage>";
  inherits: false;
  initial-value: 0%;
}
@property --cms-gradient-via-position {
  syntax: "<length-percentage>";
  inherits: false;
  initial-value: 50%;
}
@property --cms-gradient-to-position {
  syntax: "<length-percentage>";
  inherits: false;
  initial-value: 100%;
}
@property --cms-leading {
  syntax: "*";
  inherits: false;
}
@property --cms-font-weight {
  syntax: "*";
  inherits: false;
}
@property --cms-tracking {
  syntax: "*";
  inherits: false;
}
@property --cms-shadow {
  syntax: "*";
  inherits: false;
  initial-value: 0 0 #0000;
}
@property --cms-shadow-color {
  syntax: "*";
  inherits: false;
}
@property --cms-shadow-alpha {
  syntax: "<percentage>";
  inherits: false;
  initial-value: 100%;
}
@property --cms-inset-shadow {
  syntax: "*";
  inherits: false;
  initial-value: 0 0 #0000;
}
@property --cms-inset-shadow-color {
  syntax: "*";
  inherits: false;
}
@property --cms-inset-shadow-alpha {
  syntax: "<percentage>";
  inherits: false;
  initial-value: 100%;
}
@property --cms-ring-color {
  syntax: "*";
  inherits: false;
}
@property --cms-ring-shadow {
  syntax: "*";
  inherits: false;
  initial-value: 0 0 #0000;
}
@property --cms-inset-ring-color {
  syntax: "*";
  inherits: false;
}
@property --cms-inset-ring-shadow {
  syntax: "*";
  inherits: false;
  initial-value: 0 0 #0000;
}
@property --cms-ring-inset {
  syntax: "*";
  inherits: false;
}
@property --cms-ring-offset-width {
  syntax: "<length>";
  inherits: false;
  initial-value: 0px;
}
@property --cms-ring-offset-color {
  syntax: "*";
  inherits: false;
  initial-value: #fff;
}
@property --cms-ring-offset-shadow {
  syntax: "*";
  inherits: false;
  initial-value: 0 0 #0000;
}
@property --cms-blur {
  syntax: "*";
  inherits: false;
}
@property --cms-brightness {
  syntax: "*";
  inherits: false;
}
@property --cms-contrast {
  syntax: "*";
  inherits: false;
}
@property --cms-grayscale {
  syntax: "*";
  inherits: false;
}
@property --cms-hue-rotate {
  syntax: "*";
  inherits: false;
}
@property --cms-invert {
  syntax: "*";
  inherits: false;
}
@property --cms-opacity {
  syntax: "*";
  inherits: false;
}
@property --cms-saturate {
  syntax: "*";
  inherits: false;
}
@property --cms-sepia {
  syntax: "*";
  inherits: false;
}
@property --cms-drop-shadow {
  syntax: "*";
  inherits: false;
}
@property --cms-drop-shadow-color {
  syntax: "*";
  inherits: false;
}
@property --cms-drop-shadow-alpha {
  syntax: "<percentage>";
  inherits: false;
  initial-value: 100%;
}
@property --cms-drop-shadow-size {
  syntax: "*";
  inherits: false;
}
@property --cms-backdrop-blur {
  syntax: "*";
  inherits: false;
}
@property --cms-backdrop-brightness {
  syntax: "*";
  inherits: false;
}
@property --cms-backdrop-contrast {
  syntax: "*";
  inherits: false;
}
@property --cms-backdrop-grayscale {
  syntax: "*";
  inherits: false;
}
@property --cms-backdrop-hue-rotate {
  syntax: "*";
  inherits: false;
}
@property --cms-backdrop-invert {
  syntax: "*";
  inherits: false;
}
@property --cms-backdrop-opacity {
  syntax: "*";
  inherits: false;
}
@property --cms-backdrop-saturate {
  syntax: "*";
  inherits: false;
}
@property --cms-backdrop-sepia {
  syntax: "*";
  inherits: false;
}
@property --cms-duration {
  syntax: "*";
  inherits: false;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
@supports ((-webkit-hyphens: none) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color:rgb(from red r g b)))) {
    *, ::before, ::after, ::backdrop {
      --cms-translate-x: 0;
      --cms-translate-y: 0;
      --cms-translate-z: 0;
      --cms-scale-x: 1;
      --cms-scale-y: 1;
      --cms-scale-z: 1;
      --cms-space-y-reverse: 0;
      --cms-divide-y-reverse: 0;
      --cms-border-style: solid;
      --cms-gradient-position: initial;
      --cms-gradient-from: #0000;
      --cms-gradient-via: #0000;
      --cms-gradient-to: #0000;
      --cms-gradient-stops: initial;
      --cms-gradient-via-stops: initial;
      --cms-gradient-from-position: 0%;
      --cms-gradient-via-position: 50%;
      --cms-gradient-to-position: 100%;
      --cms-leading: initial;
      --cms-font-weight: initial;
      --cms-tracking: initial;
      --cms-shadow: 0 0 #0000;
      --cms-shadow-color: initial;
      --cms-shadow-alpha: 100%;
      --cms-inset-shadow: 0 0 #0000;
      --cms-inset-shadow-color: initial;
      --cms-inset-shadow-alpha: 100%;
      --cms-ring-color: initial;
      --cms-ring-shadow: 0 0 #0000;
      --cms-inset-ring-color: initial;
      --cms-inset-ring-shadow: 0 0 #0000;
      --cms-ring-inset: initial;
      --cms-ring-offset-width: 0px;
      --cms-ring-offset-color: #fff;
      --cms-ring-offset-shadow: 0 0 #0000;
      --cms-blur: initial;
      --cms-brightness: initial;
      --cms-contrast: initial;
      --cms-grayscale: initial;
      --cms-hue-rotate: initial;
      --cms-invert: initial;
      --cms-opacity: initial;
      --cms-saturate: initial;
      --cms-sepia: initial;
      --cms-drop-shadow: initial;
      --cms-drop-shadow-color: initial;
      --cms-drop-shadow-alpha: 100%;
      --cms-drop-shadow-size: initial;
      --cms-backdrop-blur: initial;
      --cms-backdrop-brightness: initial;
      --cms-backdrop-contrast: initial;
      --cms-backdrop-grayscale: initial;
      --cms-backdrop-hue-rotate: initial;
      --cms-backdrop-invert: initial;
      --cms-backdrop-opacity: initial;
      --cms-backdrop-saturate: initial;
      --cms-backdrop-sepia: initial;
      --cms-duration: initial;
    }
  }

`;

import { workspaceSidebar, editorSurface, editorCard, editorToolbar } from './styles/workspace';
import styled, { css } from 'styled-components';
import { ChevronLeft as BaseChevronLeft } from 'lucide-react';
import { PenTool as BasePenTool } from 'lucide-react';
import { Database as BaseDatabase } from 'lucide-react';
import { Sun as BaseSun } from 'lucide-react';
import { Moon as BaseMoon } from 'lucide-react';
import { Laptop as BaseLaptop } from 'lucide-react';
import { UploadCloud as BaseUploadCloud } from 'lucide-react';
import { Settings as BaseSettings } from 'lucide-react';
import { LogOut as BaseLogOut } from 'lucide-react';
import { CheckCircle as BaseCheckCircle } from 'lucide-react';
import { AlertTriangle as BaseAlertTriangle } from 'lucide-react';
import { Sparkles as BaseSparkles } from 'lucide-react';
import { Eye as BaseEye } from 'lucide-react';
import { Undo2 as BaseUndo2 } from 'lucide-react';
import { Redo2 as BaseRedo2 } from 'lucide-react';
import { RotateCcw as BaseRotateCcw } from 'lucide-react';

export const SessionScreen = styled.div`
display: flex;
min-height: 100vh;
flex-direction: column;
align-items: center;
justify-content: center;
gap: calc(var(--spacing) * 3);
background-color: var(--color-stone-950);
font-family: var(--font-sans);
color: var(--color-stone-400);
-webkit-user-select: none;
user-select: none
`;

export const SessionSpinner = styled.div`
height: calc(var(--spacing) * 9);
width: calc(var(--spacing) * 9);
animation: spin 1s linear infinite;
border-radius: calc(infinity * 1px);
border-style: var(--cms-border-style);
border-width: 2px;
border-color: var(--color-indigo-500);
border-top-color: transparent
`;

export const SessionMessage = styled.span`
font-family: var(--font-mono);
font-size: var(--text-xs);
line-height: var(--cms-leading, var(--text-xs--line-height));
--cms-tracking: var(--tracking-wider);
letter-spacing: var(--tracking-wider);
color: var(--color-stone-400)
`;

export const AppShell = styled.div`
display: flex;
min-height: 100vh;
flex-direction: column;
background-color: var(--color-stone-100);
color: var(--color-stone-900);
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;

&:where(.dark, .dark *) {
  background-color: var(--color-stone-950);
  color: var(--color-stone-100);
}
`;

export const TopBar = styled.header`
position: sticky;
top: 0px;
z-index: 30;
display: flex;
height: calc(var(--spacing) * 14);
flex-shrink: 0;
align-items: center;
justify-content: space-between;
border-bottom-style: var(--cms-border-style);
border-bottom-width: 1px;
border-color: var(--color-stone-200);
background-color: color-mix(in oklab, var(--color-white) 80%, transparent);
padding-inline: calc(var(--spacing) * 3);
--cms-backdrop-blur: blur(var(--blur-md));
-webkit-backdrop-filter: var(--cms-backdrop-blur,) var(--cms-backdrop-brightness,) var(--cms-backdrop-contrast,) var(--cms-backdrop-grayscale,) var(--cms-backdrop-hue-rotate,) var(--cms-backdrop-invert,) var(--cms-backdrop-opacity,) var(--cms-backdrop-saturate,) var(--cms-backdrop-sepia,);
backdrop-filter: var(--cms-backdrop-blur,) var(--cms-backdrop-brightness,) var(--cms-backdrop-contrast,) var(--cms-backdrop-grayscale,) var(--cms-backdrop-hue-rotate,) var(--cms-backdrop-invert,) var(--cms-backdrop-opacity,) var(--cms-backdrop-saturate,) var(--cms-backdrop-sepia,);

@media (width >= 40rem) {
  & {
    padding-inline: calc(var(--spacing) * 4);
  }
}

&:where(.dark, .dark *) {
  border-color: var(--color-stone-800);
  background-color: color-mix(in oklab, var(--color-stone-900) 80%, transparent);
}
`;

export const BrandArea = styled.div`
display: flex;
align-items: center;
gap: calc(var(--spacing) * 2.5);

@media (width >= 40rem) {
  & {
    gap: calc(var(--spacing) * 3);
  }
}
`;

export const Button = styled.button`
margin-left: calc(var(--spacing) * -1);
display: flex;
align-items: center;
gap: var(--spacing);
border-radius: var(--radius-xl);
padding-inline: calc(var(--spacing) * 2.5);
padding-block: calc(var(--spacing) * 1.5);
font-size: var(--text-xs);
line-height: var(--cms-leading, var(--text-xs--line-height));
--cms-font-weight: var(--font-weight-semibold);
font-weight: var(--font-weight-semibold);
color: var(--color-stone-700);
transition-property: all;
transition-timing-function: var(--cms-ease, var(--default-transition-timing-function));
transition-duration: var(--cms-duration, var(--default-transition-duration));

@media (hover: hover) {
  &:hover {
    background-color: var(--color-stone-100);
  }
  &:where(.dark, .dark *):hover {
    background-color: var(--color-stone-800);
  }
}

&:active {
  --cms-scale-x: 95%;
  --cms-scale-y: 95%;
  --cms-scale-z: 95%;
  scale: var(--cms-scale-x) var(--cms-scale-y);
}

@media (width >= 48rem) {
  & {
    display: none;
  }
}

&:where(.dark, .dark *) {
  color: var(--color-stone-300);
}
`;

export const ChevronLeft = styled(BaseChevronLeft)`
height: calc(var(--spacing) * 4);
width: calc(var(--spacing) * 4);
stroke-width: 2.5;
color: var(--color-indigo-500)
`;

export const Button2 = styled.button`
margin-left: calc(var(--spacing) * -1);
display: flex;
align-items: center;
gap: var(--spacing);
border-radius: var(--radius-xl);
padding-inline: calc(var(--spacing) * 2.5);
padding-block: calc(var(--spacing) * 1.5);
font-size: var(--text-xs);
line-height: var(--cms-leading, var(--text-xs--line-height));
--cms-font-weight: var(--font-weight-medium);
font-weight: var(--font-weight-medium);
color: var(--color-stone-600);
transition-property: all;
transition-timing-function: var(--cms-ease, var(--default-transition-timing-function));
transition-duration: var(--cms-duration, var(--default-transition-duration));

@media (hover: hover) {
  &:hover {
    background-color: var(--color-stone-100);
  }
  &:where(.dark, .dark *):hover {
    background-color: var(--color-stone-800);
  }
}

&:active {
  --cms-scale-x: 95%;
  --cms-scale-y: 95%;
  --cms-scale-z: 95%;
  scale: var(--cms-scale-x) var(--cms-scale-y);
}

@media (width >= 48rem) {
  & {
    display: none;
  }
}

&:where(.dark, .dark *) {
  color: var(--color-stone-400);
}
`;

export const PenTool = styled(BasePenTool)`
height: calc(var(--spacing) * 3.5);
width: calc(var(--spacing) * 3.5);
color: var(--color-indigo-500)
`;

export const InlineGroup = styled.div`
display: flex;
align-items: center;
gap: calc(var(--spacing) * 2)
`;

export const BrandIcon = styled.div`
display: flex;
height: calc(var(--spacing) * 8);
width: calc(var(--spacing) * 8);
align-items: center;
justify-content: center;
border-radius: var(--radius-xl);
--cms-gradient-position: to top right in oklab;
background-image: linear-gradient(var(--cms-gradient-stops));
--cms-gradient-from: var(--color-indigo-600);
--cms-gradient-stops: var(--cms-gradient-via-stops, var(--cms-gradient-position), var(--cms-gradient-from) var(--cms-gradient-from-position), var(--cms-gradient-to) var(--cms-gradient-to-position));
--cms-gradient-via: var(--color-indigo-500);
--cms-gradient-via-stops: var(--cms-gradient-position), var(--cms-gradient-from) var(--cms-gradient-from-position), var(--cms-gradient-via) var(--cms-gradient-via-position), var(--cms-gradient-to) var(--cms-gradient-to-position);
--cms-gradient-stops: var(--cms-gradient-via-stops);
--cms-gradient-to: var(--color-purple-500);
--cms-gradient-stops: var(--cms-gradient-via-stops, var(--cms-gradient-position), var(--cms-gradient-from) var(--cms-gradient-from-position), var(--cms-gradient-to) var(--cms-gradient-to-position));
color: var(--color-white);
--cms-shadow: 0 4px 6px -1px var(--cms-shadow-color, rgb(0 0 0 / 0.1)), 0 2px 4px -2px var(--cms-shadow-color, rgb(0 0 0 / 0.1));
box-shadow: var(--cms-inset-shadow), var(--cms-inset-ring-shadow), var(--cms-ring-offset-shadow), var(--cms-ring-shadow), var(--cms-shadow);
--cms-shadow-color: color-mix(in oklab, color-mix(in oklab, var(--color-indigo-500) 20%, transparent) var(--cms-shadow-alpha), transparent)
`;

export const PenTool2 = styled(BasePenTool)`
height: calc(var(--spacing) * 4);
width: calc(var(--spacing) * 4)
`;

export const BrandName = styled.span`
font-size: var(--text-sm);
line-height: var(--cms-leading, var(--text-sm--line-height));
--cms-font-weight: var(--font-weight-bold);
font-weight: var(--font-weight-bold);
--cms-tracking: var(--tracking-tight);
letter-spacing: var(--tracking-tight);
color: var(--color-stone-900);

&:where(.dark, .dark *) {
  color: var(--color-stone-100);
}
`;

export const VersionBadge = styled.span`
display: none;
border-radius: 0.25rem;
background-color: var(--color-stone-100);
padding-inline: calc(var(--spacing) * 1.5);
padding-block: calc(var(--spacing) * 0.5);
font-family: var(--font-mono);
font-size: 10px;
color: var(--color-stone-500);

@media (width >= 40rem) {
  & {
    display: inline-block;
  }
}

&:where(.dark, .dark *) {
  background-color: var(--color-stone-800);
  color: var(--color-stone-400);
}
`;

export const DatabaseStatus = styled.div`
display: none;
align-items: center;
gap: calc(var(--spacing) * 1.5);
border-left-style: var(--cms-border-style);
border-left-width: 1px;
border-color: var(--color-stone-200);
padding-left: calc(var(--spacing) * 3);
font-family: var(--font-mono);
font-size: var(--text-xs);
line-height: var(--cms-leading, var(--text-xs--line-height));
color: var(--color-stone-500);

@media (width >= 64rem) {
  & {
    display: flex;
  }
}

&:where(.dark, .dark *) {
  border-color: var(--color-stone-800);
}
`;

export const Database = styled(BaseDatabase)`
height: calc(var(--spacing) * 3.5);
width: calc(var(--spacing) * 3.5);
color: var(--color-indigo-500)
`;

export const Span4 = styled.span`
border-radius: 0.25rem;
background-color: var(--color-emerald-100);
padding-inline: calc(var(--spacing) * 1.5);
padding-block: calc(var(--spacing) * 0.5);
font-family: var(--font-sans);
font-size: 10px;
--cms-font-weight: var(--font-weight-medium);
font-weight: var(--font-weight-medium);
color: var(--color-emerald-700);

&:where(.dark, .dark *) {
  background-color: color-mix(in oklab, var(--color-emerald-950) 80%, transparent);
  color: var(--color-emerald-400);
}
`;

export const Button3 = styled.button`
cursor: pointer;
border-radius: 0.25rem;
background-color: var(--color-amber-100);
padding-inline: calc(var(--spacing) * 1.5);
padding-block: calc(var(--spacing) * 0.5);
font-family: var(--font-sans);
font-size: 10px;
--cms-font-weight: var(--font-weight-medium);
font-weight: var(--font-weight-medium);
color: var(--color-amber-700);
transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --cms-gradient-from, --cms-gradient-via, --cms-gradient-to;
transition-timing-function: var(--cms-ease, var(--default-transition-timing-function));
transition-duration: var(--cms-duration, var(--default-transition-duration));

@media (hover: hover) {
  &:hover {
    background-color: var(--color-amber-200);
  }
  &:where(.dark, .dark *):hover {
    background-color: color-mix(in oklab, var(--color-amber-900) 80%, transparent);
  }
}

&:where(.dark, .dark *) {
  background-color: color-mix(in oklab, var(--color-amber-950) 80%, transparent);
  color: var(--color-amber-400);
}
`;

export const HeaderActions = styled.div`
display: flex;
align-items: center;
gap: calc(var(--spacing) * 1.5);

@media (width >= 40rem) {
  & {
    gap: calc(var(--spacing) * 2);
  }
}
`;

export const ThemeSwitcher = styled.div`
display: none;
align-items: center;
border-radius: var(--radius-xl);
border-style: var(--cms-border-style);
border-width: 1px;
border-color: var(--color-stone-200);
background-color: var(--color-stone-100);
padding: var(--spacing);
font-size: var(--text-xs);
line-height: var(--cms-leading, var(--text-xs--line-height));

@media (width >= 40rem) {
  & {
    display: flex;
  }
}

&:where(.dark, .dark *) {
  border-color: color-mix(in oklab, var(--color-stone-700) 60%, transparent);
  background-color: color-mix(in oklab, var(--color-stone-800) 80%, transparent);
}
`;

const LightThemeButtonVariants = {
v0: css`
background-color: var(--color-white);
color: var(--color-amber-600);
--cms-shadow: 0 1px 2px 0 var(--cms-shadow-color, rgb(0 0 0 / 0.05));
box-shadow: var(--cms-inset-shadow), var(--cms-inset-ring-shadow), var(--cms-ring-offset-shadow), var(--cms-ring-shadow), var(--cms-shadow);

&:where(.dark, .dark *) {
  background-color: var(--color-stone-700);
}
`,
v1: css`
color: var(--color-stone-500);

@media (hover: hover) {
  &:hover {
    color: var(--color-stone-800);
  }
  &:where(.dark, .dark *):hover {
    color: var(--color-stone-200);
  }
}
`
};
export const LightThemeButton = styled.button<{ $variant: keyof typeof LightThemeButtonVariants }>`
border-radius: var(--radius-lg);
padding: calc(var(--spacing) * 1.5);
transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --cms-gradient-from, --cms-gradient-via, --cms-gradient-to;
transition-timing-function: var(--cms-ease, var(--default-transition-timing-function));
transition-duration: var(--cms-duration, var(--default-transition-duration));
${p => LightThemeButtonVariants[p.$variant]}
`;

export const Sun = styled(BaseSun)`
height: calc(var(--spacing) * 3.5);
width: calc(var(--spacing) * 3.5)
`;

const DarkThemeButtonVariants = {
v0: css`
background-color: var(--color-white);
color: var(--color-indigo-400);
--cms-shadow: 0 1px 2px 0 var(--cms-shadow-color, rgb(0 0 0 / 0.05));
box-shadow: var(--cms-inset-shadow), var(--cms-inset-ring-shadow), var(--cms-ring-offset-shadow), var(--cms-ring-shadow), var(--cms-shadow);

&:where(.dark, .dark *) {
  background-color: var(--color-stone-700);
}
`,
v1: css`
color: var(--color-stone-500);

@media (hover: hover) {
  &:hover {
    color: var(--color-stone-800);
  }
  &:where(.dark, .dark *):hover {
    color: var(--color-stone-200);
  }
}
`
};
export const DarkThemeButton = styled.button<{ $variant: keyof typeof DarkThemeButtonVariants }>`
border-radius: var(--radius-lg);
padding: calc(var(--spacing) * 1.5);
transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --cms-gradient-from, --cms-gradient-via, --cms-gradient-to;
transition-timing-function: var(--cms-ease, var(--default-transition-timing-function));
transition-duration: var(--cms-duration, var(--default-transition-duration));
${p => DarkThemeButtonVariants[p.$variant]}
`;

export const Moon = styled(BaseMoon)`
height: calc(var(--spacing) * 3.5);
width: calc(var(--spacing) * 3.5)
`;

const SystemThemeButtonVariants = {
v0: css`
background-color: var(--color-white);
color: var(--color-stone-800);
--cms-shadow: 0 1px 2px 0 var(--cms-shadow-color, rgb(0 0 0 / 0.05));
box-shadow: var(--cms-inset-shadow), var(--cms-inset-ring-shadow), var(--cms-ring-offset-shadow), var(--cms-ring-shadow), var(--cms-shadow);

&:where(.dark, .dark *) {
  background-color: var(--color-stone-700);
  color: var(--color-stone-200);
}
`,
v1: css`
color: var(--color-stone-500);

@media (hover: hover) {
  &:hover {
    color: var(--color-stone-800);
  }
  &:where(.dark, .dark *):hover {
    color: var(--color-stone-200);
  }
}
`
};
export const SystemThemeButton = styled.button<{ $variant: keyof typeof SystemThemeButtonVariants }>`
border-radius: var(--radius-lg);
padding: calc(var(--spacing) * 1.5);
transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --cms-gradient-from, --cms-gradient-via, --cms-gradient-to;
transition-timing-function: var(--cms-ease, var(--default-transition-timing-function));
transition-duration: var(--cms-duration, var(--default-transition-duration));
${p => SystemThemeButtonVariants[p.$variant]}
`;

export const Laptop = styled(BaseLaptop)`
height: calc(var(--spacing) * 3.5);
width: calc(var(--spacing) * 3.5)
`;

export const MobileThemeButton = styled.button`
border-radius: var(--radius-xl);
padding: calc(var(--spacing) * 2);
color: var(--color-stone-600);
transition-property: all;
transition-timing-function: var(--cms-ease, var(--default-transition-timing-function));
transition-duration: var(--cms-duration, var(--default-transition-duration));

@media (hover: hover) {
  &:hover {
    background-color: var(--color-stone-100);
  }
  &:where(.dark, .dark *):hover {
    background-color: var(--color-stone-800);
  }
}

&:active {
  --cms-scale-x: 95%;
  --cms-scale-y: 95%;
  --cms-scale-z: 95%;
  scale: var(--cms-scale-x) var(--cms-scale-y);
}

@media (width >= 40rem) {
  & {
    display: none;
  }
}

&:where(.dark, .dark *) {
  color: var(--color-stone-300);
}
`;

export const Sun2 = styled(BaseSun)`
height: calc(var(--spacing) * 4);
width: calc(var(--spacing) * 4);
color: var(--color-amber-500)
`;

export const Moon2 = styled(BaseMoon)`
height: calc(var(--spacing) * 4);
width: calc(var(--spacing) * 4);
color: var(--color-indigo-400)
`;

export const Laptop2 = styled(BaseLaptop)`
height: calc(var(--spacing) * 4);
width: calc(var(--spacing) * 4);
color: var(--color-stone-500)
`;

export const SettingsButton = styled.button`
border-radius: var(--radius-xl);
padding: calc(var(--spacing) * 2);
color: var(--color-stone-500);

@media (hover: hover) {
  &:hover {
    background-color: var(--color-stone-100);
    color: var(--color-stone-800);
  }
  &:where(.dark, .dark *):hover {
    background-color: var(--color-stone-800);
    color: var(--color-stone-200);
  }
}

&:active {
  --cms-scale-x: 95%;
  --cms-scale-y: 95%;
  --cms-scale-z: 95%;
  scale: var(--cms-scale-x) var(--cms-scale-y);
}
`;

export const Settings = styled(BaseSettings)`
height: calc(var(--spacing) * 4);
width: calc(var(--spacing) * 4)
`;

export const LogoutButton = styled.button`
border-radius: var(--radius-xl);
padding: calc(var(--spacing) * 2);
color: var(--color-stone-500);
transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --cms-gradient-from, --cms-gradient-via, --cms-gradient-to;
transition-timing-function: var(--cms-ease, var(--default-transition-timing-function));
transition-duration: var(--cms-duration, var(--default-transition-duration));

@media (hover: hover) {
  &:hover {
    background-color: var(--color-rose-50);
    color: var(--color-rose-600);
  }
  &:where(.dark, .dark *):hover {
    background-color: color-mix(in oklab, var(--color-rose-950) 40%, transparent);
    color: var(--color-rose-400);
  }
}

&:active {
  --cms-scale-x: 95%;
  --cms-scale-y: 95%;
  --cms-scale-z: 95%;
  scale: var(--cms-scale-x) var(--cms-scale-y);
}
`;

export const LogOut = styled(BaseLogOut)`
height: calc(var(--spacing) * 4);
width: calc(var(--spacing) * 4)
`;

export const ModeNavigation = styled.nav`
position: sticky;
top: calc(var(--spacing) * 14);
z-index: 20;
display: flex;
gap: calc(var(--spacing) * 2);
border-bottom-style: var(--cms-border-style);
border-bottom-width: 1px;
border-color: var(--color-stone-200);
background-color: color-mix(in oklab, var(--color-white) 70%, transparent);
padding-inline: calc(var(--spacing) * 3);
padding-block: calc(var(--spacing) * 2);
--cms-backdrop-blur: blur(var(--blur-md));
-webkit-backdrop-filter: var(--cms-backdrop-blur,) var(--cms-backdrop-brightness,) var(--cms-backdrop-contrast,) var(--cms-backdrop-grayscale,) var(--cms-backdrop-hue-rotate,) var(--cms-backdrop-invert,) var(--cms-backdrop-opacity,) var(--cms-backdrop-saturate,) var(--cms-backdrop-sepia,);
backdrop-filter: var(--cms-backdrop-blur,) var(--cms-backdrop-brightness,) var(--cms-backdrop-contrast,) var(--cms-backdrop-grayscale,) var(--cms-backdrop-hue-rotate,) var(--cms-backdrop-invert,) var(--cms-backdrop-opacity,) var(--cms-backdrop-saturate,) var(--cms-backdrop-sepia,);

@media (width >= 40rem) {
  & {
    padding-inline: calc(var(--spacing) * 5);
  }
}

&:where(.dark, .dark *) {
  border-color: var(--color-stone-800);
  background-color: color-mix(in oklab, var(--color-stone-900) 70%, transparent);
}
`;

const ModeButtonVariants = {
v0: css`
background-color: var(--color-indigo-600);
color: var(--color-white);
--cms-shadow: 0 1px 3px 0 var(--cms-shadow-color, rgb(0 0 0 / 0.1)), 0 1px 2px -1px var(--cms-shadow-color, rgb(0 0 0 / 0.1));
box-shadow: var(--cms-inset-shadow), var(--cms-inset-ring-shadow), var(--cms-ring-offset-shadow), var(--cms-ring-shadow), var(--cms-shadow)
`,
v1: css`
color: var(--color-stone-500);

@media (hover: hover) {
  &:hover {
    background-color: var(--color-stone-200);
  }
  &:where(.dark, .dark *):hover {
    background-color: var(--color-stone-800);
  }
}
`
};
export const ModeButton = styled.button<{ $variant: keyof typeof ModeButtonVariants }>`
border-radius: var(--radius-xl);
padding-inline: calc(var(--spacing) * 4);
padding-block: calc(var(--spacing) * 2);
font-size: var(--text-xs);
line-height: var(--cms-leading, var(--text-xs--line-height));
--cms-font-weight: var(--font-weight-medium);
font-weight: var(--font-weight-medium);
transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --cms-gradient-from, --cms-gradient-via, --cms-gradient-to;
transition-timing-function: var(--cms-ease, var(--default-transition-timing-function));
transition-duration: var(--cms-duration, var(--default-transition-duration));
${p => ModeButtonVariants[p.$variant]}
`;

export const P = styled.p`
padding: calc(var(--spacing) * 8)
`;

export const LoadingNotice = styled.div`
padding-inline: calc(var(--spacing) * 4);
padding-block: calc(var(--spacing) * 2);
font-size: var(--text-sm);
line-height: var(--cms-leading, var(--text-sm--line-height));
color: var(--color-stone-500)
`;

export const ErrorNotice = styled.div`
display: flex;
align-items: center;
gap: calc(var(--spacing) * 3);
background-color: var(--color-rose-50);
padding-inline: calc(var(--spacing) * 4);
padding-block: calc(var(--spacing) * 2);
font-size: var(--text-sm);
line-height: var(--cms-leading, var(--text-sm--line-height));
color: var(--color-rose-700);

&:where(.dark, .dark *) {
  background-color: var(--color-rose-950);
  color: var(--color-rose-200);
}
`;

export const Button12 = styled.button`
text-decoration-line: underline;

&:disabled {
  opacity: 50%;
}
`;

const ToastVariants = {
v0: css`
border-color: var(--color-emerald-300);
background-color: var(--color-emerald-50);
color: var(--color-emerald-800);

&:where(.dark, .dark *) {
  border-color: var(--color-emerald-800);
  background-color: color-mix(in oklab, var(--color-emerald-950) 90%, transparent);
  color: var(--color-emerald-200);
}
`,
v1: css`
border-color: var(--color-rose-300);
background-color: var(--color-rose-50);
color: var(--color-rose-800);

&:where(.dark, .dark *) {
  border-color: var(--color-rose-800);
  background-color: color-mix(in oklab, var(--color-rose-950) 90%, transparent);
  color: var(--color-rose-200);
}
`,
v2: css`
border-color: var(--color-indigo-300);
background-color: var(--color-indigo-50);
color: var(--color-indigo-800);

&:where(.dark, .dark *) {
  border-color: var(--color-indigo-800);
  background-color: color-mix(in oklab, var(--color-indigo-950) 90%, transparent);
  color: var(--color-indigo-200);
}
`
};
export const Toast = styled.div<{ $variant: keyof typeof ToastVariants }>`
position: fixed;
right: calc(var(--spacing) * 3);
bottom: calc(var(--spacing) * 4);
left: calc(var(--spacing) * 3);
z-index: 50;
display: flex;
align-items: center;
justify-content: space-between;
gap: calc(var(--spacing) * 2);
border-radius: var(--radius-2xl);
border-style: var(--cms-border-style);
border-width: 1px;
padding-inline: calc(var(--spacing) * 4);
padding-block: calc(var(--spacing) * 2.5);
font-size: var(--text-xs);
line-height: var(--cms-leading, var(--text-xs--line-height));
--cms-font-weight: var(--font-weight-medium);
font-weight: var(--font-weight-medium);
--cms-shadow: 0 20px 25px -5px var(--cms-shadow-color, rgb(0 0 0 / 0.1)), 0 8px 10px -6px var(--cms-shadow-color, rgb(0 0 0 / 0.1));
box-shadow: var(--cms-inset-shadow), var(--cms-inset-ring-shadow), var(--cms-ring-offset-shadow), var(--cms-ring-shadow), var(--cms-shadow);
--cms-duration: 200ms;
transition-duration: 200ms;
@media (width >= 40rem) {
  & {
    right: calc(var(--spacing) * 6);
    bottom: calc(var(--spacing) * 6);
    left: auto;
    justify-content: flex-start;
  }
}
${p => ToastVariants[p.$variant]}
`;

export const ToastContent = styled.div`
display: flex;
align-items: center;
gap: calc(var(--spacing) * 2);
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap
`;

export const CheckCircle = styled(BaseCheckCircle)`
height: calc(var(--spacing) * 4);
width: calc(var(--spacing) * 4);
flex-shrink: 0;
color: var(--color-emerald-500)
`;

export const AlertTriangle = styled(BaseAlertTriangle)`
height: calc(var(--spacing) * 4);
width: calc(var(--spacing) * 4);
flex-shrink: 0;
color: var(--color-rose-500)
`;

export const Sparkles = styled(BaseSparkles)`
height: calc(var(--spacing) * 4);
width: calc(var(--spacing) * 4);
flex-shrink: 0;
color: var(--color-indigo-500)
`;

export const ToastText = styled.span`
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap
`;

export const MomentsWorkspace = styled.div<{ $visible: boolean }>`
display: ${p => p.$visible ? "flex" : "none"};
flex: 1;
overflow: hidden
`;

export const MomentsSidebar = styled.aside<{ $variant: 'v0' | 'v1' }>`
${workspaceSidebar};
display: ${p => p.$variant === 'v0' ? 'block' : 'none'};
@media (min-width:768px) { display:block; }
`;

export const MomentsEditor = styled.main<{ $variant: 'v0' | 'v1' }>`
${editorSurface};
display: ${p => p.$variant === 'v0' ? 'block' : 'none'};
@media (min-width:768px) { display:block; }
`;

export const EditorContainer = styled.div`
margin-inline: auto;
max-width: var(--container-3xl);

:where(& > :not(:last-child)) {
  --cms-space-y-reverse: 0;
  margin-block-start: calc(calc(var(--spacing) * 4) * var(--cms-space-y-reverse));
  margin-block-end: calc(calc(var(--spacing) * 4) * calc(1 - var(--cms-space-y-reverse)));
}

@media (width >= 40rem) {
  :where(& > :not(:last-child)) {
    --cms-space-y-reverse: 0;
    margin-block-start: calc(calc(var(--spacing) * 6) * var(--cms-space-y-reverse));
    margin-block-end: calc(calc(var(--spacing) * 6) * calc(1 - var(--cms-space-y-reverse)));
  }
}
`;

export const DatabaseWarning = styled.div`
display: flex;
flex-direction: column;
justify-content: space-between;
gap: calc(var(--spacing) * 3);
border-radius: var(--radius-2xl);
border-style: var(--cms-border-style);
border-width: 1px;
border-color: color-mix(in oklab, var(--color-amber-500) 30%, transparent);
background-color: color-mix(in oklab, var(--color-amber-500) 10%, transparent);
padding: calc(var(--spacing) * 3);
font-size: var(--text-xs);
line-height: var(--cms-leading, var(--text-xs--line-height));
color: var(--color-amber-900);
--cms-shadow: 0 1px 2px 0 var(--cms-shadow-color, rgb(0 0 0 / 0.05));
box-shadow: var(--cms-inset-shadow), var(--cms-inset-ring-shadow), var(--cms-ring-offset-shadow), var(--cms-ring-shadow), var(--cms-shadow);

@media (width >= 40rem) {
  & {
    flex-direction: row;
    align-items: center;
    padding: calc(var(--spacing) * 4);
  }
}

&:where(.dark, .dark *) {
  background-color: color-mix(in oklab, var(--color-amber-950) 40%, transparent);
  color: var(--color-amber-200);
}
`;

export const WarningContent = styled.div`
display: flex;
align-items: flex-start;
gap: calc(var(--spacing) * 2.5);

@media (width >= 40rem) {
  & {
    align-items: center;
  }
}
`;

export const AlertTriangle2 = styled(BaseAlertTriangle)`
margin-top: calc(var(--spacing) * 0.5);
height: calc(var(--spacing) * 4);
width: calc(var(--spacing) * 4);
flex-shrink: 0;
color: var(--color-amber-600);

@media (width >= 40rem) {
  & {
    margin-top: 0px;
  }
}

&:where(.dark, .dark *) {
  color: var(--color-amber-400);
}
`;

export const Span7 = styled.span`
--cms-font-weight: var(--font-weight-semibold);
font-weight: var(--font-weight-semibold)
`;

export const P2 = styled.p`
margin-top: calc(var(--spacing) * 0.5);
font-size: 11px;
color: color-mix(in oklab, var(--color-amber-700) 80%, transparent);

&:where(.dark, .dark *) {
  color: color-mix(in oklab, var(--color-amber-400) 80%, transparent);
}
`;

export const Button13 = styled.button`
flex-shrink: 0;
cursor: pointer;
align-self: flex-start;
border-radius: var(--radius-xl);
background-color: var(--color-amber-600);
padding-inline: calc(var(--spacing) * 3.5);
padding-block: calc(var(--spacing) * 1.5);
--cms-font-weight: var(--font-weight-medium);
font-weight: var(--font-weight-medium);
color: var(--color-white);
--cms-shadow: 0 1px 3px 0 var(--cms-shadow-color, rgb(0 0 0 / 0.1)), 0 1px 2px -1px var(--cms-shadow-color, rgb(0 0 0 / 0.1));
box-shadow: var(--cms-inset-shadow), var(--cms-inset-ring-shadow), var(--cms-ring-offset-shadow), var(--cms-ring-shadow), var(--cms-shadow);
transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --cms-gradient-from, --cms-gradient-via, --cms-gradient-to;
transition-timing-function: var(--cms-ease, var(--default-transition-timing-function));
transition-duration: var(--cms-duration, var(--default-transition-duration));

@media (hover: hover) {
  &:hover {
    background-color: var(--color-amber-500);
  }
}

@media (width >= 40rem) {
  & {
    align-self: auto;
  }
}
`;

export const EditorToolbar = styled.div`
${editorToolbar};
@media (max-width:639px) { flex-direction:column; align-items:stretch; }
`;

export const Span8 = styled.span`
font-size: var(--text-base);
line-height: var(--cms-leading, var(--text-base--line-height));
--cms-font-weight: var(--font-weight-semibold);
font-weight: var(--font-weight-semibold);
color: var(--color-stone-900);

&:where(.dark, .dark *) {
  color: var(--color-stone-100);
}
`;

export const Span9 = styled.span`
border-radius: calc(infinity * 1px);
background-color: color-mix(in oklab, var(--color-stone-200) 60%, transparent);
padding-inline: calc(var(--spacing) * 2);
padding-block: calc(var(--spacing) * 0.5);
font-family: var(--font-mono);
font-size: var(--text-xs);
line-height: var(--cms-leading, var(--text-xs--line-height));
color: var(--color-stone-600);

&:where(.dark, .dark *) {
  background-color: var(--color-stone-800);
  color: var(--color-stone-400);
}
`;

export const EditorActions = styled.div`
display: flex;
align-items: center;
gap: calc(var(--spacing) * 1.5)
`;

export const EditorViewSwitcher = styled.div`
display: flex;
border-radius: var(--radius-xl);
background-color: color-mix(in oklab, var(--color-stone-200) 60%, transparent);
padding: calc(var(--spacing) * 0.5);
font-size: var(--text-xs);
line-height: var(--cms-leading, var(--text-xs--line-height));

&:where(.dark, .dark *) {
  background-color: color-mix(in oklab, var(--color-stone-800) 80%, transparent);
}
`;

const EditViewButtonVariants = {
v0: css`
background-color: var(--color-white);
color: var(--color-stone-900);
--cms-shadow: 0 1px 2px 0 var(--cms-shadow-color, rgb(0 0 0 / 0.05));
box-shadow: var(--cms-inset-shadow), var(--cms-inset-ring-shadow), var(--cms-ring-offset-shadow), var(--cms-ring-shadow), var(--cms-shadow);

&:where(.dark, .dark *) {
  background-color: var(--color-stone-700);
  color: var(--color-stone-100);
}
`,
v1: css`
color: var(--color-stone-500);

@media (hover: hover) {
  &:hover {
    color: var(--color-stone-800);
  }
  &:where(.dark, .dark *):hover {
    color: var(--color-stone-200);
  }
}
`
};
export const EditViewButton = styled.button<{ $variant: keyof typeof EditViewButtonVariants }>`
border-radius: var(--radius-lg);
padding-inline: calc(var(--spacing) * 3);
padding-block: var(--spacing);
--cms-font-weight: var(--font-weight-medium);
font-weight: var(--font-weight-medium);
transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --cms-gradient-from, --cms-gradient-via, --cms-gradient-to;
transition-timing-function: var(--cms-ease, var(--default-transition-timing-function));
transition-duration: var(--cms-duration, var(--default-transition-duration));
${p => EditViewButtonVariants[p.$variant]}
`;

const PreviewViewButtonVariants = {
v0: css`
background-color: var(--color-white);
color: var(--color-stone-900);
--cms-shadow: 0 1px 2px 0 var(--cms-shadow-color, rgb(0 0 0 / 0.05));
box-shadow: var(--cms-inset-shadow), var(--cms-inset-ring-shadow), var(--cms-ring-offset-shadow), var(--cms-ring-shadow), var(--cms-shadow);

&:where(.dark, .dark *) {
  background-color: var(--color-stone-700);
  color: var(--color-stone-100);
}
`,
v1: css`
color: var(--color-stone-500);

@media (hover: hover) {
  &:hover {
    color: var(--color-stone-800);
  }
  &:where(.dark, .dark *):hover {
    color: var(--color-stone-200);
  }
}
`
};
export const PreviewViewButton = styled.button<{ $variant: keyof typeof PreviewViewButtonVariants }>`
display: flex;
align-items: center;
gap: var(--spacing);
border-radius: var(--radius-lg);
padding-inline: calc(var(--spacing) * 3);
padding-block: var(--spacing);
--cms-font-weight: var(--font-weight-medium);
font-weight: var(--font-weight-medium);
transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --cms-gradient-from, --cms-gradient-via, --cms-gradient-to;
transition-timing-function: var(--cms-ease, var(--default-transition-timing-function));
transition-duration: var(--cms-duration, var(--default-transition-duration));
${p => PreviewViewButtonVariants[p.$variant]}
`;

export const Eye = styled(BaseEye)`
height: calc(var(--spacing) * 3.5);
width: calc(var(--spacing) * 3.5)
`;

export const EditorCard = styled.div`
${editorCard};
position: relative;
> :not(:last-child) { margin-bottom: 24px; }
`;

export const MetadataRow = styled.div`
display: grid;
grid-template-columns: repeat(1, minmax(0, 1fr));
gap: calc(var(--spacing) * 3);

@media (width >= 40rem) {
  & {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: calc(var(--spacing) * 4);
  }
}
`;

export const Div23 = styled.div`
:where(& > :not(:last-child)) {
  --cms-space-y-reverse: 0;
  margin-block-start: calc(calc(var(--spacing) * 2) * var(--cms-space-y-reverse));
  margin-block-end: calc(calc(var(--spacing) * 2) * calc(1 - var(--cms-space-y-reverse)));
}
`;

export const Div24 = styled.div`
display: flex;
align-items: center;
justify-content: space-between
`;

export const Label = styled.label`
font-size: var(--text-xs);
line-height: var(--cms-leading, var(--text-xs--line-height));
--cms-font-weight: var(--font-weight-semibold);
font-weight: var(--font-weight-semibold);
--cms-tracking: var(--tracking-wider);
letter-spacing: var(--tracking-wider);
color: var(--color-stone-500);
text-transform: uppercase;

&:where(.dark, .dark *) {
  color: var(--color-stone-400);
}
`;

export const Div25 = styled.div`
display: flex;
align-items: center;
gap: calc(var(--spacing) * 3);
font-size: var(--text-xs);
line-height: var(--cms-leading, var(--text-xs--line-height));
color: var(--color-stone-400)
`;

export const Div26 = styled.div`
display: flex;
align-items: center;
gap: var(--spacing)
`;

export const Button16 = styled.button`
border-radius: 0.25rem;
padding: calc(var(--spacing) * 1.5);

@media (hover: hover) {
  &:hover {
    background-color: var(--color-stone-100);
  }
  &:where(.dark, .dark *):hover {
    background-color: var(--color-stone-800);
  }
}

&:active {
  --cms-scale-x: 95%;
  --cms-scale-y: 95%;
  --cms-scale-z: 95%;
  scale: var(--cms-scale-x) var(--cms-scale-y);
}

&:disabled {
  opacity: 30%;
}

@media (width >= 40rem) {
  & {
    padding: var(--spacing);
  }
}
`;

export const Undo2 = styled(BaseUndo2)`
height: calc(var(--spacing) * 3.5);
width: calc(var(--spacing) * 3.5)
`;

export const Redo2 = styled(BaseRedo2)`
height: calc(var(--spacing) * 3.5);
width: calc(var(--spacing) * 3.5)
`;

export const Span10 = styled.span`
font-family: var(--font-mono)
`;

export const Textarea = styled.textarea`
min-height: 140px;
width: 100%;
resize: vertical;
border-radius: var(--radius-xl);
border-style: var(--cms-border-style);
border-width: 1px;
border-color: var(--color-stone-200);
background-color: color-mix(in oklab, var(--color-stone-50) 50%, transparent);
padding: calc(var(--spacing) * 3.5);
font-family: var(--font-sans);
font-size: var(--text-sm);
line-height: var(--cms-leading, var(--text-sm--line-height));
--cms-leading: var(--leading-relaxed);
line-height: var(--leading-relaxed);
color: var(--color-stone-900);

&::placeholder {
  color: var(--color-stone-400);
}

&:focus {
  --cms-ring-shadow: var(--cms-ring-inset,) 0 0 0 calc(2px + var(--cms-ring-offset-width)) var(--cms-ring-color, currentcolor);
  box-shadow: var(--cms-inset-shadow), var(--cms-inset-ring-shadow), var(--cms-ring-offset-shadow), var(--cms-ring-shadow), var(--cms-shadow);
  --cms-ring-color: var(--color-indigo-500);
  --cms-outline-style: none;
  outline-style: none;
}

@media (width >= 40rem) {
  & {
    padding: calc(var(--spacing) * 4);
  }
}

&:where(.dark, .dark *) {
  border-color: var(--color-stone-800);
  background-color: color-mix(in oklab, var(--color-stone-950) 50%, transparent);
  color: var(--color-stone-100);
}
`;

export const Div27 = styled.div`
padding-top: var(--spacing);

@media (width >= 40rem) {
  & {
    padding-top: calc(var(--spacing) * 2);
  }
}
`;

export const Div28 = styled.div`
border-top-style: var(--cms-border-style);
border-top-width: 1px;
border-color: var(--color-stone-100);
padding-top: calc(var(--spacing) * 4);

&:where(.dark, .dark *) {
  border-color: color-mix(in oklab, var(--color-stone-800) 80%, transparent);
}
`;

export const Label2 = styled.label`
margin-bottom: var(--spacing);
display: block;
font-size: var(--text-xs);
line-height: var(--cms-leading, var(--text-xs--line-height));
color: var(--color-stone-500);

&:where(.dark, .dark *) {
  color: var(--color-stone-400);
}
`;

export const Input = styled.input`
width: 100%;
border-radius: var(--radius-xl);
border-style: var(--cms-border-style);
border-width: 1px;
border-color: var(--color-stone-200);
background-color: var(--color-stone-50);
padding: calc(var(--spacing) * 2.5);
font-family: var(--font-mono);
font-size: var(--text-sm);
line-height: var(--cms-leading, var(--text-sm--line-height));
color: var(--color-stone-900);

&:focus {
  --cms-ring-shadow: var(--cms-ring-inset,) 0 0 0 calc(2px + var(--cms-ring-offset-width)) var(--cms-ring-color, currentcolor);
  box-shadow: var(--cms-inset-shadow), var(--cms-inset-ring-shadow), var(--cms-ring-offset-shadow), var(--cms-ring-shadow), var(--cms-shadow);
  --cms-ring-color: var(--color-indigo-500);
  --cms-outline-style: none;
  outline-style: none;
}

@media (width >= 40rem) {
  & {
    font-size: var(--text-xs);
    line-height: var(--cms-leading, var(--text-xs--line-height));
  }
}

&:where(.dark, .dark *) {
  border-color: var(--color-stone-800);
  background-color: var(--color-stone-950);
  color: var(--color-stone-100);
}
`;

export const Div29 = styled.div`
position: sticky;
bottom: 0px;
z-index: 20;
margin-inline: calc(var(--spacing) * -4);
margin-bottom: calc(var(--spacing) * -4);
display: flex;
align-items: center;
justify-content: space-between;
gap: calc(var(--spacing) * 2.5);
border-bottom-right-radius: var(--radius-2xl);
border-bottom-left-radius: var(--radius-2xl);
border-top-style: var(--cms-border-style);
border-top-width: 1px;
border-color: var(--color-stone-200);
background-color: color-mix(in oklab, var(--color-white) 95%, transparent);
padding: calc(var(--spacing) * 3);
padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
--cms-shadow: 0 10px 15px -3px var(--cms-shadow-color, rgb(0 0 0 / 0.1)), 0 4px 6px -4px var(--cms-shadow-color, rgb(0 0 0 / 0.1));
box-shadow: var(--cms-inset-shadow), var(--cms-inset-ring-shadow), var(--cms-ring-offset-shadow), var(--cms-ring-shadow), var(--cms-shadow);
--cms-backdrop-blur: blur(var(--blur-md));
-webkit-backdrop-filter: var(--cms-backdrop-blur,) var(--cms-backdrop-brightness,) var(--cms-backdrop-contrast,) var(--cms-backdrop-grayscale,) var(--cms-backdrop-hue-rotate,) var(--cms-backdrop-invert,) var(--cms-backdrop-opacity,) var(--cms-backdrop-saturate,) var(--cms-backdrop-sepia,);
backdrop-filter: var(--cms-backdrop-blur,) var(--cms-backdrop-brightness,) var(--cms-backdrop-contrast,) var(--cms-backdrop-grayscale,) var(--cms-backdrop-hue-rotate,) var(--cms-backdrop-invert,) var(--cms-backdrop-opacity,) var(--cms-backdrop-saturate,) var(--cms-backdrop-sepia,);

@media (width >= 40rem) {
  & {
    margin-inline: 0px;
    margin-bottom: 0px;
    gap: calc(var(--spacing) * 3);
    background-color: transparent;
    padding: 0px;
    padding-bottom: 0px;
    --cms-shadow: 0 0 #0000;
    box-shadow: var(--cms-inset-shadow), var(--cms-inset-ring-shadow), var(--cms-ring-offset-shadow), var(--cms-ring-shadow), var(--cms-shadow);
    --cms-backdrop-blur:  ;
    -webkit-backdrop-filter: var(--cms-backdrop-blur,) var(--cms-backdrop-brightness,) var(--cms-backdrop-contrast,) var(--cms-backdrop-grayscale,) var(--cms-backdrop-hue-rotate,) var(--cms-backdrop-invert,) var(--cms-backdrop-opacity,) var(--cms-backdrop-saturate,) var(--cms-backdrop-sepia,);
    backdrop-filter: var(--cms-backdrop-blur,) var(--cms-backdrop-brightness,) var(--cms-backdrop-contrast,) var(--cms-backdrop-grayscale,) var(--cms-backdrop-hue-rotate,) var(--cms-backdrop-invert,) var(--cms-backdrop-opacity,) var(--cms-backdrop-saturate,) var(--cms-backdrop-sepia,);
  }
}

&:where(.dark, .dark *) {
  border-color: var(--color-stone-800);
  background-color: color-mix(in oklab, var(--color-stone-900) 95%, transparent);
}
`;

export const Button17 = styled.button`
display: flex;
align-items: center;
gap: calc(var(--spacing) * 1.5);
border-radius: var(--radius-xl);
padding-inline: calc(var(--spacing) * 3);
padding-block: calc(var(--spacing) * 2.5);
font-size: var(--text-xs);
line-height: var(--cms-leading, var(--text-xs--line-height));
--cms-font-weight: var(--font-weight-medium);
font-weight: var(--font-weight-medium);
color: var(--color-stone-600);
transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --cms-gradient-from, --cms-gradient-via, --cms-gradient-to;
transition-timing-function: var(--cms-ease, var(--default-transition-timing-function));
transition-duration: var(--cms-duration, var(--default-transition-duration));

@media (hover: hover) {
  &:hover {
    background-color: var(--color-stone-100);
    color: var(--color-stone-900);
  }
  &:where(.dark, .dark *):hover {
    background-color: var(--color-stone-800);
    color: var(--color-stone-100);
  }
}

&:active {
  --cms-scale-x: 95%;
  --cms-scale-y: 95%;
  --cms-scale-z: 95%;
  scale: var(--cms-scale-x) var(--cms-scale-y);
}

@media (width >= 40rem) {
  & {
    padding-inline: calc(var(--spacing) * 3.5);
    padding-block: calc(var(--spacing) * 2);
  }
}

&:where(.dark, .dark *) {
  color: var(--color-stone-400);
}
`;

export const RotateCcw = styled(BaseRotateCcw)`
height: calc(var(--spacing) * 3.5);
width: calc(var(--spacing) * 3.5)
`;

export const Div30 = styled.div`
display: flex;
width: auto;
align-items: center;
gap: calc(var(--spacing) * 2.5)
`;

export const Button18 = styled.button`
display: flex;
align-items: center;
justify-content: center;
gap: calc(var(--spacing) * 2);
border-radius: var(--radius-xl);
background-color: var(--color-indigo-600);
padding-inline: calc(var(--spacing) * 4);
padding-block: calc(var(--spacing) * 2.5);
font-size: var(--text-xs);
line-height: var(--cms-leading, var(--text-xs--line-height));
--cms-font-weight: var(--font-weight-semibold);
font-weight: var(--font-weight-semibold);
color: var(--color-white);
--cms-shadow: 0 4px 6px -1px var(--cms-shadow-color, rgb(0 0 0 / 0.1)), 0 2px 4px -2px var(--cms-shadow-color, rgb(0 0 0 / 0.1));
box-shadow: var(--cms-inset-shadow), var(--cms-inset-ring-shadow), var(--cms-ring-offset-shadow), var(--cms-ring-shadow), var(--cms-shadow);
--cms-shadow-color: color-mix(in oklab, color-mix(in oklab, var(--color-indigo-600) 20%, transparent) var(--cms-shadow-alpha), transparent);
transition-property: transform, translate, scale, rotate;
transition-timing-function: var(--cms-ease, var(--default-transition-timing-function));
transition-duration: var(--cms-duration, var(--default-transition-duration));

@media (hover: hover) {
  &:hover {
    background-color: var(--color-indigo-500);
  }
}

&:active {
  --cms-scale-x: 95%;
  --cms-scale-y: 95%;
  --cms-scale-z: 95%;
  scale: var(--cms-scale-x) var(--cms-scale-y);
}

&:disabled {
  cursor: not-allowed;
  opacity: 50%;
}

@media (width >= 40rem) {
  & {
    padding-inline: calc(var(--spacing) * 5);
  }
}
`;

export const UploadCloud2 = styled(BaseUploadCloud)`
height: calc(var(--spacing) * 4);
width: calc(var(--spacing) * 4)
`;

export const Div31 = styled.div`
:where(& > :not(:last-child)) {
  --cms-space-y-reverse: 0;
  margin-block-start: calc(calc(var(--spacing) * 6) * var(--cms-space-y-reverse));
  margin-block-end: calc(calc(var(--spacing) * 6) * calc(1 - var(--cms-space-y-reverse)));
}
`;

export const Div32 = styled.div`
position: sticky;
bottom: 0px;
z-index: 20;
display: flex;
justify-content: flex-end;
gap: calc(var(--spacing) * 2.5);
border-radius: var(--radius-2xl);
border-style: var(--cms-border-style);
border-width: 1px;
border-color: var(--color-stone-200);
background-color: color-mix(in oklab, var(--color-white) 95%, transparent);
padding: calc(var(--spacing) * 3);
padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
--cms-shadow: 0 4px 6px -1px var(--cms-shadow-color, rgb(0 0 0 / 0.1)), 0 2px 4px -2px var(--cms-shadow-color, rgb(0 0 0 / 0.1));
box-shadow: var(--cms-inset-shadow), var(--cms-inset-ring-shadow), var(--cms-ring-offset-shadow), var(--cms-ring-shadow), var(--cms-shadow);
--cms-backdrop-blur: blur(var(--blur-md));
-webkit-backdrop-filter: var(--cms-backdrop-blur,) var(--cms-backdrop-brightness,) var(--cms-backdrop-contrast,) var(--cms-backdrop-grayscale,) var(--cms-backdrop-hue-rotate,) var(--cms-backdrop-invert,) var(--cms-backdrop-opacity,) var(--cms-backdrop-saturate,) var(--cms-backdrop-sepia,);
backdrop-filter: var(--cms-backdrop-blur,) var(--cms-backdrop-brightness,) var(--cms-backdrop-contrast,) var(--cms-backdrop-grayscale,) var(--cms-backdrop-hue-rotate,) var(--cms-backdrop-invert,) var(--cms-backdrop-opacity,) var(--cms-backdrop-saturate,) var(--cms-backdrop-sepia,);

@media (width >= 40rem) {
  & {
    gap: calc(var(--spacing) * 3);
    padding: calc(var(--spacing) * 4);
    padding-bottom: calc(var(--spacing) * 4);
  }
}

&:where(.dark, .dark *) {
  border-color: var(--color-stone-800);
  background-color: color-mix(in oklab, var(--color-stone-900) 95%, transparent);
}
`;

export const Button19 = styled.button`
border-radius: var(--radius-xl);
padding-inline: calc(var(--spacing) * 3.5);
padding-block: calc(var(--spacing) * 2.5);
font-size: var(--text-xs);
line-height: var(--cms-leading, var(--text-xs--line-height));
--cms-font-weight: var(--font-weight-medium);
font-weight: var(--font-weight-medium);
color: var(--color-stone-600);
transition-property: all;
transition-timing-function: var(--cms-ease, var(--default-transition-timing-function));
transition-duration: var(--cms-duration, var(--default-transition-duration));

@media (hover: hover) {
  &:hover {
    background-color: var(--color-stone-100);
  }
  &:where(.dark, .dark *):hover {
    background-color: var(--color-stone-800);
  }
}

&:active {
  --cms-scale-x: 95%;
  --cms-scale-y: 95%;
  --cms-scale-z: 95%;
  scale: var(--cms-scale-x) var(--cms-scale-y);
}

@media (width >= 40rem) {
  & {
    padding-inline: calc(var(--spacing) * 4);
    padding-block: calc(var(--spacing) * 2);
  }
}

&:where(.dark, .dark *) {
  color: var(--color-stone-400);
}
`;

export const Button20 = styled.button`
display: flex;
align-items: center;
gap: calc(var(--spacing) * 2);
border-radius: var(--radius-xl);
background-color: var(--color-indigo-600);
padding-inline: calc(var(--spacing) * 4);
padding-block: calc(var(--spacing) * 2.5);
font-size: var(--text-xs);
line-height: var(--cms-leading, var(--text-xs--line-height));
--cms-font-weight: var(--font-weight-semibold);
font-weight: var(--font-weight-semibold);
color: var(--color-white);
--cms-shadow: 0 4px 6px -1px var(--cms-shadow-color, rgb(0 0 0 / 0.1)), 0 2px 4px -2px var(--cms-shadow-color, rgb(0 0 0 / 0.1));
box-shadow: var(--cms-inset-shadow), var(--cms-inset-ring-shadow), var(--cms-ring-offset-shadow), var(--cms-ring-shadow), var(--cms-shadow);
transition-property: all;
transition-timing-function: var(--cms-ease, var(--default-transition-timing-function));
transition-duration: var(--cms-duration, var(--default-transition-duration));

@media (hover: hover) {
  &:hover {
    background-color: var(--color-indigo-500);
  }
}

&:active {
  --cms-scale-x: 95%;
  --cms-scale-y: 95%;
  --cms-scale-z: 95%;
  scale: var(--cms-scale-x) var(--cms-scale-y);
}

&:disabled {
  opacity: 50%;
}

@media (width >= 40rem) {
  & {
    padding-inline: calc(var(--spacing) * 5);
  }
}
`;


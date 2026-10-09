import styled from 'styled-components';
import { PenTool as BasePenTool } from 'lucide-react';
import { ShieldCheck as BaseShieldCheck } from 'lucide-react';
import { AlertCircle as BaseAlertCircle } from 'lucide-react';
import { KeyRound as BaseKeyRound } from 'lucide-react';
import { Cloud as BaseCloud } from 'lucide-react';
import { ArrowRight as BaseArrowRight } from 'lucide-react';
import { RotateCcw as BaseRotateCcw } from 'lucide-react';
import { Terminal as BaseTerminal } from 'lucide-react';
import { Lock as BaseLock } from 'lucide-react';

export const Div = styled.div`
padding-top:max(.75rem,env(safe-area-inset-top,0px));padding-bottom:max(.75rem,env(safe-area-inset-bottom,0px));position: relative;display: flex;min-height: 100vh;width: 100%;align-items: center;justify-content: center;overflow: hidden;background-color: var(--color-stone-950);padding-inline: calc(var(--spacing) * 4);padding-block: calc(var(--spacing) * 6);font-family: var(--font-sans);color: var(--color-stone-100);-webkit-user-select: none;user-select: none
`;

export const Div2 = styled.div`
pointer-events: none;
position: absolute;
top: calc(1 / 4 * 100%);
left: calc(1 / 2 * 100%);
height: 550px;
width: 550px;
--cms-translate-x: calc(calc(1 / 2 * 100%) * -1);
translate: var(--cms-translate-x) var(--cms-translate-y);
--cms-translate-y: calc(calc(1 / 2 * 100%) * -1);
translate: var(--cms-translate-x) var(--cms-translate-y);
border-radius: calc(infinity * 1px);
--cms-gradient-position: to top right in oklab;
background-image: linear-gradient(var(--cms-gradient-stops));
--cms-gradient-from: color-mix(in oklab, var(--color-indigo-600) 20%, transparent);
--cms-gradient-stops: var(--cms-gradient-via-stops, var(--cms-gradient-position), var(--cms-gradient-from) var(--cms-gradient-from-position), var(--cms-gradient-to) var(--cms-gradient-to-position));
--cms-gradient-via: color-mix(in oklab, var(--color-purple-600) 15%, transparent);
--cms-gradient-via-stops: var(--cms-gradient-position), var(--cms-gradient-from) var(--cms-gradient-from-position), var(--cms-gradient-via) var(--cms-gradient-via-position), var(--cms-gradient-to) var(--cms-gradient-to-position);
--cms-gradient-stops: var(--cms-gradient-via-stops);
--cms-gradient-to: transparent;
--cms-gradient-stops: var(--cms-gradient-via-stops, var(--cms-gradient-position), var(--cms-gradient-from) var(--cms-gradient-from-position), var(--cms-gradient-to) var(--cms-gradient-to-position));
--cms-blur: blur(130px);
filter: var(--cms-blur,) var(--cms-brightness,) var(--cms-contrast,) var(--cms-grayscale,) var(--cms-hue-rotate,) var(--cms-invert,) var(--cms-saturate,) var(--cms-sepia,) var(--cms-drop-shadow,)
`;

export const Div3 = styled.div`
pointer-events: none;
position: absolute;
right: calc(1 / 4 * 100%);
bottom: calc(1 / 4 * 100%);
height: 350px;
width: 350px;
border-radius: calc(infinity * 1px);
background-color: color-mix(in oklab, var(--color-indigo-500) 10%, transparent);
--cms-blur: blur(100px);
filter: var(--cms-blur,) var(--cms-brightness,) var(--cms-contrast,) var(--cms-grayscale,) var(--cms-hue-rotate,) var(--cms-invert,) var(--cms-saturate,) var(--cms-sepia,) var(--cms-drop-shadow,)
`;

export const Div4 = styled.div`
position: relative;
z-index: 10;
width: 100%;
max-width: var(--container-md);
--cms-duration: 300ms;
transition-duration: 300ms
`;

export const Div5 = styled.div`
:where(& > :not(:last-child)) {
  --cms-space-y-reverse: 0;
  margin-block-start: calc(calc(var(--spacing) * 6) * var(--cms-space-y-reverse));
  margin-block-end: calc(calc(var(--spacing) * 6) * calc(1 - var(--cms-space-y-reverse)));
}

border-radius: var(--radius-3xl);
border-style: var(--cms-border-style);
border-width: 1px;
border-color: color-mix(in oklab, var(--color-stone-800) 80%, transparent);
background-color: color-mix(in oklab, var(--color-stone-900) 70%, transparent);
padding: calc(var(--spacing) * 5);
--cms-shadow: 0 25px 50px -12px var(--cms-shadow-color, rgb(0 0 0 / 0.25));
box-shadow: var(--cms-inset-shadow), var(--cms-inset-ring-shadow), var(--cms-ring-offset-shadow), var(--cms-ring-shadow), var(--cms-shadow);
--cms-shadow-color: color-mix(in oklab, color-mix(in oklab, var(--color-black) 80%, transparent) var(--cms-shadow-alpha), transparent);
--cms-backdrop-blur: blur(var(--blur-2xl));
-webkit-backdrop-filter: var(--cms-backdrop-blur,) var(--cms-backdrop-brightness,) var(--cms-backdrop-contrast,) var(--cms-backdrop-grayscale,) var(--cms-backdrop-hue-rotate,) var(--cms-backdrop-invert,) var(--cms-backdrop-opacity,) var(--cms-backdrop-saturate,) var(--cms-backdrop-sepia,);
backdrop-filter: var(--cms-backdrop-blur,) var(--cms-backdrop-brightness,) var(--cms-backdrop-contrast,) var(--cms-backdrop-grayscale,) var(--cms-backdrop-hue-rotate,) var(--cms-backdrop-invert,) var(--cms-backdrop-opacity,) var(--cms-backdrop-saturate,) var(--cms-backdrop-sepia,);

@media (width >= 40rem) {
  :where(& > :not(:last-child)) {
    --cms-space-y-reverse: 0;
    margin-block-start: calc(calc(var(--spacing) * 7) * var(--cms-space-y-reverse));
    margin-block-end: calc(calc(var(--spacing) * 7) * calc(1 - var(--cms-space-y-reverse)));
  }
  & {
    padding: calc(var(--spacing) * 8);
  }
}
`;

export const Div6 = styled.div`
:where(& > :not(:last-child)) {
  --cms-space-y-reverse: 0;
  margin-block-start: calc(calc(var(--spacing) * 3) * var(--cms-space-y-reverse));
  margin-block-end: calc(calc(var(--spacing) * 3) * calc(1 - var(--cms-space-y-reverse)));
}

text-align: center
`;

export const Div7 = styled.div`
margin-inline: auto;
display: flex;
height: calc(var(--spacing) * 14);
width: calc(var(--spacing) * 14);
align-items: center;
justify-content: center;
border-radius: var(--radius-2xl);
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
--cms-shadow: 0 10px 15px -3px var(--cms-shadow-color, rgb(0 0 0 / 0.1)), 0 4px 6px -4px var(--cms-shadow-color, rgb(0 0 0 / 0.1));
box-shadow: var(--cms-inset-shadow), var(--cms-inset-ring-shadow), var(--cms-ring-offset-shadow), var(--cms-ring-shadow), var(--cms-shadow);
--cms-ring-shadow: var(--cms-ring-inset,) 0 0 0 calc(4px + var(--cms-ring-offset-width)) var(--cms-ring-color, currentcolor);
box-shadow: var(--cms-inset-shadow), var(--cms-inset-ring-shadow), var(--cms-ring-offset-shadow), var(--cms-ring-shadow), var(--cms-shadow);
--cms-shadow-color: color-mix(in oklab, color-mix(in oklab, var(--color-indigo-500) 25%, transparent) var(--cms-shadow-alpha), transparent);
--cms-ring-color: color-mix(in oklab, var(--color-indigo-500) 10%, transparent)
`;

export const PenTool = styled(BasePenTool)`
height: calc(var(--spacing) * 7);
width: calc(var(--spacing) * 7)
`;

export const H1 = styled.h1`
display: flex;
align-items: center;
justify-content: center;
gap: calc(var(--spacing) * 2);
font-size: var(--text-xl);
line-height: var(--cms-leading, var(--text-xl--line-height));
--cms-font-weight: var(--font-weight-bold);
font-weight: var(--font-weight-bold);
--cms-tracking: var(--tracking-tight);
letter-spacing: var(--tracking-tight);
color: var(--color-white);

@media (width >= 40rem) {
  & {
    font-size: var(--text-2xl);
    line-height: var(--cms-leading, var(--text-2xl--line-height));
  }
}
`;

export const Span = styled.span`
border-radius: calc(infinity * 1px);
border-style: var(--cms-border-style);
border-width: 1px;
border-color: color-mix(in oklab, var(--color-indigo-800) 60%, transparent);
background-color: color-mix(in oklab, var(--color-indigo-950) 80%, transparent);
padding-inline: calc(var(--spacing) * 2);
padding-block: calc(var(--spacing) * 0.5);
font-family: var(--font-mono);
font-size: 10px;
--cms-font-weight: var(--font-weight-normal);
font-weight: var(--font-weight-normal);
color: var(--color-indigo-400)
`;

export const P = styled.p`
margin-top: var(--spacing);
font-size: var(--text-xs);
line-height: var(--cms-leading, var(--text-xs--line-height));
color: var(--color-stone-400)
`;

export const Div8 = styled.div`
:where(& > :not(:last-child)) {
  --cms-space-y-reverse: 0;
  margin-block-start: calc(calc(var(--spacing) * 2.5) * var(--cms-space-y-reverse));
  margin-block-end: calc(calc(var(--spacing) * 2.5) * calc(1 - var(--cms-space-y-reverse)));
}

border-radius: var(--radius-2xl);
border-style: var(--cms-border-style);
border-width: 1px;
border-color: color-mix(in oklab, var(--color-stone-800) 80%, transparent);
background-color: color-mix(in oklab, var(--color-stone-950) 70%, transparent);
padding: calc(var(--spacing) * 4);
font-size: var(--text-xs);
line-height: var(--cms-leading, var(--text-xs--line-height));
color: var(--color-stone-400)
`;

export const Div9 = styled.div`
display: flex;
align-items: center;
gap: calc(var(--spacing) * 2);
--cms-font-weight: var(--font-weight-medium);
font-weight: var(--font-weight-medium);
color: var(--color-stone-200)
`;

export const ShieldCheck = styled(BaseShieldCheck)`
height: calc(var(--spacing) * 4);
width: calc(var(--spacing) * 4);
flex-shrink: 0;
color: var(--color-emerald-400)
`;

export const P2 = styled.p`
font-size: 11px;
--cms-leading: var(--leading-relaxed);
line-height: var(--leading-relaxed);
color: var(--color-stone-400)
`;

export const Div10 = styled.div`
:where(& > :not(:last-child)) {
  --cms-space-y-reverse: 0;
  margin-block-start: calc(calc(var(--spacing) * 2) * var(--cms-space-y-reverse));
  margin-block-end: calc(calc(var(--spacing) * 2) * calc(1 - var(--cms-space-y-reverse)));
}



border-radius: var(--radius-xl);
border-style: var(--cms-border-style);
border-width: 1px;
border-color: color-mix(in oklab, var(--color-rose-800) 60%, transparent);
background-color: color-mix(in oklab, var(--color-rose-950) 60%, transparent);
padding: calc(var(--spacing) * 3.5);
font-size: var(--text-xs);
line-height: var(--cms-leading, var(--text-xs--line-height));
color: var(--color-rose-300);
--cms-duration: 200ms;
transition-duration: 200ms
`;

export const Div11 = styled.div`
display: flex;
align-items: flex-start;
gap: calc(var(--spacing) * 2)
`;

export const AlertCircle = styled(BaseAlertCircle)`
margin-top: calc(var(--spacing) * 0.5);
height: calc(var(--spacing) * 4);
width: calc(var(--spacing) * 4);
flex-shrink: 0;
color: var(--color-rose-400)
`;

export const Span2 = styled.span`
--cms-font-weight: var(--font-weight-medium);
font-weight: var(--font-weight-medium)
`;

export const Div12 = styled.div`
:where(& > :not(:last-child)) {
  --cms-space-y-reverse: 0;
  margin-block-start: calc(var(--spacing) * var(--cms-space-y-reverse));
  margin-block-end: calc(var(--spacing) * calc(1 - var(--cms-space-y-reverse)));
}

border-radius: var(--radius-lg);
border-style: var(--cms-border-style);
border-width: 1px;
border-color: color-mix(in oklab, var(--color-rose-900) 50%, transparent);
background-color: color-mix(in oklab, var(--color-rose-950) 40%, transparent);
padding: calc(var(--spacing) * 2.5);
font-family: var(--font-mono);
font-size: 11px;
color: color-mix(in oklab, var(--color-rose-300) 80%, transparent)
`;

export const P3 = styled.p`
display: flex;
align-items: center;
gap: calc(var(--spacing) * 1.5);
--cms-font-weight: var(--font-weight-semibold);
font-weight: var(--font-weight-semibold);
color: var(--color-rose-200)
`;

export const KeyRound = styled(BaseKeyRound)`
height: calc(var(--spacing) * 3.5);
width: calc(var(--spacing) * 3.5)
`;

export const P4 = styled.p`
color: var(--color-rose-100)
`;

export const Div13 = styled.div`
:where(& > :not(:last-child)) {
  --cms-space-y-reverse: 0;
  margin-block-start: calc(calc(var(--spacing) * 3) * var(--cms-space-y-reverse));
  margin-block-end: calc(calc(var(--spacing) * 3) * calc(1 - var(--cms-space-y-reverse)));
}
`;

export const Button = styled.button`
display: flex;
width: 100%;
cursor: pointer;
align-items: center;
justify-content: center;
gap: calc(var(--spacing) * 2);
border-radius: var(--radius-xl);
background-color: var(--color-indigo-600);
padding-inline: calc(var(--spacing) * 4);
padding-block: calc(var(--spacing) * 3.5);
font-size: var(--text-xs);
line-height: var(--cms-leading, var(--text-xs--line-height));
--cms-font-weight: var(--font-weight-semibold);
font-weight: var(--font-weight-semibold);
color: var(--color-white);
--cms-shadow: 0 10px 15px -3px var(--cms-shadow-color, rgb(0 0 0 / 0.1)), 0 4px 6px -4px var(--cms-shadow-color, rgb(0 0 0 / 0.1));
box-shadow: var(--cms-inset-shadow), var(--cms-inset-ring-shadow), var(--cms-ring-offset-shadow), var(--cms-ring-shadow), var(--cms-shadow);
--cms-shadow-color: color-mix(in oklab, color-mix(in oklab, var(--color-indigo-600) 25%, transparent) var(--cms-shadow-alpha), transparent);
transition-property: all;
transition-timing-function: var(--cms-ease, var(--default-transition-timing-function));
transition-duration: var(--cms-duration, var(--default-transition-duration));

@media (hover: hover) {
  &:hover {
    background-color: var(--color-indigo-500);
  }
}

&:active {
  scale: 0.98;
}

&:disabled {
  opacity: 50%;
}
`;

export const Div14 = styled.div`
height: calc(var(--spacing) * 4);
width: calc(var(--spacing) * 4);
animation: spin 1s linear infinite;
border-radius: calc(infinity * 1px);
border-style: var(--cms-border-style);
border-width: 2px;
border-color: var(--color-white);
border-top-color: transparent
`;

export const Cloud = styled(BaseCloud)`
height: calc(var(--spacing) * 4);
width: calc(var(--spacing) * 4)
`;

export const ArrowRight = styled(BaseArrowRight)`
height: calc(var(--spacing) * 4);
width: calc(var(--spacing) * 4)
`;

export const Button2 = styled.button`
display: flex;
width: 100%;
cursor: pointer;
align-items: center;
justify-content: center;
gap: calc(var(--spacing) * 2);
border-radius: var(--radius-xl);
border-style: var(--cms-border-style);
border-width: 1px;
border-color: var(--color-stone-800);
background-color: color-mix(in oklab, var(--color-stone-900) 60%, transparent);
padding-inline: calc(var(--spacing) * 4);
padding-block: calc(var(--spacing) * 2.5);
font-size: var(--text-xs);
line-height: var(--cms-leading, var(--text-xs--line-height));
--cms-font-weight: var(--font-weight-medium);
font-weight: var(--font-weight-medium);
color: var(--color-stone-400);
transition-property: all;
transition-timing-function: var(--cms-ease, var(--default-transition-timing-function));
transition-duration: var(--cms-duration, var(--default-transition-duration));

@media (hover: hover) {
  &:hover {
    background-color: color-mix(in oklab, var(--color-stone-800) 80%, transparent);
    color: var(--color-stone-200);
  }
}
`;

export const RotateCcw = styled(BaseRotateCcw)`
height: calc(var(--spacing) * 3.5);
width: calc(var(--spacing) * 3.5)
`;

export const Div15 = styled.div`
padding-top: var(--spacing);
text-align: center
`;

export const Span3 = styled.span`
display: inline-flex;
align-items: center;
gap: calc(var(--spacing) * 1.5);
border-radius: var(--radius-lg);
border-style: var(--cms-border-style);
border-width: 1px;
border-color: color-mix(in oklab, var(--color-amber-800) 60%, transparent);
background-color: color-mix(in oklab, var(--color-amber-950) 60%, transparent);
padding-inline: calc(var(--spacing) * 2.5);
padding-block: var(--spacing);
font-family: var(--font-mono);
font-size: 10px;
color: var(--color-amber-300)
`;

export const Terminal = styled(BaseTerminal)`
height: calc(var(--spacing) * 3);
width: calc(var(--spacing) * 3)
`;

export const Div16 = styled.div`
margin-top: calc(var(--spacing) * 5);
display: flex;
align-items: center;
justify-content: center;
gap: calc(var(--spacing) * 2);
font-size: 11px;
color: var(--color-stone-500)
`;

export const Lock = styled(BaseLock)`
height: calc(var(--spacing) * 3.5);
width: calc(var(--spacing) * 3.5);
color: var(--color-indigo-400)
`;

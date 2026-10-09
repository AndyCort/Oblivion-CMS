import styled, { css } from 'styled-components';
import { Settings as BaseSettings } from 'lucide-react';
import { X as BaseX } from 'lucide-react';
import { Sparkles as BaseSparkles } from 'lucide-react';
import { Check as BaseCheck } from 'lucide-react';
import { Copy as BaseCopy } from 'lucide-react';
import { Code2 as BaseCode2 } from 'lucide-react';
import { Database as BaseDatabase } from 'lucide-react';
import { Shield as BaseShield } from 'lucide-react';

export const Div = styled.div`
position: fixed;
inset: 0px;
z-index: 50;
display: flex;
align-items: center;
justify-content: center;
background-color: color-mix(in oklab, var(--color-black) 60%, transparent);
padding: calc(var(--spacing) * 3);
--cms-backdrop-blur: blur(var(--blur-sm));
-webkit-backdrop-filter: var(--cms-backdrop-blur,) var(--cms-backdrop-brightness,) var(--cms-backdrop-contrast,) var(--cms-backdrop-grayscale,) var(--cms-backdrop-hue-rotate,) var(--cms-backdrop-invert,) var(--cms-backdrop-opacity,) var(--cms-backdrop-saturate,) var(--cms-backdrop-sepia,);
backdrop-filter: var(--cms-backdrop-blur,) var(--cms-backdrop-brightness,) var(--cms-backdrop-contrast,) var(--cms-backdrop-grayscale,) var(--cms-backdrop-hue-rotate,) var(--cms-backdrop-invert,) var(--cms-backdrop-opacity,) var(--cms-backdrop-saturate,) var(--cms-backdrop-sepia,);
-webkit-user-select: none;
user-select: none;

@media (width >= 40rem) {
  & {
    padding: calc(var(--spacing) * 4);
  }
}
`;

export const Div2 = styled.div`
max-height: 92dvh;
width: 100%;
max-width: var(--container-lg);
overflow-y: auto;
border-radius: var(--radius-2xl);
border-style: var(--cms-border-style);
border-width: 1px;
border-color: var(--color-stone-200);
background-color: var(--color-white);
padding: calc(var(--spacing) * 4.5);
--cms-shadow: 0 25px 50px -12px var(--cms-shadow-color, rgb(0 0 0 / 0.25));
box-shadow: var(--cms-inset-shadow), var(--cms-inset-ring-shadow), var(--cms-ring-offset-shadow), var(--cms-ring-shadow), var(--cms-shadow);

:where(& > :not(:last-child)) {
  --cms-space-y-reverse: 0;
  margin-block-start: calc(calc(var(--spacing) * 4) * var(--cms-space-y-reverse));
  margin-block-end: calc(calc(var(--spacing) * 4) * calc(1 - var(--cms-space-y-reverse)));
}

@media (width >= 40rem) {
  :where(& > :not(:last-child)) {
    --cms-space-y-reverse: 0;
    margin-block-start: calc(calc(var(--spacing) * 5) * var(--cms-space-y-reverse));
    margin-block-end: calc(calc(var(--spacing) * 5) * calc(1 - var(--cms-space-y-reverse)));
  }
  & {
    border-radius: var(--radius-3xl);
    padding: calc(var(--spacing) * 7);
  }
}

&:where(.dark, .dark *) {
  border-color: var(--color-stone-800);
  background-color: var(--color-stone-900);
}
`;

export const Div3 = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
border-bottom-style: var(--cms-border-style);
border-bottom-width: 1px;
border-color: var(--color-stone-100);
padding-bottom: calc(var(--spacing) * 3);

&:where(.dark, .dark *) {
  border-color: var(--color-stone-800);
}
`;

export const Div4 = styled.div`
display: flex;
align-items: center;
gap: calc(var(--spacing) * 2)
`;

export const Div5 = styled.div`
display: flex;
height: calc(var(--spacing) * 8);
width: calc(var(--spacing) * 8);
align-items: center;
justify-content: center;
border-radius: var(--radius-xl);
border-style: var(--cms-border-style);
border-width: 1px;
border-color: var(--color-indigo-200);
background-color: var(--color-indigo-50);
color: var(--color-indigo-600);

&:where(.dark, .dark *) {
  border-color: color-mix(in oklab, var(--color-indigo-800) 60%, transparent);
  background-color: color-mix(in oklab, var(--color-indigo-950) 60%, transparent);
  color: var(--color-indigo-400);
}
`;

export const Settings = styled(BaseSettings)`
height: calc(var(--spacing) * 4);
width: calc(var(--spacing) * 4)
`;

export const H3 = styled.h3`
font-size: var(--text-base);
line-height: var(--cms-leading, var(--text-base--line-height));
--cms-font-weight: var(--font-weight-semibold);
font-weight: var(--font-weight-semibold);
color: var(--color-stone-900);

&:where(.dark, .dark *) {
  color: var(--color-stone-100);
}
`;

export const P = styled.p`
font-size: 11px;
color: var(--color-stone-400)
`;

export const Button = styled.button`
cursor: pointer;
border-radius: var(--radius-xl);
padding: calc(var(--spacing) * 1.5);
color: var(--color-stone-400);

@media (hover: hover) {
  &:hover {
    background-color: var(--color-stone-100);
    color: var(--color-stone-600);
  }
  &:where(.dark, .dark *):hover {
    background-color: var(--color-stone-800);
    color: var(--color-stone-200);
  }
}
`;

export const X = styled(BaseX)`
height: calc(var(--spacing) * 5);
width: calc(var(--spacing) * 5)
`;

export const Div6 = styled.div`
:where(& > :not(:last-child)) {
  --cms-space-y-reverse: 0;
  margin-block-start: calc(calc(var(--spacing) * 3.5) * var(--cms-space-y-reverse));
  margin-block-end: calc(calc(var(--spacing) * 3.5) * calc(1 - var(--cms-space-y-reverse)));
}

font-size: var(--text-xs);
line-height: var(--cms-leading, var(--text-xs--line-height))
`;

export const Div7 = styled.div`
:where(& > :not(:last-child)) {
  --cms-space-y-reverse: 0;
  margin-block-start: calc(calc(var(--spacing) * 2.5) * var(--cms-space-y-reverse));
  margin-block-end: calc(calc(var(--spacing) * 2.5) * calc(1 - var(--cms-space-y-reverse)));
}

border-radius: var(--radius-2xl);
border-style: var(--cms-border-style);
border-width: 1px;
border-color: color-mix(in oklab, var(--color-indigo-500) 30%, transparent);
--cms-gradient-position: to bottom right in oklab;
background-image: linear-gradient(var(--cms-gradient-stops));
--cms-gradient-from: color-mix(in oklab, var(--color-indigo-500) 10%, transparent);
--cms-gradient-stops: var(--cms-gradient-via-stops, var(--cms-gradient-position), var(--cms-gradient-from) var(--cms-gradient-from-position), var(--cms-gradient-to) var(--cms-gradient-to-position));
--cms-gradient-via: color-mix(in oklab, var(--color-purple-500) 5%, transparent);
--cms-gradient-via-stops: var(--cms-gradient-position), var(--cms-gradient-from) var(--cms-gradient-from-position), var(--cms-gradient-via) var(--cms-gradient-via-position), var(--cms-gradient-to) var(--cms-gradient-to-position);
--cms-gradient-stops: var(--cms-gradient-via-stops);
--cms-gradient-to: transparent;
--cms-gradient-stops: var(--cms-gradient-via-stops, var(--cms-gradient-position), var(--cms-gradient-from) var(--cms-gradient-from-position), var(--cms-gradient-to) var(--cms-gradient-to-position));
padding: calc(var(--spacing) * 4)
`;

export const Div8 = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
--cms-font-weight: var(--font-weight-medium);
font-weight: var(--font-weight-medium);
color: var(--color-stone-900);

&:where(.dark, .dark *) {
  color: var(--color-stone-100);
}
`;

export const Span = styled.span`
display: flex;
align-items: center;
gap: calc(var(--spacing) * 1.5);
--cms-font-weight: var(--font-weight-semibold);
font-weight: var(--font-weight-semibold);
color: var(--color-indigo-600);

&:where(.dark, .dark *) {
  color: var(--color-indigo-400);
}
`;

export const Sparkles = styled(BaseSparkles)`
height: calc(var(--spacing) * 4);
width: calc(var(--spacing) * 4)
`;

export const Span2 = styled.span`
border-radius: calc(infinity * 1px);
background-color: var(--color-indigo-100);
padding-inline: calc(var(--spacing) * 2);
padding-block: calc(var(--spacing) * 0.5);
font-family: var(--font-mono);
font-size: 10px;
color: var(--color-indigo-700);

&:where(.dark, .dark *) {
  background-color: var(--color-indigo-950);
  color: var(--color-indigo-300);
}
`;

export const P2 = styled.p`
font-size: 11px;
--cms-leading: var(--leading-relaxed);
line-height: var(--leading-relaxed);
color: var(--color-stone-600);

&:where(.dark, .dark *) {
  color: var(--color-stone-400);
}
`;

export const Div9 = styled.div`
display: flex;
align-items: center;
gap: calc(var(--spacing) * 2);
border-radius: var(--radius-xl);
border-style: var(--cms-border-style);
border-width: 1px;
border-color: var(--color-stone-200);
background-color: var(--color-white);
padding: calc(var(--spacing) * 2);

&:where(.dark, .dark *) {
  border-color: var(--color-stone-800);
  background-color: var(--color-stone-950);
}
`;

export const Input = styled.input`
flex: 1;
background-color: transparent;
font-family: var(--font-mono);
font-size: 11px;
color: var(--color-indigo-600);
--cms-outline-style: none;
outline-style: none;
-webkit-user-select: all;
user-select: all;

&:where(.dark, .dark *) {
  color: var(--color-indigo-400);
}
`;

export const Button2 = styled.button`
display: flex;
flex-shrink: 0;
cursor: pointer;
align-items: center;
gap: var(--spacing);
border-radius: var(--radius-lg);
background-color: var(--color-indigo-600);
padding-inline: calc(var(--spacing) * 2.5);
padding-block: var(--spacing);
font-size: 11px;
--cms-font-weight: var(--font-weight-medium);
font-weight: var(--font-weight-medium);
color: var(--color-white);
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
`;

export const Check = styled(BaseCheck)`
height: calc(var(--spacing) * 3.5);
width: calc(var(--spacing) * 3.5)
`;

export const Copy = styled(BaseCopy)`
height: calc(var(--spacing) * 3.5);
width: calc(var(--spacing) * 3.5)
`;

export const Div10 = styled.div`
:where(& > :not(:last-child)) {
  --cms-space-y-reverse: 0;
  margin-block-start: calc(var(--spacing) * var(--cms-space-y-reverse));
  margin-block-end: calc(var(--spacing) * calc(1 - var(--cms-space-y-reverse)));
}

border-radius: var(--radius-xl);
background-color: var(--color-stone-900);
padding: calc(var(--spacing) * 2.5);
font-family: var(--font-mono);
font-size: 10px;
color: var(--color-stone-300)
`;

export const Div11 = styled.div`
display: flex;
align-items: center;
gap: var(--spacing);
font-family: var(--font-sans);
color: var(--color-stone-400)
`;

export const Code2 = styled(BaseCode2)`
height: calc(var(--spacing) * 3);
width: calc(var(--spacing) * 3);
color: var(--color-indigo-400)
`;

export const P3 = styled.p`
color: var(--color-indigo-300)
`;

export const Div12 = styled.div`
:where(& > :not(:last-child)) {
  --cms-space-y-reverse: 0;
  margin-block-start: calc(calc(var(--spacing) * 3) * var(--cms-space-y-reverse));
  margin-block-end: calc(calc(var(--spacing) * 3) * calc(1 - var(--cms-space-y-reverse)));
}

border-radius: var(--radius-2xl);
border-style: var(--cms-border-style);
border-width: 1px;
border-color: var(--color-stone-200);
background-color: var(--color-stone-50);
padding: calc(var(--spacing) * 3.5);

@media (width >= 40rem) {
  & {
    padding: calc(var(--spacing) * 4);
  }
}

&:where(.dark, .dark *) {
  border-color: var(--color-stone-800);
  background-color: var(--color-stone-950);
}
`;

export const Span3 = styled.span`
display: flex;
align-items: center;
gap: calc(var(--spacing) * 1.5)
`;

export const Database = styled(BaseDatabase)`
height: calc(var(--spacing) * 4);
width: calc(var(--spacing) * 4);
color: var(--color-emerald-500)
`;

const Span4Variants = {
v0: css`
border-color: color-mix(in oklab, var(--color-amber-300) 60%, transparent);
background-color: var(--color-amber-100);
color: var(--color-amber-700);

&:where(.dark, .dark *) {
  background-color: color-mix(in oklab, var(--color-amber-950) 60%, transparent);
  color: var(--color-amber-400);
}
`,
v1: css`
border-color: color-mix(in oklab, var(--color-emerald-300) 60%, transparent);
background-color: var(--color-emerald-100);
color: var(--color-emerald-700);

&:where(.dark, .dark *) {
  background-color: color-mix(in oklab, var(--color-emerald-950) 60%, transparent);
  color: var(--color-emerald-400);
}
`
};
export const Span4 = styled.span<{ $variant: keyof typeof Span4Variants }>`
border-radius: 0.25rem;
border-style: var(--cms-border-style);
border-width: 1px;
padding-inline: calc(var(--spacing) * 2);
padding-block: calc(var(--spacing) * 0.5);
font-size: 10px;
--cms-font-weight: var(--font-weight-medium);
font-weight: var(--font-weight-medium);
${p => Span4Variants[p.$variant]}
`;

export const Div13 = styled.div`
:where(& > :not(:last-child)) {
  --cms-space-y-reverse: 0;
  margin-block-start: calc(var(--spacing) * var(--cms-space-y-reverse));
  margin-block-end: calc(var(--spacing) * calc(1 - var(--cms-space-y-reverse)));
}

font-family: var(--font-mono);
font-size: 11px;
color: var(--color-stone-600);

&:where(.dark, .dark *) {
  color: var(--color-stone-400);
}
`;

export const Span5 = styled.span`
--cms-font-weight: var(--font-weight-bold);
font-weight: var(--font-weight-bold);
color: var(--color-indigo-600);

&:where(.dark, .dark *) {
  color: var(--color-indigo-400);
}
`;

export const Div14 = styled.div`
margin-top: calc(var(--spacing) * 2.5);
border-radius: var(--radius-xl);
border-style: var(--cms-border-style);
border-width: 1px;
border-color: color-mix(in oklab, var(--color-amber-500) 30%, transparent);
background-color: color-mix(in oklab, var(--color-amber-500) 10%, transparent);
padding: calc(var(--spacing) * 3);
font-size: 11px;
color: var(--color-amber-900);

:where(& > :not(:last-child)) {
  --cms-space-y-reverse: 0;
  margin-block-start: calc(calc(var(--spacing) * 2) * var(--cms-space-y-reverse));
  margin-block-end: calc(calc(var(--spacing) * 2) * calc(1 - var(--cms-space-y-reverse)));
}

&:where(.dark, .dark *) {
  color: var(--color-amber-200);
}
`;

export const Div15 = styled.div`
display: flex;
align-items: center;
gap: var(--spacing);
--cms-font-weight: var(--font-weight-semibold);
font-weight: var(--font-weight-semibold);
color: var(--color-amber-800);

&:where(.dark, .dark *) {
  color: var(--color-amber-300);
}
`;

export const P4 = styled.p`
--cms-leading: var(--leading-relaxed);
line-height: var(--leading-relaxed)
`;

export const Div16 = styled.div`
border-radius: var(--radius-lg);
border-style: var(--cms-border-style);
border-width: 1px;
border-color: color-mix(in oklab, var(--color-amber-500) 20%, transparent);
background-color: color-mix(in oklab, var(--color-white) 60%, transparent);
padding: calc(var(--spacing) * 2);
font-family: var(--font-mono);
font-size: 10px;
color: var(--color-stone-600);

&:where(.dark, .dark *) {
  background-color: color-mix(in oklab, var(--color-stone-900) 60%, transparent);
  color: var(--color-stone-400);
}
`;

export const Div17 = styled.div`
--cms-font-weight: var(--font-weight-semibold);
font-weight: var(--font-weight-semibold);
word-break: break-all;
color: var(--color-indigo-600);

&:where(.dark, .dark *) {
  color: var(--color-indigo-400);
}
`;

export const Div18 = styled.div`
:where(& > :not(:last-child)) {
  --cms-space-y-reverse: 0;
  margin-block-start: calc(calc(var(--spacing) * 1.5) * var(--cms-space-y-reverse));
  margin-block-end: calc(calc(var(--spacing) * 1.5) * calc(1 - var(--cms-space-y-reverse)));
}

padding-top: var(--spacing);
font-family: var(--font-sans)
`;

export const Div19 = styled.div`
--cms-font-weight: var(--font-weight-medium);
font-weight: var(--font-weight-medium);
color: var(--color-amber-900);

&:where(.dark, .dark *) {
  color: var(--color-amber-200);
}
`;

export const Ol = styled.ol`
list-style-position: inside;
list-style-type: decimal;
color: var(--color-stone-700);

:where(& > :not(:last-child)) {
  --cms-space-y-reverse: 0;
  margin-block-start: calc(var(--spacing) * var(--cms-space-y-reverse));
  margin-block-end: calc(var(--spacing) * calc(1 - var(--cms-space-y-reverse)));
}

&:where(.dark, .dark *) {
  color: var(--color-stone-300);
}
`;

export const Code = styled.code`
font-family: var(--font-mono);
--cms-font-weight: var(--font-weight-bold);
font-weight: var(--font-weight-bold);
color: var(--color-indigo-600);

&:where(.dark, .dark *) {
  color: var(--color-indigo-400);
}
`;

export const Div20 = styled.div`
:where(& > :not(:last-child)) {
  --cms-space-y-reverse: 0;
  margin-block-start: calc(calc(var(--spacing) * 1.5) * var(--cms-space-y-reverse));
  margin-block-end: calc(calc(var(--spacing) * 1.5) * calc(1 - var(--cms-space-y-reverse)));
}

border-radius: var(--radius-2xl);
border-style: var(--cms-border-style);
border-width: 1px;
border-color: var(--color-stone-200);
background-color: var(--color-stone-50);
padding: calc(var(--spacing) * 3.5);

&:where(.dark, .dark *) {
  border-color: var(--color-stone-800);
  background-color: var(--color-stone-950);
}
`;

export const Div21 = styled.div`
display: flex;
align-items: center;
gap: calc(var(--spacing) * 1.5);
--cms-font-weight: var(--font-weight-medium);
font-weight: var(--font-weight-medium);
color: var(--color-stone-900);

&:where(.dark, .dark *) {
  color: var(--color-stone-100);
}
`;

export const Shield = styled(BaseShield)`
height: calc(var(--spacing) * 4);
width: calc(var(--spacing) * 4);
color: var(--color-indigo-500)
`;

export const Div22 = styled.div`
font-size: 11px;
--cms-leading: var(--leading-relaxed);
line-height: var(--leading-relaxed);
color: var(--color-stone-600);

&:where(.dark, .dark *) {
  color: var(--color-stone-400);
}
`;

export const Span6 = styled.span`
font-family: var(--font-mono);
color: var(--color-indigo-600);

&:where(.dark, .dark *) {
  color: var(--color-indigo-400);
}
`;

export const P5 = styled.p`
margin-top: var(--spacing)
`;

export const Div23 = styled.div`
display: flex;
justify-content: flex-end;
padding-top: calc(var(--spacing) * 2)
`;

export const Button3 = styled.button`
cursor: pointer;
border-radius: var(--radius-xl);
background-color: var(--color-indigo-600);
padding-inline: calc(var(--spacing) * 5);
padding-block: calc(var(--spacing) * 2.5);
font-size: var(--text-xs);
line-height: var(--cms-leading, var(--text-xs--line-height));
--cms-font-weight: var(--font-weight-semibold);
font-weight: var(--font-weight-semibold);
color: var(--color-white);
--cms-shadow: 0 4px 6px -1px var(--cms-shadow-color, rgb(0 0 0 / 0.1)), 0 2px 4px -2px var(--cms-shadow-color, rgb(0 0 0 / 0.1));
box-shadow: var(--cms-inset-shadow), var(--cms-inset-ring-shadow), var(--cms-ring-offset-shadow), var(--cms-ring-shadow), var(--cms-shadow);
--cms-shadow-color: color-mix(in oklab, color-mix(in oklab, var(--color-indigo-600) 20%, transparent) var(--cms-shadow-alpha), transparent);
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
`;

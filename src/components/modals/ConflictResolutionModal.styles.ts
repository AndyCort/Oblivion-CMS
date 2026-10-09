import styled from 'styled-components';
import { AlertCircle as BaseAlertCircle } from 'lucide-react';
import { X as BaseX } from 'lucide-react';
import { Check as BaseCheck } from 'lucide-react';
import { Copy as BaseCopy } from 'lucide-react';
import { RefreshCw as BaseRefreshCw } from 'lucide-react';
import { UploadCloud as BaseUploadCloud } from 'lucide-react';

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
border-color: var(--color-amber-300);
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
  & {
    padding: calc(var(--spacing) * 6);
  }
}

&:where(.dark, .dark *) {
  border-color: color-mix(in oklab, var(--color-amber-800) 80%, transparent);
  background-color: var(--color-stone-900);
}
`;

export const Div3 = styled.div`
display: flex;
align-items: flex-start;
gap: calc(var(--spacing) * 3)
`;

export const Div4 = styled.div`
display: flex;
height: calc(var(--spacing) * 10);
width: calc(var(--spacing) * 10);
flex-shrink: 0;
align-items: center;
justify-content: center;
border-radius: var(--radius-xl);
background-color: var(--color-amber-50);
color: var(--color-amber-600);

&:where(.dark, .dark *) {
  background-color: color-mix(in oklab, var(--color-amber-950) 50%, transparent);
  color: var(--color-amber-400);
}
`;

export const AlertCircle = styled(BaseAlertCircle)`
height: calc(var(--spacing) * 6);
width: calc(var(--spacing) * 6)
`;

export const Div5 = styled.div`
flex: 1
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
margin-top: var(--spacing);
font-size: var(--text-xs);
line-height: var(--cms-leading, var(--text-xs--line-height));
color: var(--color-stone-500);

&:where(.dark, .dark *) {
  color: var(--color-stone-400);
}
`;

export const Button = styled.button`
border-radius: var(--radius-lg);
padding: var(--spacing);
color: var(--color-stone-400);

@media (hover: hover) {
  &:hover {
    color: var(--color-stone-600);
  }
  &:where(.dark, .dark *):hover {
    color: var(--color-stone-300);
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
  margin-block-start: calc(calc(var(--spacing) * 1.5) * var(--cms-space-y-reverse));
  margin-block-end: calc(calc(var(--spacing) * 1.5) * calc(1 - var(--cms-space-y-reverse)));
}

border-radius: var(--radius-xl);
border-style: var(--cms-border-style);
border-width: 1px;
border-color: var(--color-stone-200);
background-color: var(--color-stone-50);
padding: calc(var(--spacing) * 3);
font-family: var(--font-mono);
font-size: var(--text-xs);
line-height: var(--cms-leading, var(--text-xs--line-height));
color: var(--color-stone-600);

&:where(.dark, .dark *) {
  border-color: var(--color-stone-800);
  background-color: var(--color-stone-950);
  color: var(--color-stone-400);
}
`;

export const Div7 = styled.div`
display: flex;
flex-direction: column;
gap: calc(var(--spacing) * 3);
padding-top: calc(var(--spacing) * 2);

@media (width >= 40rem) {
  & {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}
`;

export const Button2 = styled.button`
display: flex;
align-items: center;
justify-content: center;
gap: calc(var(--spacing) * 1.5);
border-radius: var(--radius-xl);
border-style: var(--cms-border-style);
border-width: 1px;
border-color: var(--color-stone-200);
padding-inline: calc(var(--spacing) * 3);
padding-block: calc(var(--spacing) * 2);
font-size: var(--text-xs);
line-height: var(--cms-leading, var(--text-xs--line-height));
color: var(--color-stone-600);
transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --cms-gradient-from, --cms-gradient-via, --cms-gradient-to;
transition-timing-function: var(--cms-ease, var(--default-transition-timing-function));
transition-duration: var(--cms-duration, var(--default-transition-duration));

@media (hover: hover) {
  &:hover {
    color: var(--color-stone-900);
  }
  &:where(.dark, .dark *):hover {
    color: var(--color-stone-200);
  }
}

&:where(.dark, .dark *) {
  border-color: var(--color-stone-800);
  color: var(--color-stone-400);
}
`;

export const Check = styled(BaseCheck)`
height: calc(var(--spacing) * 3.5);
width: calc(var(--spacing) * 3.5);
color: var(--color-emerald-500)
`;

export const Copy = styled(BaseCopy)`
height: calc(var(--spacing) * 3.5);
width: calc(var(--spacing) * 3.5)
`;

export const Div8 = styled.div`
display: flex;
flex-wrap: wrap;
align-items: center;
justify-content: flex-end;
gap: calc(var(--spacing) * 2)
`;

export const Button3 = styled.button`
border-radius: var(--radius-xl);
padding-inline: calc(var(--spacing) * 3);
padding-block: calc(var(--spacing) * 2);
font-size: var(--text-xs);
line-height: var(--cms-leading, var(--text-xs--line-height));
color: var(--color-stone-600);
transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --cms-gradient-from, --cms-gradient-via, --cms-gradient-to;
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

&:disabled {
  opacity: 50%;
}

&:where(.dark, .dark *) {
  color: var(--color-stone-400);
}
`;

export const Button4 = styled.button`
display: flex;
align-items: center;
gap: calc(var(--spacing) * 1.5);
border-radius: var(--radius-xl);
background-color: var(--color-amber-100);
padding-inline: calc(var(--spacing) * 3);
padding-block: calc(var(--spacing) * 2);
font-size: var(--text-xs);
line-height: var(--cms-leading, var(--text-xs--line-height));
--cms-font-weight: var(--font-weight-medium);
font-weight: var(--font-weight-medium);
color: var(--color-amber-800);
transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --cms-gradient-from, --cms-gradient-via, --cms-gradient-to;
transition-timing-function: var(--cms-ease, var(--default-transition-timing-function));
transition-duration: var(--cms-duration, var(--default-transition-duration));

@media (hover: hover) {
  &:hover {
    background-color: var(--color-amber-200);
  }
  &:where(.dark, .dark *):hover {
    background-color: color-mix(in oklab, var(--color-amber-900) 60%, transparent);
  }
}

&:disabled {
  opacity: 50%;
}

&:where(.dark, .dark *) {
  background-color: color-mix(in oklab, var(--color-amber-950) 60%, transparent);
  color: var(--color-amber-300);
}
`;

export const RefreshCw = styled(BaseRefreshCw)`
height: calc(var(--spacing) * 3.5);
width: calc(var(--spacing) * 3.5)
`;

export const Button5 = styled.button`
display: flex;
align-items: center;
gap: calc(var(--spacing) * 1.5);
border-radius: var(--radius-xl);
background-color: var(--color-rose-600);
padding-inline: calc(var(--spacing) * 3.5);
padding-block: calc(var(--spacing) * 2);
font-size: var(--text-xs);
line-height: var(--cms-leading, var(--text-xs--line-height));
--cms-font-weight: var(--font-weight-medium);
font-weight: var(--font-weight-medium);
color: var(--color-white);
--cms-shadow: 0 1px 3px 0 var(--cms-shadow-color, rgb(0 0 0 / 0.1)), 0 1px 2px -1px var(--cms-shadow-color, rgb(0 0 0 / 0.1));
box-shadow: var(--cms-inset-shadow), var(--cms-inset-ring-shadow), var(--cms-ring-offset-shadow), var(--cms-ring-shadow), var(--cms-shadow);
transition-property: all;
transition-timing-function: var(--cms-ease, var(--default-transition-timing-function));
transition-duration: var(--cms-duration, var(--default-transition-duration));

@media (hover: hover) {
  &:hover {
    background-color: var(--color-rose-500);
  }
}

&:disabled {
  opacity: 50%;
}
`;

export const UploadCloud = styled(BaseUploadCloud)`
height: calc(var(--spacing) * 3.5);
width: calc(var(--spacing) * 3.5)
`;

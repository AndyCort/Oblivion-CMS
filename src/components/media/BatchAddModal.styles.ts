import styled, { css } from 'styled-components';
import { Layers as BaseLayers } from 'lucide-react';
import { X as BaseX } from 'lucide-react';
import { Plus as BasePlus } from 'lucide-react';

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
--cms-duration: 200ms;
transition-duration: 200ms;

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
  & {
    padding: calc(var(--spacing) * 6);
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
padding-bottom: calc(var(--spacing) * 2);

&:where(.dark, .dark *) {
  border-color: var(--color-stone-800);
}
`;

export const Div4 = styled.div`
display: flex;
align-items: center;
gap: calc(var(--spacing) * 2)
`;

export const Layers = styled(BaseLayers)`
height: calc(var(--spacing) * 5);
width: calc(var(--spacing) * 5);
color: var(--color-indigo-500)
`;

export const H3 = styled.h3`
font-size: var(--text-base);
line-height: var(--cms-leading, var(--text-base--line-height));
--cms-font-weight: var(--font-weight-semibold);
font-weight: var(--font-weight-semibold);
color: var(--color-stone-900);

@media (width >= 40rem) {
  & {
    font-size: var(--text-lg);
    line-height: var(--cms-leading, var(--text-lg--line-height));
  }
}

&:where(.dark, .dark *) {
  color: var(--color-stone-100);
}
`;

export const Button = styled.button`
border-radius: var(--radius-xl);
padding: calc(var(--spacing) * 1.5);
color: var(--color-stone-400);

@media (hover: hover) {
  &:hover {
    background-color: var(--color-stone-100);
    color: var(--color-stone-700);
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

export const Form = styled.form`
:where(& > :not(:last-child)) {
  --cms-space-y-reverse: 0;
  margin-block-start: calc(calc(var(--spacing) * 4) * var(--cms-space-y-reverse));
  margin-block-end: calc(calc(var(--spacing) * 4) * calc(1 - var(--cms-space-y-reverse)));
}
`;

export const Label = styled.label`
margin-bottom: var(--spacing);
display: block;
font-size: var(--text-xs);
line-height: var(--cms-leading, var(--text-xs--line-height));
--cms-font-weight: var(--font-weight-medium);
font-weight: var(--font-weight-medium);
color: var(--color-stone-500);

&:where(.dark, .dark *) {
  color: var(--color-stone-400);
}
`;

export const Textarea = styled.textarea`
width: 100%;
border-radius: var(--radius-xl);
border-style: var(--cms-border-style);
border-width: 1px;
border-color: var(--color-stone-300);
background-color: var(--color-stone-50);
padding: calc(var(--spacing) * 3);
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

&:where(.dark, .dark *) {
  border-color: var(--color-stone-700);
  background-color: var(--color-stone-950);
  color: var(--color-stone-100);
}
`;

export const Div5 = styled.div`
display: flex;
align-items: center;
justify-content: space-between
`;

export const Span = styled.span`
font-size: var(--text-xs);
line-height: var(--cms-leading, var(--text-xs--line-height));
color: var(--color-stone-500);

&:where(.dark, .dark *) {
  color: var(--color-stone-400);
}
`;

export const Div6 = styled.div`
display: flex;
gap: calc(var(--spacing) * 2)
`;

const Button2Variants = {
v0: css`
border-color: var(--color-indigo-300);
background-color: var(--color-indigo-50);
--cms-font-weight: var(--font-weight-medium);
font-weight: var(--font-weight-medium);
color: var(--color-indigo-600);

&:where(.dark, .dark *) {
  border-color: var(--color-indigo-600);
  background-color: color-mix(in oklab, var(--color-indigo-950) 60%, transparent);
  color: var(--color-indigo-400);
}
`,
v1: css`
border-color: var(--color-stone-200);
color: var(--color-stone-600);

&:where(.dark, .dark *) {
  border-color: var(--color-stone-700);
  color: var(--color-stone-400);
}
`
};
export const Button2 = styled.button<{ $variant: keyof typeof Button2Variants }>`
border-radius: var(--radius-lg);
border-style: var(--cms-border-style);
border-width: 1px;
padding-inline: calc(var(--spacing) * 2.5);
padding-block: var(--spacing);
font-size: var(--text-xs);
line-height: var(--cms-leading, var(--text-xs--line-height));
${p => Button2Variants[p.$variant]}
`;

export const Div7 = styled.div`
display: flex;
justify-content: flex-end;
gap: calc(var(--spacing) * 3);
padding-top: calc(var(--spacing) * 2)
`;

export const Button3 = styled.button`
border-radius: var(--radius-xl);
padding-inline: calc(var(--spacing) * 4);
padding-block: calc(var(--spacing) * 2);
font-size: var(--text-sm);
line-height: var(--cms-leading, var(--text-sm--line-height));
--cms-font-weight: var(--font-weight-medium);
font-weight: var(--font-weight-medium);
color: var(--color-stone-600);

@media (hover: hover) {
  &:hover {
    background-color: var(--color-stone-100);
  }
  &:where(.dark, .dark *):hover {
    background-color: var(--color-stone-800);
  }
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
background-color: var(--color-indigo-600);
padding-inline: calc(var(--spacing) * 4);
padding-block: calc(var(--spacing) * 2);
font-size: var(--text-sm);
line-height: var(--cms-leading, var(--text-sm--line-height));
--cms-font-weight: var(--font-weight-medium);
font-weight: var(--font-weight-medium);
color: var(--color-white);
--cms-shadow: 0 1px 3px 0 var(--cms-shadow-color, rgb(0 0 0 / 0.1)), 0 1px 2px -1px var(--cms-shadow-color, rgb(0 0 0 / 0.1));
box-shadow: var(--cms-inset-shadow), var(--cms-inset-ring-shadow), var(--cms-ring-offset-shadow), var(--cms-ring-shadow), var(--cms-shadow);

@media (hover: hover) {
  &:hover {
    background-color: var(--color-indigo-500);
  }
}

&:disabled {
  cursor: not-allowed;
  opacity: 50%;
}
`;

export const Plus = styled(BasePlus)`
height: calc(var(--spacing) * 4);
width: calc(var(--spacing) * 4)
`;

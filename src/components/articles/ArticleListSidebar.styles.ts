import { sidebarSurface, primaryButton } from '../../styles/workspace';
import styled, { css } from 'styled-components';

import { Plus as BasePlus } from 'lucide-react';
import { Search as BaseSearch } from 'lucide-react';
import { ArrowUpDown as BaseArrowUpDown } from 'lucide-react';
import { Sparkles as BaseSparkles } from 'lucide-react';
import { Clock as BaseClock } from 'lucide-react';
import { FileEdit as BaseFileEdit } from 'lucide-react';
import { CheckCircle2 as BaseCheckCircle2 } from 'lucide-react';
import { MapPin as BaseMapPin } from 'lucide-react';
import { Music2 as BaseMusic2 } from 'lucide-react';
import { Copy as BaseCopy } from 'lucide-react';
import { Trash2 as BaseTrash2 } from 'lucide-react';

export const Div = styled.div`
${sidebarSurface};
display:flex; height:100%; flex-direction:column;
`;

export const Div2 = styled.div`
flex-shrink: 0;
border-bottom-style: var(--cms-border-style);
border-bottom-width: 1px;
border-color: var(--color-stone-100);
padding: calc(var(--spacing) * 3.5);

:where(& > :not(:last-child)) {
  --cms-space-y-reverse: 0;
  margin-block-start: calc(calc(var(--spacing) * 3) * var(--cms-space-y-reverse));
  margin-block-end: calc(calc(var(--spacing) * 3) * calc(1 - var(--cms-space-y-reverse)));
}

&:where(.dark, .dark *) {
  border-color: var(--color-stone-800);
}
`;

export const Div3 = styled.div`
display: flex;
align-items: center;
justify-content: space-between
`;

export const Div4 = styled.div`
display: flex;
align-items: center;
gap: calc(var(--spacing) * 2)
`;

export const H2 = styled.h2`
font-size: var(--text-sm);
line-height: var(--cms-leading, var(--text-sm--line-height));
--cms-font-weight: var(--font-weight-semibold);
font-weight: var(--font-weight-semibold);
color: var(--color-stone-900);

&:where(.dark, .dark *) {
  color: var(--color-stone-100);
}
`;

export const Span = styled.span`
border-radius: calc(infinity * 1px);
background-color: var(--color-stone-100);
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

export const Div5 = styled.div`
display: flex;
align-items: center;
gap: calc(var(--spacing) * 1.5)
`;

export const Button2 = styled.button`
${primaryButton};
`;

export const Plus = styled(BasePlus)`
height: calc(var(--spacing) * 3.5);
width: calc(var(--spacing) * 3.5)
`;

export const Div6 = styled.div`
position: relative
`;

export const Search = styled(BaseSearch)`
position: absolute;
top: calc(1 / 2 * 100%);
left: calc(var(--spacing) * 3);
height: calc(var(--spacing) * 3.5);
width: calc(var(--spacing) * 3.5);
--cms-translate-y: calc(calc(1 / 2 * 100%) * -1);
translate: var(--cms-translate-x) var(--cms-translate-y);
color: var(--color-stone-400)
`;

export const Input = styled.input`
width: 100%;
border-radius: var(--radius-xl);
border-style: var(--cms-border-style);
border-width: 1px;
border-color: var(--color-stone-200);
background-color: var(--color-stone-50);
padding-block: calc(var(--spacing) * 2);
padding-right: calc(var(--spacing) * 3);
padding-left: calc(var(--spacing) * 8.5);
font-size: var(--text-sm);
line-height: var(--cms-leading, var(--text-sm--line-height));
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

export const Div7 = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
padding-top: var(--spacing);
font-size: var(--text-xs);
line-height: var(--cms-leading, var(--text-xs--line-height))
`;

export const Div8 = styled.div`
display: flex; scrollbar-width:none; -ms-overflow-style:none; align-items: center; gap: var(--spacing); overflow-x: auto; padding-block: calc(var(--spacing) * 0.5); &::-webkit-scrollbar {display:none;}
`;

const Button3Variants = {
v0: css`
border-style: var(--cms-border-style);
border-width: 1px;
border-color: color-mix(in oklab, var(--color-amber-300) 60%, transparent);
background-color: var(--color-amber-100);
--cms-font-weight: var(--font-weight-medium);
font-weight: var(--font-weight-medium);
color: var(--color-amber-700);

&:where(.dark, .dark *) {
  background-color: color-mix(in oklab, var(--color-amber-950) 60%, transparent);
  color: var(--color-amber-300);
}
`,
v1: css`
background-color: var(--color-stone-100);
color: var(--color-stone-600);

@media (hover: hover) {
  &:hover {
    background-color: var(--color-stone-200);
  }
}

&:where(.dark, .dark *) {
  background-color: var(--color-stone-800);
  color: var(--color-stone-400);
}
`
};
export const Button3 = styled.button<{ $variant: keyof typeof Button3Variants }>`
border-radius: var(--radius-lg);
padding-inline: calc(var(--spacing) * 2);
padding-block: calc(var(--spacing) * 0.5);
font-size: 11px;
white-space: nowrap;
transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --cms-gradient-from, --cms-gradient-via, --cms-gradient-to;
transition-timing-function: var(--cms-ease, var(--default-transition-timing-function));
transition-duration: var(--cms-duration, var(--default-transition-duration));
${p => Button3Variants[p.$variant]}
`;

const Button4Variants = {
v0: css`
border-style: var(--cms-border-style);
border-width: 1px;
border-color: color-mix(in oklab, var(--color-indigo-300) 60%, transparent);
background-color: var(--color-indigo-100);
--cms-font-weight: var(--font-weight-medium);
font-weight: var(--font-weight-medium);
color: var(--color-indigo-700);

&:where(.dark, .dark *) {
  background-color: color-mix(in oklab, var(--color-indigo-950) 60%, transparent);
  color: var(--color-indigo-300);
}
`,
v1: css`
background-color: var(--color-stone-100);
color: var(--color-stone-600);

@media (hover: hover) {
  &:hover {
    background-color: var(--color-stone-200);
  }
}

&:where(.dark, .dark *) {
  background-color: var(--color-stone-800);
  color: var(--color-stone-400);
}
`
};
export const Button4 = styled.button<{ $variant: keyof typeof Button4Variants }>`
border-radius: var(--radius-lg);
padding-inline: calc(var(--spacing) * 2);
padding-block: calc(var(--spacing) * 0.5);
font-size: 11px;
white-space: nowrap;
transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --cms-gradient-from, --cms-gradient-via, --cms-gradient-to;
transition-timing-function: var(--cms-ease, var(--default-transition-timing-function));
transition-duration: var(--cms-duration, var(--default-transition-duration));
${p => Button4Variants[p.$variant]}
`;

export const Button5 = styled.button`
display: flex;
align-items: center;
gap: var(--spacing);
border-radius: var(--radius-lg);
background-color: var(--color-indigo-600);
padding-inline: calc(var(--spacing) * 2);
padding-block: calc(var(--spacing) * 0.5);
font-size: 11px;
color: var(--color-white)
`;

export const Button6 = styled.button`
margin-left: calc(var(--spacing) * 2);
display: flex;
flex-shrink: 0;
align-items: center;
gap: var(--spacing);
font-size: 11px;
color: var(--color-stone-500);

@media (hover: hover) {
  &:hover {
    color: var(--color-stone-800);
  }
  &:where(.dark, .dark *):hover {
    color: var(--color-stone-200);
  }
}
`;

export const ArrowUpDown = styled(BaseArrowUpDown)`
height: calc(var(--spacing) * 3);
width: calc(var(--spacing) * 3)
`;

export const Button7 = styled.button`
flex-shrink: 0;
border-radius: var(--radius-md);
background-color: var(--color-stone-100);
padding-inline: calc(var(--spacing) * 2);
padding-block: calc(var(--spacing) * 0.5);
font-size: 10px;
color: var(--color-stone-600);

@media (hover: hover) {
  &:hover {
    background-color: var(--color-stone-200);
  }
  &:where(.dark, .dark *):hover {
    background-color: var(--color-stone-700);
  }
}

&:where(.dark, .dark *) {
  background-color: color-mix(in oklab, var(--color-stone-800) 80%, transparent);
  color: var(--color-stone-400);
}
`;

export const Div9 = styled.div`
flex: 1;
padding-bottom:max(.75rem,env(safe-area-inset-bottom,0px));
overflow-y: auto;
:where(& > :not(:last-child)) {
  --cms-divide-y-reverse: 0;
  border-bottom-style: var(--cms-border-style);
  border-top-style: var(--cms-border-style);
  border-top-width: calc(1px * var(--cms-divide-y-reverse));
  border-bottom-width: calc(1px * calc(1 - var(--cms-divide-y-reverse)));
  border-color: var(--color-stone-100);
}

:where(&:where(.dark, .dark *) > :not(:last-child)) {
  border-color: color-mix(in oklab, var(--color-stone-800) 80%, transparent);
}
`;

export const Div10 = styled.div`
:where(& > :not(:last-child)) {
  --cms-space-y-reverse: 0;
  margin-block-start: calc(calc(var(--spacing) * 2) * var(--cms-space-y-reverse));
  margin-block-end: calc(calc(var(--spacing) * 2) * calc(1 - var(--cms-space-y-reverse)));
}

padding: calc(var(--spacing) * 8);
text-align: center;
color: var(--color-stone-400)
`;

export const Sparkles = styled(BaseSparkles)`
margin-inline: auto;
height: calc(var(--spacing) * 8);
width: calc(var(--spacing) * 8);
stroke-width: 1;
opacity: 60%
`;

export const P = styled.p`
font-size: var(--text-xs);
line-height: var(--cms-leading, var(--text-xs--line-height))
`;

const Div11Variants = {
v0: css`
border-left-style: var(--cms-border-style);
border-left-width: 3px;
border-color: var(--color-indigo-600);
background-color: color-mix(in oklab, var(--color-indigo-50) 70%, transparent);

&:where(.dark, .dark *) {
  background-color: color-mix(in oklab, var(--color-indigo-950) 40%, transparent);
}
`,
v1: css`
@media (hover: hover) {
  &:hover {
    background-color: var(--color-stone-50);
  }
  &:where(.dark, .dark *):hover {
    background-color: color-mix(in oklab, var(--color-stone-800) 50%, transparent);
  }
}
`
};
export const Div11 = styled.div<{ $variant: keyof typeof Div11Variants }>`
position: relative;
cursor: pointer;
padding: calc(var(--spacing) * 3.5);
transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --cms-gradient-from, --cms-gradient-via, --cms-gradient-to;
transition-timing-function: var(--cms-ease, var(--default-transition-timing-function));
transition-duration: var(--cms-duration, var(--default-transition-duration));
&:active {
  background-color: color-mix(in oklab, var(--color-stone-100) 70%, transparent);
};
&:where(.dark, .dark *):active {
  background-color: color-mix(in oklab, var(--color-stone-800) 60%, transparent);
}
${p => Div11Variants[p.$variant]}
`;

export const Div12 = styled.div`
margin-bottom: calc(var(--spacing) * 1.5);
display: flex;
align-items: center;
justify-content: space-between;
font-size: 11px;
color: var(--color-stone-400)
`;

export const Div13 = styled.div`
display: flex;
align-items: center;
gap: var(--spacing);
font-family: var(--font-mono)
`;

export const Clock = styled(BaseClock)`
height: calc(var(--spacing) * 3);
width: calc(var(--spacing) * 3);
color: var(--color-stone-400)
`;

export const Span2 = styled.span`
display: inline-flex;
align-items: center;
gap: var(--spacing);
border-radius: 0.25rem;
background-color: var(--color-amber-100);
padding-inline: calc(var(--spacing) * 1.5);
padding-block: calc(var(--spacing) * 0.5);
font-size: 10px;
--cms-font-weight: var(--font-weight-medium);
font-weight: var(--font-weight-medium);
color: var(--color-amber-700);

&:where(.dark, .dark *) {
  background-color: color-mix(in oklab, var(--color-amber-950) 80%, transparent);
  color: var(--color-amber-400);
}
`;

export const FileEdit = styled(BaseFileEdit)`
height: calc(var(--spacing) * 2.5);
width: calc(var(--spacing) * 2.5)
`;

export const Span3 = styled.span`
display: flex;
align-items: center;
gap: var(--spacing);
font-size: 10px;
color: var(--color-emerald-600);

&:where(.dark, .dark *) {
  color: var(--color-emerald-400);
}
`;

export const CheckCircle2 = styled(BaseCheckCircle2)`
height: calc(var(--spacing) * 2.5);
width: calc(var(--spacing) * 2.5)
`;

export const Div14 = styled.div`
margin-bottom: calc(var(--spacing) * 2);
font-family: var(--font-serif);
font-size: var(--text-xs);
line-height: var(--cms-leading, var(--text-xs--line-height));
--cms-leading: var(--leading-relaxed);
line-height: var(--leading-relaxed);
--cms-tracking: var(--tracking-wide);
letter-spacing: var(--tracking-wide);
overflow-wrap: break-word;
white-space: pre-wrap;
color: var(--color-stone-800);
-webkit-user-select: text;
user-select: text;

@media (width >= 40rem) {
  & {
    font-size: 13px;
  }
}

&:where(.dark, .dark *) {
  color: var(--color-stone-200);
}
`;

export const Span4 = styled.span`
color: var(--color-stone-400);
font-style: italic;

&:where(.dark, .dark *) {
  color: var(--color-stone-500);
}
`;

export const Div15 = styled.div`
margin-bottom: calc(var(--spacing) * 2);
display: flex;
align-items: center;
gap: calc(var(--spacing) * 1.5)
`;

export const Div16 = styled.div`
height: calc(var(--spacing) * 7);
width: calc(var(--spacing) * 7);
flex-shrink: 0;
overflow: hidden;
border-radius: var(--radius-md);
border-style: var(--cms-border-style);
border-width: 1px;
border-color: var(--color-stone-200);
background-color: var(--color-stone-200);

&:where(.dark, .dark *) {
  border-color: var(--color-stone-700);
  background-color: var(--color-stone-800);
}
`;

export const Img = styled.img`
height: 100%;
width: 100%;
object-fit: cover
`;

export const Div17 = styled.div`
display: flex;
height: 100%;
width: 100%;
align-items: center;
justify-content: center;
background-color: var(--color-stone-900);
font-size: 8px;
--cms-font-weight: var(--font-weight-bold);
font-weight: var(--font-weight-bold);
color: var(--color-white)
`;

export const Span5 = styled.span`
font-family: var(--font-mono);
font-size: 10px;
color: var(--color-stone-400)
`;

export const Div18 = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
padding-top: var(--spacing);
font-size: 11px;
color: var(--color-stone-400)
`;

export const Div19 = styled.div`
display: flex;
align-items: center;
gap: calc(var(--spacing) * 2);
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
overflow: hidden
`;

export const Span6 = styled.span`
display: flex;
align-items: center;
gap: calc(var(--spacing) * 0.5);
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
color: var(--color-stone-500)
`;

export const MapPin = styled(BaseMapPin)`
height: calc(var(--spacing) * 3);
width: calc(var(--spacing) * 3);
flex-shrink: 0;
color: var(--color-indigo-400)
`;

export const Span7 = styled.span`
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap
`;

export const Music2 = styled(BaseMusic2)`
height: calc(var(--spacing) * 3);
width: calc(var(--spacing) * 3);
flex-shrink: 0;
color: var(--color-indigo-400)
`;

export const Div20 = styled.div`
display: flex;
align-items: center;
gap: var(--spacing);
opacity: 90%;
transition-property: opacity;
transition-timing-function: var(--cms-ease, var(--default-transition-timing-function));
transition-duration: var(--cms-duration, var(--default-transition-duration));

@media (width >= 40rem) {
  & {
    opacity: 0%;
  }
  @media (hover: hover) {
    &:is(:where([data-style-group]):hover *) {
      opacity: 100%;
    }
  }
}
`;

export const Button8 = styled.button`
border-radius: var(--radius-md);
padding: calc(var(--spacing) * 1.5);
color: var(--color-stone-400);
transition-property: transform, translate, scale, rotate;
transition-timing-function: var(--cms-ease, var(--default-transition-timing-function));
transition-duration: var(--cms-duration, var(--default-transition-duration));

@media (hover: hover) {
  &:hover {
    background-color: color-mix(in oklab, var(--color-stone-200) 60%, transparent);
    color: var(--color-stone-700);
  }
  &:where(.dark, .dark *):hover {
    background-color: color-mix(in oklab, var(--color-stone-700) 60%, transparent);
    color: var(--color-stone-200);
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
    padding: var(--spacing);
  }
}
`;

export const Copy = styled(BaseCopy)`
height: calc(var(--spacing) * 3.5);
width: calc(var(--spacing) * 3.5);

@media (width >= 40rem) {
  & {
    height: calc(var(--spacing) * 3);
    width: calc(var(--spacing) * 3);
  }
}
`;

export const Button9 = styled.button`
border-radius: var(--radius-md);
padding: calc(var(--spacing) * 1.5);
color: var(--color-stone-400);
transition-property: transform, translate, scale, rotate;
transition-timing-function: var(--cms-ease, var(--default-transition-timing-function));
transition-duration: var(--cms-duration, var(--default-transition-duration));

@media (hover: hover) {
  &:hover {
    background-color: var(--color-rose-50);
    color: var(--color-rose-600);
  }
  &:where(.dark, .dark *):hover {
    background-color: color-mix(in oklab, var(--color-rose-950) 50%, transparent);
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
    padding: var(--spacing);
  }
}
`;

export const Trash2 = styled(BaseTrash2)`
height: calc(var(--spacing) * 3.5);
width: calc(var(--spacing) * 3.5);

@media (width >= 40rem) {
  & {
    height: calc(var(--spacing) * 3);
    width: calc(var(--spacing) * 3);
  }
}
`;

import styled, { css } from 'styled-components';
import { Layers as BaseLayers } from 'lucide-react';
import { AlertTriangle as BaseAlertTriangle } from 'lucide-react';
import { RotateCw as BaseRotateCw } from 'lucide-react';
import { Edit2 as BaseEdit2 } from 'lucide-react';
import { Play as BasePlay } from 'lucide-react';
import { ArrowLeftRight as BaseArrowLeftRight } from 'lucide-react';
import { Trash2 as BaseTrash2 } from 'lucide-react';
import { GripVertical as BaseGripVertical } from 'lucide-react';
import { Plus as BasePlus } from 'lucide-react';
import { Image as BaseImageIcon } from 'lucide-react';
import { Video as BaseVideoIcon } from 'lucide-react';

export const Div = styled.div`
:where(& > :not(:last-child)) {
  --cms-space-y-reverse: 0;
  margin-block-start: calc(calc(var(--spacing) * 3) * var(--cms-space-y-reverse));
  margin-block-end: calc(calc(var(--spacing) * 3) * calc(1 - var(--cms-space-y-reverse)));
}
`;

export const Div2 = styled.div`
display: flex;
align-items: center;
justify-content: space-between
`;

export const Label = styled.label`
display: flex;
align-items: center;
gap: calc(var(--spacing) * 1.5);
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

export const Span = styled.span`
--cms-font-weight: var(--font-weight-normal);
font-weight: var(--font-weight-normal);
color: var(--color-stone-400);

&:where(.dark, .dark *) {
  color: var(--color-stone-600);
}
`;

export const Button = styled.button`
display: flex;
align-items: center;
gap: var(--spacing);
font-size: var(--text-xs);
line-height: var(--cms-leading, var(--text-xs--line-height));
--cms-font-weight: var(--font-weight-medium);
font-weight: var(--font-weight-medium);
color: var(--color-indigo-600);

@media (hover: hover) {
  &:hover {
    color: var(--color-indigo-700);
  }
}

&:where(.dark, .dark *) {
  color: var(--color-indigo-400);
}
`;

export const Layers = styled(BaseLayers)`
height: calc(var(--spacing) * 3.5);
width: calc(var(--spacing) * 3.5)
`;

export const Div3 = styled.div`
display: grid;
grid-template-columns: repeat(3, minmax(0, 1fr));
gap: calc(var(--spacing) * 3)
`;

const Div4Variants = {
v0: css`
--cms-scale-x: 95%;
--cms-scale-y: 95%;
--cms-scale-z: 95%;
scale: var(--cms-scale-x) var(--cms-scale-y);
--cms-scale-x: 102%;
--cms-scale-y: 102%;
--cms-scale-z: 102%;
scale: var(--cms-scale-x) var(--cms-scale-y);
opacity: 30%;
--cms-ring-shadow: var(--cms-ring-inset,) 0 0 0 calc(2px + var(--cms-ring-offset-width)) var(--cms-ring-color, currentcolor);
--cms-ring-color: var(--color-indigo-500)
`,
v1: css`
--cms-scale-x: 95%;
--cms-scale-y: 95%;
--cms-scale-z: 95%;
scale: var(--cms-scale-x) var(--cms-scale-y);
opacity: 30%;

@media (hover: hover) {
  &:hover {
    --cms-shadow: 0 4px 6px -1px var(--cms-shadow-color, rgb(0 0 0 / 0.1)), 0 2px 4px -2px var(--cms-shadow-color, rgb(0 0 0 / 0.1));
    box-shadow: var(--cms-inset-shadow), var(--cms-inset-ring-shadow), var(--cms-ring-offset-shadow), var(--cms-ring-shadow), var(--cms-shadow);
  }
}
`,
v2: css`
--cms-scale-x: 102%;
--cms-scale-y: 102%;
--cms-scale-z: 102%;
scale: var(--cms-scale-x) var(--cms-scale-y);
--cms-ring-shadow: var(--cms-ring-inset,) 0 0 0 calc(2px + var(--cms-ring-offset-width)) var(--cms-ring-color, currentcolor);
--cms-ring-color: var(--color-indigo-500)
`,
v3: css`
@media (hover: hover) {
  &:hover {
    --cms-shadow: 0 4px 6px -1px var(--cms-shadow-color, rgb(0 0 0 / 0.1)), 0 2px 4px -2px var(--cms-shadow-color, rgb(0 0 0 / 0.1));
    box-shadow: var(--cms-inset-shadow), var(--cms-inset-ring-shadow), var(--cms-ring-offset-shadow), var(--cms-ring-shadow), var(--cms-shadow);
  }
}
`
};
export const Div4 = styled.div<{ $variant: keyof typeof Div4Variants }>`
position: relative;
aspect-ratio: 1 / 1;
cursor: pointer;
overflow: hidden;
border-radius: var(--radius-xl);
border-style: var(--cms-border-style);
border-width: 1px;
border-color: var(--color-stone-200);
background-color: var(--color-stone-100);
--cms-shadow: 0 1px 3px 0 var(--cms-shadow-color, rgb(0 0 0 / 0.1)), 0 1px 2px -1px var(--cms-shadow-color, rgb(0 0 0 / 0.1));
box-shadow: var(--cms-inset-shadow), var(--cms-inset-ring-shadow), var(--cms-ring-offset-shadow), var(--cms-ring-shadow), var(--cms-shadow);
box-shadow: var(--cms-inset-shadow), var(--cms-inset-ring-shadow), var(--cms-ring-offset-shadow), var(--cms-ring-shadow), var(--cms-shadow);
transition-property: all;
transition-timing-function: var(--cms-ease, var(--default-transition-timing-function));
transition-duration: var(--cms-duration, var(--default-transition-duration));
--cms-duration: 200ms;
transition-duration: 200ms;
-webkit-user-select: none;
user-select: none;
&:where(.dark, .dark *) {
  border-color: color-mix(in oklab, var(--color-stone-700) 80%, transparent);
  background-color: color-mix(in oklab, var(--color-stone-800) 80%, transparent);
}
${p => Div4Variants[p.$variant]}
`;

export const Div5 = styled.div`
display: flex;
height: 100%;
width: 100%;
flex-direction: column;
align-items: center;
justify-content: center;
background-color: color-mix(in oklab, var(--color-stone-200) 50%, transparent);
padding: calc(var(--spacing) * 2);
text-align: center;

&:where(.dark, .dark *) {
  background-color: var(--color-stone-800);
}
`;

export const AlertTriangle = styled(BaseAlertTriangle)`
margin-bottom: var(--spacing);
height: calc(var(--spacing) * 6);
width: calc(var(--spacing) * 6);
color: var(--color-amber-500)
`;

export const Span2 = styled.span`
font-size: 10px;
--cms-leading: var(--leading-tight);
line-height: var(--leading-tight);
color: var(--color-stone-600);

&:where(.dark, .dark *) {
  color: var(--color-stone-400);
}
`;

export const Div6 = styled.div`
margin-top: calc(var(--spacing) * 2);
display: flex;
gap: calc(var(--spacing) * 1.5)
`;

export const Button2 = styled.button`
border-radius: 0.25rem;
background-color: var(--color-white);
padding: var(--spacing);
color: var(--color-stone-700);

@media (hover: hover) {
  &:hover {
    background-color: var(--color-stone-50);
  }
}

&:where(.dark, .dark *) {
  background-color: var(--color-stone-700);
  color: var(--color-stone-200);
}
`;

export const RotateCw = styled(BaseRotateCw)`
height: calc(var(--spacing) * 3);
width: calc(var(--spacing) * 3)
`;

export const Edit2 = styled(BaseEdit2)`
height: calc(var(--spacing) * 3);
width: calc(var(--spacing) * 3)
`;

export const Img = styled.img`
height: 100%;
width: 100%;
object-fit: cover;
transition-property: transform, translate, scale, rotate;
transition-timing-function: var(--cms-ease, var(--default-transition-timing-function));
transition-duration: var(--cms-duration, var(--default-transition-duration));
--cms-duration: 300ms;
transition-duration: 300ms;

@media (hover: hover) {
  &:is(:where([data-style-group]):hover *) {
    --cms-scale-x: 105%;
    --cms-scale-y: 105%;
    --cms-scale-z: 105%;
    scale: var(--cms-scale-x) var(--cms-scale-y);
  }
}
`;

export const Div7 = styled.div`
position: relative;
display: flex;
height: 100%;
width: 100%;
align-items: center;
justify-content: center;
background-color: var(--color-stone-900)
`;

export const Video = styled.video`
height: 100%;
width: 100%;
object-fit: cover
`;

export const Div8 = styled.div`
position: absolute;
inset: 0px;
display: flex;
align-items: center;
justify-content: center;
background-color: color-mix(in oklab, var(--color-black) 25%, transparent)
`;

export const Div9 = styled.div`
display: flex;
height: calc(var(--spacing) * 8);
width: calc(var(--spacing) * 8);
align-items: center;
justify-content: center;
border-radius: calc(infinity * 1px);
background-color: color-mix(in oklab, var(--color-black) 60%, transparent);
color: var(--color-white);
--cms-shadow: 0 10px 15px -3px var(--cms-shadow-color, rgb(0 0 0 / 0.1)), 0 4px 6px -4px var(--cms-shadow-color, rgb(0 0 0 / 0.1));
box-shadow: var(--cms-inset-shadow), var(--cms-inset-ring-shadow), var(--cms-ring-offset-shadow), var(--cms-ring-shadow), var(--cms-shadow);
--cms-backdrop-blur: blur(var(--blur-xs));
-webkit-backdrop-filter: var(--cms-backdrop-blur,) var(--cms-backdrop-brightness,) var(--cms-backdrop-contrast,) var(--cms-backdrop-grayscale,) var(--cms-backdrop-hue-rotate,) var(--cms-backdrop-invert,) var(--cms-backdrop-opacity,) var(--cms-backdrop-saturate,) var(--cms-backdrop-sepia,);
backdrop-filter: var(--cms-backdrop-blur,) var(--cms-backdrop-brightness,) var(--cms-backdrop-contrast,) var(--cms-backdrop-grayscale,) var(--cms-backdrop-hue-rotate,) var(--cms-backdrop-invert,) var(--cms-backdrop-opacity,) var(--cms-backdrop-saturate,) var(--cms-backdrop-sepia,)
`;

export const Play = styled(BasePlay)`
height: calc(var(--spacing) * 4);
width: calc(var(--spacing) * 4);
--cms-translate-x: calc(var(--spacing) * 0.5);
translate: var(--cms-translate-x) var(--cms-translate-y);
fill: var(--color-white)
`;

export const Span3 = styled.span`
position: absolute;
right: calc(var(--spacing) * 1.5);
bottom: calc(var(--spacing) * 1.5);
border-radius: 0.25rem;
background-color: color-mix(in oklab, var(--color-black) 70%, transparent);
padding-inline: calc(var(--spacing) * 1.5);
padding-block: calc(var(--spacing) * 0.5);
font-size: 10px;
--cms-font-weight: var(--font-weight-bold);
font-weight: var(--font-weight-bold);
color: var(--color-white)
`;

export const Div10 = styled.div`
position: absolute;
top: calc(var(--spacing) * 1.5);
left: calc(var(--spacing) * 1.5);
border-radius: var(--radius-md);
background-color: color-mix(in oklab, var(--color-black) 50%, transparent);
padding-inline: calc(var(--spacing) * 1.5);
padding-block: calc(var(--spacing) * 0.5);
font-family: var(--font-mono);
font-size: 10px;
color: color-mix(in oklab, var(--color-white) 90%, transparent);
--cms-backdrop-blur: blur(var(--blur-xs));
-webkit-backdrop-filter: var(--cms-backdrop-blur,) var(--cms-backdrop-brightness,) var(--cms-backdrop-contrast,) var(--cms-backdrop-grayscale,) var(--cms-backdrop-hue-rotate,) var(--cms-backdrop-invert,) var(--cms-backdrop-opacity,) var(--cms-backdrop-saturate,) var(--cms-backdrop-sepia,);
backdrop-filter: var(--cms-backdrop-blur,) var(--cms-backdrop-brightness,) var(--cms-backdrop-contrast,) var(--cms-backdrop-grayscale,) var(--cms-backdrop-hue-rotate,) var(--cms-backdrop-invert,) var(--cms-backdrop-opacity,) var(--cms-backdrop-saturate,) var(--cms-backdrop-sepia,)
`;

export const Div11 = styled.div`
position: absolute;
top: calc(var(--spacing) * 1.5);
right: calc(var(--spacing) * 1.5);
z-index: 10;
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

export const Button3 = styled.button`
display: flex;
height: calc(var(--spacing) * 6);
width: calc(var(--spacing) * 6);
align-items: center;
justify-content: center;
border-radius: var(--radius-md);
background-color: color-mix(in oklab, var(--color-black) 60%, transparent);
color: var(--color-white);
--cms-backdrop-blur: blur(var(--blur-xs));
-webkit-backdrop-filter: var(--cms-backdrop-blur,) var(--cms-backdrop-brightness,) var(--cms-backdrop-contrast,) var(--cms-backdrop-grayscale,) var(--cms-backdrop-hue-rotate,) var(--cms-backdrop-invert,) var(--cms-backdrop-opacity,) var(--cms-backdrop-saturate,) var(--cms-backdrop-sepia,);
backdrop-filter: var(--cms-backdrop-blur,) var(--cms-backdrop-brightness,) var(--cms-backdrop-contrast,) var(--cms-backdrop-grayscale,) var(--cms-backdrop-hue-rotate,) var(--cms-backdrop-invert,) var(--cms-backdrop-opacity,) var(--cms-backdrop-saturate,) var(--cms-backdrop-sepia,);
transition-property: transform, translate, scale, rotate;
transition-timing-function: var(--cms-ease, var(--default-transition-timing-function));
transition-duration: var(--cms-duration, var(--default-transition-duration));

@media (hover: hover) {
  &:hover {
    background-color: color-mix(in oklab, var(--color-black) 90%, transparent);
  }
}

&:active {
  --cms-scale-x: 90%;
  --cms-scale-y: 90%;
  --cms-scale-z: 90%;
  scale: var(--cms-scale-x) var(--cms-scale-y);
}
`;

export const ArrowLeftRight = styled(BaseArrowLeftRight)`
height: calc(var(--spacing) * 3);
width: calc(var(--spacing) * 3)
`;

export const Button4 = styled.button`
display: flex;
height: calc(var(--spacing) * 6);
width: calc(var(--spacing) * 6);
align-items: center;
justify-content: center;
border-radius: var(--radius-md);
background-color: color-mix(in oklab, var(--color-rose-600) 90%, transparent);
color: var(--color-white);
--cms-shadow: 0 1px 2px 0 var(--cms-shadow-color, rgb(0 0 0 / 0.05));
box-shadow: var(--cms-inset-shadow), var(--cms-inset-ring-shadow), var(--cms-ring-offset-shadow), var(--cms-ring-shadow), var(--cms-shadow);
--cms-backdrop-blur: blur(var(--blur-xs));
-webkit-backdrop-filter: var(--cms-backdrop-blur,) var(--cms-backdrop-brightness,) var(--cms-backdrop-contrast,) var(--cms-backdrop-grayscale,) var(--cms-backdrop-hue-rotate,) var(--cms-backdrop-invert,) var(--cms-backdrop-opacity,) var(--cms-backdrop-saturate,) var(--cms-backdrop-sepia,);
backdrop-filter: var(--cms-backdrop-blur,) var(--cms-backdrop-brightness,) var(--cms-backdrop-contrast,) var(--cms-backdrop-grayscale,) var(--cms-backdrop-hue-rotate,) var(--cms-backdrop-invert,) var(--cms-backdrop-opacity,) var(--cms-backdrop-saturate,) var(--cms-backdrop-sepia,);
transition-property: transform, translate, scale, rotate;
transition-timing-function: var(--cms-ease, var(--default-transition-timing-function));
transition-duration: var(--cms-duration, var(--default-transition-duration));

@media (hover: hover) {
  &:hover {
    background-color: var(--color-rose-600);
  }
}

&:active {
  --cms-scale-x: 90%;
  --cms-scale-y: 90%;
  --cms-scale-z: 90%;
  scale: var(--cms-scale-x) var(--cms-scale-y);
}
`;

export const Trash2 = styled(BaseTrash2)`
height: calc(var(--spacing) * 3);
width: calc(var(--spacing) * 3)
`;

export const Div12 = styled.div`
pointer-events: none;
position: absolute;
inset: 0px;
display: flex;
flex-direction: column;
justify-content: space-between;
background-color: color-mix(in oklab, var(--color-black) 30%, transparent);
padding: calc(var(--spacing) * 1.5);
opacity: 0%;
transition-property: opacity;
transition-timing-function: var(--cms-ease, var(--default-transition-timing-function));
transition-duration: var(--cms-duration, var(--default-transition-duration));

@media (width >= 40rem) {
  @media (hover: hover) {
    &:is(:where([data-style-group]):hover *) {
      opacity: 100%;
    }
  }
}
`;

export const Div13 = styled.div`
display: flex;
align-items: center
`;

export const Div14 = styled.div`
pointer-events: auto;
cursor: grab;
border-radius: var(--radius-md);
background-color: color-mix(in oklab, var(--color-black) 50%, transparent);
padding: var(--spacing);
color: var(--color-white);

&:active {
  cursor: grabbing;
}
`;

export const GripVertical = styled(BaseGripVertical)`
height: calc(var(--spacing) * 3.5);
width: calc(var(--spacing) * 3.5)
`;

export const Div15 = styled.div`
padding-bottom: var(--spacing);
text-align: center;
font-size: 11px;
--cms-font-weight: var(--font-weight-medium);
font-weight: var(--font-weight-medium);
color: color-mix(in oklab, var(--color-white) 90%, transparent);
--cms-drop-shadow-size: drop-shadow(0 1px 2px var(--cms-drop-shadow-color, rgb(0 0 0 / 0.1))) drop-shadow(0 1px 1px var(--cms-drop-shadow-color, rgb(0 0 0 / 0.06)));
--cms-drop-shadow: drop-shadow(0 1px 2px rgb(0 0 0 / 0.1)) drop-shadow( 0 1px 1px rgb(0 0 0 / 0.06));
filter: var(--cms-blur,) var(--cms-brightness,) var(--cms-contrast,) var(--cms-grayscale,) var(--cms-hue-rotate,) var(--cms-invert,) var(--cms-saturate,) var(--cms-sepia,) var(--cms-drop-shadow,)
`;

export const Button5 = styled.button`
display: flex;
aspect-ratio: 1 / 1;
flex-direction: column;
align-items: center;
justify-content: center;
gap: var(--spacing);
border-radius: var(--radius-xl);
border-style: var(--cms-border-style);
border-width: 2px;
--cms-border-style: dashed;
border-style: dashed;
border-color: var(--color-stone-300);
background-color: color-mix(in oklab, var(--color-stone-50) 50%, transparent);
color: var(--color-stone-500);
transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --cms-gradient-from, --cms-gradient-via, --cms-gradient-to;
transition-timing-function: var(--cms-ease, var(--default-transition-timing-function));
transition-duration: var(--cms-duration, var(--default-transition-duration));

@media (hover: hover) {
  &:hover {
    border-color: var(--color-indigo-500);
    background-color: color-mix(in oklab, var(--color-indigo-50) 30%, transparent);
    color: var(--color-indigo-600);
  }
  &:where(.dark, .dark *):hover {
    border-color: var(--color-indigo-400);
    background-color: color-mix(in oklab, var(--color-indigo-950) 20%, transparent);
    color: var(--color-indigo-400);
  }
}

&:active {
  --cms-scale-x: 95%;
  --cms-scale-y: 95%;
  --cms-scale-z: 95%;
  scale: var(--cms-scale-x) var(--cms-scale-y);
}

&:where(.dark, .dark *) {
  border-color: var(--color-stone-700);
  background-color: color-mix(in oklab, var(--color-stone-900) 50%, transparent);
  color: var(--color-stone-400);
}
`;

export const Div16 = styled.div`
display: flex;
height: calc(var(--spacing) * 8);
width: calc(var(--spacing) * 8);
align-items: center;
justify-content: center;
border-radius: calc(infinity * 1px);
background-color: color-mix(in oklab, var(--color-stone-200) 70%, transparent);

@media (width >= 40rem) {
  & {
    height: calc(var(--spacing) * 9);
    width: calc(var(--spacing) * 9);
  }
}

&:where(.dark, .dark *) {
  background-color: var(--color-stone-800);
}
`;

export const Plus = styled(BasePlus)`
height: calc(var(--spacing) * 4);
width: calc(var(--spacing) * 4);

@media (width >= 40rem) {
  & {
    height: calc(var(--spacing) * 5);
    width: calc(var(--spacing) * 5);
  }
}
`;

export const Span4 = styled.span`
font-size: 11px;
--cms-font-weight: var(--font-weight-medium);
font-weight: var(--font-weight-medium);

@media (width >= 40rem) {
  & {
    font-size: var(--text-xs);
    line-height: var(--cms-leading, var(--text-xs--line-height));
  }
}
`;

export const Div17 = styled.div`
position: fixed;
inset: 0px;
z-index: 50;
display: flex;
align-items: center;
justify-content: center;
background-color: color-mix(in oklab, var(--color-black) 60%, transparent);
padding: calc(var(--spacing) * 4);
--cms-backdrop-blur: blur(var(--blur-xs));
-webkit-backdrop-filter: var(--cms-backdrop-blur,) var(--cms-backdrop-brightness,) var(--cms-backdrop-contrast,) var(--cms-backdrop-grayscale,) var(--cms-backdrop-hue-rotate,) var(--cms-backdrop-invert,) var(--cms-backdrop-opacity,) var(--cms-backdrop-saturate,) var(--cms-backdrop-sepia,);
backdrop-filter: var(--cms-backdrop-blur,) var(--cms-backdrop-brightness,) var(--cms-backdrop-contrast,) var(--cms-backdrop-grayscale,) var(--cms-backdrop-hue-rotate,) var(--cms-backdrop-invert,) var(--cms-backdrop-opacity,) var(--cms-backdrop-saturate,) var(--cms-backdrop-sepia,)
`;

export const Div18 = styled.div`
width: 100%;
max-width: var(--container-sm);
border-radius: var(--radius-2xl);
border-style: var(--cms-border-style);
border-width: 1px;
border-color: var(--color-stone-200);
background-color: var(--color-white);
padding: calc(var(--spacing) * 5);
--cms-shadow: 0 25px 50px -12px var(--cms-shadow-color, rgb(0 0 0 / 0.25));
box-shadow: var(--cms-inset-shadow), var(--cms-inset-ring-shadow), var(--cms-ring-offset-shadow), var(--cms-ring-shadow), var(--cms-shadow);

:where(& > :not(:last-child)) {
  --cms-space-y-reverse: 0;
  margin-block-start: calc(calc(var(--spacing) * 4) * var(--cms-space-y-reverse));
  margin-block-end: calc(calc(var(--spacing) * 4) * calc(1 - var(--cms-space-y-reverse)));
}

&:where(.dark, .dark *) {
  border-color: var(--color-stone-800);
  background-color: var(--color-stone-900);
}
`;

export const H4 = styled.h4`
font-size: var(--text-sm);
line-height: var(--cms-leading, var(--text-sm--line-height));
--cms-font-weight: var(--font-weight-semibold);
font-weight: var(--font-weight-semibold);
color: var(--color-stone-900);

&:where(.dark, .dark *) {
  color: var(--color-stone-100);
}
`;

export const Form = styled.form`
:where(& > :not(:last-child)) {
  --cms-space-y-reverse: 0;
  margin-block-start: calc(calc(var(--spacing) * 3.5) * var(--cms-space-y-reverse));
  margin-block-end: calc(calc(var(--spacing) * 3.5) * calc(1 - var(--cms-space-y-reverse)));
}
`;

export const Div19 = styled.div`
display: flex;
gap: calc(var(--spacing) * 2)
`;

const Button6Variants = {
v0: css`
background-color: var(--color-indigo-600);
--cms-font-weight: var(--font-weight-medium);
font-weight: var(--font-weight-medium);
color: var(--color-white);
--cms-shadow: 0 1px 2px 0 var(--cms-shadow-color, rgb(0 0 0 / 0.05));
box-shadow: var(--cms-inset-shadow), var(--cms-inset-ring-shadow), var(--cms-ring-offset-shadow), var(--cms-ring-shadow), var(--cms-shadow)
`,
v1: css`
background-color: var(--color-stone-100);
color: var(--color-stone-600);

&:where(.dark, .dark *) {
  background-color: var(--color-stone-800);
  color: var(--color-stone-400);
}
`
};
export const Button6 = styled.button<{ $variant: keyof typeof Button6Variants }>`
display: flex;
flex: 1;
align-items: center;
justify-content: center;
gap: calc(var(--spacing) * 1.5);
border-radius: var(--radius-xl);
padding-block: calc(var(--spacing) * 2);
font-size: var(--text-xs);
line-height: var(--cms-leading, var(--text-xs--line-height));
transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --cms-gradient-from, --cms-gradient-via, --cms-gradient-to;
transition-timing-function: var(--cms-ease, var(--default-transition-timing-function));
transition-duration: var(--cms-duration, var(--default-transition-duration));
${p => Button6Variants[p.$variant]}
`;

export const ImageIcon = styled(BaseImageIcon)`
height: calc(var(--spacing) * 3.5);
width: calc(var(--spacing) * 3.5)
`;

export const VideoIcon = styled(BaseVideoIcon)`
height: calc(var(--spacing) * 3.5);
width: calc(var(--spacing) * 3.5)
`;

export const Label2 = styled.label`
margin-bottom: var(--spacing);
display: block;
font-size: 11px;
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
border-color: var(--color-stone-300);
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
  border-color: var(--color-stone-700);
  background-color: var(--color-stone-950);
  color: var(--color-stone-100);
}
`;

export const Div20 = styled.div`
display: flex;
justify-content: flex-end;
gap: calc(var(--spacing) * 2);
padding-top: var(--spacing)
`;

export const Button7 = styled.button`
border-radius: var(--radius-xl);
padding-inline: calc(var(--spacing) * 3.5);
padding-block: calc(var(--spacing) * 2);
font-size: var(--text-xs);
line-height: var(--cms-leading, var(--text-xs--line-height));
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

export const Button8 = styled.button`
border-radius: var(--radius-xl);
background-color: var(--color-indigo-600);
padding-inline: calc(var(--spacing) * 4);
padding-block: calc(var(--spacing) * 2);
font-size: var(--text-xs);
line-height: var(--cms-leading, var(--text-xs--line-height));
--cms-font-weight: var(--font-weight-medium);
font-weight: var(--font-weight-medium);
color: var(--color-white);
--cms-shadow: 0 1px 2px 0 var(--cms-shadow-color, rgb(0 0 0 / 0.05));
box-shadow: var(--cms-inset-shadow), var(--cms-inset-ring-shadow), var(--cms-ring-offset-shadow), var(--cms-ring-shadow), var(--cms-shadow);

@media (hover: hover) {
  &:hover {
    background-color: var(--color-indigo-500);
  }
}

&:disabled {
  opacity: 50%;
}
`;

export const Div21 = styled.div`
position: fixed;
inset: 0px;
z-index: 50;
display: flex;
align-items: center;
justify-content: center;
background-color: color-mix(in oklab, var(--color-black) 60%, transparent);
padding: calc(var(--spacing) * 4);
--cms-backdrop-blur: blur(var(--blur-xs));
-webkit-backdrop-filter: var(--cms-backdrop-blur,) var(--cms-backdrop-brightness,) var(--cms-backdrop-contrast,) var(--cms-backdrop-grayscale,) var(--cms-backdrop-hue-rotate,) var(--cms-backdrop-invert,) var(--cms-backdrop-opacity,) var(--cms-backdrop-saturate,) var(--cms-backdrop-sepia,);
backdrop-filter: var(--cms-backdrop-blur,) var(--cms-backdrop-brightness,) var(--cms-backdrop-contrast,) var(--cms-backdrop-grayscale,) var(--cms-backdrop-hue-rotate,) var(--cms-backdrop-invert,) var(--cms-backdrop-opacity,) var(--cms-backdrop-saturate,) var(--cms-backdrop-sepia,)
`;

export const Div22 = styled.div`
width: 100%;
max-width: var(--container-md);
border-radius: var(--radius-2xl);
border-style: var(--cms-border-style);
border-width: 1px;
border-color: var(--color-stone-200);
background-color: var(--color-white);
padding: calc(var(--spacing) * 5);
--cms-shadow: 0 25px 50px -12px var(--cms-shadow-color, rgb(0 0 0 / 0.25));
box-shadow: var(--cms-inset-shadow), var(--cms-inset-ring-shadow), var(--cms-ring-offset-shadow), var(--cms-ring-shadow), var(--cms-shadow);

:where(& > :not(:last-child)) {
  --cms-space-y-reverse: 0;
  margin-block-start: calc(calc(var(--spacing) * 4) * var(--cms-space-y-reverse));
  margin-block-end: calc(calc(var(--spacing) * 4) * calc(1 - var(--cms-space-y-reverse)));
}

&:where(.dark, .dark *) {
  border-color: var(--color-stone-800);
  background-color: var(--color-stone-900);
}
`;

export const Form2 = styled.form`
:where(& > :not(:last-child)) {
  --cms-space-y-reverse: 0;
  margin-block-start: calc(calc(var(--spacing) * 3) * var(--cms-space-y-reverse));
  margin-block-end: calc(calc(var(--spacing) * 3) * calc(1 - var(--cms-space-y-reverse)));
}
`;

export const Input2 = styled.input`
width: 100%;
border-radius: var(--radius-xl);
border-style: var(--cms-border-style);
border-width: 1px;
border-color: var(--color-stone-300);
background-color: var(--color-stone-50);
padding: calc(var(--spacing) * 2.5);
font-family: var(--font-mono);
font-size: var(--text-sm);
line-height: var(--cms-leading, var(--text-sm--line-height));
color: var(--color-stone-900);
--cms-outline-style: none;
outline-style: none;

&:focus {
  --cms-ring-shadow: var(--cms-ring-inset,) 0 0 0 calc(2px + var(--cms-ring-offset-width)) var(--cms-ring-color, currentcolor);
  box-shadow: var(--cms-inset-shadow), var(--cms-inset-ring-shadow), var(--cms-ring-offset-shadow), var(--cms-ring-shadow), var(--cms-shadow);
  --cms-ring-color: var(--color-indigo-500);
}

&:where(.dark, .dark *) {
  border-color: var(--color-stone-700);
  background-color: var(--color-stone-950);
  color: var(--color-stone-100);
}
`;

export const Div23 = styled.div`
display: flex;
justify-content: flex-end;
gap: calc(var(--spacing) * 2)
`;

export const Button9 = styled.button`
border-radius: var(--radius-lg);
padding-inline: calc(var(--spacing) * 3);
padding-block: calc(var(--spacing) * 1.5);
font-size: var(--text-xs);
line-height: var(--cms-leading, var(--text-xs--line-height));
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

export const Button10 = styled.button`
border-radius: var(--radius-lg);
background-color: var(--color-indigo-600);
padding-inline: calc(var(--spacing) * 3);
padding-block: calc(var(--spacing) * 1.5);
font-size: var(--text-xs);
line-height: var(--cms-leading, var(--text-xs--line-height));
--cms-font-weight: var(--font-weight-medium);
font-weight: var(--font-weight-medium);
color: var(--color-white);

@media (hover: hover) {
  &:hover {
    background-color: var(--color-indigo-500);
  }
}
`;

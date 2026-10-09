import styled from 'styled-components';
import { Music2 as BaseMusic2 } from 'lucide-react';
import { Edit2 as BaseEdit2 } from 'lucide-react';
import { Trash2 as BaseTrash2 } from 'lucide-react';
import { Plus as BasePlus } from 'lucide-react';
import { ExternalLink as BaseExternalLink } from 'lucide-react';

export const Div = styled.div`
:where(& > :not(:last-child)) {
  --cms-space-y-reverse: 0;
  margin-block-start: calc(calc(var(--spacing) * 2) * var(--cms-space-y-reverse));
  margin-block-end: calc(calc(var(--spacing) * 2) * calc(1 - var(--cms-space-y-reverse)));
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

export const Music2 = styled(BaseMusic2)`
height: calc(var(--spacing) * 3.5);
width: calc(var(--spacing) * 3.5);
color: var(--color-indigo-500)
`;

export const Div3 = styled.div`
display: flex;
align-items: center;
gap: calc(var(--spacing) * 1.5)
`;

export const Button = styled.button`
display: flex;
align-items: center;
gap: var(--spacing);
font-size: var(--text-xs);
line-height: var(--cms-leading, var(--text-xs--line-height));
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

export const Edit2 = styled(BaseEdit2)`
height: calc(var(--spacing) * 3);
width: calc(var(--spacing) * 3)
`;

export const Span = styled.span`
color: var(--color-stone-300);

&:where(.dark, .dark *) {
  color: var(--color-stone-700);
}
`;

export const Button2 = styled.button`
display: flex;
align-items: center;
gap: var(--spacing);
font-size: var(--text-xs);
line-height: var(--cms-leading, var(--text-xs--line-height));
color: var(--color-rose-500);

@media (hover: hover) {
  &:hover {
    color: var(--color-rose-600);
  }
}
`;

export const Trash2 = styled(BaseTrash2)`
height: calc(var(--spacing) * 3);
width: calc(var(--spacing) * 3)
`;

export const Button3 = styled.button`
display: flex;
width: 100%;
align-items: center;
justify-content: center;
gap: calc(var(--spacing) * 1.5);
border-radius: var(--radius-xl);
border-style: var(--cms-border-style);
border-width: 1px;
--cms-border-style: dashed;
border-style: dashed;
border-color: var(--color-stone-300);
padding-inline: calc(var(--spacing) * 3);
padding-block: calc(var(--spacing) * 2.5);
font-size: var(--text-xs);
line-height: var(--cms-leading, var(--text-xs--line-height));
color: var(--color-stone-500);
transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --cms-gradient-from, --cms-gradient-via, --cms-gradient-to;
transition-timing-function: var(--cms-ease, var(--default-transition-timing-function));
transition-duration: var(--cms-duration, var(--default-transition-duration));

@media (hover: hover) {
  &:hover {
    border-color: var(--color-indigo-500);
    color: var(--color-indigo-600);
  }
  &:where(.dark, .dark *):hover {
    border-color: var(--color-indigo-400);
    color: var(--color-indigo-400);
  }
}

&:where(.dark, .dark *) {
  border-color: var(--color-stone-700);
  color: var(--color-stone-400);
}
`;

export const Plus = styled(BasePlus)`
height: calc(var(--spacing) * 4);
width: calc(var(--spacing) * 4)
`;

export const Form = styled.form`
:where(& > :not(:last-child)) {
  --cms-space-y-reverse: 0;
  margin-block-start: calc(calc(var(--spacing) * 3) * var(--cms-space-y-reverse));
  margin-block-end: calc(calc(var(--spacing) * 3) * calc(1 - var(--cms-space-y-reverse)));
}

border-radius: var(--radius-xl);
border-style: var(--cms-border-style);
border-width: 1px;
border-color: var(--color-indigo-200);
background-color: color-mix(in oklab, var(--color-indigo-50) 20%, transparent);
padding: calc(var(--spacing) * 3.5);

&:where(.dark, .dark *) {
  border-color: color-mix(in oklab, var(--color-indigo-900) 60%, transparent);
  background-color: color-mix(in oklab, var(--color-indigo-950) 20%, transparent);
}
`;

export const Div4 = styled.div`
display: grid;
grid-template-columns: repeat(1, minmax(0, 1fr));
gap: calc(var(--spacing) * 2.5);

@media (width >= 40rem) {
  & {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
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
border-radius: var(--radius-lg);
border-style: var(--cms-border-style);
border-width: 1px;
border-color: var(--color-stone-300);
background-color: var(--color-white);
padding: calc(var(--spacing) * 2.5);
font-size: var(--text-sm);
line-height: var(--cms-leading, var(--text-sm--line-height));
color: var(--color-stone-900);

&:focus {
  --cms-ring-shadow: var(--cms-ring-inset,) 0 0 0 calc(1px + var(--cms-ring-offset-width)) var(--cms-ring-color, currentcolor);
  box-shadow: var(--cms-inset-shadow), var(--cms-inset-ring-shadow), var(--cms-ring-offset-shadow), var(--cms-ring-shadow), var(--cms-shadow);
  --cms-ring-color: var(--color-indigo-500);
  --cms-outline-style: none;
  outline-style: none;
}

@media (width >= 40rem) {
  & {
    padding: calc(var(--spacing) * 2);
    font-size: var(--text-xs);
    line-height: var(--cms-leading, var(--text-xs--line-height));
  }
}

&:where(.dark, .dark *) {
  border-color: var(--color-stone-700);
  background-color: var(--color-stone-900);
  color: var(--color-stone-100);
}
`;

export const Input2 = styled.input`
width: 100%;
border-radius: var(--radius-lg);
border-style: var(--cms-border-style);
border-width: 1px;
border-color: var(--color-stone-300);
background-color: var(--color-white);
padding: calc(var(--spacing) * 2.5);
font-family: var(--font-mono);
font-size: var(--text-sm);
line-height: var(--cms-leading, var(--text-sm--line-height));
color: var(--color-stone-900);

&:focus {
  --cms-ring-shadow: var(--cms-ring-inset,) 0 0 0 calc(1px + var(--cms-ring-offset-width)) var(--cms-ring-color, currentcolor);
  box-shadow: var(--cms-inset-shadow), var(--cms-inset-ring-shadow), var(--cms-ring-offset-shadow), var(--cms-ring-shadow), var(--cms-shadow);
  --cms-ring-color: var(--color-indigo-500);
  --cms-outline-style: none;
  outline-style: none;
}

@media (width >= 40rem) {
  & {
    padding: calc(var(--spacing) * 2);
    font-size: var(--text-xs);
    line-height: var(--cms-leading, var(--text-xs--line-height));
  }
}

&:where(.dark, .dark *) {
  border-color: var(--color-stone-700);
  background-color: var(--color-stone-900);
  color: var(--color-stone-100);
}
`;

export const Div5 = styled.div`
display: flex;
justify-content: flex-end;
gap: calc(var(--spacing) * 2);
padding-top: var(--spacing)
`;

export const Button4 = styled.button`
border-radius: var(--radius-lg);
padding-inline: calc(var(--spacing) * 3.5);
padding-block: calc(var(--spacing) * 1.5);
font-size: var(--text-xs);
line-height: var(--cms-leading, var(--text-xs--line-height));
color: var(--color-stone-600);

@media (hover: hover) {
  &:hover {
    background-color: color-mix(in oklab, var(--color-stone-200) 50%, transparent);
  }
}

&:where(.dark, .dark *) {
  color: var(--color-stone-400);
}
`;

export const Button5 = styled.button`
border-radius: var(--radius-lg);
background-color: var(--color-indigo-600);
padding-inline: calc(var(--spacing) * 4);
padding-block: calc(var(--spacing) * 1.5);
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
`;

export const Div6 = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
border-radius: var(--radius-xl);
border-style: var(--cms-border-style);
border-width: 1px;
border-color: var(--color-stone-200);
background-color: var(--color-stone-50);
padding: calc(var(--spacing) * 3);

&:where(.dark, .dark *) {
  border-color: var(--color-stone-800);
  background-color: color-mix(in oklab, var(--color-stone-900) 60%, transparent);
}
`;

export const Div7 = styled.div`
display: flex;
align-items: center;
gap: calc(var(--spacing) * 2.5);
overflow: hidden
`;

export const Div8 = styled.div`
display: flex;
height: calc(var(--spacing) * 8);
width: calc(var(--spacing) * 8);
flex-shrink: 0;
align-items: center;
justify-content: center;
border-radius: var(--radius-lg);
background-color: color-mix(in oklab, var(--color-indigo-500) 10%, transparent);
color: var(--color-indigo-600);

&:where(.dark, .dark *) {
  color: var(--color-indigo-400);
}
`;

export const Music22 = styled(BaseMusic2)`
height: calc(var(--spacing) * 4);
width: calc(var(--spacing) * 4)
`;

export const Div9 = styled.div`
overflow: hidden
`;

export const Div10 = styled.div`
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
font-size: var(--text-xs);
line-height: var(--cms-leading, var(--text-xs--line-height));
--cms-font-weight: var(--font-weight-semibold);
font-weight: var(--font-weight-semibold);
color: var(--color-stone-900);

&:where(.dark, .dark *) {
  color: var(--color-stone-100);
}
`;

export const Div11 = styled.div`
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
font-size: 11px;
color: var(--color-stone-500);

&:where(.dark, .dark *) {
  color: var(--color-stone-400);
}
`;

export const A = styled.a`
flex-shrink: 0;
border-radius: var(--radius-lg);
padding: calc(var(--spacing) * 1.5);
color: var(--color-stone-400);

@media (hover: hover) {
  &:hover {
    background-color: color-mix(in oklab, var(--color-stone-200) 50%, transparent);
    color: var(--color-stone-700);
  }
  &:where(.dark, .dark *):hover {
    color: var(--color-stone-200);
  }
}
`;

export const ExternalLink = styled(BaseExternalLink)`
height: calc(var(--spacing) * 3.5);
width: calc(var(--spacing) * 3.5)
`;

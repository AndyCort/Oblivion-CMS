import styled from 'styled-components';
import { Tag as BaseTagIcon } from 'lucide-react';
import { X as BaseX } from 'lucide-react';
import { Plus as BasePlus } from 'lucide-react';

export const Div = styled.div`
:where(& > :not(:last-child)) {
  --cms-space-y-reverse: 0;
  margin-block-start: calc(calc(var(--spacing) * 2) * var(--cms-space-y-reverse));
  margin-block-end: calc(calc(var(--spacing) * 2) * calc(1 - var(--cms-space-y-reverse)));
}
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

export const TagIcon = styled(BaseTagIcon)`
height: calc(var(--spacing) * 3.5);
width: calc(var(--spacing) * 3.5);
color: var(--color-indigo-500)
`;

export const Div2 = styled.div`
display: flex;
min-height: calc(var(--spacing) * 10);
flex-wrap: wrap;
align-items: center;
gap: calc(var(--spacing) * 1.5);
border-radius: var(--radius-xl);
border-style: var(--cms-border-style);
border-width: 1px;
border-color: var(--color-stone-200);
background-color: color-mix(in oklab, var(--color-stone-50) 50%, transparent);
padding: calc(var(--spacing) * 2);

&:where(.dark, .dark *) {
  border-color: var(--color-stone-800);
  background-color: color-mix(in oklab, var(--color-stone-900) 50%, transparent);
}
`;

export const Span = styled.span`
display: inline-flex;
align-items: center;
gap: var(--spacing);
border-radius: var(--radius-lg);
border-style: var(--cms-border-style);
border-width: 1px;
border-color: color-mix(in oklab, var(--color-indigo-200) 60%, transparent);
background-color: var(--color-indigo-50);
padding-inline: calc(var(--spacing) * 2.5);
padding-block: var(--spacing);
font-size: var(--text-xs);
line-height: var(--cms-leading, var(--text-xs--line-height));
--cms-font-weight: var(--font-weight-medium);
font-weight: var(--font-weight-medium);
color: var(--color-indigo-600);

&:where(.dark, .dark *) {
  border-color: color-mix(in oklab, var(--color-indigo-800) 60%, transparent);
  background-color: color-mix(in oklab, var(--color-indigo-950) 60%, transparent);
  color: var(--color-indigo-400);
}
`;

export const Button = styled.button`
border-radius: 0.25rem;
padding: calc(var(--spacing) * 0.5);

@media (hover: hover) {
  &:hover {
    color: var(--color-indigo-900);
  }
  &:where(.dark, .dark *):hover {
    color: var(--color-indigo-200);
  }
}
`;

export const X = styled(BaseX)`
height: calc(var(--spacing) * 3);
width: calc(var(--spacing) * 3)
`;

export const Div3 = styled.div`
display: flex;
min-width: 120px;
flex: 1;
align-items: center
`;

export const Input = styled.input`
width: 100%;
--cms-border-style: none;
border-style: none;
background-color: transparent;
font-size: var(--text-sm);
line-height: var(--cms-leading, var(--text-sm--line-height));
color: var(--color-stone-900);
--cms-outline-style: none;
outline-style: none;

&::placeholder {
  color: var(--color-stone-400);
}

@media (width >= 40rem) {
  & {
    font-size: var(--text-xs);
    line-height: var(--cms-leading, var(--text-xs--line-height));
  }
}

&:where(.dark, .dark *) {
  color: var(--color-stone-100);
}
`;

export const Button2 = styled.button`
padding: var(--spacing);
font-size: var(--text-xs);
line-height: var(--cms-leading, var(--text-xs--line-height));
color: var(--color-indigo-600)
`;

export const Plus = styled(BasePlus)`
height: calc(var(--spacing) * 3.5);
width: calc(var(--spacing) * 3.5)
`;

export const Div4 = styled.div`
display: flex;
flex-wrap: wrap;
align-items: center;
gap: var(--spacing);
padding-top: var(--spacing)
`;

export const Span2 = styled.span`
font-size: 11px;
color: var(--color-stone-400);

&:where(.dark, .dark *) {
  color: var(--color-stone-500);
}
`;

export const Button3 = styled.button`
border-radius: var(--radius-md);
background-color: var(--color-stone-100);
padding-inline: calc(var(--spacing) * 2);
padding-block: calc(var(--spacing) * 0.5);
font-size: 11px;
color: var(--color-stone-600);
transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --cms-gradient-from, --cms-gradient-via, --cms-gradient-to;
transition-timing-function: var(--cms-ease, var(--default-transition-timing-function));
transition-duration: var(--cms-duration, var(--default-transition-duration));

@media (hover: hover) {
  &:hover {
    background-color: var(--color-stone-200);
    color: var(--color-stone-900);
  }
  &:where(.dark, .dark *):hover {
    background-color: var(--color-stone-700);
  }
}

&:where(.dark, .dark *) {
  background-color: var(--color-stone-800);
  color: var(--color-stone-400);
}
`;

export const Span3 = styled.span`
margin-left: calc(var(--spacing) * 0.5);
font-size: 10px;
opacity: 60%
`;

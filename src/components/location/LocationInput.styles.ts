import styled from 'styled-components';
import { MapPin as BaseMapPin } from 'lucide-react';
import { X as BaseX } from 'lucide-react';

export const Div = styled.div`
position: relative;

:where(& > :not(:last-child)) {
  --cms-space-y-reverse: 0;
  margin-block-start: calc(calc(var(--spacing) * 1.5) * var(--cms-space-y-reverse));
  margin-block-end: calc(calc(var(--spacing) * 1.5) * calc(1 - var(--cms-space-y-reverse)));
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

export const MapPin = styled(BaseMapPin)`
height: calc(var(--spacing) * 3.5);
width: calc(var(--spacing) * 3.5);
color: var(--color-indigo-500)
`;

export const Div2 = styled.div`
position: relative;
display: flex;
align-items: center
`;

export const Input = styled.input`
width: 100%;
border-radius: var(--radius-xl);
border-style: var(--cms-border-style);
border-width: 1px;
border-color: var(--color-stone-200);
background-color: color-mix(in oklab, var(--color-stone-50) 50%, transparent);
padding: calc(var(--spacing) * 2.5);
padding-right: calc(var(--spacing) * 8);
padding-left: calc(var(--spacing) * 3);
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
  background-color: color-mix(in oklab, var(--color-stone-900) 50%, transparent);
  color: var(--color-stone-100);
}
`;

export const Button = styled.button`
position: absolute;
right: calc(var(--spacing) * 2.5);
border-radius: var(--radius-md);
padding: var(--spacing);
color: var(--color-stone-400);

@media (hover: hover) {
  &:hover {
    color: var(--color-stone-700);
  }
  &:where(.dark, .dark *):hover {
    color: var(--color-stone-200);
  }
}
`;

export const X = styled(BaseX)`
height: calc(var(--spacing) * 3.5);
width: calc(var(--spacing) * 3.5)
`;

export const Div3 = styled.div`
display: flex;
flex-wrap: wrap;
align-items: center;
gap: var(--spacing);
padding-top: var(--spacing)
`;

export const Span = styled.span`
font-size: 11px;
color: var(--color-stone-400);

&:where(.dark, .dark *) {
  color: var(--color-stone-500);
}
`;

export const Button2 = styled.button`
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

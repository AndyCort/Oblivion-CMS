import styled from 'styled-components';
import { Clock as BaseClock } from 'lucide-react';
import { RotateCcw as BaseRotateCcw } from 'lucide-react';

export const Div = styled.div`
:where(& > :not(:last-child)) {
  --cms-space-y-reverse: 0;
  margin-block-start: calc(calc(var(--spacing) * 1.5) * var(--cms-space-y-reverse));
  margin-block-end: calc(calc(var(--spacing) * 1.5) * calc(1 - var(--cms-space-y-reverse)));
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

export const Clock = styled(BaseClock)`
height: calc(var(--spacing) * 3.5);
width: calc(var(--spacing) * 3.5);
color: var(--color-indigo-500)
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

export const RotateCcw = styled(BaseRotateCcw)`
height: calc(var(--spacing) * 3);
width: calc(var(--spacing) * 3)
`;

export const Div3 = styled.div`
display: flex;
align-items: center;
gap: calc(var(--spacing) * 2)
`;

export const Input = styled.input`
width: 100%;
border-radius: var(--radius-xl);
border-style: var(--cms-border-style);
border-width: 1px;
border-color: var(--color-stone-200);
background-color: color-mix(in oklab, var(--color-stone-50) 50%, transparent);
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
  background-color: color-mix(in oklab, var(--color-stone-900) 50%, transparent);
  color: var(--color-stone-100);
}
`;

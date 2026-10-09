import styled from 'styled-components';
import { Eye as BaseEye } from 'lucide-react';
import { Play as BasePlay } from 'lucide-react';
import { MapPin as BaseMapPin } from 'lucide-react';
import { Music2 as BaseMusic2 } from 'lucide-react';

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
justify-content: space-between;
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
display: flex;
align-items: center;
gap: calc(var(--spacing) * 1.5)
`;

export const Eye = styled(BaseEye)`
height: calc(var(--spacing) * 3.5);
width: calc(var(--spacing) * 3.5);
color: var(--color-indigo-500)
`;

export const Span2 = styled.span`
font-size: 11px;
--cms-font-weight: var(--font-weight-normal);
font-weight: var(--font-weight-normal);
color: var(--color-stone-400)
`;

export const Div3 = styled.div`
position: relative;
overflow: hidden;
border-radius: var(--radius-2xl);
border-style: var(--cms-border-style);
border-width: 1px;
border-color: color-mix(in oklab, var(--color-stone-800) 80%, transparent);
background-color: var(--color-stone-950);
padding: calc(var(--spacing) * 4);
color: var(--color-white);
--cms-shadow: 0 25px 50px -12px var(--cms-shadow-color, rgb(0 0 0 / 0.25));
box-shadow: var(--cms-inset-shadow), var(--cms-inset-ring-shadow), var(--cms-ring-offset-shadow), var(--cms-ring-shadow), var(--cms-shadow);
--cms-backdrop-blur: blur(var(--blur-xl));
-webkit-backdrop-filter: var(--cms-backdrop-blur,) var(--cms-backdrop-brightness,) var(--cms-backdrop-contrast,) var(--cms-backdrop-grayscale,) var(--cms-backdrop-hue-rotate,) var(--cms-backdrop-invert,) var(--cms-backdrop-opacity,) var(--cms-backdrop-saturate,) var(--cms-backdrop-sepia,);
backdrop-filter: var(--cms-backdrop-blur,) var(--cms-backdrop-brightness,) var(--cms-backdrop-contrast,) var(--cms-backdrop-grayscale,) var(--cms-backdrop-hue-rotate,) var(--cms-backdrop-invert,) var(--cms-backdrop-opacity,) var(--cms-backdrop-saturate,) var(--cms-backdrop-sepia,);

@media (width >= 40rem) {
  & {
    padding: calc(var(--spacing) * 5);
  }
}
`;

export const Header = styled.header`
margin-bottom: calc(var(--spacing) * 4);
display: flex;
align-items: center;
gap: calc(var(--spacing) * 3)
`;

export const Div4 = styled.div`
height: calc(var(--spacing) * 9);
width: calc(var(--spacing) * 9);
flex-shrink: 0;
overflow: hidden;
border-radius: calc(infinity * 1px);
border-style: var(--cms-border-style);
border-width: 1px;
border-color: color-mix(in oklab, var(--color-white) 20%, transparent)
`;

export const Img = styled.img`
height: 100%;
width: 100%;
object-fit: cover
`;

export const Div5 = styled.div`
font-size: var(--text-sm);
line-height: var(--cms-leading, var(--text-sm--line-height));
--cms-font-weight: var(--font-weight-medium);
font-weight: var(--font-weight-medium);
color: var(--color-stone-100)
`;

export const Div6 = styled.div`
margin-bottom: calc(var(--spacing) * 4);
font-family: var(--font-serif);
font-size: var(--text-sm);
line-height: var(--cms-leading, var(--text-sm--line-height));
--cms-leading: var(--leading-relaxed);
line-height: var(--leading-relaxed);
--cms-tracking: var(--tracking-wide);
letter-spacing: var(--tracking-wide);
white-space: pre-wrap;
color: var(--color-stone-200);
-webkit-user-select: text;
user-select: text
`;

export const Span3 = styled.span`
color: var(--color-stone-500);
font-style: italic
`;

export const Div7 = styled.div`
margin-bottom: calc(var(--spacing) * 4);
display: grid;
grid-template-columns: repeat(3, minmax(0, 1fr));
gap: calc(var(--spacing) * 2);

@media (width >= 40rem) {
  & {
    gap: calc(var(--spacing) * 2.5);
  }
}
`;

export const Div8 = styled.div`
position: relative;
aspect-ratio: 1 / 1;
overflow: hidden;
border-radius: var(--radius-lg);
border-style: var(--cms-border-style);
border-width: 1px;
border-color: color-mix(in oklab, var(--color-white) 10%, transparent);
background-color: var(--color-stone-900)
`;

export const Div9 = styled.div`
position: relative;
height: 100%;
width: 100%
`;

export const Video = styled.video`
height: 100%;
width: 100%;
object-fit: cover
`;

export const Div10 = styled.div`
position: absolute;
inset: 0px;
display: flex;
align-items: center;
justify-content: center;
background-color: color-mix(in oklab, var(--color-black) 30%, transparent)
`;

export const Div11 = styled.div`
display: flex;
height: calc(var(--spacing) * 7);
width: calc(var(--spacing) * 7);
align-items: center;
justify-content: center;
border-radius: calc(infinity * 1px);
background-color: color-mix(in oklab, var(--color-black) 60%, transparent);
color: var(--color-white);
--cms-shadow: 0 1px 3px 0 var(--cms-shadow-color, rgb(0 0 0 / 0.1)), 0 1px 2px -1px var(--cms-shadow-color, rgb(0 0 0 / 0.1));
box-shadow: var(--cms-inset-shadow), var(--cms-inset-ring-shadow), var(--cms-ring-offset-shadow), var(--cms-ring-shadow), var(--cms-shadow)
`;

export const Play = styled(BasePlay)`
height: calc(var(--spacing) * 3.5);
width: calc(var(--spacing) * 3.5);
--cms-translate-x: calc(var(--spacing) * 0.5);
translate: var(--cms-translate-x) var(--cms-translate-y);
fill: var(--color-white)
`;

export const Div12 = styled.div`
margin-bottom: calc(var(--spacing) * 3);
display: flex;
flex-wrap: wrap;
gap: calc(var(--spacing) * 2.5);
font-family: var(--font-serif);
font-size: var(--text-xs);
line-height: var(--cms-leading, var(--text-xs--line-height))
`;

export const Span4 = styled.span`
color: var(--color-indigo-300)
`;

export const Div13 = styled.div`
margin-bottom: calc(var(--spacing) * 4);
display: flex;
align-items: center;
gap: calc(var(--spacing) * 1.5);
font-family: var(--font-serif);
font-size: var(--text-xs);
line-height: var(--cms-leading, var(--text-xs--line-height));
color: var(--color-stone-400)
`;

export const MapPin = styled(BaseMapPin)`
height: calc(var(--spacing) * 3.5);
width: calc(var(--spacing) * 3.5);
stroke-width: 2.5;
color: var(--color-indigo-400)
`;

export const Footer = styled.footer`
display: flex;
align-items: center;
justify-content: space-between;
border-top-style: var(--cms-border-style);
border-top-width: 1px;
border-color: color-mix(in oklab, var(--color-white) 10%, transparent);
padding-top: calc(var(--spacing) * 3);
font-size: var(--text-xs);
line-height: var(--cms-leading, var(--text-xs--line-height));
color: var(--color-stone-400)
`;

export const Span5 = styled.span`
display: flex;
max-width: 50%;
align-items: center;
gap: calc(var(--spacing) * 1.5);
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
color: var(--color-stone-300)
`;

export const Music2 = styled(BaseMusic2)`
height: calc(var(--spacing) * 3.5);
width: calc(var(--spacing) * 3.5);
flex-shrink: 0;
color: var(--color-indigo-400)
`;

export const Span6 = styled.span`
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap
`;

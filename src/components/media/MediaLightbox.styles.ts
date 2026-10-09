import styled from 'styled-components';
import { X as BaseX } from 'lucide-react';
import { ChevronLeft as BaseChevronLeft } from 'lucide-react';
import { ChevronRight as BaseChevronRight } from 'lucide-react';

export const Div = styled.div`
position: fixed;
inset: 0px;
z-index: 50;
display: flex;
align-items: center;
justify-content: center;
background-color: color-mix(in oklab, var(--color-black) 90%, transparent);
padding: calc(var(--spacing) * 2);
--cms-backdrop-blur: blur(var(--blur-md));
-webkit-backdrop-filter: var(--cms-backdrop-blur,) var(--cms-backdrop-brightness,) var(--cms-backdrop-contrast,) var(--cms-backdrop-grayscale,) var(--cms-backdrop-hue-rotate,) var(--cms-backdrop-invert,) var(--cms-backdrop-opacity,) var(--cms-backdrop-saturate,) var(--cms-backdrop-sepia,);
backdrop-filter: var(--cms-backdrop-blur,) var(--cms-backdrop-brightness,) var(--cms-backdrop-contrast,) var(--cms-backdrop-grayscale,) var(--cms-backdrop-hue-rotate,) var(--cms-backdrop-invert,) var(--cms-backdrop-opacity,) var(--cms-backdrop-saturate,) var(--cms-backdrop-sepia,);
--cms-duration: 200ms;
transition-duration: 200ms;
-webkit-user-select: none;
user-select: none;

@media (width >= 40rem) {
  & {
    padding: calc(var(--spacing) * 4);
  }
}
`;

export const Div2 = styled.div`
position: absolute;
padding-top:max(.75rem,env(safe-area-inset-top,0px));
top: calc(var(--spacing) * 4);
right: calc(var(--spacing) * 4);
z-index: 20;
display: flex;
align-items: center;
gap: calc(var(--spacing) * 3)
`;

export const Span = styled.span`
border-radius: calc(infinity * 1px);
background-color: color-mix(in oklab, var(--color-black) 40%, transparent);
padding-inline: calc(var(--spacing) * 2);
padding-block: calc(var(--spacing) * 0.5);
font-family: var(--font-mono);
font-size: var(--text-xs);
line-height: var(--cms-leading, var(--text-xs--line-height));
color: var(--color-stone-300);
--cms-backdrop-blur: blur(var(--blur-xs));
-webkit-backdrop-filter: var(--cms-backdrop-blur,) var(--cms-backdrop-brightness,) var(--cms-backdrop-contrast,) var(--cms-backdrop-grayscale,) var(--cms-backdrop-hue-rotate,) var(--cms-backdrop-invert,) var(--cms-backdrop-opacity,) var(--cms-backdrop-saturate,) var(--cms-backdrop-sepia,);
backdrop-filter: var(--cms-backdrop-blur,) var(--cms-backdrop-brightness,) var(--cms-backdrop-contrast,) var(--cms-backdrop-grayscale,) var(--cms-backdrop-hue-rotate,) var(--cms-backdrop-invert,) var(--cms-backdrop-opacity,) var(--cms-backdrop-saturate,) var(--cms-backdrop-sepia,);

@media (width >= 40rem) {
  & {
    font-size: var(--text-sm);
    line-height: var(--cms-leading, var(--text-sm--line-height));
  }
}
`;

export const Button = styled.button`
border-radius: calc(infinity * 1px);
background-color: color-mix(in oklab, var(--color-white) 15%, transparent);
padding: calc(var(--spacing) * 2);
color: var(--color-white);
transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --cms-gradient-from, --cms-gradient-via, --cms-gradient-to;
transition-timing-function: var(--cms-ease, var(--default-transition-timing-function));
transition-duration: var(--cms-duration, var(--default-transition-duration));

@media (hover: hover) {
  &:hover {
    background-color: color-mix(in oklab, var(--color-white) 25%, transparent);
  }
}

&:active {
  background-color: color-mix(in oklab, var(--color-white) 35%, transparent);
}

@media (width >= 40rem) {
  & {
    padding: calc(var(--spacing) * 2.5);
  }
}
`;

export const X = styled(BaseX)`
height: calc(var(--spacing) * 5);
width: calc(var(--spacing) * 5)
`;

export const Button2 = styled.button`
position: absolute;
left: calc(var(--spacing) * 2);
z-index: 20;
border-radius: calc(infinity * 1px);
background-color: color-mix(in oklab, var(--color-white) 10%, transparent);
padding: calc(var(--spacing) * 2);
color: var(--color-white);
--cms-backdrop-blur: blur(var(--blur-xs));
-webkit-backdrop-filter: var(--cms-backdrop-blur,) var(--cms-backdrop-brightness,) var(--cms-backdrop-contrast,) var(--cms-backdrop-grayscale,) var(--cms-backdrop-hue-rotate,) var(--cms-backdrop-invert,) var(--cms-backdrop-opacity,) var(--cms-backdrop-saturate,) var(--cms-backdrop-sepia,);
backdrop-filter: var(--cms-backdrop-blur,) var(--cms-backdrop-brightness,) var(--cms-backdrop-contrast,) var(--cms-backdrop-grayscale,) var(--cms-backdrop-hue-rotate,) var(--cms-backdrop-invert,) var(--cms-backdrop-opacity,) var(--cms-backdrop-saturate,) var(--cms-backdrop-sepia,);
transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --cms-gradient-from, --cms-gradient-via, --cms-gradient-to;
transition-timing-function: var(--cms-ease, var(--default-transition-timing-function));
transition-duration: var(--cms-duration, var(--default-transition-duration));

@media (hover: hover) {
  &:hover {
    background-color: color-mix(in oklab, var(--color-white) 25%, transparent);
  }
}

&:active {
  background-color: color-mix(in oklab, var(--color-white) 35%, transparent);
}

@media (width >= 40rem) {
  & {
    left: calc(var(--spacing) * 4);
    padding: calc(var(--spacing) * 3);
  }
}
`;

export const ChevronLeft = styled(BaseChevronLeft)`
height: calc(var(--spacing) * 5);
width: calc(var(--spacing) * 5);

@media (width >= 40rem) {
  & {
    height: calc(var(--spacing) * 6);
    width: calc(var(--spacing) * 6);
  }
}
`;

export const Button3 = styled.button`
position: absolute;
right: calc(var(--spacing) * 2);
z-index: 20;
border-radius: calc(infinity * 1px);
background-color: color-mix(in oklab, var(--color-white) 10%, transparent);
padding: calc(var(--spacing) * 2);
color: var(--color-white);
--cms-backdrop-blur: blur(var(--blur-xs));
-webkit-backdrop-filter: var(--cms-backdrop-blur,) var(--cms-backdrop-brightness,) var(--cms-backdrop-contrast,) var(--cms-backdrop-grayscale,) var(--cms-backdrop-hue-rotate,) var(--cms-backdrop-invert,) var(--cms-backdrop-opacity,) var(--cms-backdrop-saturate,) var(--cms-backdrop-sepia,);
backdrop-filter: var(--cms-backdrop-blur,) var(--cms-backdrop-brightness,) var(--cms-backdrop-contrast,) var(--cms-backdrop-grayscale,) var(--cms-backdrop-hue-rotate,) var(--cms-backdrop-invert,) var(--cms-backdrop-opacity,) var(--cms-backdrop-saturate,) var(--cms-backdrop-sepia,);
transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --cms-gradient-from, --cms-gradient-via, --cms-gradient-to;
transition-timing-function: var(--cms-ease, var(--default-transition-timing-function));
transition-duration: var(--cms-duration, var(--default-transition-duration));

@media (hover: hover) {
  &:hover {
    background-color: color-mix(in oklab, var(--color-white) 25%, transparent);
  }
}

&:active {
  background-color: color-mix(in oklab, var(--color-white) 35%, transparent);
}

@media (width >= 40rem) {
  & {
    right: calc(var(--spacing) * 4);
    padding: calc(var(--spacing) * 3);
  }
}
`;

export const ChevronRight = styled(BaseChevronRight)`
height: calc(var(--spacing) * 5);
width: calc(var(--spacing) * 5);

@media (width >= 40rem) {
  & {
    height: calc(var(--spacing) * 6);
    width: calc(var(--spacing) * 6);
  }
}
`;

export const Div3 = styled.div`
display: flex;
max-height: 85vh;
width: 100%;
max-width: var(--container-4xl);
align-items: center;
justify-content: center;
padding: calc(var(--spacing) * 2)
`;

export const Img = styled.img`
max-height: 80vh;
max-width: 100%;
border-radius: var(--radius-lg);
object-fit: contain;
--cms-shadow: 0 25px 50px -12px var(--cms-shadow-color, rgb(0 0 0 / 0.25));
box-shadow: var(--cms-inset-shadow), var(--cms-inset-ring-shadow), var(--cms-ring-offset-shadow), var(--cms-ring-shadow), var(--cms-shadow);
transition-property: transform, translate, scale, rotate;
transition-timing-function: var(--cms-ease, var(--default-transition-timing-function));
transition-duration: var(--cms-duration, var(--default-transition-duration))
`;

export const Div4 = styled.div`
display: flex;
aspect-ratio: var(--aspect-video);
width: 100%;
max-width: var(--container-3xl);
align-items: center;
justify-content: center;
overflow: hidden;
border-radius: var(--radius-xl);
background-color: var(--color-black);
--cms-shadow: 0 25px 50px -12px var(--cms-shadow-color, rgb(0 0 0 / 0.25));
box-shadow: var(--cms-inset-shadow), var(--cms-inset-ring-shadow), var(--cms-ring-offset-shadow), var(--cms-ring-shadow), var(--cms-shadow)
`;

export const Video = styled.video`
height: 100%;
width: 100%;
object-fit: contain
`;

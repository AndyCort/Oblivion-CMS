import styled from 'styled-components';
import { MessageCircle, FileText } from 'lucide-react';

const Navigation = styled.nav`
  display: flex;
  flex-shrink: 0;
  gap: 4px;
  padding: 12px 14px;
  border-bottom: 1px solid var(--color-stone-200);
  &:where(.dark, .dark *) { border-color: var(--color-stone-800); }
`;
const Mode = styled.button<{ $active: boolean }>`
  && {
    flex: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 9px 8px;
    border-radius: 10px;
    font-size: 12px;
    font-weight: 500;
    color: ${p => p.$active ? 'white' : 'var(--color-stone-500)'};
    background: ${p => p.$active ? 'var(--color-indigo-600)' : 'transparent'};
    cursor: pointer;
    transition: background 150ms;
    &:hover { background: ${p => p.$active ? 'var(--color-indigo-500)' : 'var(--color-stone-100)'}; }
    &:where(.dark, .dark *) {
      color: ${p => p.$active ? 'white' : 'var(--color-stone-400)'};
      &:hover { background: ${p => p.$active ? 'var(--color-indigo-500)' : 'var(--color-stone-800)'}; }
    }
  }
`;
export function ContentModeSwitch({ mode, onChange }: { mode: 'moments' | 'posts'; onChange: (mode: 'moments' | 'posts') => void }) {
  return <Navigation aria-label="内容模式">
    <Mode type="button" $active={mode === 'moments'} aria-pressed={mode === 'moments'} onClick={() => onChange('moments')}><MessageCircle size={14} />说说动态</Mode>
    <Mode type="button" $active={mode === 'posts'} aria-pressed={mode === 'posts'} onClick={() => onChange('posts')}><FileText size={14} />博客长文</Mode>
  </Navigation>;
}

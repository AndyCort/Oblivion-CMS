// @vitest-environment jsdom
import { it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MarkdownPreview } from '../src/components/posts/MarkdownPreview';
import { slugFromTitle } from '../src/components/posts/PostsWorkspace';
it('renders GFM tables, tasks, highlighted code and unique heading anchors', () => {
  const html = renderToStaticMarkup(<MarkdownPreview content={'# 重复\n# 重复\n\n| A | B |\n|---|---|\n| 1 | 2 |\n\n- [x] Done\n\n```js\nconst x = 1;\n```'}/>);
  expect(html).toContain('<table>');
  expect(html).toContain('type="checkbox"');
  expect(html).toContain('hljs-keyword');
  expect(html).toContain('id="post-heading-0"');
  expect(html).toContain('id="post-heading-1"');
});
it('sanitizes raw HTML, event handlers, scripts and javascript URLs', () => {
  const html = renderToStaticMarkup(<MarkdownPreview content={'<img src="x" onerror="alert(1)"><script>alert(1)</script>\n\n[attack](javascript:alert(1))\n<iframe src="https://example.com"></iframe>'}/>);
  expect(html).not.toMatch(/onerror|<script|javascript:|<iframe/);
});
it('generates editable Chinese and English slugs', () => {
  expect(slugFromTitle('你好世界')).toBe('ni-hao-shi-jie');
  expect(slugFromTitle('My First Post!')).toBe('my-first-post');
});

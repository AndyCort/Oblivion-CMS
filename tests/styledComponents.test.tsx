import { ContentModeSwitch } from '../src/components/articles/ContentModeSwitch';
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';
import { MomentsWorkspace } from '../src/App.styles';
import { Workspace } from '../src/components/posts/PostsWorkspace.styles';

function renderStyles(element: React.ReactElement) {
  const sheet = new ServerStyleSheet();
  try {
    const html = renderToStaticMarkup(sheet.collectStyles(element));
    return { html, styles: sheet.getStyleTags() };
  } finally {
    sheet.seal();
  }
}

describe('styled CMS integration', () => {
  it('keeps selected-mode colors separate from shared transition declarations', () => {
    const { html, styles } = renderStyles(<ContentModeSwitch mode="posts" onChange={() => {}} />);
    expect(styles).toMatch(/[;{]background:var\(--color-indigo-600\);/);
    expect(styles).toMatch(/[;{]color:white;/);
    expect(html).not.toContain('$active');
    expect(html).toContain('aria-pressed="true"');
  });

  it('hides the inactive moments workspace without unmounting its contents', () => {
    const { html, styles } = renderStyles(<MomentsWorkspace $visible={false}><input defaultValue="草稿" /></MomentsWorkspace>);
    expect(html).toContain('草稿');
    expect(html).not.toContain('$visible');
    expect(styles).toContain('display:none;');
  });

  it('scopes mobile editor and dark-theme selectors to the blog workspace', () => {
    const { styles } = renderStyles(<Workspace className="posts-mobile-editor" />);
    expect(styles).toMatch(/\.\w+\.posts-mobile-editor \.posts-main\{display:flex;/);
    expect(styles).toMatch(/\.dark \.\w+\{/);
    expect(styles).toMatch(/@media \(max-width:\s*767px\)/);
  });
});

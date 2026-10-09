import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';
import { ModeButton, MomentsWorkspace } from '../src/App.styles';
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
    const { html, styles } = renderStyles(<ModeButton $variant="v0">博客长文</ModeButton>);
    expect(styles).toMatch(/[;{]background-color:var\(--color-indigo-600\);/);
    expect(styles).toMatch(/[;{]color:var\(--color-white\);/);
    expect(html).not.toContain('$variant');
  });

  it('hides the inactive moments workspace without unmounting its contents', () => {
    const { html, styles } = renderStyles(<MomentsWorkspace $visible={false}><input defaultValue="草稿" /></MomentsWorkspace>);
    expect(html).toContain('草稿');
    expect(html).not.toContain('$visible');
    expect(styles).toContain('display:none;');
  });

  it('scopes mobile editor and dark-theme selectors to the blog workspace', () => {
    const { styles } = renderStyles(<Workspace className="posts-mobile-editor" />);
    expect(styles).toMatch(/\.\w+\.posts-mobile-editor \.posts-main\{display:block;/);
    expect(styles).toMatch(/\.dark \.\w+\{/);
    expect(styles).toMatch(/@media \(max-width:\s*767px\)/);
  });
});

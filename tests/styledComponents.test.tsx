import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';
import { MomentsWorkspace, RailIconButton } from '../src/App.styles';
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
  it('renders active and primary RailIconButton states without leaking transient props', () => {
    const { html: activeHtml, styles: activeStyles } = renderStyles(
      <RailIconButton type="button" $active aria-pressed={true} />,
    );
    expect(activeStyles).toMatch(/color:\s*var\(--color-indigo-600\)/);
    expect(activeHtml).not.toContain('$active');
    expect(activeHtml).toContain('aria-pressed="true"');

    const { html: primaryHtml, styles: primaryStyles } = renderStyles(
      <RailIconButton type="button" $primary />,
    );
    expect(primaryStyles).toMatch(/background-color:\s*var\(--color-indigo-600\)/);
    expect(primaryStyles).toMatch(/color:\s*var\(--color-white\)/);
    expect(primaryHtml).not.toContain('$primary');
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

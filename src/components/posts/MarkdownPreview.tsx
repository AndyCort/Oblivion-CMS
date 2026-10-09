import { useMemo } from 'react';
import { Marked } from 'marked';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import css from 'highlight.js/lib/languages/css';
import xml from 'highlight.js/lib/languages/xml';
import json from 'highlight.js/lib/languages/json';
import python from 'highlight.js/lib/languages/python';
import bash from 'highlight.js/lib/languages/bash';
import 'highlight.js/styles/github-dark.css';
for (const [name, language] of Object.entries({ javascript, typescript, css, xml, json, python, bash })) hljs.registerLanguage(name, language);
const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export function MarkdownPreview({ content }: { content: string }) {
  const rendered = useMemo(() => {
    const headings: { id: string; text: string; level: number }[] = [];
    const parser = new Marked({ gfm: true, renderer: {
      heading({ tokens, depth }) {
        const id = `post-heading-${headings.length}`;
        const text = this.parser.parseInline(tokens);
        headings.push({ id, text: text.replace(/<[^>]+>/g, ''), level: depth });
        return `<h${depth} id="${id}">${text}</h${depth}>`;
      },
      code({ text, lang }) {
        const language = (lang || '').split(/\s/)[0];
        const code = hljs.getLanguage(language) ? hljs.highlight(text, { language }).value : escape(text);
        return `<pre><code class="hljs">${code}</code></pre>`;
      },
    } });
    const html = DOMPurify.sanitize(parser.parse(content, { async: false }), { ADD_ATTR: ['id'], FORBID_TAGS: ['style', 'iframe', 'form'], FORBID_ATTR: ['style'] });
    return { html, headings };
  }, [content]);
  return <section className="post-preview" aria-label="Markdown 实时预览">
    {rendered.headings.length > 0 && <details className="post-toc" open><summary>文章目录</summary><nav aria-label="文章目录">{rendered.headings.map(h => <a key={h.id} href={`#${h.id}`} style={{ paddingLeft: (h.level - 1) * 12 }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(h.text) }} />)}</nav></details>}
    <div className="post-prose" dangerouslySetInnerHTML={{ __html: rendered.html }} />
  </section>;
}

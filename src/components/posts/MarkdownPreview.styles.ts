import styled from 'styled-components';

export const Preview = styled.section`
& {
  padding: 28px;
  min-width: 0;
  max-height: 900px;
  overflow: auto;
}
.post-toc {
  padding: 14px 18px;
  border: 1px solid var(--post-border);
  border-radius: 10px;
  font-size: 12px;
  margin-bottom: 30px;
}
.post-toc summary {
  cursor: pointer;
  color: var(--post-muted);
}
.post-toc nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
}
.post-toc a {
  color: #818cf8;
}
.post-prose {
  line-height: 1.9;
  overflow-wrap: anywhere;
}
.post-prose h1,
.post-prose h2,
.post-prose h3,
.post-prose h4 {
  font-weight: 650;
  line-height: 1.35;
  margin: 1.4em 0 0.65em;
  scroll-margin-top: 120px;
}
.post-prose h1 {
  font-size: 2em;
}
.post-prose h2 {
  font-size: 1.5em;
  border-bottom: 1px solid var(--post-border);
  padding-bottom: 0.4em;
}
.post-prose h3 {
  font-size: 1.2em;
}
.post-prose p,
.post-prose ul,
.post-prose ol,
.post-prose blockquote {
  margin: 1em 0;
}
.post-prose ul {
  list-style: disc;
  padding-left: 24px;
}
.post-prose ol {
  list-style: decimal;
  padding-left: 24px;
}
.post-prose blockquote {
  padding: 2px 18px;
  border-left: 3px solid #818cf8;
  color: var(--post-muted);
  background: #6366f108;
}
.post-prose a {
  color: #818cf8;
  text-decoration: underline;
}
.post-prose img {
  max-width: 100%;
  border-radius: 8px;
}
.post-prose pre {
  overflow: auto;
  max-width: 100%;
  background: #0d1117;
  color: #c9d1d9;
  border-radius: 10px;
  padding: 16px;
  font-size: 12px;
  line-height: 1.7;
}
.post-prose code {
  font-family: ui-monospace, monospace;
}
.post-prose :not(pre) > code {
  background: #6366f112;
  padding: 2px 5px;
  border-radius: 4px;
  font-size: 0.9em;
}
.post-prose table {
  display: block;
  overflow: auto;
  border-collapse: collapse;
  margin: 18px 0;
}
.post-prose th,
.post-prose td {
  padding: 8px 12px;
  border: 1px solid var(--post-border);
}
.post-prose th {
  background: #6366f10a;
}
.post-prose hr {
  border: 0;
  border-top: 1px solid var(--post-border);
  margin: 28px 0;
}

@media (max-width:767px) { padding:20px; }
pre code.hljs {
  display: block;
  overflow-x: auto;
  padding: 1em
}
code.hljs {
  padding: 3px 5px
}
/*!
  Theme: GitHub Dark
  Description: Dark theme as seen on github.com
  Author: github.com
  Maintainer: @Hirse
  Updated: 2021-05-15

  Outdated base version: https://github.com/primer/github-syntax-dark
  Current colors taken from GitHub's CSS
*/
.hljs {
  color: #c9d1d9;
  background: #0d1117
}
.hljs-doctag,
.hljs-keyword,
.hljs-meta .hljs-keyword,
.hljs-template-tag,
.hljs-template-variable,
.hljs-type,
.hljs-variable.language_ {
  /* prettylights-syntax-keyword */
  color: #ff7b72
}
.hljs-title,
.hljs-title.class_,
.hljs-title.class_.inherited__,
.hljs-title.function_ {
  /* prettylights-syntax-entity */
  color: #d2a8ff
}
.hljs-attr,
.hljs-attribute,
.hljs-literal,
.hljs-meta,
.hljs-number,
.hljs-operator,
.hljs-variable,
.hljs-selector-attr,
.hljs-selector-class,
.hljs-selector-id {
  /* prettylights-syntax-constant */
  color: #79c0ff
}
.hljs-regexp,
.hljs-string,
.hljs-meta .hljs-string {
  /* prettylights-syntax-string */
  color: #a5d6ff
}
.hljs-built_in,
.hljs-symbol {
  /* prettylights-syntax-variable */
  color: #ffa657
}
.hljs-comment,
.hljs-code,
.hljs-formula {
  /* prettylights-syntax-comment */
  color: #8b949e
}
.hljs-name,
.hljs-quote,
.hljs-selector-tag,
.hljs-selector-pseudo {
  /* prettylights-syntax-entity-tag */
  color: #7ee787
}
.hljs-subst {
  /* prettylights-syntax-storage-modifier-import */
  color: #c9d1d9
}
.hljs-section {
  /* prettylights-syntax-markup-heading */
  color: #1f6feb;
  font-weight: bold
}
.hljs-bullet {
  /* prettylights-syntax-markup-list */
  color: #f2cc60
}
.hljs-emphasis {
  /* prettylights-syntax-markup-italic */
  color: #c9d1d9;
  font-style: italic
}
.hljs-strong {
  /* prettylights-syntax-markup-bold */
  color: #c9d1d9;
  font-weight: bold
}
.hljs-addition {
  /* prettylights-syntax-markup-inserted */
  color: #aff5b4;
  background-color: #033a16
}
.hljs-deletion {
  /* prettylights-syntax-markup-deleted */
  color: #ffdcd7;
  background-color: #67060c
}
.hljs-char.escape_,
.hljs-link,
.hljs-params,
.hljs-property,
.hljs-punctuation,
.hljs-tag {
  /* purposely ignored */
  
}
`;

export const TocLink = styled.a<{ $level: number }>`padding-left: ${p => (p.$level - 1) * 12}px;`;

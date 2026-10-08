-- Cloudflare D1 Database Schema for Oblivion-CMS
-- Oblivion-CMS 自动包含自检建表逻辑，你也可以在 Cloudflare Dashboard D1 控制台手动执行此脚本：

CREATE TABLE IF NOT EXISTS articles (
  time INTEGER PRIMARY KEY,
  content TEXT NOT NULL DEFAULT '',
  media TEXT NOT NULL DEFAULT '[]',
  tags TEXT NOT NULL DEFAULT '[]',
  location TEXT NOT NULL DEFAULT '',
  music TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_articles_time ON articles(time DESC);

-- Cloudflare D1 Database Schema for Oblivion-CMS
-- Oblivion-CMS 自动包含自检建表逻辑，你也可以在 Cloudflare Dashboard D1 控制台手动执行此脚本：
-- 使用独立命名的说说表，不会修改博客的 articles 表。
-- 已有旧版 CMS articles 表的部署会自动继续使用旧表，无需执行本脚本。

CREATE TABLE IF NOT EXISTS oblivion_cms_moments (
  time INTEGER PRIMARY KEY,
  content TEXT NOT NULL DEFAULT '',
  media TEXT NOT NULL DEFAULT '[]',
  tags TEXT NOT NULL DEFAULT '[]',
  location TEXT NOT NULL DEFAULT '',
  music TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_oblivion_cms_moments_time ON oblivion_cms_moments(time DESC);

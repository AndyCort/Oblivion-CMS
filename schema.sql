-- Cloudflare D1 Database Schema for Oblivion-CMS
-- 首次访问会自动初始化以下说说表与索引；也可在 D1 控制台手动执行本脚本。

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

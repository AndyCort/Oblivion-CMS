# Oblivion-CMS

**Oblivion-CMS** 是一个托管在 **Cloudflare Pages** 上的个人内容创作工作台，提供「说说动态（Moments）」与「博客长文（Posts）」双创作模式，基于 **Cloudflare Access** 零信任身份认证，并以 **Cloudflare D1** 与博客内容 Worker 作为持久化存储。

---

## 核心特性

- **双模式工作台**：
  - **说说动态（Moments）**：编辑 / 分屏 / 前台实时预览，支持 QQ 空间式九宫格媒体（图片 / 视频混排、拖拽排序、全屏灯箱、单条或批量粘贴添加）、底部悬浮 Meta Dock 一行管理时间、地点、标签与音乐。
  - **博客长文（Posts）**：单语言 Markdown 写作与预览（GFM、TOC 目录、代码高亮、`DOMPurify` XSS 清洗），按需加载 `pinyin-pro` 生成中文 Slug，兼容读取旧版多语言 JSON 记录。
- **统一本机防抖草稿队列**：
  - 700ms 防抖自动写入浏览器 IndexedDB（`oblivion_cms_db`），支持切换文章、发布、关闭或切后台前串行自动刷盘，避免并发覆盖或草稿丢失。
- **Cloudflare Access 严格服务端验签**：
  - 后端统一校验 `Cf-Access-Jwt-Assertion` / `CF_Authorization` Cookie 的 JWKS 签名、`issuer` 与 `audience`；支持 Access 原生 Passkey 登录。
- **语义化主题与多端适配**：
  - 支持浅色 / 深色 / 跟随系统与 5 套强调色切换，适配桌面与移动端安全区域。

---

## 架构与数据流

```mermaid
graph TD
    User([用户浏览器]) -->|HTTPS + CF Access| Pages[Cloudflare Pages 前端]
    User -.->|本地防抖草稿| IDB[(浏览器 IndexedDB)]
    Pages -->|REST API + Access JWT| Functions[Cloudflare Pages Functions]
    Functions -->|JWKS 验签| CFAccess[Cloudflare Access]
    Functions -->|说说读写| D1[(Cloudflare D1: DB / oblivion_cms_moments)]
    Functions -->|博客长文 Worker + BLOG_DB source_path| BlogWorker[oblivion-content Worker]
    PublicAPI[/api/public/moments] -->|只读 CORS JSON| Blog[博客前台网站]
```

---

## 目录结构

```text
Oblivion-CMS/
├── functions/
│   ├── api/
│   │   ├── auth/me.ts & logout.ts      # 鉴权状态检查与退出登录
│   │   ├── moments/index.ts & [time].ts # GET/POST /api/moments, DELETE /api/moments/:time
│   │   ├── posts/index.ts, [id].ts, publish.ts # 博客长文列表/详情/发布/删除
│   │   └── public/moments.ts           # 公开只读 /api/public/moments (支持 ?format=wrapped)
│   └── lib/
│       ├── access.ts                   # 统一 Cloudflare Access JWT 验签
│       ├── d1.ts                       # 原生 D1 绑定 (DB) 与 oblivion_cms_moments CRUD
│       └── posts.ts                    # 博客 Worker 桥接与 BLOG_DB source_path 读取
├── src/
│   ├── components/
│   │   ├── auth/                       # 兜底登录页
│   │   ├── layout/                     # 左侧导轨 (LeftRail)
│   │   ├── modals/                     # 删除确认弹窗
│   │   ├── moments/                    # 说说工作区、侧栏、九宫格、灯箱、预览卡片
│   │   ├── posts/                      # 博客工作区、侧栏、Markdown 安全预览
│   │   ├── settings/                   # 设置中心与草稿/备份管理
│   │   └── workspace/                  # 共享工作台原语 (顶栏/Dock/弹窗/侧栏样式)
│   ├── hooks/                          # useDraftQueue / useMomentsWorkspace / usePostsWorkspace
│   ├── lib/
│   │   ├── api/                        # client.ts / posts.ts 及 dev-only localMock.ts
│   │   ├── settings/cmsSettings.ts     # 偏好设置与语义主题应用
│   │   ├── storage/draftStore.ts       # IndexedDB 草稿存储 (moment: / post:)
│   │   ├── postsList.ts                # 博客筛选与标签统计
│   │   └── utils.ts                    # 通用工具与按需拼音 Slug 生成
│   ├── styles/                         # GlobalStyle.ts (语义 CSS 变量) & workspace.ts
│   ├── types/                          # article.ts & post.ts
│   └── App.tsx
├── schema.sql                          # D1 oblivion_cms_moments 表结构
└── vite.config.ts
```

---

## 本地开发与校验

```bash
npm install
npm run dev       # 启动 Vite 本地开发 (自动启用仅限 localhost dev 的内存模拟数据)
npm run check     # 前端 + Functions 类型检查
npm run build     # 生产打包至 dist/
```

---

## 部署到 Cloudflare Pages

1. **构建配置**：Framework preset 选择 `Vite`，Build command 为 `npm run build`，输出目录为 `dist`。
2. **D1 数据库绑定（Settings -> Functions -> D1 database bindings）**：
   - `DB`：说说动态数据库（首次访问自动建表 `oblivion_cms_moments`，也可手动执行 `schema.sql`）。
   - `BLOG_DB`：博客长文对应的 D1 数据库绑定（编辑既有 Worker 文章时用于保留 `source_path` 映射，切勿与说说库混淆）。
3. **环境变量（Settings -> Environment variables）**：

| 变量名 | 说明 |
| :--- | :--- |
| `CF_ACCESS_TEAM_DOMAIN` | Cloudflare Zero Trust 团队域名（生产必填） |
| `CF_ACCESS_AUD` | Cloudflare Access Application AUD 标识（生产必填） |
| `BLOG_WORKER_URL` | `oblivion-content` Worker 根地址（不要带 `/api`） |
| `BLOG_PUBLISH_SECRET` | 与 Worker 的 `PUBLISH_SECRET` 一致（设为 Secret） |
| `DEV_MODE` | 仅本地开发设为 `true`，生产环境留空或 `false` |

### Worker 协议说明

博客接口代理 `oblivion-content` 的 `/api/articles`、`/api/articles/:id` 与 `/api/publish`：由于 Worker 的 `/api/publish` 采用全量 `activeIds` 同步语义，CMS 会并发拉取完整 ID 列表与 `BLOG_DB` 中的 `source_path` 后一并提交，请串行发布并避免与其他同步进程同时写入。

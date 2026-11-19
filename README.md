# Oblivion-CMS

**Oblivion-CMS** 是一个独立托管在 **Cloudflare Pages** 上的个人博客可视化创作工作台，提供「说说动态（Moments）」与「博客长文（Posts）」双创作模式，基于 **Cloudflare Access** 实现零信任身份认证，并以 **Cloudflare D1** 与博客内容 Worker 作为持久化存储。

---

## 🌟 核心特性

- **双模式创作工作台**：
  - **说说动态（Moments）**：类似 QQ 空间“发表说说”的沉浸式编辑器，支持编辑 / 分屏 / 前台 1:1 实时预览，底部悬浮 Meta Dock 一行管理时间、地点、标签、音乐与发布备注。
  - **博客长文（Posts）**：支持多语言（中文 / English / 自定义语言代码）、Markdown 编辑与行号对齐、拼音自动生成 Slug、GFM / TOC 目录 / 代码高亮安全预览（DOMPurify 清洗）。
- **QQ 空间式九宫格媒体管理**：
  - 三列统一正方形网格（1:1），图片视频自由混排，支持突破 9 个限制自动换行。
  - 支持鼠标拖拽排序、全屏大图灯箱（键盘方向键、Escape 关闭）与视频弹层预览。
  - 支持多行批量粘贴 URL 导入并自动识别图片 / 视频类型，内置加载失败占位与重试。
- **IndexedDB 本机防抖自动草稿**：
  - 编辑时防抖自动写入当前浏览器的 IndexedDB（默认 700ms，可在设置中调整）。
  - 刷新页面、意外关闭或切换文章均保留草稿，发布成功后自动清理对应草稿。
- **乐观锁冲突保护与导入迁移**：
  - 说说发布基于数据版本 SHA 校验，发生并发修改时触发 **409 Conflict** 保护弹窗，支持复制草稿 JSON、拉取最新远程数据或强制覆盖。
  - 设置中心支持批量导入 `.json` 与旧版 `moments.ts`（通过 `@babel/parser` AST 解析），并支持 CMS 个性化设置的导出与迁移。
- **Cloudflare Access 零信任服务端验签**：
  - 后端 Pages Functions 通过 `jose` 校验 `Cf-Access-Jwt-Assertion` 的 JWKS 签名、Audience 与有效期。
  - 支持 Cloudflare Access 原生 Passkey 登录；所有服务端密钥仅保存在 Cloudflare Secrets 中，不进入前端 Bundle。
- **全平台 Safari 与移动端适配**：
  - 适配 Mac、iPad、iPhone 与 `safe-area-inset` 安全区域，支持浅色 / 深色 / 跟随系统主题及 5 套强调色切换。

---

## 🏗️ 架构与数据流

```mermaid
graph TD
    User([用户浏览器 Safari / Chrome]) -->|HTTPS + CF Access| Pages[Cloudflare Pages 前端]
    User -.->|本地自动保存| IDB[(浏览器 IndexedDB 本地草稿)]
    Pages -->|API 请求 + Access JWT| Functions[Cloudflare Pages Functions API]
    Functions -->|1. JWT 验签| CFAccess[Cloudflare Access JWKS]
    Functions -->|2. 说说读写| D1[(Cloudflare D1: oblivion_cms_moments)]
    Functions -->|3. 博客长文代理 / 读写| BlogWorker[oblivion-content Worker / BLOG_DB]
    PublicAPI[/api/public/moments] -->|只读 CORS JSON| Blog[博客前台网站]
```

---

## 📦 目录结构

```text
Oblivion-CMS/
├── functions/                    # Cloudflare Pages Functions 后端 API
│   ├── api/
│   │   ├── articles.ts           # GET /api/articles (读取说说列表与版本 SHA)
│   │   ├── publish.ts            # POST /api/publish (说说新建/更新/删除与冲突校验)
│   │   ├── import.ts             # POST /api/import (说说批量合并/覆盖导入)
│   │   ├── auth/me.ts            # GET /api/auth/me (当前用户鉴权状态)
│   │   ├── auth/logout.ts        # POST /api/auth/logout (退出登录)
│   │   ├── posts/                # /api/posts/* (博客长文增删改查接口)
│   │   └── public/               # /api/public/moments & /articles (公开只读 API)
│   └── lib/
│       ├── access.ts             # Cloudflare Access JWT 验证与 JSON 响应工具
│       ├── d1.ts                 # Cloudflare D1 客户端（原生 Binding / REST API / 本地模拟）
│       └── posts.ts              # 博客 Worker 桥接与 BLOG_DB 读写逻辑
├── src/                          # 前端 React 源代码
│   ├── components/
│   │   ├── articles/             # 说说列表侧边栏、说说工作区画布
│   │   ├── auth/                 # Cloudflare Access 登录页
│   │   ├── layout/               # 左侧 44px 图标导轨 (LeftRail)
│   │   ├── media/                # 九宫格媒体管理、灯箱、批量导入弹窗
│   │   ├── modals/               # 设置中心、删除确认、冲突解决弹窗
│   │   ├── posts/                # 博客长文工作区与 Markdown 安全预览
│   │   └── preview/              # 说说前台 1:1 实时预览卡片
│   ├── lib/
│   │   ├── api/                  # 前端 API 请求与本地开发模拟适配器
│   │   ├── ast/                  # TypeScript AST 解析器 (moments.ts 导入解析)
│   │   ├── hooks/                # useMomentsWorkspace 状态与草稿同步 Hook
│   │   ├── importer/             # JSON / moments.ts 数据归一化与导入解析
│   │   ├── settings/             # CMS 个人设置与站点品牌同步
│   │   ├── storage/              # IndexedDB 本机草稿存储服务
│   │   └── postsList.ts          # 博客筛选、标签统计工具
│   ├── styles/                   # GlobalStyle.ts 全局重置与 workspace.ts 共享样式
│   ├── types/                    # TypeScript 数据模型与校验逻辑
│   ├── App.tsx                   # 根组件：鉴权生命周期、模式切换与全局快捷键
│   └── main.tsx                  # 应用入口
├── tests/                        # Vitest 单元测试与集成测试
├── schema.sql                    # Cloudflare D1 说说表结构定义
├── .env.example                  # 环境变量配置模板
└── vite.config.ts                # Vite 构建配置
```

---

## 🚀 本地开发与调试

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

在本地开发模式（`localhost:5173`）下：
- 系统内置了**显式启用、严格限制于本地的开发模拟鉴权与内存数据适配器**。
- 无需配置 Cloudflare D1 或 Cloudflare Access 即可体验完整编辑器功能（九宫格拖拽、批量导入、新建、编辑、删除、草稿自动保存、冲突演练与博客 Markdown 编辑）。

### 3. 执行自动化检查与构建

```bash
# 运行全部类型检查（前端 + Functions）与 Vitest 测试
npm run check

# 单独运行单元测试
npm test

# 运行正式生产构建打包
npm run build
```

---

## ☁️ 部署到 Cloudflare Pages

### 第一步：准备 Cloudflare D1 数据库与项目构建

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)，在 **Workers & Pages -> D1 SQL Database** 创建数据库（若已有数据库可直接复用）。
2. 进入 **Workers & Pages -> Create application -> Pages -> Connect to Git**，选择本仓库：
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
3. 在 **Settings -> Functions -> D1 database bindings** 中绑定 D1 数据库：
   - 变量名填写 `DB`（用于存储说说动态，系统会在首次访问时自动建表 `oblivion_cms_moments`）。
   - 如需协同博客长文，按下方「博客长文（Posts）」章节绑定 `BLOG_DB`。

### 第二步：配置环境变量 (Settings -> Environment variables)

| 变量名 | 必填 | 说明 | 示例 |
| :--- | :---: | :--- | :--- |
| `CF_ACCESS_TEAM_DOMAIN` | 生产必填 | Cloudflare Zero Trust 团队域名 | `my-team.cloudflareaccess.com` |
| `CF_ACCESS_AUD` | 生产必填 | Cloudflare Access Application AUD 标识 | `xxxx-xxxx-xxxx` |
| `DEV_MODE` | 否 | 生产环境请留空或设为 `false` | `false` |
| `BLOG_WORKER_URL` | 博客 Worker 模式必填 | 博客内容 Worker 根地址（不要带 `/api`） | `https://oblivion-content.example.workers.dev` |
| `BLOG_PUBLISH_SECRET` | 博客 Worker 模式必填 | 与博客 Worker 的 `PUBLISH_SECRET` 一致（设为 Secret） | `secret` |
| `CF_ACCOUNT_ID` / `CF_D1_DATABASE_ID` / `CF_API_TOKEN` | 可选 | 仅在无 D1 原生 Binding 时用于 REST 直连 D1 | — |

---

### 第三步：配置 Cloudflare Access (Zero Trust) 保护

1. 打开 [Cloudflare Zero Trust 控制台](https://one.dash.cloudflare.com/)。
2. 进入 **Access -> Applications -> Add an application -> Self-hosted**。
3. 填写应用信息：
   - **Application name**: `Oblivion-CMS`
   - **Application domain**: 绑定您的自定义域名（例如 `cms.yourdomain.com`）或 Pages 域名。
4. 在 **Policies** 中添加策略：
   - **Action**: `Allow`
   - **Include**: 选择 `Emails`，填入允许登录您编辑器的个人邮箱。
5. 保存后，在 Application 详情页面复制 **Application Audience (AUD) Tag**，将其填入 Cloudflare Pages 的 `CF_ACCESS_AUD` 环境变量中，并将团队域名填入 `CF_ACCESS_TEAM_DOMAIN`。

#### 保护预览部署域名（防止绕开 Access 规则）
Cloudflare Pages 默认会为每次提交生成类似 `<hash>.pages.dev` 的预览域名。为了防止未经授权的访问通过默认 Pages 域名绕开 Access：
- 在 Cloudflare Pages 项目的 **Settings -> Access control** 中直接启用 Access 策略，或者将 Access Application 的域名通配设置为 `*.pages.dev`。

### 可选：通过 Cloudflare Access 启用 Passkey 登录

Cloudflare Access 原生支持 Passkeys，可在 Access 中验证现有身份后绑定通行密钥。CMS 继续使用原有 Access JWT 鉴权，无需新增账号系统、数据库表或环境变量，也无需放开 CMS 域名的 Access 保护。

1. 在 Cloudflare Zero Trust 打开 **Integrations → Identity providers → Add an identity provider**，选择 **Passkeys** 并保存。若已存在，直接检查其设置。可选开启 **Automatically prompt on the login page**。
2. 打开 **Access controls → Applications → CMS 应用 → Edit → Login methods**。若未启用 **Accept all available identity providers**，将 **Passkeys** 加入允许的登录方式，然后保存。保留现有邮箱/SSO 登录方式以便恢复账号。
3. 进入 CMS 的 Access 登录页，选择 **Sign in with a passkey → Don't have a passkey? Set one up**。使用已有登录方式验证身份，输入密钥名称，点击 **Add passkey**，按浏览器或系统提示完成绑定。
4. 后续选择 **Sign in with a passkey**，使用设备指纹、面容、PIN 或支持用户验证的安全密钥登录。使用 **Manage passkeys** 可添加、重命名与删除通行密钥。

绑定 Passkey 不会自动授予 CMS 权限，仍需满足 Access 的允许策略。Passkey 登录不会从其他身份提供商获取用户组或自定义属性；若策略依赖这些属性，需要检查兼容性。删除密钥会阻止后续登录；若还要终止既有 Access 会话，需要另行撤销会话。

上述开关需在 Cloudflare 控制台配置，仅更新 CMS 代码不会启用它。配置后可退出当前 Access 会话或用无痕窗口验证；本地模拟登录不创建真实 Passkey。浏览器中的密钥绑定操作由用户本人完成。

参考：[Cloudflare Access Passkeys 官方文档](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/passkeys/)。

---

## 🛠️ 常见问题与排查 (FAQ)

### Q1: 提示“409 CONFLICT: 检测到版本冲突”怎么办？
- **原因**：在您打开页面到点击发布的这段时间内，D1 数据库中的说说数据已被其他客户端修改，远程版本 SHA 与您本地编辑时的基准 SHA 不一致。
- **解决办法**：系统会自动弹出冲突处理弹窗，保护您的本地草稿不被覆盖。您可以点击“复制草稿 JSON 备份”，然后选择“拉取最新远程数据”或“强制覆盖发布”。

### Q2: 批量导入 `moments.ts` 时提示动态表达式错误怎么办？
- **原因**：AST 解析器检测到对象中含有非静态字面量的 JavaScript 动态表达式（如 `Date.now()`、Spread 运算符 `...props` 或函数调用）。
- **解决办法**：建议先在原文件或粘贴文本中将动态字段替换为常量值（例如具体的毫秒时间戳数字），或导出为标准 JSON 数组后再导入。

### Q3: 本地草稿会同步到其他设备吗？
- **不会**。未发布草稿使用浏览器的 IndexedDB 存储，严格隔离在当前浏览器和当前设备中。只有点击“发布”后，内容才会提交到 Cloudflare D1 或博客 Worker。

---

## D1 与已有博客数据库共用

CMS 的说说数据默认保存在独立表 `oblivion_cms_moments` 中，首次访问时自动创建。
已有博客的 `articles` 表（如 `id/title/date/content` 结构）不会被读取、覆盖或删除；空表不会自动填充示例内容。

若数据库仍使用旧版 CMS 的 `articles` 表（包含 `time/content/media/tags/location/music/created_at/updated_at`），
且独立说说表不存在，程序会继续使用旧表以保留已有说说。此时无需手动执行 `schema.sql`。

出现 `no such column: time` 时，部署包含此兼容逻辑的新版本即可，
无需删除博客表或给博客文章强行添加时间戳字段。博客文章不会自动转换为说说。

---

## 博客长文（Posts）

左侧导轨可切换「说说动态 / 博客长文」，模式保存在 localStorage。博客编辑器支持 GFM、表格、任务列表、目录、常见语言代码高亮，以及 Ctrl/⌘+B、Ctrl/⌘+I、Tab 缩进。预览经过 DOMPurify 清理。首次进入博客模式才加载编辑器及拼音词典。

博客草稿按 `post:<编辑器 UUID>` 写入 IndexedDB，700ms 防抖，在切换文章和发布前等待保存提交；Slug 编辑不会改变草稿身份。动态草稿使用 `moment:<原 ID>`，继续读取旧版无前缀草稿。新草稿、未发布修改、恢复和清空均独立于动态。清空当前草稿会恢复线上内容。浏览器清除站点数据也会删除本地草稿。

### 部署配置

- Pages 服务端设置 `BLOG_WORKER_URL` 和 Secret `BLOG_PUBLISH_SECRET`，后者与 `oblivion-content` 的 `PUBLISH_SECRET` 相同。不要使用 `VITE_` 前缀。
- 博客管理接口严格校验 Access JWT 的签名、issuer 与 audience，配置 `CF_ACCESS_TEAM_DOMAIN`、`CF_ACCESS_AUD`，并用 Access 保护 CMS 域名。
- **编辑既有 Worker 文章还需将博客的同一 D1 以 `BLOG_DB` 名称绑定到 Pages，并重新部署**。说说继续使用 `DB`；`BLOG_DB` 是数据库绑定，不是文本环境变量。未配置 `BLOG_DB` 时兼容原有 D1 配置。当前 Worker 隐藏 `source_path`，而 upsert 会覆盖这个字段；CMS 从 D1 读取该映射后原样传回。没有绑定时拒绝更新，以免破坏 Obsidian/原始 Markdown 文件的 ID 映射。创建、读取和删除可仅通过 Worker 工作。
- 不设置 Worker URL 时，复用原有 D1 绑定/REST API 配置，按博客结构创建 `articles`。不会修改 `oblivion_cms_moments`。如果 `articles` 仍为旧动态结构则拒绝操作，不覆盖旧数据。
- D1 直连不会调用 Worker 的缓存清理，界面会提示这一点。配置了 Worker 后的网络或认证失败不会退回模拟成功。
- 仅 localhost 显式启用开发认证时使用服务端内存模拟；纯 Vite 本地运行也有明确标记的内存适配器。模拟发布不是上线，刷新/重启可能丢失；IndexedDB 草稿仍保留。

接口：`GET /api/posts?page=1&pageSize=20&q=关键词`、`GET /api/posts/:id`、`POST /api/posts/publish`（`{ post: BlogPost, originalId?: string }`）、`DELETE /api/posts/:id`。创建时不传 originalId；修改时必须与现有 id 相同。已发布 Slug 固定，避免遗留旧链接或产生重复文章。标题、摘要和正文同时支持纯文本或语言对象（例如 `{ "zh": "中文", "en": "English" }`）。顶部操作栏与底部 Meta Dock 中可切换已有语言、一键添加中英文版本，并按当前语言预览；发布与本地草稿保存完整语言对象，未编辑的语言保持原样。列表优先显示中文，再回退到英文或其他非空语言。纯文本字段默认各语言共用，可点击「分语言」后独立编辑。日期同时兼容 `YYYY-MM-DD`、已有的 `YYYY-MM-DD HH:mm:ss` 及 ISO 时间格式；修改日期时保留原时间和时区后缀。阅读字数按当前语言显示，发布的 `chars` 为各语言非空白字符总数。

### Worker 协议与验证范围

此适配器对接现有 `/api/articles`、`/api/articles/:id` 与 `/api/publish`。现有 publish 是全量同步语义：CMS 每次读取不带缓存的完整 ID 列表，然后只 upsert 当前文章，并将全部保留 ID 放入 `activeIds`。删除同样发送空 `articles` 和剔除目标后的 `activeIds`，因此由 Worker 执行原有 `cache.purge()` 流程。Worker 当前只在日志里记录 purge 失败，CMS 无法确认每个边缘节点已清理。

**现有 Worker 没有原子增量发布或版本条件接口，读取 ID 到写入之间仍存在并发窗口。请串行发布，避免同时运行其他 CMS / Obsidian 全量同步。** 真正支持并发写入需要 Worker 增加事务内的单篇更新/删除接口；仅靠 Pages 代理无法保证跨客户端同步互斥。

执行 `npm run check` 可检查前端、Pages Functions 类型和自动化测试；`npm run build` 构建生产产物。

### 界面样式

CMS 统一使用 `styled-components`，组件样式与组件放在同目录的 `*.styles.ts` 中；全局重置、设计变量和安全区域设置位于 `src/styles/GlobalStyle.ts`。深浅主题沿用根元素的 `dark` 状态。动态样式使用 `$` 前缀的 transient props，避免将样式状态传入 DOM。博客正文与代码高亮样式限定在预览组件内。无需 Tailwind 或额外 CSS 编译插件。

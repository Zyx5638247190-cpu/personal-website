# 技术设计文档 · 黄色奶龙个人站

| 项目 | 内容 |
| --- | --- |
| 对应 PRD | `PRD.md` v1.0 |
| 文档版本 | v1.0 |
| 日期 | 2026-10-18 |
| 技术定位 | 纯前端 SPA，静态部署，零后端 |
| 目标读者 | 实现者（本人）、后续维护者 |

---

## 1. 设计目标与约束

### 1.1 目标

用最小依赖实现 PRD 的全部 MVP 功能：6 个页面/区块、深色/浅色主题、Canvas 星空、内联 SVG 奶龙、localStorage 数据层；首屏 JS ≤ 200KB（gzip），移动端 375px 无横向滚动。

### 1.2 硬约束

| 约束 | 决策 |
| --- | --- |
| 框架 | React 18+ + TypeScript（strict） |
| 构建 | Vite |
| 样式 | Tailwind CSS，语义色走 CSS 变量 |
| 路由 | React Router（声明式模式） |
| 数据 | localStorage 模拟后端，接口层异步化 |
| UI 库 | **不引入** Ant Design / MUI / Chakra / shadcn 等；组件全部自写 |
| 图标 | 自绘内联 SVG，不引入图标库 |
| 后端 | 无 |

### 1.3 非目标

不做 SSR、不做服务端接口、不做账号体系、不做实时数据。这些由 PRD「明确不做」约束。

---

## 2. 技术栈

### 2.1 依赖清单

**运行时依赖**

| 包 | 版本建议 | 用途 | 备注 |
| --- | --- | --- | --- |
| `react` / `react-dom` | ^18.3 或 ^19 | UI | |
| `react-router-dom` | ^7 | 路由 | 只用声明式 API，不用框架模式 |
| `react-markdown` + `remark-gfm` | 最新 | 博客正文渲染 | **仅在 `/blog/:slug` 路由内动态 import**，见 9.4 |
| `rehype-highlight` | 最新 | 代码高亮 | 同上，随详情页 chunk 加载 |

**开发依赖**

| 包 | 用途 |
| --- | --- |
| `vite` + `@vitejs/plugin-react` | 构建与 HMR |
| `typescript` | 类型检查 |
| `tailwindcss` + `@tailwindcss/vite` | 样式（v4 CSS-first 配置） |
| `@types/react` / `@types/react-dom` / `@types/node` | 类型 |
| `vitest` + `@testing-library/react` + `jsdom` | 单元/组件测试 |
| `@playwright/test` + `@axe-core/playwright` | E2E 与可访问性 |
| `eslint` + `prettier` | 代码规范 |

> 版本策略：以安装时的最新稳定版为准。Tailwind 若锁定 v3.4，改用附录 B 的 JS 配置写法，组件类名保持一致（`bg-surface` 等语义名通过 `theme.extend.colors` 映射 CSS 变量）。

### 2.2 明确不引入

- 状态管理库（Redux/Zustand/Jotai）：本项目的全局状态只有「主题」和「Toast」，Context 足够。
- 动画库（Framer Motion/GSAP）：动效全部用 CSS `transition`/`keyframes` + 少量原生 RAF。
- 组件库、图标库、日期库（用 `Intl.DateTimeFormat`）。
- 粒子库（tsparticles 等）：包体大且难以精确控制性能，自己写 80 行 Canvas。

---

## 3. 项目结构

```
personal-website/
├─ public/
│  ├─ favicon.svg                # 奶龙头像
│  ├─ og-default.png             # 1200×630 分享图
│  └─ robots.txt
├─ scripts/
│  ├─ generate-sitemap.mjs       # 构建后基于种子数据生成 sitemap.xml
│  └─ check-links.mjs            # 可选：外链可用性检查
├─ src/
│  ├─ main.tsx                   # 挂载、Router、Providers
│  ├─ App.tsx                    # 布局壳 + <Routes>
│  ├─ index.css                  # Tailwind 入口 + 设计 token + keyframes
│  │
│  ├─ components/                # 公共组件（不含业务数据）
│  │  ├─ layout/
│  │  │  ├─ Navbar.tsx
│  │  │  ├─ MobileMenu.tsx
│  │  │  ├─ Footer.tsx
│  │  │  └─ PageShell.tsx
│  │  ├─ mascot/
│  │  │  ├─ DragonMascot.tsx     # 内联 SVG，mood/size 驱动
│  │  │  ├─ MascotEyes.tsx       # 眼睛与眼神跟随
│  │  │  └─ mascot.css           # 呼吸/眨眼/尾巴 keyframes
│  │  ├─ background/
│  │  │  ├─ Starfield.tsx
│  │  │  └─ starfield.ts         # 纯函数粒子引擎（可单测）
│  │  ├─ ui/
│  │  │  ├─ Button.tsx
│  │  │  ├─ Card.tsx
│  │  │  ├─ Tag.tsx
│  │  │  ├─ SectionHeading.tsx
│  │  │  ├─ Skeleton.tsx
│  │  │  ├─ EmptyState.tsx
│  │  │  ├─ Toast.tsx + ToastProvider.tsx
│  │  │  ├─ BackToTop.tsx
│  │  │  └─ ThemeToggle.tsx
│  │  ├─ sections/               # 首页业务区块（组合 ui + 数据）
│  │  │  ├─ HeroSection.tsx
│  │  │  ├─ AboutSection.tsx
│  │  │  ├─ SkillsSection.tsx
│  │  │  ├─ ProjectsSection.tsx
│  │  │  └─ ContactSection.tsx
│  │  ├─ cards/
│  │  │  ├─ ProjectCard.tsx
│  │  │  ├─ PostCard.tsx
│  │  │  └─ PostToc.tsx
│  │  └─ icons/index.tsx         # 手写内联 SVG 图标集合
│  │
│  ├─ pages/
│  │  ├─ Home.tsx                # 组合 5 个 section
│  │  ├─ About.tsx
│  │  ├─ Skills.tsx
│  │  ├─ Projects.tsx
│  │  ├─ Blog.tsx
│  │  ├─ PostDetail.tsx
│  │  └─ NotFound.tsx
│  │
│  ├─ api/                       # 数据接口层（唯一读写 localStorage 的地方）
│  │  ├─ client.ts               # storage 封装、延迟、错误
│  │  ├─ seed.ts                 # 默认内容（Profile/Skills/Projects/Posts）
│  │  ├─ profile.ts
│  │  ├─ skills.ts
│  │  ├─ projects.ts
│  │  ├─ posts.ts
│  │  └─ types.ts                # ApiError、分页参数等接口层类型
│  │
│  ├─ types/
│  │  ├─ models.ts               # Profile/Skill/Project/Post/SocialLink
│  │  └─ common.ts               # AsyncState、Theme、Breakpoint
│  │
│  ├─ hooks/
│  │  ├─ useAsync.ts
│  │  ├─ useTheme.ts
│  │  ├─ useHashScroll.ts
│  │  ├─ useDocumentMeta.ts
│  │  ├─ useMediaQuery.ts
│  │  └─ useToast.ts
│  │
│  ├─ context/
│  │  ├─ ThemeProvider.tsx
│  │  └─ ToastProvider.tsx
│  │
│  ├─ lib/
│  │  ├─ cn.ts                   # class 合并（10 行实现，不引 clsx）
│  │  ├─ date.ts                 # 日期格式化
│  │  └─ copy.ts                 # 剪贴板 + 降级
│  │
│  └─ content/
│     └─ posts/*.md              # 种子文章的正文源（构建期读入 seed.ts）
│
├─ index.html                    # 含防闪白内联脚本
├─ vite.config.ts
├─ tsconfig.json
├─ package.json
├─ PRD.md
├─ TECH_DESIGN.md
└─ README.md
```

**分层规则**

1. `pages/` 只做「取数 + 组装」，不写复杂 DOM 结构。
2. `components/` 不直接调用 `api/`（`sections/` 例外：它承担首页区块的数据获取，便于 Home 页面拆小块）。
3. `api/` 之外任何文件不得出现 `localStorage` 字样。
4. `types/` 只放类型，无运行时代码。

---

## 4. 数据模型

`src/types/models.ts`：

```ts
export type Theme = 'dark' | 'light';
export type Mood = 'happy' | 'sleepy' | 'curious' | 'sad' | 'celebrate';
export type SkillLevel = 1 | 2 | 3 | 4 | 5;
export type ProjectStatus = 'featured' | 'wip' | 'archived';

export interface SocialLink {
  id: string;
  label: string;          // "GitHub"
  href: string;
  icon: 'github' | 'mail' | 'rss' | 'juejin' | 'x' | 'wechat';
}

export interface Profile {
  name: string;
  handle: string;         // 用于页脚与 OG
  role: string;           // "前端工程师"
  tagline: string;        // 一句话介绍
  bio: string[];          // 2–3 段
  avatar: string;         // 头像路径或 data URI
  email: string;
  location: string;
  availability: {
    open: boolean;
    label: string;        // "正在寻找新机会"
  };
  quickFacts: Array<{ label: string; value: string }>;  // 2×2 卡片
  education: Array<{
    school: string;
    major: string;
    degree: string;
    period: string;
  }>;
  socials: SocialLink[];
}

export interface Skill {
  id: string;
  name: string;
  icon: string;           // 图标 key，对应 icons 注册表
  level: SkillLevel;
}

export interface SkillGroup {
  category: string;       // "前端" | "后端" | "工具与工程化" | "设计与其他"
  items: Skill[];
}

export interface Experience {
  id: string;
  period: string;         // "2023.06 — 至今"
  org: string;
  role: string;
  highlights: string[];
  tags?: string[];
}

export interface Project {
  slug: string;
  title: string;
  summary: string;
  cover?: string;
  tags: string[];
  links: { live?: string; repo?: string };
  date: string;           // "2026-05"
  status: ProjectStatus;
  featured: boolean;
  order?: number;
}

export interface Post {
  slug: string;
  title: string;
  summary: string;
  content: string;        // Markdown
  date: string;           // ISO "2026-09-12"
  tags: string[];
  cover?: string;
  readingTime: number;    // 构建期按中文字数计算
  draft?: boolean;
}
```

**派生类型**：`PostSummary = Omit<Post, 'content'>`。列表接口只返回摘要，避免把全文塞进列表响应（虽然后端是本地，仍保持接口形状正确）。

**约定**

- `SkillLevel` 用字面量联合，编译期禁止 0/6；种子数据禁止全 5（PRD 5.3）。
- 所有 `slug` 全局唯一，仅允许 `a-z0-9-`；`posts.ts` 与 `projects.ts` 在种子加载时做一次重复校验（开发环境 `console.warn`）。
- 日期存储为字符串而非 `Date`：localStorage 序列化简单，排序用字典序即可（ISO/`YYYY-MM` 格式天然有序）。

---

## 5. API 层设计（localStorage 模拟后端）

### 5.1 设计原则

- **接口异步化**：所有方法返回 `Promise`，带 120–300ms 随机延迟。这样页面必须处理 loading/error，将来换成真实 HTTP 时只改 `client.ts` 与各模块内部实现，页面零改动。
- **唯一入口**：`localStorage` 只在 `api/client.ts` 中出现。
- **种子自动填充**：首次访问（storage 为空）自动写入种子数据；用户清空数据后自动恢复，不会白屏。
- **失败可见**：读取损坏 JSON 时回退种子并记录日志，不抛给页面。
- **类型安全**：读写都经过泛型 + 运行时浅校验（字段缺失时合并种子）。

### 5.2 存储键与版本

| Key | 值 | 说明 |
| --- | --- | --- |
| `nd:v1:meta` | `{ schemaVersion: 1, seededAt: string }` | 数据版本，用于将来迁移 |
| `nd:v1:profile` | `Profile` | |
| `nd:v1:skills` | `SkillGroup[]` | |
| `nd:v1:experience` | `Experience[]` | 关于页时间线 |
| `nd:v1:projects` | `Project[]` | |
| `nd:v1:posts` | `Post[]` | 含正文 |
| `nd:theme` | `'dark' | 'light'` | 主题偏好（独立命名空间，清数据也不影响） |

> 前缀 `nd` = Naidragon。版本号进 key，未来 `v2` 可并行读取旧数据做迁移，不破坏已部署用户的本地内容。

### 5.3 核心实现骨架

```ts
// src/api/client.ts
const PREFIX = 'nd:v1';
export const STORAGE_KEYS = {
  meta: `${PREFIX}:meta`,
  profile: `${PREFIX}:profile`,
  skills: `${PREFIX}:skills`,
  experience: `${PREFIX}:experience`,
  projects: `${PREFIX}:projects`,
  posts: `${PREFIX}:posts`,
} as const;

export class ApiError extends Error {
  constructor(message: string, readonly code: 'NOT_FOUND' | 'STORAGE' | 'INVALID') {
    super(message);
    this.name = 'ApiError';
  }
}

const delay = (ms = 120 + Math.random() * 180) =>
  new Promise<void>((r) => setTimeout(r, ms));

let usable: boolean | null = null;
export function storageAvailable(): boolean {
  if (usable !== null) return usable;
  try {
    const k = '__nd_probe__';
    localStorage.setItem(k, '1');
    localStorage.removeItem(k);
    usable = true;
  } catch {
    usable = false;          // 隐私模式 / 配额满 / 被禁用
  }
  return usable;
}

const memory = new Map<string, string>();   // 降级：内存模式

export function read<T>(key: string, fallback: T): T {
  try {
    const raw = storageAvailable() ? localStorage.getItem(key) : memory.get(key) ?? null;
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    console.warn(`[api] failed to parse ${key}, fallback to seed`);
    return fallback;
  }
}

export function write<T>(key: string, value: T): void {
  try {
    const raw = JSON.stringify(value);
    if (storageAvailable()) localStorage.setItem(key, raw);
    else memory.set(key, raw);
  } catch (e) {
    throw new ApiError('本地存储写入失败，可能是空间已满', 'STORAGE');
  }
}

export function ensureSeeded<T>(key: string, seed: T): T {
  const current = read<T | null>(key, null);
  if (current !== null) return current;
  write(key, seed);
  return seed;
}

export async function simulate<T>(fn: () => T): Promise<T> {
  await delay();
  return fn();
}
```

### 5.4 模块接口约定

```ts
// profile.ts
export const profileApi = {
  get(): Promise<Profile>;
  update(patch: Partial<Profile>): Promise<Profile>;   // 预留，不做 UI
};

// skills.ts
export const skillsApi = {
  list(): Promise<SkillGroup[]>;
};

// projects.ts
export const projectsApi = {
  list(params?: { status?: ProjectStatus | 'all'; tag?: string }): Promise<Project[]>;
  getBySlug(slug: string): Promise<Project>;           // 不存在抛 NOT_FOUND
};

// posts.ts
export const postsApi = {
  list(params?: { tag?: string; page?: number; pageSize?: number }):
    Promise<{ items: PostSummary[]; total: number; hasMore: boolean }>;
  getBySlug(slug: string): Promise<Post>;
  getAdjacent(slug: string): Promise<{ prev?: PostSummary; next?: PostSummary }>;
  tags(): Promise<Array<{ tag: string; count: number }>>;
};
```

**错误约定**：查不到资源统一抛 `ApiError(code: 'NOT_FOUND')`；页面捕获后渲染奶龙 404 区块，而不是跳到 `/404`（避免地址栏变化造成「URL 有效但内容不存在」的困惑，博客详情除外——详情页 404 时也保留 URL）。

### 5.5 缓存与去重

- 内存级缓存：每个 `list()` 结果缓存 60s，键为 `模块:参数 JSON`；详情页读写完成后失效。避免同一页面重复触发的闪烁。
- 请求去重：模块内维护 `Map<string, Promise<T>>`，相同参数的并发调用共用一个 Promise。
- 不做 localStorage 之外的持久化，刷新后重新读本地数据（很快，无需 IndexedDB）。

### 5.6 局限与应对

| 局限 | 影响 | 应对 |
| --- | --- | --- |
| 单浏览器、单设备 | 换设备看不到数据 | 内容以种子代码为「真实来源」，localStorage 只作为可覆盖层；README 说明如何修改种子 |
| 容量约 5MB | 文章多了会写失败 | 单篇正文限制 ≤ 40KB；写入失败抛 `STORAGE` 并 toast 提示 |
| 用户清缓存即丢失 | 自定义内容消失 | 同上，种子自动恢复，站点不崩 |
| 隐私模式不可写 | Safari 私密窗口报错 | `storageAvailable()` 降级到内存 Map，仅当次会话有效 |
| 无并发控制 | 多标签页数据不一致 | 订阅 `storage` 事件刷新主题；内容区 MVP 不做同步 |

---

## 6. 路由与应用壳

### 6.1 路由表

| 路径 | 组件 | 加载方式 | 说明 |
| --- | --- | --- | --- |
| `/` | `Home` | 同步（首屏） | Hero + About + Skills + Projects + Contact |
| `/blog` | `Blog` | `lazy` | 列表 + 标签筛选（`?tag=`） |
| `/blog/:slug` | `PostDetail` | `lazy` | Markdown 渲染器随此 chunk 加载 |
| `*` | `NotFound` | 同步 | 奶龙举 404 牌 |

PRD 中 `/projects/:slug` 属二期，路由预留但先隐藏入口。

### 6.2 应用壳

```tsx
// main.tsx
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
```

```tsx
// App.tsx
export default function App() {
  return (
    <div className="relative min-h-dvh bg-bg text-text">
      <Starfield />
      <a className="skip-link" href="#main">跳到主要内容</a>
      <Navbar />
      <main id="main" className="relative z-10">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<PostDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
```

### 6.3 滚动行为

- 新增 `ScrollManager`：监听 `useLocation()`，路径变化时 `window.scrollTo(0, 0)`；带 `location.hash` 时滚动到对应 `id` 元素，并补偿固定导航高度（`scroll-margin-top: 88px` 写在 CSS 中）。
- 首页导航项使用 `Link to="/#about"`，从其他页面点击时先回首页再定位。
- 锚点高亮：`IntersectionObserver`（`rootMargin: '-40% 0px -55% 0px'`）监听各 section，更新 Navbar 当前项；仅在首页启用。

---

## 7. 主题系统（黄色奶龙主题）

### 7.1 Token 分层

```
设计变量（PRD 6.1）
   ↓
CSS 变量：--bg / --surface / --text / --primary-*（按 data-theme 切换）
   ↓
Tailwind @theme inline：--color-bg / --color-surface / --color-primary-500 …
   ↓
组件类名：bg-bg / text-text-muted / bg-primary-500 / border-border
```

好处：换主色只改 `--primary-*` 一组值；改深浅模式只改 `[data-theme]` 块；组件内**禁止**出现十六进制颜色。

### 7.2 CSS 变量定义

```css
/* src/index.css */
@import "tailwindcss";
@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));

@theme {
  --font-sans: -apple-system, "PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif;
  --breakpoint-mobile: 375px;
  --breakpoint-tablet: 640px;
  --breakpoint-desktop: 1024px;
  --breakpoint-wide: 1440px;
  --radius-card: 8px;
  --radius-button: 20px;
}

@theme inline {
  --color-bg: var(--bg);
  --color-bg-soft: var(--bg-soft);
  --color-surface: var(--surface);
  --color-surface-hover: var(--surface-hover);
  --color-border: var(--border);
  --color-border-strong: var(--border-strong);
  --color-text: var(--text);
  --color-text-muted: var(--text-muted);
  --color-text-dim: var(--text-dim);
  --color-primary-300: var(--primary-300);
  --color-primary-400: var(--primary-400);
  --color-primary-500: var(--primary-500);
  --color-primary-600: var(--primary-600);
  --color-primary-glow: var(--primary-glow);
}

:root,
[data-theme="dark"] {
  color-scheme: dark;
  --bg: #0b0b12;
  --bg-soft: #12121c;
  --surface: #171723;
  --surface-hover: #1e1e2c;
  --border: rgb(255 255 255 / 0.08);
  --border-strong: rgb(255 202 40 / 0.45);
  --text: #f5f5f7;
  --text-muted: #a0a0b2;
  --text-dim: #6e6e80;

  --primary-300: #ffe082;
  --primary-400: #ffd54f;
  --primary-500: #ffca28;
  --primary-600: #ffb300;
  --primary-glow: rgb(255 202 40 / 0.35);
  --primary-gradient: linear-gradient(135deg, #ffd54f 0%, #ffca28 50%, #ffb300 100%);
  --star-opacity: 1;
}

[data-theme="light"] {
  color-scheme: light;
  --bg: #fffdf7;
  --bg-soft: #fff8e6;
  --surface: #ffffff;
  --surface-hover: #fffaf0;
  --border: rgb(0 0 0 / 0.08);
  --border-strong: rgb(176 120 0 / 0.35);
  --text: #1a1a22;
  --text-muted: #5c5c6b;
  --text-dim: #7a7a88;

  --primary-300: #ffe9a8;
  --primary-400: #ffd54f;
  --primary-500: #ffca28;
  --primary-600: #ffb300;
  --primary-glow: rgb(255 179 0 / 0.22);
  --star-opacity: 0.35;
}
```

**可读性规则**（PRD AC-13）：浅色模式下黄色正文改用 `--primary-ink: #b07800`（单独声明，仅文字用），亮黄只用于底色与装饰。

### 7.3 防闪白（FOUC）

`index.html` 在 `<head>` 最前面放内联脚本（不经打包，避免延迟）：

```html
<script>
  (function () {
    try {
      var t = localStorage.getItem('nd:theme');
      if (t !== 'dark' && t !== 'light') t = 'dark';   // PRD：默认深色
      document.documentElement.dataset.theme = t;
    } catch (e) {
      document.documentElement.dataset.theme = 'dark';
    }
  })();
</script>
```

### 7.4 ThemeProvider

```tsx
type ThemeCtx = {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
};

const ThemeContext = createContext<ThemeCtx | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(
    () => (document.documentElement.dataset.theme as Theme) || 'dark'
  );

  const setTheme = useCallback((t: Theme) => {
    document.documentElement.dataset.theme = t;
    try { localStorage.setItem('nd:theme', t); } catch {}
    setThemeState(t);
  }, []);

  const toggle = useCallback(
    () => setTheme(theme === 'dark' ? 'light' : 'dark'),
    [theme, setTheme]
  );

  // 多标签页同步
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'nd:theme' && (e.newValue === 'dark' || e.newValue === 'light')) {
        document.documentElement.dataset.theme = e.newValue;
        setThemeState(e.newValue);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return <ThemeContext.Provider value={{ theme, toggle, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
```

**注意**：读取 `dataset.theme` 必须在首帧渲染前完成（内联脚本已保证）；不要在 `useEffect` 里初始化，否则会有一次闪白。

---

## 8. 奶龙吉祥物（内联 SVG）

### 8.1 组件 API

```ts
interface DragonMascotProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | number;  // 32 / 64 / 160 / 280 / px
  mood?: Mood;
  animated?: boolean;      // 默认 true，但 reduced-motion 下自动关闭
  followCursor?: boolean;  // 默认 false，仅 Hero 开启
  className?: string;
  title?: string;          // 提供时可访问；纯装饰不传
}
```

### 8.2 SVG 结构

`viewBox="0 0 200 200"`，按组拆分，便于单独动画：

```
<svg viewBox="0 0 200 200" role={title ? 'img' : 'presentation'}>
  <defs>
    <linearGradient id="body" ...>#FFD54F → #FFCA28</linearGradient>
    <radialGradient id="belly" ...>#FFE082</radialGradient>
  </defs>
  <g class="mascot-tail">…</g>          <!-- transform-origin: 尾根 -->
  <g class="mascot-body">…</g>
  <g class="mascot-belly">…</g>
  <g class="mascot-horns">…</g>
  <g class="mascot-face">
    <g class="mascot-eye left">  <circle r="14" fill="#2A2A33"/><circle r="4" fill="#fff"/></g>
    <g class="mascot-eye right"> … </g>
    <path class="mascot-mouth" d="…" />
    <circle cx="70" cy="118" r="6" fill="#FF9E3D" opacity=".35"/>  <!-- 腮红 -->
  </g>
  <g class="mascot-arms">…</g>
  <g class="mascot-star">…</g>          <!-- 抱着的星星 -->
</svg>
```

**实现要点**

- 用 `mood` 映射表切换嘴部/眼睛路径，而非缩放整图：`const MOUTH: Record<Mood, string>`。
- 眼神跟随：容器上设置 CSS 变量 `--look-x` / `--look-y`（-1~1），瞳孔组 `transform: translate(calc(var(--look-x) * 3px), calc(var(--look-y) * 3px))`。JS 只在 `pointermove` 时用 `requestAnimationFrame` 写变量，节流到 ≤ 30fps，`pointerleave` 归零。
- 动画全部在 `mascot.css`：`breathe 3s ease-in-out infinite`、`blink 6s infinite`（关键帧只含 0%/96%/100%）、尾巴 `sway 4s`。
- 减少动效：`@media (prefers-reduced-motion: reduce) { .mascot * { animation: none !important; transition: none !important; } }`。
- 小尺寸 32px 只渲染头部组（`variant="head"` 内部裁剪 `viewBox="20 20 160 150"`），保证 Logo 可辨识（PRD AC-16）。
- 不使用 `<filter>` 的高斯模糊做发光（移动端开销大），改用外圈描边 + 低透明圆形模拟光晕。

### 8.3 出场映射

| 位置 | 组件用法 |
| --- | --- |
| Navbar Logo | `<DragonMascot size="xs" variant="head" animated={false} />` |
| Hero | `<DragonMascot size="lg" mood="happy" followCursor />` |
| 关于区 | `size="md" mood="curious"`，绝对定位右下角 |
| EmptyState | `size="sm" mood={mood}`，由 props 传入 |
| 404 | `size="md" mood="sad"` + 牌子元素 |
| 加载 | `size="md" mood="sleepy" animated` + 旋转星星 |

---

## 9. 星空背景

### 9.1 组件职责

`<Starfield />` 只负责：创建 canvas、管理尺寸与 DPR、启动/停止 RAF、清理监听。粒子算法放在 `starfield.ts` 的纯函数/类中，便于单测与复用。

### 9.2 参数与分档（对应 PRD 9.2）

| 视口宽 | 粒子数 | 说明 |
| --- | --- | --- |
| < 640 | 90 | 手机 |
| 640–1023 | 160 | 平板 |
| ≥ 1024 | 240 | 桌面 |
| `prefers-reduced-motion` | 0 | 只画静态星点（一帧） |

其他参数：`dpr = Math.min(devicePixelRatio, 2)`；星点半径 0.4–1.6px；基础透明度 0.2–0.7；闪烁周期 2.5–6s 随机相位；10% 星点用 `#FFD54F`。

### 9.3 实现骨架

```ts
// src/components/background/starfield.ts
export interface Star { x: number; y: number; r: number; base: number; phase: number; speed: number; warm: boolean }

export function createStars(count: number, w: number, h: number): Star[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: 0.4 + Math.random() * 1.2,
    base: 0.2 + Math.random() * 0.5,
    phase: Math.random() * Math.PI * 2,
    speed: 0.4 + Math.random() * 1.2,
    warm: Math.random() < 0.1,
  }));
}

export function drawStars(
  ctx: CanvasRenderingContext2D,
  stars: Star[],
  w: number,
  h: number,
  t: number,               // 秒
  opacity: number
) {
  ctx.clearRect(0, 0, w, h);
  for (const s of stars) {
    const a = (s.base + Math.sin(t * s.speed + s.phase) * 0.18) * opacity;
    ctx.globalAlpha = Math.max(0, Math.min(1, a));
    ctx.fillStyle = s.warm ? '#FFD54F' : '#FFFFFF';
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}
```

```tsx
// Starfield.tsx（要点，非完整实现）
const canvasRef = useRef<HTMLCanvasElement>(null);
const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');

useEffect(() => {
  const canvas = canvasRef.current!;
  const ctx = canvas.getContext('2d', { alpha: true })!;
  let raf = 0;
  let stars: Star[] = [];
  let w = 0, h = 0;

  const setup = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    stars = createStars(pickCount(w), w, h);
  };

  const loop = (ts: number) => {
    drawStars(ctx, stars, w, h, ts / 1000, themeStarOpacity());
    raf = requestAnimationFrame(loop);
  };

  const start = () => {
    setup();
    if (reduced.matches) {
      drawStars(ctx, stars, w, h, 0, themeStarOpacity()); // 静态一帧
      return;
    }
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(loop);
  };

  start();

  let resizeTimer = 0;
  const onResize = () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(start, 200);         // 防抖
  };
  const onVisibility = () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else if (!reduced.matches) raf = requestAnimationFrame(loop);
  };

  window.addEventListener('resize', onResize);
  document.addEventListener('visibilitychange', onVisibility);
  return () => {
    cancelAnimationFrame(raf);
    window.clearTimeout(resizeTimer);
    window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVisibility);
  };
}, [reduced.matches]);
```

**主题联动**：星空透明度读取 CSS 变量 `--star-opacity`（深色 1 / 浅色 0.35），用 `getComputedStyle(document.documentElement).getPropertyValue()` 在主题切换后重取，避免为每个星点单独判断主题。

### 9.4 层级与性能

```css
.starfield {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  contain: strict;             /* 限制重排范围 */
}
```

- canvas 为 `position: fixed`，滚动时浏览器只做合成，不重绘内容（对应 PRD AC-18）。
- 不监听 `scroll`，不做视差。
- 每帧仅 `clearRect + arc`，实测桌面 < 1.5ms / 240 粒子。
- 若低端设备实测掉帧（`requestAnimationFrame` 帧间隔 P95 > 33ms 连续 2s），降档：粒子数 ×0.5 并关闭闪烁（透明度固定）。
- 禁止在 canvas 上使用 `filter: blur()`、`box-shadow`（会触发全屏重绘）。

### 9.5 静态降级

`prefers-reduced-motion: reduce` → 只渲染一帧；若不支持 canvas 或 `getContext` 返回 null → 用 CSS 渐变 + 一个内联 SVG 星点图案（`background-image: radial-gradient`）兜底。

---

## 10. 页面实现要点

### 10.1 首页

```
<Home>
  <HeroSection />       // 同步渲染，奶龙 + 姓名 + CTA
  <AboutSection />      // 懒加载数据，Skeleton 占位
  <SkillsSection />
  <ProjectsSection />   // 只展示 featured/最新 3 条 + "查看全部"
  <ContactSection />
</Home>
```

- 数据全部在 `sections` 内用 `useAsync` 拉取，各自独立 loading，互不阻塞。
- 区块标题统一 `<SectionHeading eyebrow="关于" title="…" desc="…" />`。
- 进入视口动画：`<Reveal>` 包装器（IntersectionObserver + CSS），只触发一次，`reduced-motion` 下直接可见。

### 10.2 关于

- 桌面：左侧文字（sticky 在 1024px+），右侧时间线；移动端纵向堆叠。
- 时间线数据来自 `experience`；超过 6 条折叠，展开按钮记录在组件本地 state。
- 教育背景用同一 `Timeline` 组件的紧凑变体。

### 10.3 技能

- 分组卡片；进度条为 5 个 `<span>`，填充靠 CSS `width` + 逐项 `transition-delay`。
- 首次进入视口触发填充：`data-filled="true"` 由 IntersectionObserver 设置。
- 无障碍：容器 `role="meter" aria-valuemin={1} aria-valuemax={5} aria-valuenow={level} aria-label={`${name} 熟练度`}`。

### 10.4 项目

- 筛选 chips 写在 URL query（`?status=featured`），用 `useSearchParams`，刷新保持（PRD AC-05 同理）。
- 卡片封面：`loading="lazy"`、`decoding="async"`、固定 `aspect-[16/10]` 防 CLS；`onError` 切到奶龙占位 SVG。
- 外链统一 `<a target="_blank" rel="noopener noreferrer">`，并加 `aria-label="在新窗口打开"`。

### 10.5 博客

- 列表：`postsApi.list({ page, pageSize: 6, tag })`；「加载更多」追加，不做无限滚动。
- 标签筛选改变时重置 page 并 `scrollTo` 列表顶部。
- 详情：
  - `useParams()` 取 slug → `getBySlug`；`NOT_FOUND` → 渲染 `<PostMissing />`（奶龙 + 回列表）。
  - `React.lazy` 加载 `PostBody`（内含 react-markdown），避免首屏体积。
  - 代码块：`components/pre` 自定义渲染，右上角复制按钮，复制后 `toast('嗷！复制好了')`。
  - 目录 `PostToc`：`useEffect` 里查询 `article h2, h3` 生成锚点，`IntersectionObserver` 高亮；桌面 ≥ 1280 显示。
  - 阅读进度条：监听 `scroll`（`passive: true`），用 `requestAnimationFrame` 合并更新，且仅在详情页挂载。

### 10.6 联系

- 邮箱按钮 `href="mailto:..."`；复制按钮调用 `navigator.clipboard.writeText`，失败降级 `document.execCommand('copy')`（临时 textarea）。
- 微信二维码用 `<dialog>` 或自写遮罩层，焦点陷阱 + Esc 关闭。

---

## 11. 通用 Hooks 与工具

```ts
// useAsync.ts
export function useAsync<T>(
  fn: () => Promise<T>,
  deps: unknown[] = []
): { data: T | null; loading: boolean; error: Error | null; refetch: () => void } {
  const [state, setState] = useState<{ data: T | null; loading: boolean; error: Error | null }>({
    data: null, loading: true, error: null,
  });

  const run = useCallback(() => {
    let alive = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    fn()
      .then((data) => alive && setState({ data, loading: false, error: null }))
      .catch((error) => alive && setState({ data: null, loading: false, error }));
    return () => { alive = false; };
  }, deps);   // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(run, [run]);
  return { ...state, refetch: run };
}
```

其他 hook：

| Hook | 职责 |
| --- | --- |
| `useMediaQuery(query)` | 响应式判断（reduced-motion、桌面 hover） |
| `useHashScroll()` | 处理 `/#section` 定位与导航高度补偿 |
| `useDocumentMeta({title, description, image})` | 写 `document.title` 与 meta（SPA 轻量 SEO） |
| `useToast()` | 取 `toast(message, type?)`，2s 自动消失，最多同时 3 条 |
| `useLocalStorage(key, initial)` | 仅用于主题等 UI 偏好；业务数据走 `api/` |

`cn.ts`：

```ts
export const cn = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(' ');
```

---

## 12. 样式与组件规范

### 12.1 类名约定

- 只写语义 token：`bg-surface`、`text-text-muted`、`border-border`、`bg-primary-500`。
- 禁止 `bg-[#FFCA28]`、`text-[13px]` 这类魔法值（一次性的动画参数除外，需注释原因）。
- 重复 3 次以上的组合抽成组件（Button/Card/Tag），不抽 `@apply` 大杂烩。

### 12.2 响应式策略

- 移动优先，`sm/md/lg` 只做增强。
- 断点：`sm: 640`、`md: 768`（可选）、`lg: 1024`、`xl: 1280`（TOC）、`2xl: 1440`。
- 375px 保险：全局 `body { overflow-x: clip; }` 仅作为兜底，**根因仍要修**（PRD AC-11 要求 `scrollWidth <= 375`，靠 clip 隐藏不算通过）。
- 长文本：`break-words` / `[overflow-wrap:anywhere]`；代码块 `overflow-x: auto` 且 `max-w-full`。

### 12.3 共享组件清单

| 组件 | 关键 props | 说明 |
| --- | --- | --- |
| `Button` | `variant: primary \| ghost \| text`、`as`、`size` | 渲染 `<button>` 或 `<a>`，统一焦点环 |
| `Card` | `interactive?: boolean` | 悬停上浮与描边转黄 |
| `Tag` | `active?`、`onClick?` | 可点击时渲染 `<button aria-pressed>` |
| `SectionHeading` | `eyebrow, title, desc` | 统一区块间距与字号 |
| `Skeleton` | `className` | 纯色块 + 微光扫过（reduced-motion 下静止） |
| `EmptyState` | `mood, title, desc, action` | 内置奶龙 |
| `PageLoader` | — | 奶龙 + 三个跳动星点 |
| `Toast` | — | `role="status"`，`aria-live="polite"` |
| `BackToTop` | — | 滚动 > 600px 显示，`passive` 监听 + rAF 节流 |

---

## 13. 性能设计

| 指标 | 预算 | 手段 |
| --- | --- | --- |
| 首屏 JS（gzip） | ≤ 200KB | 路由级 `lazy`；Markdown 渲染器只在详情页加载；不引 UI/动画库 |
| CSS | ≤ 40KB | Tailwind 按需生成；无 UI 库样式 |
| LCP | < 2.5s（4G） | Hero 文字优先渲染、奶龙 SVG 内联（无请求）、字体 `font-display: swap` |
| CLS | < 0.1 | 封面/头像固定宽高比；Skeleton 尺寸与真实内容一致 |
| FPS | 桌面 ≥ 50，中端安卓 ≥ 30 | canvas 分档 + DPR≤2 + 页面隐藏暂停 |
| 图片 | 单张 ≤ 200KB | WebP/AVIF、`loading="lazy"`、`srcset`（封面两档） |

**代码分割**：`React.lazy` + `<Suspense>`；`PostBody`（markdown 栈）再拆一层，进入详情页才下载。

**字体**：不引入中文网络字体（体积过大），标题圆润效果用系统字体 + 字重/字距实现；如需 Logo 字体，仅子集化加载 woff2 且 `preload` 单个文件。

**图片策略**：项目封面放 `public/covers/`，构建时不处理；建议 1200×750 与 600×375 两档。

---

## 14. 可访问性实现

| PRD 要求 | 实现 |
| --- | --- |
| 语义结构 | `header/nav/main/section/article/footer`；每页唯一 `h1`，`SectionHeading` 用 `h2` |
| 键盘可达 | 所有交互用原生 `button/a`；`skip-link` 首个可聚焦元素 |
| 焦点可见 | 全局 `:focus-visible { outline: 2px solid var(--primary-500); outline-offset: 3px; }` |
| 抽屉/弹层 | `role="dialog" aria-modal="true"`，打开时焦点移入、Tab 循环、Esc 关闭、关闭后焦点归还触发按钮、`body` 锁滚动 |
| 状态同步 | `ThemeToggle` 的 `aria-label` 随主题变化（「切换到浅色模式」/「切换到深色模式」） |
| 动效可选 | `prefers-reduced-motion` 全局媒体查询 + `useMediaQuery` 控制 canvas |
| 不靠颜色 | 熟练度同时有方块数量与 `aria-valuenow`；链接有 `↗` 与文字说明 |
| 图片替代 | 装饰性 SVG `aria-hidden`；封面 `alt` 来自项目名 |

---

## 15. SEO 与分享（SPA 的取舍）

纯 Vite SPA 的天然短板是首屏 HTML 无正文，爬虫依赖 JS 执行。按优先级处理：

1. **必做**：`index.html` 写好默认 `title`/`description`/OG；运行时 `useDocumentMeta` 覆盖；`lang="zh-CN"`；语义标签。
2. **必做**：构建后脚本从种子数据生成 `sitemap.xml`（含所有 `/blog/:slug`）与 `robots.txt`。
3. **建议**：接入 `vite-plugin-prerender` 或 `react-snap` 做构建期预渲染（输出 `/`、`/blog` 及各文章静态 HTML），成本低、收益明显。
4. **备选**：若 SEO 权重高，后续迁移 Astro/Next SSG；数据层接口形状不变，页面组件可复用。

OG 图：为默认页准备 1 张静态 `og-default.png`；文章页二期用构建脚本生成（Node + `satori`/`sharp`），MVP 复用默认图。

---

## 16. 测试策略

### 16.1 单元 / 组件（Vitest + RTL）

- `starfield.ts`：粒子数量、边界、透明度范围（纯函数好测）。
- `api/*`：种子自动写入、损坏 JSON 回退、`NOT_FOUND` 抛出、筛选与分页正确性。用 `localStorage` mock 或 jsdom 自带实现。
- `DragonMascot`：不同 `mood` 渲染对应路径；`size` 映射正确；无 `title` 时 `aria-hidden`。
- `ThemeProvider`：切换后 `data-theme` 与 localStorage 同步。

### 16.2 E2E（Playwright）

| 用例 | 断言 |
| --- | --- |
| 375px 无横向滚动 | `document.documentElement.scrollWidth <= 375`，遍历 `/`、`/blog`、`/blog/:slug` |
| 主题持久化 | 切浅色 → 刷新 → `html[data-theme="light"]`，且首帧无 `dark` 闪烁（截图对比） |
| 路由与 404 | 访问 `/blog/not-exist` 显示奶龙 404 区块；`/xyz` 显示 404 页 |
| 外链属性 | 所有 `target="_blank"` 的 `a` 均含 `rel="noopener noreferrer"` |
| 减少动效 | `page.emulateMedia({ reducedMotion: 'reduce' })` 后 canvas 不再更新（对比两帧像素） |
| 可访问性 | axe 扫描无 serious/critical；Tab 可遍历首屏所有交互 |
| 复制邮箱 | 点击后 toast 出现且文本正确 |

### 16.3 手工验收

真机（iOS Safari、中端 Android Chrome）验证：滚动帧率、`backdrop-filter` 降级、地址栏收缩时 Hero 不跳动（`dvh`）、横屏布局。对应 PRD AC-12/17/18/23。

---

## 17. 构建、部署与环境

### 17.1 脚本

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build && node scripts/generate-sitemap.mjs",
    "preview": "vite preview",
    "lint": "eslint .",
    "test": "vitest",
    "test:e2e": "playwright test"
  }
}
```

### 17.2 部署

- 目标：Vercel / Cloudflare Pages / Netlify 任选，纯静态。
- SPA 回退：所有未匹配路径 rewrite 到 `/index.html`（否则刷新 `/blog/xxx` 404）。
- 缓存：`/assets/*` 强缓存（内容哈希），`index.html` no-cache。
- 环境变量：无。站点信息（域名、统计 ID）放 `src/config.ts` 常量，避免构建期配置复杂化。

### 17.3 Vite 配置要点

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});
```

TypeScript：`strict: true`、`noUncheckedIndexedAccess: true`、路径别名 `@/*` 与 vite 对齐。

---

## 18. 实施顺序（对齐 PRD 里程碑）

| 阶段 | 技术任务 | 完成标志 |
| --- | --- | --- |
| M1 设计基线 | 初始化 Vite + TS + Tailwind；写 `index.css` token；`DragonMascot` 三个表情 | Storybook 不需要，用临时页面看效果 |
| M2 骨架 | `App` 壳、路由、Navbar/Footer、ThemeProvider、Starfield | 空页面可切换主题、星空不卡 |
| M3 区块 | api 层 + seed；Hero/About/Skills/Projects/Contact | 首页完整，数据来自 localStorage |
| M4 博客 | 列表/详情、Markdown、代码复制、TOC | 三篇示例文章可读 |
| M5 打磨 | EmptyState、404、PageLoader、Toast、动效、A11y、meta | 逐条过 PRD 第 15 章 |
| M6 验收 | Playwright 用例 + 真机 | AC-01 ~ AC-25 全绿 |

---

## 19. 风险与技术决策记录

| 风险 | 影响 | 决策 |
| --- | --- | --- |
| Tailwind v4 与 v3 语法差异 | 配置写错、构建失败 | 统一 v4 CSS-first；若团队环境要求 v3 用附录 B，类名不变 |
| Markdown 渲染器增大详情页体积 | 详情页 LCP 变差 | 路由 + 二次 `lazy`，且仅详情页加载；预算 ≤ 90KB gz |
| Canvas 在低端机掉帧 | 违反 AC-17 | 分档 + 自适应降档 + reduced-motion 静态化；实测后调参 |
| `backdrop-filter` 在部分安卓 WebView 不生效 | 导航毛玻璃失效 | 提供不透明 `surface` 兜底（`@supports not (backdrop-filter: blur(1px))`） |
| SPA SEO 弱 | 文章不被收录 | 构建期预渲染 + sitemap；二期可迁 SSG |
| localStorage 数据非权威 | 用户以为改了站点 | 定位为「本地演示数据」，真实内容以 `seed.ts` 为准 |
| 内联 SVG 过大 | 首屏 HTML 膨胀 | 奶龙单文件 ≤ 8KB，路径简化；图标按需内联 |
| 依赖 `dataset.theme` 初始化 | 首帧闪白 | 内联脚本前置；禁止在 effect 中首次赋值 |

**已确定的技术取舍**

1. 不引入 Zustand：全局状态仅主题与 toast，Context + 局部 state 足够，减少依赖。
2. 不做 SSR：内容量小、无登录，静态托管成本为零；SEO 用预渲染补足。
3. 不引入 UI 库：设计高度定制（黄色渐变 + 奶龙），组件库的主题覆盖成本高于自写 10 个组件。
4. 数据层异步化：即使当前是同步 localStorage，也强制走 Promise，保留未来接真实 API 的迁移路径。
5. 图标自绘：与吉祥物同源（同一 SVG 规范），也避免图标库风格不统一。

---

## 20. 可行性结论

**所有 PRD 功能均可用纯前端实现，无需后端与服务器成本。**

逐项核对：

| PRD 能力 | 可行性 | 说明 |
| --- | --- | --- |
| 首页 Hero + 奶龙 + CTA | ✅ | 内联 SVG + CSS 动画，无外部资源 |
| 关于/时间线/教育 | ✅ | 静态数据渲染 |
| 技能分类与熟练度 | ✅ | 5 段进度条，纯 CSS |
| 项目卡片与筛选 | ✅ | 本地数组 + URL query |
| 博客列表/详情 | ✅ | Markdown 本地渲染，构建期/运行时皆可 |
| 联系与社交 | ✅ | `mailto`、剪贴板 API、外链 |
| 深色模式 + 记忆 | ✅ | CSS 变量 + localStorage + 内联脚本防闪白 |
| 星空背景 | ✅ | 原生 Canvas，~80 行，性能可控 |
| 响应式 375px | ✅ | Tailwind 移动优先 + Playwright 断言 |
| 空状态/404/加载 | ✅ | 可复用 `EmptyState` + 奶龙表情 |
| SEO / 分享 | ⚠️ 有条件 | SPA 需构建期预渲染才能达到最佳收录效果；MVP 可先上线再补 |
| 内容管理 | ⚠️ 有限 | localStorage 仅本机；内容以 `seed.ts` 为唯一真实来源 |

**成本**：开发 1 人，按里程碑约 5–8 个工作日；运行成本 0（静态托管免费额度内）；维护成本主要是依赖升级与内容更新。

---

## 附录 A：关键类型速查

```ts
// 页面异步状态
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };
```

## 附录 B：Tailwind v3.4 兼容配置（备用）

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        'bg-soft': 'var(--bg-soft)',
        surface: 'var(--surface)',
        'surface-hover': 'var(--surface-hover)',
        border: 'var(--border)',
        'border-strong': 'var(--border-strong)',
        text: 'var(--text)',
        'text-muted': 'var(--text-muted)',
        'text-dim': 'var(--text-dim)',
        primary: {
          300: 'var(--primary-300)',
          400: 'var(--primary-400)',
          500: 'var(--primary-500)',
          600: 'var(--primary-600)',
        },
      },
      borderRadius: { card: '8px', button: '20px' },
      fontFamily: {
        sans: ['-apple-system', '"PingFang SC"', '"Microsoft YaHei"', '"Noto Sans SC"', 'sans-serif'],
      },
    },
  },
} satisfies Config;
```

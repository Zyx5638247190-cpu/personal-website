# AGENTS.md · AI 代理开发指令

> 本文件面向在本仓库工作的 AI 代理（以及人类协作者）。开始任何编码任务前先读完本文；与 `PRD.md`、`TECH_DESIGN.md` 冲突时，**以本文件为准**（原因：本文件是后续迭代中最新确认的规范）。

---

## 1. 项目概述

**黄色奶龙个人展示网站**：纯前端 React 单页应用，深色（夜空）为默认主题，带 Canvas 星空背景与一只内联 SVG 绘制的黄色小奶龙吉祥物。

| 项 | 值 |
| --- | --- |
| 技术栈 | React 18+ + TypeScript + Vite + Tailwind CSS + React Router |
| 数据 | localStorage 模拟后端，接口层异步化，无真实服务器 |
| 页面 | 首页（Hero/关于/技能/项目/联系）、博客列表、博客详情、404 |
| 主题 | 深色默认，支持浅色切换并记忆 |
| 主色 | `#FFD54F → #FFCA28 → #FFB300` 暖黄渐变 |
| 吉祥物 | 纯 CSS/SVG 自绘奶龙，禁止使用外部图片 |
| 部署 | 静态托管，零后端成本 |

**写作对象**：招聘方、同行、社区读者。整体观感要「可爱但不幼稚」——吉祥物负责情绪，信息结构必须专业清晰。

---

## 2. 常用命令

```bash
npm run dev        # 本地开发
npm run build      # 类型检查 + 构建（含 sitemap 生成）
npm run preview    # 预览构建产物
npm run lint       # ESLint
npm run test       # Vitest 单元/组件测试
npm run test:e2e   # Playwright 端到端
```

提交前至少跑通 `lint` 与 `test`；涉及布局、主题、星空的改动必须补跑 `test:e2e`。

---

## 3. 目录与职责

```
src/
├─ components/      公共组件（不含业务数据）：layout / mascot / background / ui / cards / icons
├─ components/sections/  首页业务区块（可以取数）
├─ pages/           页面组件，只做「取数 + 组装」
├─ api/             唯一允许读写 localStorage 的层
├─ types/           纯类型定义
├─ hooks/           可复用逻辑
├─ context/         ThemeProvider、ToastProvider
├─ lib/             cn / date / copy 等无副作用工具
└─ content/posts/   博客 Markdown 源文件
```

**分层铁律**

1. 页面（`pages/`）不写复杂 DOM，不直接 `JSON.parse` 任何内容。
2. `components/` 下的纯展示组件**禁止** import `api/`；需要数据的放 `sections/`。
3. 除 `api/` 外，任何文件不得出现 `localStorage` 字样。
4. `types/` 不放运行时代码。
5. 组件超过 ~200 行或承担两种以上职责时，拆分子组件。

---

## 4. 开发规范

### 4.1 组件拆分

- **每个页面一个独立组件**：`Home`、`Blog`、`PostDetail`、`NotFound`。
- 页面内区块拆成 `sections/` 下的独立组件，每个区块自行取数、自行 loading。
- 出现第 2 次使用的 UI 结构就抽到 `components/ui/`，不要复制粘贴。
- 组件文件导出方式统一为**具名导出**，页面组件可用默认导出；同一文件内只放一个主组件（子组件可同文件，但必须无独立状态）。
- 组件必须是函数组件 + Hooks，不写 class 组件。

### 4.2 命名

| 对象 | 规范 | 示例 |
| --- | --- | --- |
| 组件 / 页面文件 | PascalCase | `ProjectCard.tsx`、`PostDetail.tsx` |
| 组件名 | PascalCase | `DragonMascot`、`SkillsSection` |
| 函数 / 变量 / Hook | camelCase（Hook 以 `use` 开头） | `formatDate`、`useAsync`、`isMenuOpen` |
| 类型 / 接口 | PascalCase | `Project`、`ApiError` |
| 常量 | UPPER_SNAKE_CASE | `STORAGE_KEYS`、`MAX_PARTICLES` |
| CSS 类 | kebab-case | `.mascot-eye`、`.skip-link` |
| 数据文件 | camelCase | `projects.ts`、`seed.ts` |
| 布尔值 | `is/has/should/can` 前缀 | `isLoading`、`hasMore` |
| 事件处理 | `handleX` / `onX` | `handleCopy`、`onToggle` |

**禁止**：拼音命名（`naLong`）、无意义缩写（`btn2`、`tmp`）、单字母变量（循环索引除外）。

### 4.3 TypeScript

- `strict: true`，**禁止 `any`**；确实未知用 `unknown` 并收窄。
- 对外导出的函数必须写返回类型。
- 数据模型一律来自 `src/types/models.ts`，不在组件内重复声明形状。
- 使用字面量联合而非 `string`（如 `Mood`、`SkillLevel`）。

### 4.4 状态与数据

- 全局状态只有「主题」和「Toast」，用 Context。**禁止**引入 Redux/Zustand/Jotai。
- 页面数据用 `useAsync`，必须处理三种状态：加载（Skeleton）、错误（奶龙 + 重试）、空（EmptyState）。
- 所有 API 调用走 `src/api/`，不得在组件里直接写种子数据。
- 筛选条件写进 URL query（`useSearchParams`），保证刷新可还原。

### 4.5 注释

**所有新增逻辑必须有中文注释**，说明「为什么」而不是「是什么」。复杂算法、性能取舍、浏览器兼容处理尤其要写。

```tsx
// 粒子数量按视口分档：中低端手机全量渲染会掉到 30FPS 以下
const count = width < 640 ? 90 : width < 1024 ? 160 : 240;

useEffect(() => {
  // 页面切到后台时暂停 RAF，避免不可见时仍消耗电量
  const onVisibility = () => {
    if (document.hidden) cancelAnimationFrame(rafRef.current);
  };
  document.addEventListener('visibilitychange', onVisibility);
  return () => document.removeEventListener('visibilitychange', onVisibility);
}, []);
```

### 4.6 禁止事项

- 引入重型 UI 库：Ant Design、MUI、Chakra、Element Plus、shadcn 等一律不用。
- 引入动画库（Framer Motion / GSAP）、图标库、粒子库、日期库。
- 使用 `styled-components` / `emotion` 等 CSS-in-JS。
- 在组件里写死十六进制颜色或魔法像素值（见 5.2）。
- 使用外部图片、GIF、Lottie 承载吉祥物或图标。
- 提交 `console.log`、注释掉的死代码、`TODO` 占位（要么实现，要么删掉）。

---

## 5. 视觉规范

### 5.1 主色与 CSS 变量

主色统一由 CSS 变量控制，**组件里只写语义 token，不写色值**。

```css
:root {
  --primary: #ffca28;              /* 唯一主色控制点：改主题从这里开始 */
  --primary-400: #ffd54f;          /* 渐变起点，浅一档 */
  --primary-500: var(--primary);   /* 主品牌色 */
  --primary-600: #ffb300;          /* 渐变终点，深一档 */
  --primary-300: #ffe082;          /* 高光 / hover 底 */
  --primary-glow: rgb(255 202 40 / 0.35);
  --primary-gradient: linear-gradient(135deg, var(--primary-400) 0%, var(--primary-500) 50%, var(--primary-600) 100%);
}
```

- 更换主色时：改 `--primary`，并同步 `--primary-300/400/600` 三个衍生值（品牌色需精确，不自动推导）。
- 文字用黄色时优先 `--primary-500`；**浅色模式下正文禁用亮黄**，改用加深的 `--primary-ink: #b07800`（对比度不足会违反验收标准）。
- Tailwind 中通过 `@theme inline` 映射为 `bg-primary-500`、`text-primary-500` 等类名使用。

### 5.2 圆角、间距、阴影

| 元素 | 圆角 | 说明 |
| --- | --- | --- |
| 卡片 / 面板 / 图片容器 | **8px** | 统一值，禁止出现 12/16/20px 的卡片 |
| 按钮 | **20px（胶囊形）** | 高度 48px，`rounded-[20px]` 或 `rounded-full` 二选一，同一页面保持一致 |
| 标签 chip | 8px | 与卡片同一体系 |
| 头像 / 圆形图标 | 9999px | 正圆 |

- 间距使用 8px 基准：4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96。
- 卡片间距 24px；区块上下内边距桌面 120px、移动 72px。
- 深色模式**不用黑色投影**，用 1px 描边 + 内发光表达层级；浅色模式可用 `0 8px 24px rgba(0,0,0,.06)`。
- 图标 24×24、`stroke-width: 1.75`、圆角端点。

### 5.3 奶龙吉祥物

- **必须内联 SVG**，写在 `components/mascot/DragonMascot.tsx`，不使用 `<img>`、外链、GIF、Lottie。
- 统一 `viewBox="0 0 200 200"`；配色：身体 `#FFCA28`、肚皮 `#FFE082`、描边 `#C98A00`、眼睛 `#2A2A33`。
- 通过 `mood` 切换表情（`happy | sleepy | curious | sad | celebrate`），切换嘴部/眼睛路径，不换整图。
- 表情与场景匹配：加载 = 抱星星、空状态 = 摊手/抱笔、404 = 举牌、Hero = 坐姿抱星星。
- 动画只用 `transform` / `opacity`：呼吸 3s、眨眼 6s、尾巴摆动 4s；`prefers-reduced-motion` 下全部关闭。
- 小尺寸（32px）只渲染头部，保证 Logo 可辨识。

### 5.4 星空背景

- Canvas 固定在内容层之下（`position: fixed; z-index: 0; pointer-events: none`），滚动时不重绘内容。
- 粒子数分档：< 640px → 90；640–1023px → 160；≥ 1024px → 240。
- `devicePixelRatio` 上限 2；resize 防抖 200ms；`visibilitychange` 隐藏时暂停 RAF。
- 星星低亮度（0.2–0.7），不抢文字；90% 白色、10% 暖黄。
- `prefers-reduced-motion: reduce` → 只渲染一帧静态星点。

### 5.5 图标与图片

- 图标一律内联 SVG，集中在 `components/icons/index.tsx`，用 `currentColor` 着色。
- 项目封面等位图仅限内容图片，必须：固定宽高比（16:10）+ `loading="lazy"` + 加载失败切奶龙占位图。
- 装饰性 SVG 加 `aria-hidden="true"`，有语义的加 `role="img"` + `<title>`。

### 5.6 响应式

- 移动优先，只在 `sm / md / lg / xl / 2xl` 断点做增强。
- **375px 宽度必须无横向滚动**：不用 `100vw`（用 `100%`）、图片 `max-width: 100%`、长 URL 用 `overflow-wrap: anywhere`、代码块自身横向滚动。
- 触控目标最小 44×44px；依赖 hover 的信息必须有触屏替代。
- 移动端高度用 `dvh`，固定导航与底部按钮加 `env(safe-area-inset-*)`。

---

## 6. 文案规范

**语气**：活泼、口语、第二人称；可爱但不刷屏。

- 自称「奶龙」，称访客「你」；可用「嗷！」「～」。
- **每个区块最多一处语气词**；按钮标签、技术描述、错误码保持中性准确。
- 空状态、加载、成功提示是奶龙出场的主要场景。

| 场景 | ✅ 这样写 | ❌ 不要这样写 |
| --- | --- | --- |
| Hero 副标题 | 前端工程师 · 把复杂的东西做得简单，顺便养了一只奶龙 | 致力于通过技术赋能业务 |
| 项目区标题 | 奶龙做过的东西 | 项目展示 |
| 加载 | 奶龙正在搬砖…嗷！ | Loading... |
| 空状态 | 这里空空的，奶龙帮你找找别的？ | 暂无数据 |
| 复制成功 | 嗷！邮箱复制好了 | 操作成功 |
| 错误 | 奶龙没连上星星，再试一次？ | 请求失败（500） |

**底线**：可爱不能牺牲可理解性。日期格式、外链说明、表单错误必须清楚。

---

## 7. 测试要求

### 7.1 三条硬指标（每次改动都要验证）

| # | 要求 | 验证方式 |
| --- | --- | --- |
| 1 | **375px 宽度无横向滚动** | DevTools 设备模拟 + Playwright 断言 `document.documentElement.scrollWidth <= 375`，覆盖 `/`、`/blog`、`/blog/:slug` |
| 2 | **深色模式切换正常** | 点击切换 → `html[data-theme]` 立即变化、刷新后保持、首帧不闪白；浅色下正文对比度 ≥ 4.5:1 |
| 3 | **星空背景不卡顿** | 桌面 ≥ 50 FPS、中端安卓 ≥ 30 FPS；滚动时不掉帧、不抖动；切后台暂停 |

### 7.2 其他必测项

- 无效 slug / 未知路由显示奶龙 404，不白屏。
- 所有 `target="_blank"` 链接都带 `rel="noopener noreferrer"`。
- 键盘 Tab 可遍历所有交互元素，焦点环可见；Esc 可关闭抽屉与弹层。
- `prefers-reduced-motion: reduce` 下动画关闭、功能完整。
- 控制台无报错、无 404 资源。

### 7.3 测试编写约定

- 单元测试与源码同目录或 `*.test.ts(x)`；E2E 放 `e2e/`。
- 测试描述用中文，说明业务意图：`it('375px 下博客详情页不出现横向滚动', ...)`。
- 不为纯样式写测试；重点测数据层、粒子算法、主题逻辑、空/错状态。

---

## 8. 注意事项（红线）

1. **不引入重型 UI 库**（Ant Design、MUI、Chakra 等）；需要的组件自己写。
2. **保持简洁现代**：留白充足、层级清晰、动效克制；不堆渐变、不堆阴影、不加无意义装饰。
3. **所有图片资源用内联 SVG 或 CSS 绘制**；奶龙、图标、空状态插画、Logo 全部自绘，不引用外部素材。
4. **代码要有中文注释**，关键决策与性能取舍必须说明原因。
5. **不破坏验收标准**：375px 无横向滚动、主题切换正常、星空流畅，任何一条不达标即视为未完成。
6. **不新增运行时依赖**，除非能说明体积与必要性并获得确认。
7. **不提交隐私信息**：真实手机号、住址、密钥不得进入代码或种子数据。
8. 深色为默认主题，浅色是补充；不能只做一套。

---

## 9. 代码范式

### ✅ 推荐

```tsx
// src/components/ui/Button.tsx
import { cn } from '@/lib/cn';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost';
  children: ReactNode;
};

/** 站点统一按钮：主按钮为黄色渐变胶囊，次按钮为描边幽灵按钮 */
export function Button({ variant = 'primary', className, children, ...rest }: Props) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex h-12 items-center justify-center rounded-[20px] px-6 text-sm font-medium transition',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500',
        variant === 'primary'
          ? 'bg-primary-gradient text-[#1a1a22] hover:brightness-105'
          : 'border border-primary-500/60 text-primary-500 hover:bg-primary-500/10',
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
```

```ts
// src/api/projects.ts
import { ApiError, read, simulate, STORAGE_KEYS } from './client';
import { SEED_PROJECTS } from './seed';
import type { Project, ProjectStatus } from '@/types/models';

/** 项目列表：按精选优先、时间倒序；筛选在内存中完成 */
export async function listProjects(params?: { status?: ProjectStatus | 'all' }): Promise<Project[]> {
  return simulate(() => {
    const all = read<Project[]>(STORAGE_KEYS.projects, SEED_PROJECTS);
    const filtered =
      !params?.status || params.status === 'all'
        ? all
        : all.filter((p) => p.status === params.status);
    return [...filtered].sort(
      (a, b) => Number(b.featured) - Number(a.featured) || b.date.localeCompare(a.date)
    );
  });
}
```

### ❌ 反面示例

```tsx
// 问题：写死颜色、引入 UI 库、无注释、用 any、魔法圆角
import { Button } from 'antd';

export default function Card({ data }: any) {
  return (
    <div style={{ background: '#171723', borderRadius: 17, boxShadow: '0 0 30px #000' }}>
      <img src="https://cdn.example.com/dragon.gif" />
      <Button type="primary">{data.title}</Button>
    </div>
  );
}
```

---

## 10. 完成定义（DoD）

提交前逐条自检：

- [ ] 类型检查通过，无 `any`、无未使用变量
- [ ] 所有新增逻辑有中文注释
- [ ] 颜色走 token，没有组件内十六进制
- [ ] 卡片 8px / 按钮 20px 圆角一致
- [ ] 奶龙为内联 SVG，无外部图片
- [ ] 375px、768px、1440px 三档检查无错位
- [ ] 深色 / 浅色两套主题都看过
- [ ] 加载、错误、空状态三态齐全（涉及数据的地方）
- [ ] 外链带 `noopener noreferrer`，图片有 `alt`
- [ ] 星空在低端设备模拟下不掉帧
- [ ] `npm run lint` 与 `npm run test` 通过
- [ ] 没有引入新依赖（或已说明理由）

---

## 11. 参考文档

- 产品需求与验收标准：`PRD.md`
- 技术方案、数据结构、接口签名：`TECH_DESIGN.md`

遇到文档未覆盖的问题，优先选择「更简单、依赖更少、性能更好」的方案，并在代码注释或 PR 描述中记录决策。

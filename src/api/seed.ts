import type {
  Experience,
  Post,
  Profile,
  Project,
  SkillGroup,
} from '@/types/models';

/**
 * 默认内容（内容真相源）。
 * 本地存储只是本机的可覆盖层，换设备后仍以这里的数据为准。
 */
export const SEED_PROFILE: Profile = {
  name: '冷箭竹',
  handle: '@naidragon',
  role: '前端工程师',
  tagline: '把复杂的东西做得简单，顺便养了一只奶龙。',
  bio: [
    '你好，我是冷箭竹，一名前端工程师。喜欢把复杂的产品拆成清晰的小块，再用最少的代码把它们拼回去。',
    '日常主要写 React 与 TypeScript，也会折腾构建、性能和那些「看起来没必要但用起来很爽」的交互细节。',
    '工作之外，我给这个站点画了一只黄色小奶龙。它负责在空状态里陪着你，也负责提醒我：做东西要有趣。',
  ],
  avatar: '/avatar.svg',
  email: 'hello@naidragon.dev',
  location: '杭州',
  availability: { open: true, label: '正在寻找新机会' },
  quickFacts: [
    { label: '所在地', value: '杭州 · 中国' },
    { label: '关注领域', value: '前端工程化 / 交互体验' },
    { label: '常用技术', value: 'React · TypeScript' },
    { label: '回复速度', value: '通常 24 小时内' },
  ],
  education: [
    {
      school: '某某大学',
      major: '计算机科学与技术',
      degree: '本科',
      period: '2017 — 2021',
    },
  ],
  socials: [
    { id: 'github', label: 'GitHub', href: 'https://github.com/', icon: 'github' },
    { id: 'juejin', label: '掘金', href: 'https://juejin.cn/', icon: 'juejin' },
    { id: 'mail', label: '邮箱', href: 'mailto:hello@naidragon.dev', icon: 'mail' },
  ],
};

export const SEED_SKILLS: SkillGroup[] = [
  {
    category: '前端',
    items: [
      { id: 'react', name: 'React', icon: 'react', level: 5 },
      { id: 'typescript', name: 'TypeScript', icon: 'typescript', level: 4 },
      { id: 'tailwind', name: 'Tailwind CSS', icon: 'tailwind', level: 4 },
      { id: 'vite', name: 'Vite', icon: 'vite', level: 4 },
    ],
  },
  {
    category: '后端',
    items: [
      { id: 'node', name: 'Node.js', icon: 'node', level: 3 },
      { id: 'postgres', name: 'PostgreSQL', icon: 'postgres', level: 3 },
    ],
  },
  {
    category: '工具与工程化',
    items: [
      { id: 'git', name: 'Git', icon: 'git', level: 4 },
      { id: 'docker', name: 'Docker', icon: 'docker', level: 3 },
      { id: 'ci', name: 'CI / CD', icon: 'ci', level: 3 },
    ],
  },
  {
    category: '设计与其他',
    items: [
      { id: 'figma', name: 'Figma', icon: 'figma', level: 3 },
      { id: 'svg', name: 'SVG 插画', icon: 'svg', level: 4 },
    ],
  },
];

export const SEED_EXPERIENCE: Experience[] = [
  {
    id: 'exp-3',
    period: '2023.06 — 至今',
    org: '某互联网公司',
    role: '前端工程师',
    highlights: [
      '负责核心业务的前端架构与组件库建设，覆盖 6 条产品线。',
      '把首屏加载从 3.2s 降到 1.4s，移动端转化率提升 8%。',
    ],
    tags: ['React', 'TypeScript', '性能优化'],
  },
  {
    id: 'exp-2',
    period: '2021.07 — 2023.05',
    org: '某 SaaS 创业公司',
    role: '前端开发',
    highlights: [
      '从 0 到 1 搭建管理后台，沉淀 40+ 可复用组件。',
      '推动构建流程迁移到 Vite，本地冷启动从 28s 降到 2s。',
    ],
    tags: ['Vite', '组件库'],
  },
  {
    id: 'exp-1',
    period: '2020.09 — 2021.06',
    org: '某设计工作室',
    role: '前端实习生',
    highlights: ['独立完成 10+ 品牌官网，负责动效与响应式适配。'],
    tags: ['CSS', '动效'],
  },
];

export const SEED_PROJECTS: Project[] = [
  {
    slug: 'naidragon-site',
    title: '奶龙小站',
    summary: '你正在看的这个站点：深色星空、奶龙吉祥物、纯前端实现。',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Canvas'],
    links: { repo: 'https://github.com/' },
    date: '2026-10',
    status: 'featured',
    featured: true,
    order: 1,
  },
  {
    slug: 'naidragon-ui',
    title: '奶龙组件库',
    summary: '一套带主题 token 的轻量组件库，只保留真正会复用的 12 个组件。',
    tags: ['React', 'TypeScript', 'Design Token'],
    links: { live: 'https://example.com', repo: 'https://github.com/' },
    date: '2026-06',
    status: 'featured',
    featured: true,
    order: 2,
  },
  {
    slug: 'perf-lighthouse',
    title: '性能巡检台',
    summary: '把 Lighthouse 报告变成趋势图，帮团队盯住每一次性能回退。',
    tags: ['Node.js', 'Playwright', 'PostgreSQL'],
    links: { repo: 'https://github.com/' },
    date: '2025-11',
    status: 'archived',
    featured: false,
    order: 3,
  },
  {
    slug: 'star-track-theme',
    title: '星轨博客主题',
    summary: '一个把星空画进排版的静态博客主题，强调阅读时的呼吸感。',
    tags: ['Astro', 'CSS', 'SVG'],
    links: {},
    date: '2026-09',
    status: 'wip',
    featured: false,
    order: 4,
  },
];

export const SEED_POSTS: Post[] = [
  {
    slug: 'why-i-draw-a-dragon',
    title: '为什么我给自己的网站画了一只奶龙',
    summary: '吉祥物不是装饰，它是这个站点里唯一会「看着你」的东西。',
    date: '2026-10-02',
    tags: ['设计', '随笔'],
    readingTime: 4,
    content: `个人网站最尴尬的地方在于：它既不是产品，也不是简历，却要同时承担这两件事。

我试过做一个特别克制的版本：黑底、灰字、一条细分隔线，像一份排版良好的 PDF。它很专业，也很容易被忘掉。访客滑到底，记住的可能只有「某个前端」。

后来我想，如果站点里有一个固定的角色呢？它不解释技术，也不推销我，只是在空状态里坐着，在加载时抱着一颗星星。于是有了这只黄色小奶龙。

它的作用有三个。

第一，它给页面一个情绪锚点。深色星空是冷的，黄色是暖的，两者放在一起，视线会自然落到奶龙身上，再顺着它看到名字和一句话介绍。

第二，它让「空」变得可以接受。博客没写完、筛选没有结果、链接失效，这些状态原本是尴尬的，奶龙往那里一坐，读者会知道这是设计的一部分，而不是我做坏了。

第三，它约束了我。既然站点里有一只圆滚滚的龙，就不该出现尖锐的投影、刺眼的荧光色和堆到天花板的装饰。风格是从角色长出来的，不是贴上去的。

这只奶龙没有用任何图片，全部由内联 SVG 和几条 CSS 关键帧画成。它会在你移动鼠标时轻轻看你一眼，也会在系统开启「减少动效」时安静地停下来。

如果你也在做个人站，我建议你养一只。什么都行，一只猫、一颗星星、一株会长大的草。它不需要好看，只需要一直在。`,
  },
  {
    slug: 'css-variables-theme',
    title: '用一组 CSS 变量管住整站配色',
    summary: '从 token 到组件类名，聊聊为什么不要在组件里写十六进制颜色。',
    date: '2026-09-18',
    tags: ['技术', 'CSS'],
    readingTime: 6,
    content: `配色失控通常不是从「选错颜色」开始的，而是从第一次在组件里写 #FFCA28 开始的。

一旦颜色散落在几十个文件里，改主题就变成了全局搜索替换；而搜索替换迟早会漏，漏掉的那一处会在浅色模式下变成一团看不清的黄色。

我的做法是三层。

第一层是设计变量：品牌黄、夜空底色、三种文字灰。它们只在 index.css 里出现一次，按深色和浅色分别声明在 [data-theme] 块里。

第二层是语义映射：把 --bg 映射成 Tailwind 的 bg 颜色，把 --text 映射成 text 颜色。这里用 @theme inline，让生成的工具类直接引用变量，而不是在构建时把值写死。

第三层是组件：只允许写 bg-surface、text-text-muted、border-border 这样的类名。组件不需要知道现在是深色还是浅色，它只需要知道「这是卡片底色」。

这样做之后，切换主题不再需要 JavaScript 改样式，只是给 html 换一个 data-theme 属性。首屏防闪白也简单：在 head 里放一小段内联脚本，在样式加载前把属性写好。

还有一个容易忽略的细节：亮黄色在浅色背景上的对比度很低。所以浅色模式里的黄色正文要换成加深的黄褐色，亮黄只留给底色和装饰。可爱不能以看不清为代价。`,
  },
  {
    slug: 'starfield-performance',
    title: '让星空动起来，但不让手机发烫',
    summary: '一个 80 行的 Canvas 粒子背景，以及它必须遵守的性能预算。',
    date: '2026-08-30',
    tags: ['技术', 'Canvas', '性能'],
    readingTime: 7,
    content: `星空背景最容易犯的错误，是把「好看」直接等同于「粒子越多越好」。

第一版我用了 800 个粒子，桌面看起来很浪漫，中端安卓机上滚两屏就开始掉帧，手机背面温温的。问题不在 Canvas 本身，而在于每一帧都在做多余的绘制。

调整后的做法有五条。

粒子数量按视口宽度分档：手机 90，平板 160，桌面 240。星空是氛围，不是主角，少一点反而更安静。

设备像素比封顶 2。高分屏上按 3 倍渲染，肉眼几乎看不出差别，像素填充量却多了 125%。

页面隐藏时暂停 requestAnimationFrame。切换到别的标签页还在画星星，是纯粹的浪费。

窗口尺寸变化做 200ms 防抖，避免拖动窗口时反复重建粒子数组。

尊重 prefers-reduced-motion：不启动动画循环，只画一帧静态星点。对前庭敏感的用户来说，缓慢闪烁也可能造成不适。

绘制本身很简单：清屏，遍历粒子，用正弦函数算透明度，画圆。不要加模糊滤镜，不要给 canvas 加阴影，那会让浏览器每帧重绘整个屏幕。

最后是层级：canvas 固定定位在内容下面，滚动时不跟随、不重绘。这样滚动性能几乎不受影响，文字也不会被星星干扰。

性能预算不是限制创意，它只是提醒你：背景再美，也不该让读者等它。`,
  },
];

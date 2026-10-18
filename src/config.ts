/** 站点级常量：只放不会随内容变化的信息 */
export const SITE = {
  name: '奶龙小站',
  owner: '冷箭竹',
  email: 'hello@naidragon.dev',
  github: 'https://github.com/',
  tagline: '前端工程师 · 把复杂的东西做得简单，顺便养了一只奶龙。',
  description: '冷箭竹的个人站：前端工程师，喜欢把复杂的东西做得简单。',
} as const;

/** 首页锚点导航，顺序即展示顺序 */
export const NAV_SECTIONS = [
  { id: 'home', label: '首页' },
  { id: 'about', label: '关于' },
  { id: 'skills', label: '技能' },
  { id: 'projects', label: '项目' },
  { id: 'blog', label: '博客' },
  { id: 'contact', label: '联系' },
] as const;

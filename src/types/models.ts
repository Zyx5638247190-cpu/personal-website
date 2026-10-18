/** 主题只有深色与浅色两种，默认深色 */
export type Theme = 'dark' | 'light';

/** 奶龙表情，驱动嘴部与眼睛路径 */
export type Mood = 'happy' | 'sleepy' | 'curious' | 'sad' | 'celebrate';

/** 熟练度固定 1–5 的整数，避免组件里出现小数或越界值 */
export type SkillLevel = 1 | 2 | 3 | 4 | 5;

export type ProjectStatus = 'featured' | 'wip' | 'archived';

export type SocialIcon = 'github' | 'mail' | 'juejin' | 'x' | 'wechat' | 'rss';

export interface SocialLink {
  id: string;
  label: string;
  href: string;
  icon: SocialIcon;
}

export interface Availability {
  open: boolean;
  label: string;
}

export interface QuickFact {
  label: string;
  value: string;
}

export interface Education {
  school: string;
  major: string;
  degree: string;
  period: string;
}

export interface Profile {
  name: string;
  handle: string;
  role: string;
  tagline: string;
  bio: string[];
  avatar: string;
  email: string;
  location: string;
  availability: Availability;
  quickFacts: QuickFact[];
  education: Education[];
  socials: SocialLink[];
}

export interface Skill {
  id: string;
  name: string;
  icon: string;
  level: SkillLevel;
}

export interface SkillGroup {
  category: string;
  items: Skill[];
}

export interface Experience {
  id: string;
  period: string;
  org: string;
  role: string;
  highlights: string[];
  tags?: string[];
}

export interface Project {
  slug: string;
  title: string;
  summary: string;
  /** 项目详情正文由后台维护；前台列表只用摘要，详情可后续接入 */
  content?: string;
  cover?: string;
  tags: string[];
  links: { live?: string; repo?: string };
  date: string;
  status: ProjectStatus;
  featured: boolean;
  order?: number;
}

export interface Post {
  slug: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  tags: string[];
  cover?: string;
  readingTime: number;
  draft?: boolean;
}

/** 列表页只取摘要，避免把全文带进列表 */
export type PostSummary = Omit<Post, 'content'>;

/** 后台登录会话：只保存 token 与过期时间，密码绝不落地 */
export interface AdminSession {
  token: string;
  username: string;
  issuedAt: number;
  expiresAt: number;
}

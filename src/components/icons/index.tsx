import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

/** 统一线条图标：24×24、1.75 描边、圆角端点（AGENTS.md 5.5） */
const strokeProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
} as const;

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...strokeProps} width="20" height="20" {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowUpIcon(props: IconProps) {
  return (
    <svg {...strokeProps} width="20" height="20" {...props}>
      <path d="M12 19V5M6 11l6-6 6 6" />
    </svg>
  );
}

export function ExternalLinkIcon(props: IconProps) {
  return (
    <svg {...strokeProps} width="16" height="16" {...props}>
      <path d="M14 4h6v6M20 4l-8 8M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </svg>
  );
}

export function CopyIcon(props: IconProps) {
  return (
    <svg {...strokeProps} width="18" height="18" {...props}>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a1 1 0 0 1 1-1h10" />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg {...strokeProps} width="20" height="20" {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 6.5 8.5 6 8.5-6" />
    </svg>
  );
}

export function GithubIcon(props: IconProps) {
  return (
    <svg {...strokeProps} width="20" height="20" {...props}>
      <path d="M9 19c-4.5 1.3-4.5-2.3-6.3-2.8M15 21v-3.4a3.1 3.1 0 0 0-.9-2.4c2.9-.3 5.9-1.4 5.9-6.4a5 5 0 0 0-1.4-3.5 4.6 4.6 0 0 0-.1-3.5s-1.1-.3-3.6 1.4a12.4 12.4 0 0 0-6.4 0C6 .3 4.9.6 4.9.6a4.6 4.6 0 0 0-.1 3.5A5 5 0 0 0 3.4 7.6c0 5 3 6.1 5.9 6.4a3.1 3.1 0 0 0-.9 2.4V21" />
    </svg>
  );
}

export function JuejinIcon(props: IconProps) {
  return (
    <svg {...strokeProps} width="20" height="20" {...props}>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m5 12 7 4 7-4M5 16l7 4 7-4" />
    </svg>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <svg {...strokeProps} width="20" height="20" {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <svg {...strokeProps} width="20" height="20" {...props}>
      <path d="M21 13.5A8.5 8.5 0 0 1 10.5 3a7 7 0 1 0 10.5 10.5Z" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...strokeProps} width="22" height="22" {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...strokeProps} width="22" height="22" {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function MapPinIcon(props: IconProps) {
  return (
    <svg {...strokeProps} width="16" height="16" {...props}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function GraduationIcon(props: IconProps) {
  return (
    <svg {...strokeProps} width="16" height="16" {...props}>
      <path d="m2 9 10-5 10 5-10 5L2 9Z" />
      <path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5" />
    </svg>
  );
}

export function SparkleIcon(props: IconProps) {
  return (
    <svg {...strokeProps} width="16" height="16" {...props}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
    </svg>
  );
}

/* ---------- 后台常用图标 ---------- */

export function DashboardIcon(props: IconProps) {
  return (
    <svg {...strokeProps} width="20" height="20" {...props}>
      <rect x="3" y="3" width="7" height="8" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="3" y="15" width="7" height="6" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
    </svg>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <svg {...strokeProps} width="20" height="20" {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}

export function FolderIcon(props: IconProps) {
  return (
    <svg {...strokeProps} width="20" height="20" {...props}>
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
      <path d="M3 11h18" />
    </svg>
  );
}

export function FileTextIcon(props: IconProps) {
  return (
    <svg {...strokeProps} width="20" height="20" {...props}>
      <path d="M6 2.5h7l5 5V21a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1Z" />
      <path d="M13 2.5V8h5M8.5 12h7M8.5 16h7" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg {...strokeProps} width="18" height="18" {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function PencilIcon(props: IconProps) {
  return (
    <svg {...strokeProps} width="18" height="18" {...props}>
      <path d="M4 20h4l10.5-10.5a2.8 2.8 0 0 0-4-4L4 16v4Z" />
      <path d="m13.5 6.5 4 4" />
    </svg>
  );
}

export function TrashIcon(props: IconProps) {
  return (
    <svg {...strokeProps} width="18" height="18" {...props}>
      <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
      <path d="M10 11v5M14 11v5" />
    </svg>
  );
}

export function LogoutIcon(props: IconProps) {
  return (
    <svg {...strokeProps} width="18" height="18" {...props}>
      <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" />
      <path d="M10 8l-4 4 4 4M6 12h10" />
    </svg>
  );
}

export function EyeIcon(props: IconProps) {
  return (
    <svg {...strokeProps} width="18" height="18" {...props}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <svg {...strokeProps} width="20" height="20" {...props}>
      <rect x="4.5" y="10" width="15" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <svg {...strokeProps} width="18" height="18" {...props}>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  );
}

export function StarIcon(props: IconProps) {
  return (
    <svg {...strokeProps} width="16" height="16" {...props}>
      <path d="m12 3 2.7 5.6 6.1.8-4.5 4.3 1.1 6-5.4-2.9-5.4 2.9 1.1-6L3.2 9.4l6.1-.8L12 3Z" />
    </svg>
  );
}

/** 技能图标：按 key 渲染简化图形，全部随 currentColor 变色 */
export function TechGlyph({ name, ...props }: IconProps & { name: string }) {
  const common = { ...strokeProps, width: '22', height: '22', ...props };

  switch (name) {
    case 'react':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
          <ellipse cx="12" cy="12" rx="10" ry="4.2" />
          <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)" />
        </svg>
      );
    case 'typescript':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path d="M8 10h6M11 10v7M14.5 16.6c.6.5 1.4.7 2.2.5 1.1-.2 1.6-1 1.4-1.9-.2-.8-1-1.1-2-1.4-1.1-.3-1.9-.8-1.9-1.8 0-1 .9-1.7 2.1-1.7.8 0 1.5.2 2 .6" />
        </svg>
      );
    case 'tailwind':
      return (
        <svg {...common}>
          <path d="M3 13c1.5-4 4-6 7.5-6 2.5 0 4 1.5 4.5 3 1-1.5 2.3-2.2 4-2 1.6.2 2.5 1.3 2 3.5-1.5 4-4 6-7.5 6-2.5 0-4-1.5-4.5-3-1 1.5-2.3 2.2-4 2-1.6-.2-2.5-1.3-2-3.5Z" />
        </svg>
      );
    case 'vite':
      return (
        <svg {...common}>
          <path d="m4 5 8 15 8-15-8 2.5L4 5Z" />
          <path d="m11 8 3-1-4 8 1-5-2 .5 2-2.5Z" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'node':
      return (
        <svg {...common}>
          <path d="m12 2 8.5 5v10L12 22 3.5 17V7L12 2Z" />
          <path d="M9 14V9.5c0-.8.8-1.2 1.5-.8l3 1.8c.7.4.7 1.2 0 1.6l-3 1.8c-.7.4-1.5 0-1.5-.9Z" />
        </svg>
      );
    case 'postgres':
      return (
        <svg {...common}>
          <ellipse cx="12" cy="6" rx="7" ry="3" />
          <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6" />
          <path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
        </svg>
      );
    case 'git':
      return (
        <svg {...common}>
          <circle cx="6" cy="6" r="2.5" />
          <circle cx="6" cy="18" r="2.5" />
          <circle cx="18" cy="9" r="2.5" />
          <path d="M6 8.5v7M18 11.5c0 3-3 3.5-6 3.5s-4 1-4 3" />
        </svg>
      );
    case 'docker':
      return (
        <svg {...common}>
          <rect x="3" y="9" width="4" height="4" rx=".6" />
          <rect x="8" y="9" width="4" height="4" rx=".6" />
          <rect x="13" y="9" width="4" height="4" rx=".6" />
          <rect x="8" y="4.5" width="4" height="4" rx=".6" />
          <path d="M3 13h15c1.7 0 3 1.3 3 3 0 3-3 5-8 5-4.5 0-8-2-10-5Z" />
        </svg>
      );
    case 'ci':
      return (
        <svg {...common}>
          <path d="M20 12a8 8 0 0 1-13.7 5.6M4 12a8 8 0 0 1 13.7-5.6" />
          <path d="M17.5 3.5v3h-3M6.5 20.5v-3h3" />
        </svg>
      );
    case 'figma':
      return (
        <svg {...common}>
          <path d="M9 3h3v6H9a3 3 0 0 1 0-6Z" />
          <path d="M12 3h3a3 3 0 0 1 0 6h-3V3Z" />
          <path d="M9 9h3v6H9a3 3 0 0 1 0-6Z" />
          <circle cx="15" cy="12" r="3" />
          <path d="M9 15h3v3a3 3 0 1 1-3-3Z" />
        </svg>
      );
    case 'svg':
      return (
        <svg {...common}>
          <path d="M4 18C6 8 12 4 20 5" />
          <rect x="2.5" y="16.5" width="3" height="3" rx=".5" />
          <rect x="18.5" y="3.5" width="3" height="3" rx=".5" />
          <path d="m9 15 3-3" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M8 12h8M12 8v8" />
        </svg>
      );
  }
}

import { readStored, writeStored } from './client';
import type { Theme } from '@/types/models';

const THEME_KEY = 'nd:theme';

/** 读取主题偏好；非法值一律回退深色 */
export function getStoredTheme(): Theme {
  const raw = readStored(THEME_KEY);
  return raw === 'light' ? 'light' : 'dark';
}

export function setStoredTheme(theme: Theme): void {
  writeStored(THEME_KEY, theme);
}

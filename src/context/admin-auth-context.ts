import { createContext } from 'react';
import type { AdminSession } from '@/types/models';

export interface AdminAuthContextValue {
  session: AdminSession | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

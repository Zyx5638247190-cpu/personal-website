import { useContext } from 'react';
import { ToastContext } from '@/context/toast-context';

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast 必须在 ToastProvider 内使用');
  return context;
}

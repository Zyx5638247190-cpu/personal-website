import { Dialog } from './Dialog';
import { Button } from '@/components/ui/Button';
import { TrashIcon } from '@/components/icons';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** 删除等危险操作的二次确认；危险按钮统一红色，默认焦点留在「取消」上 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = '确认删除',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      title={title}
      size="sm"
      onClose={onCancel}
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onCancel} disabled={loading} data-autofocus>
            再想想
          </Button>
          <Button variant="danger" size="sm" onClick={onConfirm} disabled={loading}>
            <TrashIcon />
            {loading ? '删除中…' : confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-4">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-red-400/40 bg-red-500/10 text-danger">
          <TrashIcon />
        </span>
        <p className="text-sm leading-relaxed text-text-muted">{description}</p>
      </div>
    </Dialog>
  );
}

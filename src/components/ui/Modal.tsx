import { ReactNode, useEffect } from 'react';

interface ModalProps {
  open: boolean;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
  closeButton?: boolean;
  compact?: boolean;
}

export function Modal({ open, title, children, footer, onClose, closeButton = true, compact = false }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 px-3 py-4 sm:px-4 sm:py-8">
      <div className={`w-full rounded-[20px] border border-transparent hover:border-sky-500/25 hover:border-emerald-500/40 bg-[#11141A]/95 p-4 shadow-soft sm:p-5 ${compact ? 'max-w-[18rem] sm:max-w-[20rem]' : 'max-w-2xl'}`}>
        {(title || closeButton) ? (
          <div className="flex items-start justify-between gap-4">
            <div>{title ? <p className="text-sm uppercase tracking-[0.32em] text-[#3B82F6]">{title}</p> : null}</div>
            {closeButton ? (
              <button onClick={onClose} className="rounded-full border border-transparent hover:border-sky-500/25 hover:border-emerald-500/40 bg-[#171A22] p-2 text-[#B7BDCB] transition hover:bg-white/[0.08]">
                ✕
              </button>
            ) : null}
          </div>
        ) : null}
        <div className={`${title || closeButton ? 'mt-4' : 'mt-0'} space-y-3`}>{children}</div>
        {footer ? <div className="mt-5 border-t border-transparent hover:border-sky-500/25 hover:border-emerald-500/40 pt-3">{footer}</div> : null}
      </div>
    </div>
  );
}

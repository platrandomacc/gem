import { ReactNode, useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  duration?: number;
}

export function Toast({ message, duration = 3000 }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), duration);
    return () => window.clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-xs rounded-[18px] border border-transparent hover:border-sky-500/25 hover:border-emerald-500/40 bg-[#12141B] p-4 text-sm text-[#F7F7F8] shadow-soft">
      {message}
    </div>
  );
}

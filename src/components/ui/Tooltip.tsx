import { ReactNode, useState } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  const [active, setActive] = useState(false);

  return (
    <div className="relative inline-flex" onMouseEnter={() => setActive(true)} onMouseLeave={() => setActive(false)}>
      {children}
      {active ? (
        <div className="absolute bottom-full left-1/2 z-10 -translate-x-1/2 rounded-full bg-[#12141B] px-3 py-2 text-xs text-[#B7BDCB] shadow-soft">
          {content}
        </div>
      ) : null}
    </div>
  );
}

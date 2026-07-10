import { ReactNode } from 'react';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function SectionHeading({ title, subtitle, action }: SectionHeadingProps) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-xl font-semibold tracking-[0.02em] text-white">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-[#8D95A8]">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

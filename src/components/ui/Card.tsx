import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = true }: CardProps) {
  return (
    <div
      style={{ willChange: 'transform, box-shadow' }}
      className={`rounded-[24px] border border-white/10 bg-[linear-gradient(145deg,rgba(7,21,32,0.92),rgba(3,8,12,0.98))] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl ${hover ? 'transition-all duration-300 ease-out hover:scale-[1.01] hover:border-[#00F5FF]/40 hover:shadow-[0_25px_60px_rgba(0,245,255,0.08)]' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

import { HTMLAttributes } from 'react';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
}

export function Skeleton({ width = '100%', height = '1rem', className = '', ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-[#1B1F2A] ${className}`}
      style={{ width, height }}
      {...props}
    />
  );
}

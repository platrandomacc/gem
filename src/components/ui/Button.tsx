import { ReactNode, ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  sharp?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-gradient-to-r from-[#00F5FF] via-[#14B8A6] to-[#00D8F6] text-[#03080C] shadow-[0_4px_20px_rgba(0,245,255,0.25)] hover:shadow-[0_8px_30px_rgba(0,245,255,0.5)] border-none',
  secondary: 'bg-[#071520] text-[#E2F8FF] border border-[#00F5FF]/20 hover:border-[#00F5FF]/50 hover:bg-[#0C202F] shadow-[0_4px_15px_rgba(0,0,0,0.2)]',
  ghost: 'bg-transparent text-[#7DD3FC]/70 hover:bg-white/[0.05] hover:text-[#00F5FF]',
  outline: 'border border-[#00F5FF]/30 text-[#00F5FF] bg-[#00F5FF]/5 hover:bg-[#00F5FF]/10 hover:border-[#00F5FF]/60 shadow-[0_4px_12px_rgba(0,245,255,0.05)]',
};

export function Button({ children, variant = 'primary', fullWidth = false, sharp = false, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex h-11 items-center justify-center ${sharp ? 'rounded-none' : 'rounded-[16px]'} px-5 text-sm font-bold tracking-wide transition-all duration-200 ease-out hover:-translate-y-[1.5px] active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00F5FF]/60 disabled:cursor-not-allowed disabled:opacity-40 disabled:transform-none disabled:shadow-none ${variantClasses[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

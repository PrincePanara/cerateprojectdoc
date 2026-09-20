import React from 'react';
import { Loader2Icon } from 'lucide-react';
import { cn } from '../../utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'subtle';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
}

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-brand text-white hover:bg-brandInk border border-transparent shadow-sm',
  secondary: 'bg-surface text-ink border border-line hover:bg-surface2',
  ghost: 'bg-transparent text-ink2 hover:text-ink hover:bg-surface2 border border-transparent',
  danger: 'bg-badSoft text-bad border border-bad/25 hover:bg-bad hover:text-white',
  subtle: 'bg-brandSoft text-brandInk border border-transparent hover:bg-brand hover:text-white'
};

const SIZES: Record<Size, string> = {
  sm: 'h-8 px-2.5 text-[13px] gap-1.5 rounded-lg',
  md: 'h-9 px-3.5 text-[13.5px] gap-2 rounded-lg',
  lg: 'h-11 px-5 text-[15px] gap-2 rounded-lg'
};

export function Button({
  variant = 'secondary',
  size = 'md',
  loading = false,
  icon,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-colors duration-150 ease-out disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap',
        VARIANTS[variant],
        SIZES[size],
        className
      )}>
      
      {loading ? <Loader2Icon className="w-4 h-4 animate-spin" aria-hidden /> : icon}
      {children}
    </button>);

}
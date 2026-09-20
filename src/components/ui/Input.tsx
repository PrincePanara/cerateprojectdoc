import React from 'react';
import { cn } from '../../utils/cn';

export const inputClasses =
'w-full h-9 px-3 rounded-lg bg-surface border border-line text-[13.5px] text-ink placeholder:text-ink3 transition-colors duration-150 ease-out hover:border-ink3/60 focus:border-brand focus:ring-0';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...rest }, ref) {
    return <input ref={ref} {...rest} className={cn(inputClasses, className)} />;
  }
);
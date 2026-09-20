import React from 'react';
import { cn } from '../../utils/cn';

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, rows = 4, ...rest }, ref) {
    return (
      <textarea
        ref={ref}
        rows={rows}
        {...rest}
        className={cn(
          'w-full px-3 py-2.5 rounded-lg bg-surface border border-line text-[13.5px] leading-relaxed text-ink placeholder:text-ink3 transition-colors duration-150 ease-out hover:border-ink3/60 focus:border-brand focus:ring-0 resize-y',
          className
        )} />);


  }
);
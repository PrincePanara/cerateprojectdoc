import React from 'react';
import { cn } from '../../utils/cn';

interface FieldProps {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  htmlFor?: string;
  className?: string;
  children: React.ReactNode;
}

export function Field({ label, hint, error, required, htmlFor, className, children }: FieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={htmlFor} className="text-[12.5px] font-medium text-ink2">
        {label}
        {required && <span className="text-bad ml-0.5">*</span>}
      </label>
      {children}
      {error ?
      <p className="text-[12px] text-bad">{error}</p> :
      hint ?
      <p className="text-[12px] text-ink3">{hint}</p> :
      null}
    </div>);

}
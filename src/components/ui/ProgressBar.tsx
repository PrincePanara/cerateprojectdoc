import React from 'react';
import { cn } from '../../utils/cn';

export function ProgressBar({
  value,
  tone = 'brand',
  className,
  label





}: {value: number;tone?: 'brand' | 'ok' | 'warn';className?: string;label?: string;}) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  const bar = tone === 'ok' ? 'bg-ok' : tone === 'warn' ? 'bg-warn' : 'bg-brand';
  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn('h-1.5 w-full rounded-full bg-line2 overflow-hidden', className)}>
      
      <div
        className={cn('h-full rounded-full transition-[width] duration-300 ease-out', bar)}
        style={{ width: `${clamped}%` }} />
      
    </div>);

}
import React from 'react';
import { cn } from '../../utils/cn';

type Tone = 'neutral' | 'brand' | 'ok' | 'warn' | 'bad';

const TONES: Record<Tone, string> = {
  neutral: 'bg-surface2 text-ink2 border-line',
  brand: 'bg-brandSoft text-brandInk border-brand/20',
  ok: 'bg-okSoft text-ok border-ok/25',
  warn: 'bg-warnSoft text-warn border-warn/25',
  bad: 'bg-badSoft text-bad border-bad/25'
};

export function Badge({
  tone = 'neutral',
  children,
  className




}: {tone?: Tone;children: React.ReactNode;className?: string;}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 h-[22px] px-2 rounded-md border text-[11.5px] font-medium tracking-[0.01em]',
        TONES[tone],
        className
      )}>
      
      {children}
    </span>);

}
import React from 'react';
import { cn } from '../../utils/cn';

export function Logo({ size = 'md', withWordmark = true, className }: {size?: 'sm' | 'md';withWordmark?: boolean;className?: string;}) {
  const box = size === 'sm' ? 'w-7 h-7' : 'w-8 h-8';
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span className={cn('rounded-lg bg-brand text-white flex items-center justify-center shrink-0', box)} aria-hidden>
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 3h8l4 4v14H6z" />
          <path d="M14 3v5h4" />
          <path d="M9 13h6" />
          <path d="M9 17h4" />
        </svg>
      </span>
      {withWordmark &&
      <span className="font-semibold text-ink tracking-[-0.01em] text-[15px]">
          DocuForge <span className="text-brand">AI</span>
        </span>
      }
    </span>);

}
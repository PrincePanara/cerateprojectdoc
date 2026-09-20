import React from 'react';
import { cn } from '../../utils/cn';

interface PanelProps {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

export function Panel({ title, description, actions, children, className, bodyClassName }: PanelProps) {
  return (
    <section className={cn('bg-surface border border-line rounded-xl shadow-card', className)}>
      {(title || actions) &&
      <header className="flex items-start justify-between gap-4 px-5 py-4 border-b border-line2">
          <div className="min-w-0">
            {title && <h2 className="text-[14.5px] font-semibold text-ink">{title}</h2>}
            {description && <p className="text-[12.5px] text-ink2 mt-0.5 leading-relaxed">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </header>
      }
      <div className={cn('px-5 py-4', bodyClassName)}>{children}</div>
    </section>);

}
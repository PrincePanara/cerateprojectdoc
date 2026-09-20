import React from 'react';

export function EmptyState({
  icon,
  title,
  description,
  action





}: {icon: React.ReactNode;title: string;description: string;action?: React.ReactNode;}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6 rounded-xl border border-dashed border-line bg-surface2/60">
      <div className="w-10 h-10 rounded-lg bg-surface border border-line flex items-center justify-center text-ink3 mb-3.5">
        {icon}
      </div>
      <h3 className="text-[14.5px] font-semibold text-ink">{title}</h3>
      <p className="text-[13px] text-ink2 mt-1 max-w-sm leading-relaxed">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>);

}
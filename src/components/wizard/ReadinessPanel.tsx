import React from 'react';
import { CheckIcon, CircleAlertIcon, TriangleAlertIcon } from 'lucide-react';
import type { Project } from '../../types/project';
import { getReadiness } from '../../utils/validation';
import { ProgressBar } from '../ui/ProgressBar';
import { Button } from '../ui/Button';

export function ReadinessPanel({ project, goTo }: {project: Project;goTo: (step: string) => void;}) {
  const readiness = getReadiness(project);
  const firstIncomplete = readiness.items.find((i) => i.state !== 'ok');

  return (
    <div className="rounded-xl border border-line bg-surface shadow-card">
      <div className="px-5 py-4 border-b border-line2">
        <div className="flex items-baseline justify-between">
          <h2 className="text-[14.5px] font-semibold text-ink">Documentation readiness</h2>
          <span className="text-[19px] font-semibold text-ink tabular-nums tracking-[-0.02em]">{readiness.percent}%</span>
        </div>
        <ProgressBar
          className="mt-2.5"
          value={readiness.percent}
          tone={readiness.percent >= 80 ? 'ok' : readiness.percent >= 40 ? 'brand' : 'warn'}
          label="Documentation readiness" />
        
      </div>
      <ul className="px-2 py-2">
        {readiness.items.map((item) =>
        <li key={item.key}>
            <button
            onClick={() => goTo(item.step)}
            className="w-full flex items-start gap-2.5 px-3 py-2 rounded-lg text-left hover:bg-surface2 transition-colors duration-150 ease-out">
            
              <span className="mt-0.5 shrink-0" aria-hidden>
                {item.state === 'ok' ?
              <CheckIcon className="w-4 h-4 text-ok" /> :
              item.state === 'warn' ?
              <TriangleAlertIcon className="w-4 h-4 text-warn" /> :

              <CircleAlertIcon className="w-4 h-4 text-bad" />
              }
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] text-ink">
                  {item.label}
                  {item.required && item.state !== 'ok' && <span className="text-[11.5px] text-bad ml-1.5">required</span>}
                </span>
                <span className="block text-[12px] text-ink3">{item.detail}</span>
              </span>
            </button>
          </li>
        )}
      </ul>
      {firstIncomplete &&
      <div className="px-5 py-3.5 border-t border-line2">
          <Button size="sm" variant="primary" onClick={() => goTo(firstIncomplete.step)}>
            Fix missing sections
          </Button>
        </div>
      }
    </div>);

}
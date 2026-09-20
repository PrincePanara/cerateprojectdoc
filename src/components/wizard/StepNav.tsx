import React from 'react';
import { CheckIcon } from 'lucide-react';
import type { Project } from '../../types/project';
import { WIZARD_STEPS, type WizardStepKey } from '../../data/catalogs';
import { getStepStatus } from '../../utils/stepStatus';
import { cn } from '../../utils/cn';

export function StepNav({
  project,
  current,
  onSelect




}: {project: Project;current: WizardStepKey;onSelect: (step: WizardStepKey) => void;}) {
  return (
    <nav aria-label="Documentation steps" className="border-b border-line2 bg-surface">
      <ol className="flex items-stretch gap-1 px-4 sm:px-6 overflow-x-auto scroll-thin">
        {WIZARD_STEPS.map((step, i) => {
          const state = getStepStatus(project, step.key);
          const active = step.key === current;
          return (
            <li key={step.key}>
              <button
                onClick={() => onSelect(step.key)}
                aria-current={active ? 'step' : undefined}
                className={cn(
                  'group flex items-center gap-2 h-11 px-2.5 text-[12.5px] whitespace-nowrap border-b-2 transition-colors duration-150 ease-out',
                  active ? 'border-brand text-ink font-medium' : 'border-transparent text-ink2 hover:text-ink'
                )}>
                
                <span
                  className={cn(
                    'w-4 h-4 rounded-full flex items-center justify-center text-[9.5px] font-semibold shrink-0',
                    state === 'complete' ?
                    'bg-ok text-white' :
                    state === 'partial' ?
                    'bg-warnSoft text-warn border border-warn/40' :
                    'bg-surface2 text-ink3 border border-line'
                  )}
                  aria-hidden>
                  
                  {state === 'complete' ? <CheckIcon className="w-2.5 h-2.5" /> : i + 1}
                </span>
                {step.label}
              </button>
            </li>);

        })}
      </ol>
    </nav>);

}
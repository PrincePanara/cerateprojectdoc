import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PenLineIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useProjects } from '../contexts/ProjectsContext';
import { getReadiness } from '../utils/validation';
import { WIZARD_STEPS } from '../data/catalogs';

export function Builder() {
  const { projects } = useProjects();
  const navigate = useNavigate();
  const active = projects.filter((p) => p.status !== 'Archived');

  if (active.length === 0) {
    return (
      <EmptyState
        icon={<PenLineIcon className="w-5 h-5" />}
        title="Nothing to build yet"
        description="Create a project first, then the documentation builder will take you through each step."
        action={<Button variant="primary" onClick={() => navigate('/app')}>Go to dashboard</Button>} />);


  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-ink">Documentation Builder</h1>
        <p className="text-[13.5px] text-ink2 mt-1">Pick a project and jump straight to the step you want to work on.</p>
      </header>

      <div className="flex flex-col gap-3">
        {active.map((p) => {
          const readiness = getReadiness(p);
          return (
            <article key={p.id} className="rounded-xl border border-line bg-surface p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-[15px] font-semibold text-ink truncate">{p.basicInfo.projectName}</h2>
                  <p className="text-[12.5px] text-ink3 mt-0.5">
                    {readiness.percent}% complete · {readiness.blocking} required section
                    {readiness.blocking === 1 ? '' : 's'} still missing
                  </p>
                </div>
                <Button variant="primary" size="sm" onClick={() => navigate(`/project/${p.id}/basic`)}>
                  Open builder
                </Button>
              </div>
              <ProgressBar value={readiness.percent} className="mt-3" label={`${p.basicInfo.projectName} completion`} />
              <div className="mt-3 flex flex-wrap gap-1.5">
                {WIZARD_STEPS.map((s) =>
                <button
                  key={s.key}
                  onClick={() => navigate(`/project/${p.id}/${s.key}`)}
                  className="h-6 px-2 rounded-md border border-line bg-surface2 text-[11.5px] text-ink2 hover:border-brand hover:text-brand transition-colors duration-150 ease-out">
                  
                    {s.label}
                  </button>
                )}
              </div>
            </article>);

        })}
      </div>
    </div>);

}
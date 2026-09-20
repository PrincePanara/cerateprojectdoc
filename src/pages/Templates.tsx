import React, { useState } from 'react';
import { CheckIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { TEMPLATES, type TemplateDef } from '../data/catalogs';
import { useProjects } from '../contexts/ProjectsContext';
import { useToast } from '../components/ui/ToastProvider';
import { Select } from '../components/ui/Select';
import { cn } from '../utils/cn';

function TemplatePreview({ template }: {template: TemplateDef;}) {
  return (
    <div className="aspect-[3/4] rounded-lg bg-white border border-neutral-200 p-5 flex flex-col" aria-hidden>
      <div className="h-2 w-2/3 rounded-sm mx-auto" style={{ background: template.accent }} />
      <div className="h-1.5 w-2/5 bg-neutral-300 rounded-sm mx-auto mt-2" />
      <div className="mt-6 space-y-1.5">
        {[96, 90, 94, 78].map((w, i) =>
        <div key={i} className="h-[4px] bg-neutral-200 rounded-sm" style={{ width: `${w}%` }} />
        )}
      </div>
      <div className="mt-5 h-2 w-1/3 rounded-sm" style={{ background: template.accent, opacity: 0.7 }} />
      <div className="mt-2 space-y-1.5">
        {[92, 88, 95].map((w, i) =>
        <div key={i} className="h-[4px] bg-neutral-200 rounded-sm" style={{ width: `${w}%` }} />
        )}
      </div>
      <div className="mt-auto h-10 border border-neutral-200 rounded-sm" />
    </div>);

}

export function Templates() {
  const { projects, updateProject } = useProjects();
  const { push } = useToast();
  const [preview, setPreview] = useState<TemplateDef | null>(null);
  const [target, setTarget] = useState(projects[0]?.id ?? '');

  const apply = (template: TemplateDef) => {
    const projectId = target || projects[0]?.id;
    if (!projectId) return;
    updateProject(projectId, (p) => ({
      ...p,
      formatting: { ...p.formatting, template: template.id, font: template.font }
    }));
    push({ tone: 'success', title: `${template.name} applied`, description: 'Formatting defaults were updated for the selected project.' });
    setPreview(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-ink">Templates</h1>
          <p className="text-[13.5px] text-ink2 mt-1">Preview a report template and apply it to one of your projects.</p>
        </div>
        {projects.length > 0 &&
        <label className="flex items-center gap-2 text-[13px] text-ink2">
            Apply to
            <Select
            options={projects.map((p) => ({ value: p.id, label: p.basicInfo.projectName }))}
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="w-[220px]" />
          
          </label>
        }
      </header>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {TEMPLATES.map((t) => {
          const inUse = projects.some((p) => p.id === (target || projects[0]?.id) && p.formatting.template === t.id);
          return (
            <article key={t.id} className={cn('rounded-xl border bg-surface p-4 flex flex-col', inUse ? 'border-brand' : 'border-line')}>
              <TemplatePreview template={t} />
              <div className="flex items-start justify-between gap-2 mt-3.5">
                <h2 className="text-[14px] font-semibold text-ink">{t.name}</h2>
                {inUse &&
                <span className="inline-flex items-center gap-1 text-[11.5px] text-brand font-medium">
                    <CheckIcon className="w-3.5 h-3.5" /> In use
                  </span>
                }
              </div>
              <p className="text-[12.5px] text-ink2 mt-1 leading-relaxed">{t.description}</p>
              <p className="text-[12px] text-ink3 mt-2">Default font: {t.font}</p>
              <div className="mt-auto pt-3.5 flex gap-2">
                <Button size="sm" onClick={() => setPreview(t)}>
                  Preview
                </Button>
                <Button size="sm" variant="primary" onClick={() => apply(t)} disabled={!projects.length}>
                  Use template
                </Button>
              </div>
            </article>);

        })}
      </div>

      <Modal
        open={!!preview}
        onClose={() => setPreview(null)}
        title={preview?.name ?? ''}
        description={preview?.description}
        size="md"
        footer={
        <>
            <Button onClick={() => setPreview(null)}>Close</Button>
            <Button variant="primary" onClick={() => preview && apply(preview)} disabled={!projects.length}>
              Use this template
            </Button>
          </>
        }>
        
        {preview &&
        <div className="grid sm:grid-cols-2 gap-5">
            <TemplatePreview template={preview} />
            <dl className="text-[13px] space-y-3">
              <div>
                <dt className="text-ink3">Body font</dt>
                <dd className="text-ink">{preview.font}</dd>
              </div>
              <div>
                <dt className="text-ink3">Required sections</dt>
                <dd className="text-ink capitalize">{preview.requires.join(', ')}</dd>
              </div>
              <div>
                <dt className="text-ink3">Best for</dt>
                <dd className="text-ink leading-relaxed">{preview.description}</dd>
              </div>
            </dl>
          </div>
        }
      </Modal>
    </div>);

}
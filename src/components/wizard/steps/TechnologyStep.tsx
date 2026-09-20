import React, { useState } from 'react';
import { PlusIcon, Trash2Icon } from 'lucide-react';
import type { StepProps } from '../types';
import type { Technology } from '../../../types/project';
import { Panel } from '../../ui/Panel';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Field } from '../../ui/Field';
import { Textarea } from '../../ui/Textarea';
import { AIAssist } from '../AIAssist';
import { TECH_CATALOG, TECH_CATEGORIES } from '../../../data/catalogs';
import { uid } from '../../../utils/cn';

export function TechnologyStep({ project, update }: StepProps) {
  const [custom, setCustom] = useState<Record<string, string>>({});

  const setTech = (next: Technology[]) => update((p) => ({ ...p, technologies: next }));

  const add = (category: string, name: string) => {
    if (!name.trim()) return;
    if (project.technologies.some((t) => t.name.toLowerCase() === name.toLowerCase() && t.category === category)) return;
    setTech([...project.technologies, { id: uid('tech'), category, name: name.trim(), version: '', purpose: '', usage: '' }]);
  };

  const patch = (id: string, values: Partial<Technology>) =>
  setTech(project.technologies.map((t) => t.id === id ? { ...t, ...values } : t));

  return (
    <div className="flex flex-col gap-5">
      <header>
        <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-ink">Technology stack</h2>
        <p className="text-[13.5px] text-ink2 mt-1">
          Each technology becomes a subsection of Chapter 4 and a row in the technology summary table.
        </p>
      </header>

      {TECH_CATEGORIES.map((category) => {
        const selected = project.technologies.filter((t) => t.category === category);
        return (
          <Panel key={category} title={category} description={`${selected.length} selected`}>
            <div className="flex flex-wrap gap-1.5">
              {TECH_CATALOG[category].map((name) => {
                const active = selected.some((t) => t.name === name);
                return (
                  <button
                    key={name}
                    onClick={() => active ? setTech(project.technologies.filter((t) => !(t.name === name && t.category === category))) : add(category, name)}
                    aria-pressed={active}
                    className={`h-7 px-2.5 rounded-md border text-[12.5px] transition-colors duration-150 ease-out ${
                    active ? 'border-brand bg-brandSoft text-brandInk font-medium' : 'border-line bg-surface2 text-ink2 hover:border-ink3/60'}`
                    }>
                    
                    {active ? '✓ ' : '+ '}
                    {name}
                  </button>);

              })}
            </div>

            <div className="flex gap-2 mt-3 max-w-sm">
              <Input
                value={custom[category] ?? ''}
                placeholder={`Custom ${category.toLowerCase()} technology`}
                aria-label={`Custom ${category} technology`}
                onChange={(e) => setCustom({ ...custom, [category]: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    add(category, custom[category] ?? '');
                    setCustom({ ...custom, [category]: '' });
                  }
                }} />
              
              <Button
                icon={<PlusIcon className="w-3.5 h-3.5" />}
                onClick={() => {
                  add(category, custom[category] ?? '');
                  setCustom({ ...custom, [category]: '' });
                }}>
                
                Add
              </Button>
            </div>

            {selected.length > 0 &&
            <ul className="flex flex-col gap-3 mt-4">
                {selected.map((t) =>
              <li key={t.id} className="rounded-lg border border-line p-3.5">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-[13.5px] font-semibold text-ink">{t.name}</h3>
                      <Button
                    size="sm"
                    variant="ghost"
                    aria-label={`Remove ${t.name}`}
                    icon={<Trash2Icon className="w-3.5 h-3.5" />}
                    onClick={() => setTech(project.technologies.filter((x) => x.id !== t.id))} />
                  
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3 mt-2.5">
                      <Field label="Version" htmlFor={`v-${t.id}`}>
                        <Input id={`v-${t.id}`} value={t.version} placeholder="18.3" onChange={(e) => patch(t.id, { version: e.target.value })} />
                      </Field>
                      <Field label="Purpose" htmlFor={`p-${t.id}`}>
                        <Input id={`p-${t.id}`} value={t.purpose} placeholder="User interface" onChange={(e) => patch(t.id, { purpose: e.target.value })} />
                      </Field>
                    </div>
                    <Field label="Usage description" htmlFor={`u-${t.id}`} className="mt-3">
                      <Textarea
                    id={`u-${t.id}`}
                    rows={2}
                    value={t.usage}
                    placeholder="How this technology is used in the project."
                    onChange={(e) => patch(t.id, { usage: e.target.value })} />
                  
                    </Field>
                    <div className="mt-2">
                      <AIAssist
                    task="technologyDescription"
                    project={project}
                    current={t.usage}
                    args={{ technologyId: t.id }}
                    label="Generate explanation"
                    compact
                    onAccept={(text) => patch(t.id, { usage: text })} />
                  
                    </div>
                  </li>
              )}
              </ul>
            }
          </Panel>);

      })}
    </div>);

}
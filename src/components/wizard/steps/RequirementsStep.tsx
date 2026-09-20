import React from 'react';
import { ListChecksIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import type { StepProps } from '../types';
import type { FunctionalRequirement, NonFunctionalRequirement, Priority } from '../../../types/project';
import { Panel } from '../../ui/Panel';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import { Textarea } from '../../ui/Textarea';
import { EmptyState } from '../../ui/EmptyState';
import { Badge } from '../../ui/Badge';
import { NFR_CATEGORIES } from '../../../data/catalogs';
import { pad, uid } from '../../../utils/cn';

const PRIORITIES: Priority[] = ['High', 'Medium', 'Low'];

export function RequirementsStep({ project, update }: StepProps) {
  const { functional, nonFunctional } = project.requirements;
  const moduleOptions = ['—', ...project.modules.map((m) => m.name)];

  const setFunctional = (next: FunctionalRequirement[]) =>
  update((p) => ({ ...p, requirements: { ...p.requirements, functional: next } }));
  const setNonFunctional = (next: NonFunctionalRequirement[]) =>
  update((p) => ({ ...p, requirements: { ...p.requirements, nonFunctional: next } }));

  const addFunctional = () =>
  setFunctional([
  ...functional,
  { id: uid('fr'), reqId: `FR-${pad(functional.length + 1)}`, name: '', description: '', priority: 'High', module: '' }]
  );

  const addNonFunctional = (category: string) =>
  setNonFunctional([...nonFunctional, { id: uid('nfr'), category, name: '', description: '' }]);

  return (
    <div className="flex flex-col gap-5">
      <header>
        <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-ink">Project requirements</h2>
        <p className="text-[13.5px] text-ink2 mt-1">
          Requirements become numbered tables in Chapter 2 and drive the generated test cases.
        </p>
      </header>

      <Panel
        title="Functional requirements"
        description="What the system must do."
        actions={
        <Button size="sm" variant="primary" icon={<PlusIcon className="w-3.5 h-3.5" />} onClick={addFunctional}>
            Add requirement
          </Button>
        }>
        
        {functional.length === 0 ?
        <EmptyState
          icon={<ListChecksIcon className="w-5 h-5" />}
          title="No functional requirements yet"
          description="Add requirements like user registration, login or report generation."
          action={<Button variant="primary" onClick={addFunctional}>Add the first requirement</Button>} /> :


        <ul className="flex flex-col gap-3">
            {functional.map((r, i) =>
          <li key={r.id} className="rounded-lg border border-line p-3">
                <div className="grid grid-cols-1 sm:grid-cols-[92px_1fr_150px_120px_auto] gap-2 items-start">
                  <Input
                value={r.reqId}
                aria-label={`Requirement ${i + 1} ID`}
                onChange={(e) => setFunctional(functional.map((x) => x.id === r.id ? { ...x, reqId: e.target.value } : x))} />
              
                  <Input
                value={r.name}
                placeholder="Requirement name"
                aria-label={`Requirement ${i + 1} name`}
                onChange={(e) => setFunctional(functional.map((x) => x.id === r.id ? { ...x, name: e.target.value } : x))} />
              
                  <Select
                options={moduleOptions}
                value={r.module || '—'}
                aria-label={`Requirement ${i + 1} module`}
                onChange={(e) =>
                setFunctional(functional.map((x) => x.id === r.id ? { ...x, module: e.target.value === '—' ? '' : e.target.value } : x))
                } />
              
                  <Select
                options={PRIORITIES}
                value={r.priority}
                aria-label={`Requirement ${i + 1} priority`}
                onChange={(e) => setFunctional(functional.map((x) => x.id === r.id ? { ...x, priority: e.target.value as Priority } : x))} />
              
                  <Button
                size="sm"
                variant="ghost"
                aria-label={`Delete requirement ${r.reqId}`}
                icon={<Trash2Icon className="w-3.5 h-3.5" />}
                onClick={() => setFunctional(functional.filter((x) => x.id !== r.id))} />
              
                </div>
                <Textarea
              className="mt-2"
              rows={2}
              value={r.description}
              placeholder="Describe what this requirement covers."
              aria-label={`Requirement ${i + 1} description`}
              onChange={(e) => setFunctional(functional.map((x) => x.id === r.id ? { ...x, description: e.target.value } : x))} />
            
              </li>
          )}
          </ul>
        }
      </Panel>

      <Panel
        title="Non-functional requirements"
        description="How well the system must behave. Pick a category to add one.">
        
        <div className="flex flex-wrap gap-1.5 mb-4">
          {NFR_CATEGORIES.map((c) =>
          <button
            key={c}
            onClick={() => addNonFunctional(c)}
            className="h-7 px-2.5 rounded-md border border-line bg-surface2 text-[12.5px] text-ink2 hover:border-brand hover:text-brand transition-colors duration-150 ease-out">
            
              + {c}
            </button>
          )}
          <button
            onClick={() => addNonFunctional('Custom')}
            className="h-7 px-2.5 rounded-md border border-dashed border-line text-[12.5px] text-ink3 hover:text-brand hover:border-brand transition-colors duration-150 ease-out">
            
            + Custom
          </button>
        </div>

        {nonFunctional.length === 0 ?
        <p className="text-[13px] text-ink3">
            No quality attributes added yet. Most reports include at least performance, security and usability.
          </p> :

        <ul className="flex flex-col gap-3">
            {nonFunctional.map((r, i) =>
          <li key={r.id} className="rounded-lg border border-line p-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge tone="brand">{r.category}</Badge>
                  <Button
                size="sm"
                variant="ghost"
                aria-label={`Delete non-functional requirement ${i + 1}`}
                icon={<Trash2Icon className="w-3.5 h-3.5" />}
                onClick={() => setNonFunctional(nonFunctional.filter((x) => x.id !== r.id))} />
              
                </div>
                <div className="grid sm:grid-cols-[220px_1fr] gap-2">
                  <Input
                value={r.name}
                placeholder="Requirement name"
                aria-label={`Non-functional requirement ${i + 1} name`}
                onChange={(e) => setNonFunctional(nonFunctional.map((x) => x.id === r.id ? { ...x, name: e.target.value } : x))} />
              
                  <Input
                value={r.description}
                placeholder="Describe the expected behaviour"
                aria-label={`Non-functional requirement ${i + 1} description`}
                onChange={(e) => setNonFunctional(nonFunctional.map((x) => x.id === r.id ? { ...x, description: e.target.value } : x))} />
              
                </div>
              </li>
          )}
          </ul>
        }
      </Panel>
    </div>);

}
import React from 'react';
import { ShapesIcon, Trash2Icon } from 'lucide-react';
import type { StepProps } from '../types';
import type { Diagram, DiagramType } from '../../../types/project';
import { Panel } from '../../ui/Panel';
import { Button } from '../../ui/Button';
import { Field } from '../../ui/Field';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import { Textarea } from '../../ui/Textarea';
import { UploadZone } from '../../ui/UploadZone';
import { EmptyState } from '../../ui/EmptyState';
import { Badge } from '../../ui/Badge';
import { AIAssist } from '../AIAssist';
import { DIAGRAM_TYPES } from '../../../data/catalogs';
import { uid } from '../../../utils/cn';

export function ArchitectureStep({ project, update }: StepProps) {
  const setDiagrams = (next: Diagram[]) => update((p) => ({ ...p, diagrams: next }));
  const setContent = (key: string, value: string) => update((p) => ({ ...p, content: { ...p.content, [key]: value } }));
  const patch = (id: string, values: Partial<Diagram>) =>
  setDiagrams(project.diagrams.map((d) => d.id === id ? { ...d, ...values } : d));

  const addDiagrams = (files: {name: string;dataUrl: string;}[]) =>
  setDiagrams([
  ...project.diagrams,
  ...files.map((f) => ({
    id: uid('dg'),
    type: 'Architecture Diagram' as DiagramType,
    title: f.name.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    description: '',
    chapter: 'Chapter 3 — System Design',
    imageUrl: f.dataUrl
  }))]
  );

  return (
    <div className="flex flex-col gap-5">
      <header>
        <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-ink">System architecture</h2>
        <p className="text-[13.5px] text-ink2 mt-1">
          Written architecture goes into Sections 3.1 and 3.2. Every diagram becomes a numbered figure in Chapter 3.
        </p>
      </header>

      <Panel title="3.1 System architecture" description="How the layers of the system fit together.">
        <Textarea
          rows={5}
          value={project.content['ch3.architecture'] ?? ''}
          aria-label="System architecture description"
          placeholder="Describe the presentation, application and data layers."
          onChange={(e) => setContent('ch3.architecture', e.target.value)} />
        
        <div className="mt-2.5">
          <AIAssist
            task="architecture"
            project={project}
            current={project.content['ch3.architecture'] ?? ''}
            label="Generate from technology stack"
            onAccept={(text) => setContent('ch3.architecture', text)} />
          
        </div>
      </Panel>

      <Panel title="3.2 System workflow" description="The path a typical interaction takes through the modules.">
        <Textarea
          rows={5}
          value={project.content['ch3.workflow'] ?? ''}
          aria-label="System workflow description"
          placeholder="Describe a typical end to end flow."
          onChange={(e) => setContent('ch3.workflow', e.target.value)} />
        
        <div className="mt-2.5">
          <AIAssist
            task="workflow"
            project={project}
            current={project.content['ch3.workflow'] ?? ''}
            label="Generate from modules"
            onAccept={(text) => setContent('ch3.workflow', text)} />
          
        </div>
      </Panel>

      <Panel title="Diagrams" description="Upload architecture, use case, data flow, ER, class, sequence or activity diagrams.">
        <UploadZone onFiles={addDiagrams} label="Drop diagram images here or click to browse" />

        {project.diagrams.length === 0 ?
        <div className="mt-4">
            <EmptyState
            icon={<ShapesIcon className="w-5 h-5" />}
            title="No diagrams added"
            description="A report usually includes at least an architecture diagram, a use case diagram and an ER diagram." />
          
          </div> :

        <ul className="grid lg:grid-cols-2 gap-4 mt-4">
            {project.diagrams.map((d, i) =>
          <li key={d.id} className="rounded-lg border border-line overflow-hidden">
                <div className="aspect-[4/3] bg-white border-b border-line2 flex items-center justify-center">
                  {d.imageUrl ?
              <img src={d.imageUrl} alt={d.title} className="w-full h-full object-contain" /> :

              <ShapesIcon className="w-5 h-5 text-ink3" aria-hidden />
              }
                </div>
                <div className="p-3.5 flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge tone="brand">Figure 3.{i + 1}</Badge>
                    <Button
                  size="sm"
                  variant="ghost"
                  aria-label={`Delete diagram ${d.title}`}
                  icon={<Trash2Icon className="w-3.5 h-3.5" />}
                  onClick={() => setDiagrams(project.diagrams.filter((x) => x.id !== d.id))} />
                
                  </div>
                  <Field label="Diagram title" htmlFor={`dt-${d.id}`}>
                    <Input id={`dt-${d.id}`} value={d.title} onChange={(e) => patch(d.id, { title: e.target.value })} />
                  </Field>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Field label="Diagram type" htmlFor={`dy-${d.id}`}>
                      <Select
                    id={`dy-${d.id}`}
                    options={DIAGRAM_TYPES}
                    value={d.type}
                    onChange={(e) => patch(d.id, { type: e.target.value as DiagramType })} />
                  
                    </Field>
                    <Field label="Related chapter" htmlFor={`dc-${d.id}`}>
                      <Input id={`dc-${d.id}`} value={d.chapter} onChange={(e) => patch(d.id, { chapter: e.target.value })} />
                    </Field>
                  </div>
                  <Field label="Description" htmlFor={`dd-${d.id}`}>
                    <Textarea id={`dd-${d.id}`} rows={2} value={d.description} onChange={(e) => patch(d.id, { description: e.target.value })} />
                  </Field>
                  <AIAssist
                task="diagramDescription"
                project={project}
                current={d.description}
                args={{ diagramId: d.id }}
                label="Describe diagram"
                compact
                onAccept={(text) => patch(d.id, { description: text })} />
              
                </div>
              </li>
          )}
          </ul>
        }
      </Panel>
    </div>);

}
import React, { useState } from 'react';
import { GripVerticalIcon, ImageIcon, ScanSearchIcon, Trash2Icon } from 'lucide-react';
import type { StepProps } from '../types';
import type { Screenshot } from '../../../types/project';
import { Panel } from '../../ui/Panel';
import { Button } from '../../ui/Button';
import { Field } from '../../ui/Field';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import { Textarea } from '../../ui/Textarea';
import { ListEditor } from '../../ui/ListEditor';
import { UploadZone } from '../../ui/UploadZone';
import { EmptyState } from '../../ui/EmptyState';
import { Badge } from '../../ui/Badge';
import { AIAssist } from '../AIAssist';
import { SCREEN_TYPES } from '../../../data/catalogs';
import { uid } from '../../../utils/cn';
import { runAI } from '../../../utils/ai';
import { useToast } from '../../ui/ToastProvider';

export function ScreenshotsStep({ project, update }: StepProps) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState<string | null>(null);
  const { push } = useToast();

  const setShots = (next: Screenshot[]) => update((p) => ({ ...p, screenshots: next }));
  const patch = (id: string, values: Partial<Screenshot>) =>
  setShots(project.screenshots.map((s) => s.id === id ? { ...s, ...values } : s));

  const add = (files: {name: string;dataUrl: string;}[]) =>
  setShots([
  ...project.screenshots,
  ...files.map((f) => ({
    id: uid('shot'),
    title: f.name.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    module: project.modules[0]?.name ?? '',
    screenType: 'Dashboard',
    description: '',
    functionalities: [],
    notes: '',
    imageUrl: f.dataUrl
  }))]
  );

  const reorder = (targetId: string) => {
    if (!dragId || dragId === targetId) return;
    const list = [...project.screenshots];
    const from = list.findIndex((s) => s.id === dragId);
    const to = list.findIndex((s) => s.id === targetId);
    const [moved] = list.splice(from, 1);
    list.splice(to, 0, moved);
    setShots(list);
  };

  const analyze = async (shot: Screenshot) => {
    setAnalyzing(shot.id);
    const res = await runAI({ task: 'screenshotDescription', project, args: { screenshotId: shot.id } });
    setAnalyzing(null);
    if (res.status === 'missing') {
      push({
        tone: 'info',
        title: 'Information required',
        description: `Add ${res.missing.join(', ').toLowerCase()} before analysing this screenshot.`
      });
      return;
    }
    patch(shot.id, { description: res.text });
    push({ tone: 'success', title: 'Description generated', description: 'Review and edit it before exporting.' });
  };

  return (
    <div className="flex flex-col gap-5">
      <header>
        <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-ink">Screenshot manager</h2>
        <p className="text-[13.5px] text-ink2 mt-1">
          Screenshots become Chapter 6. Each one is numbered Figure 6.x in the order shown below.
        </p>
      </header>

      <Panel title="Upload screenshots">
        <UploadZone onFiles={add} />
      </Panel>

      {project.screenshots.length === 0 ?
      <EmptyState
        icon={<ImageIcon className="w-5 h-5" />}
        title="No screenshots yet"
        description="Upload the screens of your application. Login, dashboard and the main workflow screens are a good place to start." /> :


      <ul className="flex flex-col gap-4">
          {project.screenshots.map((s, i) =>
        <li
          key={s.id}
          draggable
          onDragStart={() => setDragId(s.id)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => {
            reorder(s.id);
            setDragId(null);
          }}
          className="rounded-xl border border-line bg-surface shadow-card overflow-hidden grid lg:grid-cols-[300px_1fr]">
          
              <div className="border-b lg:border-b-0 lg:border-r border-line2 bg-surface2">
                <div className="aspect-[16/10] flex items-center justify-center overflow-hidden bg-white">
                  {s.imageUrl ?
              <img src={s.imageUrl} alt={s.title} className="w-full h-full object-cover" loading="lazy" /> :

              <ImageIcon className="w-5 h-5 text-ink3" aria-hidden />
              }
                </div>
                <div className="flex items-center justify-between gap-2 px-3 py-2">
                  <span className="flex items-center gap-1.5">
                    <GripVerticalIcon className="w-3.5 h-3.5 text-ink3 cursor-grab active:cursor-grabbing" aria-hidden />
                    <Badge tone="brand">Figure 6.{i + 1}</Badge>
                  </span>
                  <Button
                size="sm"
                variant="ghost"
                aria-label={`Delete screenshot ${s.title}`}
                icon={<Trash2Icon className="w-3.5 h-3.5" />}
                onClick={() => setShots(project.screenshots.filter((x) => x.id !== s.id))} />
              
                </div>
              </div>

              <div className="p-4 flex flex-col gap-3">
                <div className="grid sm:grid-cols-3 gap-3">
                  <Field label="Screenshot title" htmlFor={`st-${s.id}`}>
                    <Input id={`st-${s.id}`} value={s.title} onChange={(e) => patch(s.id, { title: e.target.value })} />
                  </Field>
                  <Field label="Module" htmlFor={`sm-${s.id}`}>
                    <Select
                  id={`sm-${s.id}`}
                  options={['—', ...project.modules.map((m) => m.name)]}
                  value={s.module || '—'}
                  onChange={(e) => patch(s.id, { module: e.target.value === '—' ? '' : e.target.value })} />
                
                  </Field>
                  <Field label="Screen type" htmlFor={`sy-${s.id}`}>
                    <Select id={`sy-${s.id}`} options={SCREEN_TYPES} value={s.screenType} onChange={(e) => patch(s.id, { screenType: e.target.value })} />
                  </Field>
                </div>

                <Field label="Description" htmlFor={`sd-${s.id}`} hint="This paragraph appears above the figure in the report.">
                  <Textarea id={`sd-${s.id}`} rows={3} value={s.description} onChange={(e) => patch(s.id, { description: e.target.value })} />
                </Field>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                size="sm"
                variant="subtle"
                icon={<ScanSearchIcon className="w-3.5 h-3.5" />}
                loading={analyzing === s.id}
                onClick={() => analyze(s)}>
                
                    Analyze screenshot
                  </Button>
                  <AIAssist
                task="screenshotDescription"
                project={project}
                current={s.description}
                args={{ screenshotId: s.id }}
                label="Generate description"
                compact
                onAccept={(text) => patch(s.id, { description: text })} />
              
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="Functionalities">
                    <ListEditor
                  items={s.functionalities}
                  onChange={(functionalities) => patch(s.id, { functionalities })}
                  placeholder="User management"
                  emptyLabel="None listed — the AI description will stay general without these." />
                
                  </Field>
                  <Field label="Notes" htmlFor={`sn-${s.id}`} hint="Optional. Printed under the figure.">
                    <Textarea id={`sn-${s.id}`} rows={3} value={s.notes} onChange={(e) => patch(s.id, { notes: e.target.value })} />
                  </Field>
                </div>
              </div>
            </li>
        )}
        </ul>
      }
    </div>);

}
import React, { useState } from 'react';
import { BoxesIcon, ChevronDownIcon, GripVerticalIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import type { StepProps } from '../types';
import type { ProjectModule } from '../../../types/project';
import { Panel } from '../../ui/Panel';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Field } from '../../ui/Field';
import { Textarea } from '../../ui/Textarea';
import { ListEditor } from '../../ui/ListEditor';
import { EmptyState } from '../../ui/EmptyState';
import { AIAssist } from '../AIAssist';
import { USER_ROLES } from '../../../data/catalogs';
import { pad, uid } from '../../../utils/cn';

export function ModulesStep({ project, update }: StepProps) {
  const [openId, setOpenId] = useState<string | null>(project.modules[0]?.id ?? null);
  const [dragId, setDragId] = useState<string | null>(null);

  const setModules = (next: ProjectModule[]) => update((p) => ({ ...p, modules: next }));
  const patch = (id: string, values: Partial<ProjectModule>) =>
  setModules(project.modules.map((m) => m.id === id ? { ...m, ...values } : m));

  const addModule = () => {
    const mod: ProjectModule = {
      id: uid('mod'),
      moduleId: `MOD-${pad(project.modules.length + 1)}`,
      name: '',
      description: '',
      purpose: '',
      roles: [],
      functions: [],
      inputs: [],
      outputs: [],
      dependencies: []
    };
    setModules([...project.modules, mod]);
    setOpenId(mod.id);
  };

  const reorder = (targetId: string) => {
    if (!dragId || dragId === targetId) return;
    const list = [...project.modules];
    const from = list.findIndex((m) => m.id === dragId);
    const to = list.findIndex((m) => m.id === targetId);
    if (from < 0 || to < 0) return;
    const [moved] = list.splice(from, 1);
    list.splice(to, 0, moved);
    setModules(list);
  };

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-ink">Module builder</h2>
          <p className="text-[13.5px] text-ink2 mt-1">
            Modules become Chapter 5. Drag to reorder — the order here is the order in the report.
          </p>
        </div>
        <Button variant="primary" icon={<PlusIcon className="w-4 h-4" />} onClick={addModule}>
          Add module
        </Button>
      </header>

      {project.modules.length === 0 ?
      <EmptyState
        icon={<BoxesIcon className="w-5 h-5" />}
        title="No modules yet"
        description="Break the system into modules such as Authentication, Dashboard or Reports."
        action={<Button variant="primary" onClick={addModule}>Add the first module</Button>} /> :


      <ul className="flex flex-col gap-3">
          {project.modules.map((m, i) => {
          const open = openId === m.id;
          return (
            <li
              key={m.id}
              draggable
              onDragStart={() => setDragId(m.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                reorder(m.id);
                setDragId(null);
              }}
              className="rounded-xl border border-line bg-surface shadow-card">
              
                <div className="flex items-center gap-2 px-3.5 py-3">
                  <span className="text-ink3 cursor-grab active:cursor-grabbing" aria-hidden>
                    <GripVerticalIcon className="w-4 h-4" />
                  </span>
                  <Input
                  className="w-[104px] shrink-0"
                  value={m.moduleId}
                  aria-label={`Module ${i + 1} ID`}
                  onChange={(e) => patch(m.id, { moduleId: e.target.value })} />
                
                  <Input
                  value={m.name}
                  placeholder="Module name"
                  aria-label={`Module ${i + 1} name`}
                  onChange={(e) => patch(m.id, { name: e.target.value })} />
                
                  <Button
                  size="sm"
                  variant="ghost"
                  aria-expanded={open}
                  aria-label={open ? 'Collapse module' : 'Expand module'}
                  icon={<ChevronDownIcon className={`w-4 h-4 transition-transform duration-150 ease-out ${open ? 'rotate-180' : ''}`} />}
                  onClick={() => setOpenId(open ? null : m.id)} />
                
                  <Button
                  size="sm"
                  variant="ghost"
                  aria-label={`Delete module ${m.name || i + 1}`}
                  icon={<Trash2Icon className="w-3.5 h-3.5" />}
                  onClick={() => setModules(project.modules.filter((x) => x.id !== m.id))} />
                
                </div>

                {open &&
              <div className="px-3.5 pb-4 pt-1 border-t border-line2 grid lg:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-3">
                      <Field label="Purpose" htmlFor={`purpose-${m.id}`}>
                        <Input
                      id={`purpose-${m.id}`}
                      value={m.purpose}
                      placeholder="Manage users and their account information"
                      onChange={(e) => patch(m.id, { purpose: e.target.value })} />
                    
                      </Field>
                      <Field label="Description" htmlFor={`desc-${m.id}`}>
                        <Textarea
                      id={`desc-${m.id}`}
                      rows={4}
                      value={m.description}
                      placeholder="What this module does and how it fits into the system."
                      onChange={(e) => patch(m.id, { description: e.target.value })} />
                    
                      </Field>
                      <AIAssist
                    task="moduleDescription"
                    project={project}
                    current={m.description}
                    args={{ moduleId: m.id }}
                    label="Generate module description"
                    onAccept={(text) => patch(m.id, { description: text })} />
                  
                      <Field label="User roles">
                        <div className="flex flex-wrap gap-1.5">
                          {USER_ROLES.map((role) => {
                        const active = m.roles.includes(role);
                        return (
                          <button
                            key={role}
                            onClick={() => patch(m.id, { roles: active ? m.roles.filter((r) => r !== role) : [...m.roles, role] })}
                            aria-pressed={active}
                            className={`h-7 px-2.5 rounded-md border text-[12.5px] transition-colors duration-150 ease-out ${
                            active ? 'border-brand bg-brandSoft text-brandInk font-medium' : 'border-line text-ink2 hover:border-ink3/60'}`
                            }>
                            
                                {role}
                              </button>);

                      })}
                        </div>
                      </Field>
                    </div>

                    <div className="flex flex-col gap-3">
                      <Field label="Functions">
                        <ListEditor
                      items={m.functions}
                      onChange={(functions) => patch(m.id, { functions })}
                      placeholder="Create User"
                      emptyLabel="No functions listed yet." />
                    
                      </Field>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <Field label="Inputs">
                          <ListEditor items={m.inputs} onChange={(inputs) => patch(m.id, { inputs })} placeholder="Email address" />
                        </Field>
                        <Field label="Outputs">
                          <ListEditor items={m.outputs} onChange={(outputs) => patch(m.id, { outputs })} placeholder="User record" />
                        </Field>
                      </div>
                      <Field label="Dependencies">
                        <ListEditor
                      items={m.dependencies}
                      onChange={(dependencies) => patch(m.id, { dependencies })}
                      placeholder="Authentication Module"
                      suggestions={project.modules.filter((x) => x.id !== m.id && x.name).map((x) => x.name)} />
                    
                      </Field>
                    </div>
                  </div>
              }
              </li>);

        })}
        </ul>
      }

      <Panel title="Module summary" description="This table is generated into Section 5.1 of the report.">
        {project.modules.length === 0 ?
        <p className="text-[13px] text-ink3">Add modules to see the generated overview table.</p> :

        <div className="overflow-x-auto scroll-thin">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="text-left text-ink3 border-b border-line2">
                  <th className="py-2 pr-3 font-medium">ID</th>
                  <th className="py-2 pr-3 font-medium">Module</th>
                  <th className="py-2 pr-3 font-medium">Purpose</th>
                  <th className="py-2 font-medium">Roles</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line2">
                {project.modules.map((m) =>
              <tr key={m.id}>
                    <td className="py-2 pr-3 text-ink2 whitespace-nowrap">{m.moduleId}</td>
                    <td className="py-2 pr-3 text-ink">{m.name || '—'}</td>
                    <td className="py-2 pr-3 text-ink2">{m.purpose || m.description || '—'}</td>
                    <td className="py-2 text-ink2">{m.roles.join(', ') || '—'}</td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>
        }
      </Panel>
    </div>);

}
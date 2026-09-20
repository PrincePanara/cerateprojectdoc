import React, { useState } from 'react';
import type { StepProps } from '../types';
import { Panel } from '../../ui/Panel';
import { Textarea } from '../../ui/Textarea';
import { ListEditor } from '../../ui/ListEditor';
import { AIAssist } from '../AIAssist';
import { USER_ROLES } from '../../../data/catalogs';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { cn } from '../../../utils/cn';

export function ObjectivesStep({ project, update }: StepProps) {
  const o = project.objectives;
  const [customRole, setCustomRole] = useState('');

  const set = <K extends keyof typeof o,>(key: K, value: (typeof o)[K]) =>
  update((p) => ({ ...p, objectives: { ...p.objectives, [key]: value } }));

  const toggleRole = (role: string) =>
  set('targetUsers', o.targetUsers.includes(role) ? o.targetUsers.filter((r) => r !== role) : [...o.targetUsers, role]);

  return (
    <div className="flex flex-col gap-5">
      <header>
        <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-ink">Objectives & scope</h2>
        <p className="text-[13.5px] text-ink2 mt-1">
          This content fills Sections 1.3 to 1.7 and feeds the abstract, advantages and conclusion.
        </p>
      </header>

      <Panel title="Problem statement" description="What is wrong with the current way of doing this?">
        <Textarea
          rows={6}
          value={o.problemStatement}
          aria-label="Problem statement"
          placeholder="Describe the existing process and where it breaks down."
          onChange={(e) => set('problemStatement', e.target.value)} />
        
        <div className="mt-2.5">
          <AIAssist
            task="problemStatement"
            project={project}
            current={o.problemStatement}
            label="Polish with AI"
            actions={['improve', 'expand', 'professional', 'grammar']}
            onAccept={(text) => set('problemStatement', text)} />
          
        </div>
      </Panel>

      <Panel title="Project motivation" description="Why is solving it worth the effort?">
        <Textarea
          rows={5}
          value={o.motivation}
          aria-label="Project motivation"
          placeholder="Explain what motivated this project."
          onChange={(e) => set('motivation', e.target.value)} />
        
        <div className="mt-2.5">
          <AIAssist
            task="motivation"
            project={project}
            current={o.motivation}
            label="Polish with AI"
            actions={['improve', 'expand', 'professional', 'grammar']}
            onAccept={(text) => set('motivation', text)} />
          
        </div>
      </Panel>

      <Panel title="Objectives" description="Each objective becomes a bullet in Section 1.5.">
        <ListEditor
          items={o.objectives}
          onChange={(items) => set('objectives', items)}
          placeholder="Reduce human errors during evaluation"
          emptyLabel="No objectives added yet."
          suggestions={[
          'Improve manual processes',
          'Reduce human errors',
          'Provide centralized data management',
          'Improve system efficiency']
          } />
        
      </Panel>

      <Panel title="Project scope" description="State clearly what is included and what is not.">
        <Textarea
          rows={5}
          value={o.scope}
          aria-label="Project scope"
          placeholder="The system covers … The following are outside the scope of this version …"
          onChange={(e) => set('scope', e.target.value)} />
        
        <div className="mt-2.5">
          <AIAssist
            task="scope"
            project={project}
            current={o.scope}
            label="Polish with AI"
            actions={['improve', 'expand', 'professional', 'grammar']}
            onAccept={(text) => set('scope', text)} />
          
        </div>
      </Panel>

      <Panel title="Target users" description="The roles the system is built for.">
        <div className="flex flex-wrap gap-1.5">
          {USER_ROLES.map((role) => {
            const active = o.targetUsers.includes(role);
            return (
              <button
                key={role}
                onClick={() => toggleRole(role)}
                aria-pressed={active}
                className={cn(
                  'h-8 px-3 rounded-lg border text-[13px] transition-colors duration-150 ease-out',
                  active ? 'border-brand bg-brandSoft text-brandInk font-medium' : 'border-line text-ink2 hover:border-ink3/60'
                )}>
                
                {role}
              </button>);

          })}
        </div>
        {o.targetUsers.filter((r) => !USER_ROLES.includes(r)).length > 0 &&
        <div className="flex flex-wrap gap-1.5 mt-2">
            {o.targetUsers.
          filter((r) => !USER_ROLES.includes(r)).
          map((r) =>
          <button
            key={r}
            onClick={() => toggleRole(r)}
            className="h-8 px-3 rounded-lg border border-brand bg-brandSoft text-brandInk text-[13px] font-medium">
            
                  {r} ×
                </button>
          )}
          </div>
        }
        <div className="flex gap-2 mt-3 max-w-sm">
          <Input
            value={customRole}
            placeholder="Custom role"
            aria-label="Custom role"
            onChange={(e) => setCustomRole(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && customRole.trim()) {
                toggleRole(customRole.trim());
                setCustomRole('');
              }
            }} />
          
          <Button
            onClick={() => {
              if (customRole.trim()) {
                toggleRole(customRole.trim());
                setCustomRole('');
              }
            }}>
            
            Add role
          </Button>
        </div>
      </Panel>
    </div>);

}
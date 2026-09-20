import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Field } from '../ui/Field';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { PROJECT_TYPES, TEMPLATES } from '../../data/catalogs';
import { useProjects } from '../../contexts/ProjectsContext';
import { cn } from '../../utils/cn';
import type { TemplateId } from '../../types/project';

export function NewProjectModal({ open, onClose }: {open: boolean;onClose: () => void;}) {
  const { createProject } = useProjects();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [type, setType] = useState(PROJECT_TYPES[7]);
  const [template, setTemplate] = useState<TemplateId>('academic-classic');
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    if (name.trim().length < 3) {
      setError('Give the project a name of at least 3 characters.');
      return;
    }
    const project = createProject(name.trim(), type, template);
    onClose();
    setName('');
    navigate(`/project/${project.id}/basic`);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create a new project"
      description="You can change every one of these later."
      footer={
      <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={submit}>
            Create project
          </Button>
        </>
      }>
      
      <div className="flex flex-col gap-4">
        <Field label="Project name" htmlFor="project-name" required error={error ?? undefined}>
          <Input
            id="project-name"
            value={name}
            autoFocus
            placeholder="Hostel Management System"
            onChange={(e) => {
              setName(e.target.value);
              setError(null);
            }}
            onKeyDown={(e) => e.key === 'Enter' && submit()} />
          
        </Field>
        <Field label="Project type" htmlFor="project-type">
          <Select id="project-type" options={PROJECT_TYPES} value={type} onChange={(e) => setType(e.target.value)} />
        </Field>
        <Field label="Report template">
          <div className="grid sm:grid-cols-2 gap-2">
            {TEMPLATES.map((t) =>
            <button
              key={t.id}
              type="button"
              onClick={() => setTemplate(t.id)}
              aria-pressed={template === t.id}
              className={cn(
                'text-left rounded-lg border p-3 transition-colors duration-150 ease-out',
                template === t.id ? 'border-brand bg-brandSoft' : 'border-line hover:border-ink3/60'
              )}>
              
                <span className="block text-[13px] font-medium text-ink">{t.name}</span>
                <span className="block text-[12px] text-ink2 mt-0.5 leading-relaxed">{t.description}</span>
              </button>
            )}
          </div>
        </Field>
      </div>
    </Modal>);

}
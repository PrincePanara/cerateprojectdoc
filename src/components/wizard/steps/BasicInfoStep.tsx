import React from 'react';
import { PlusIcon, Trash2Icon } from 'lucide-react';
import type { StepProps } from '../types';
import { Panel } from '../../ui/Panel';
import { Field } from '../../ui/Field';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import { Button } from '../../ui/Button';
import { UploadZone } from '../../ui/UploadZone';
import { PROJECT_TYPES } from '../../../data/catalogs';
import { uid } from '../../../utils/cn';

export function BasicInfoStep({ project, update }: StepProps) {
  const b = project.basicInfo;
  const set = <K extends keyof typeof b,>(key: K, value: (typeof b)[K]) =>
  update((p) => ({ ...p, basicInfo: { ...p.basicInfo, [key]: value } }));

  return (
    <div className="flex flex-col gap-5">
      <header>
        <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-ink">Basic project information</h2>
        <p className="text-[13.5px] text-ink2 mt-1">
          These details appear on the cover page, certificate and declaration of the report.
        </p>
      </header>

      <Panel title="Project">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Project name" htmlFor="b-name" required className="sm:col-span-2">
            <Input id="b-name" value={b.projectName} onChange={(e) => set('projectName', e.target.value)} placeholder="Hostel Management System" />
          </Field>
          <Field label="Project subtitle" htmlFor="b-sub" className="sm:col-span-2" hint="A single line describing what the system does.">
            <Input id="b-sub" value={b.subtitle} onChange={(e) => set('subtitle', e.target.value)} placeholder="An online hostel room allocation and fee management platform" />
          </Field>
          <Field label="Project type" htmlFor="b-type">
            <Select id="b-type" options={PROJECT_TYPES} value={b.projectType} onChange={(e) => set('projectType', e.target.value)} />
          </Field>
          <Field label="Project duration" htmlFor="b-duration">
            <Input id="b-duration" value={b.duration} onChange={(e) => set('duration', e.target.value)} placeholder="6 Months (Jan 2026 – Jun 2026)" />
          </Field>
          <Field label="Project version" htmlFor="b-version">
            <Input id="b-version" value={b.version} onChange={(e) => set('version', e.target.value)} placeholder="1.0" />
          </Field>
        </div>
      </Panel>

      <Panel title="Student & institution">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Student name" htmlFor="b-student" required>
            <Input id="b-student" value={b.studentName} onChange={(e) => set('studentName', e.target.value)} />
          </Field>
          <Field label="Guide name" htmlFor="b-guide" required>
            <Input id="b-guide" value={b.guideName} onChange={(e) => set('guideName', e.target.value)} placeholder="Prof. R. K. Sharma" />
          </Field>
          <Field label="Enrollment number" htmlFor="b-enroll">
            <Input id="b-enroll" value={b.enrollmentNumber} onChange={(e) => set('enrollmentNumber', e.target.value)} />
          </Field>
          <Field label="Roll number" htmlFor="b-roll">
            <Input id="b-roll" value={b.rollNumber} onChange={(e) => set('rollNumber', e.target.value)} />
          </Field>
          <Field label="College name" htmlFor="b-college" required>
            <Input id="b-college" value={b.collegeName} onChange={(e) => set('collegeName', e.target.value)} />
          </Field>
          <Field label="University name" htmlFor="b-univ">
            <Input id="b-univ" value={b.universityName} onChange={(e) => set('universityName', e.target.value)} />
          </Field>
          <Field label="Department" htmlFor="b-dept" required>
            <Input id="b-dept" value={b.department} onChange={(e) => set('department', e.target.value)} placeholder="Computer Engineering" />
          </Field>
          <Field label="Semester" htmlFor="b-sem">
            <Input id="b-sem" value={b.semester} onChange={(e) => set('semester', e.target.value)} placeholder="8th Semester" />
          </Field>
          <Field label="Academic year" htmlFor="b-year" required>
            <Input id="b-year" value={b.academicYear} onChange={(e) => set('academicYear', e.target.value)} placeholder="2025 - 2026" />
          </Field>
        </div>
      </Panel>

      <Panel
        title="Team members"
        description="Everyone listed here appears on the cover page."
        actions={
        <Button
          size="sm"
          icon={<PlusIcon className="w-3.5 h-3.5" />}
          onClick={() => set('teamMembers', [...b.teamMembers, { id: uid('tm'), name: '', enrollment: '' }])}>
          
            Add member
          </Button>
        }>
        
        {b.teamMembers.length === 0 ?
        <p className="text-[13px] text-ink3">
            No team members added. The student named above is used on the cover page.
          </p> :

        <ul className="flex flex-col gap-2">
            {b.teamMembers.map((m, i) =>
          <li key={m.id} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
                <Input
              value={m.name}
              aria-label={`Team member ${i + 1} name`}
              placeholder="Full name"
              onChange={(e) =>
              set('teamMembers', b.teamMembers.map((x) => x.id === m.id ? { ...x, name: e.target.value } : x))
              } />
            
                <Input
              value={m.enrollment}
              aria-label={`Team member ${i + 1} enrollment number`}
              placeholder="Enrollment number"
              onChange={(e) =>
              set('teamMembers', b.teamMembers.map((x) => x.id === m.id ? { ...x, enrollment: e.target.value } : x))
              } />
            
                <Button
              size="sm"
              variant="ghost"
              aria-label={`Remove team member ${i + 1}`}
              icon={<Trash2Icon className="w-3.5 h-3.5" />}
              onClick={() => set('teamMembers', b.teamMembers.filter((x) => x.id !== m.id))} />
            
              </li>
          )}
          </ul>
        }
      </Panel>

      <Panel title="College logo" description="Placed at the top of the cover page. Optional.">
        {b.collegeLogo ?
        <div className="flex items-center gap-4">
            <img src={b.collegeLogo} alt="College logo preview" className="w-16 h-16 object-contain rounded-lg border border-line bg-white p-1.5" />
            <Button size="sm" variant="danger" icon={<Trash2Icon className="w-3.5 h-3.5" />} onClick={() => set('collegeLogo', null)}>
              Remove logo
            </Button>
          </div> :

        <UploadZone
          compact
          multiple={false}
          label="Upload the college logo"
          hint="PNG or JPG with a transparent or white background works best"
          onFiles={(files) => files[0] && set('collegeLogo', files[0].dataUrl)} />

        }
      </Panel>
    </div>);

}
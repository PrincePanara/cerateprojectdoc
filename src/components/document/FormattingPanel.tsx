import React from 'react';
import type { Formatting, Project } from '../../types/project';
import { Field } from '../ui/Field';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { TEMPLATES } from '../../data/catalogs';
import { cn } from '../../utils/cn';

export function FormattingPanel({
  project,
  onChange



}: {project: Project;onChange: (values: Partial<Formatting>) => void;}) {
  const f = project.formatting;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-[11px] font-semibold tracking-[0.08em] text-ink3 mb-2">TEMPLATE</p>
        <div className="grid grid-cols-2 gap-1.5">
          {TEMPLATES.map((t) =>
          <button
            key={t.id}
            onClick={() => onChange({ template: t.id, font: t.font })}
            aria-pressed={f.template === t.id}
            className={cn(
              'text-left rounded-lg border px-2.5 py-2 text-[12px] transition-colors duration-150 ease-out',
              f.template === t.id ? 'border-brand bg-brandSoft text-brandInk font-medium' : 'border-line text-ink2 hover:border-ink3/60'
            )}>
            
              {t.name}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Page" htmlFor="f-page">
          <Select id="f-page" options={['A4', 'Letter']} value={f.pageSize} onChange={(e) => onChange({ pageSize: e.target.value as Formatting['pageSize'] })} />
        </Field>
        <Field label="Margins" htmlFor="f-margin">
          <Select id="f-margin" options={['Normal', 'Narrow', 'Wide']} value={f.margins} onChange={(e) => onChange({ margins: e.target.value as Formatting['margins'] })} />
        </Field>
        <Field label="Font" htmlFor="f-font" className="col-span-2">
          <Select
            id="f-font"
            options={['Times New Roman', 'Arial', 'Calibri', 'Georgia']}
            value={f.font}
            onChange={(e) => onChange({ font: e.target.value as Formatting['font'] })} />
          
        </Field>
        <Field label="Body size" htmlFor="f-body">
          <Select id="f-body" options={['10', '11', '12', '13', '14']} value={String(f.bodySize)} onChange={(e) => onChange({ bodySize: Number(e.target.value) })} />
        </Field>
        <Field label="Line spacing" htmlFor="f-line">
          <Select
            id="f-line"
            options={['1', '1.15', '1.5', '2']}
            value={String(f.lineSpacing)}
            onChange={(e) => onChange({ lineSpacing: Number(e.target.value) as Formatting['lineSpacing'] })} />
          
        </Field>
        <Field label="Heading 1" htmlFor="f-h1">
          <Select id="f-h1" options={['14', '15', '16', '18', '20']} value={String(f.h1Size)} onChange={(e) => onChange({ h1Size: Number(e.target.value) })} />
        </Field>
        <Field label="Heading 2" htmlFor="f-h2">
          <Select id="f-h2" options={['12', '13', '14', '16']} value={String(f.h2Size)} onChange={(e) => onChange({ h2Size: Number(e.target.value) })} />
        </Field>
        <Field label="Heading 3" htmlFor="f-h3">
          <Select id="f-h3" options={['11', '12', '13', '14']} value={String(f.h3Size)} onChange={(e) => onChange({ h3Size: Number(e.target.value) })} />
        </Field>
        <Field label="Alignment" htmlFor="f-align">
          <Select
            id="f-align"
            options={[
            { value: 'left', label: 'Left' },
            { value: 'center', label: 'Center' },
            { value: 'justify', label: 'Justify' }]
            }
            value={f.alignment}
            onChange={(e) => onChange({ alignment: e.target.value as Formatting['alignment'] })} />
          
        </Field>
        <Field label="Page numbers" htmlFor="f-nums" className="col-span-2">
          <Select
            id="f-nums"
            options={['Bottom Center', 'Bottom Right', 'Top Right', 'None']}
            value={f.pageNumbers}
            onChange={(e) => onChange({ pageNumbers: e.target.value as Formatting['pageNumbers'] })} />
          
        </Field>
        <Field label="Header text" htmlFor="f-header" className="col-span-2">
          <Input id="f-header" value={f.headerText} placeholder="Project name" onChange={(e) => onChange({ headerText: e.target.value })} />
        </Field>
        <Field label="Footer text" htmlFor="f-footer" className="col-span-2">
          <Input id="f-footer" value={f.footerText} placeholder="University name" onChange={(e) => onChange({ footerText: e.target.value })} />
        </Field>
      </div>
    </div>);

}
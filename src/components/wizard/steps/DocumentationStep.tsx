import React from 'react';
import type { StepProps } from '../types';
import type { AITaskId } from '../../../utils/ai';
import { Panel } from '../../ui/Panel';
import { Textarea } from '../../ui/Textarea';
import { AIAssist } from '../AIAssist';
import { ReadinessPanel } from '../ReadinessPanel';

interface Entry {
  key: string;
  title: string;
  section: string;
  task: AITaskId;
  hint: string;
  rows?: number;
}

const GROUPS: {group: string;entries: Entry[];}[] = [
{
  group: 'Front matter',
  entries: [
  { key: 'abstract', title: 'Abstract', section: 'Front matter', task: 'abstract', hint: 'Summarises the whole project in one paragraph. Generated from your modules, technologies and objectives.', rows: 6 },
  { key: 'acknowledgement', title: 'Acknowledgement', section: 'Front matter', task: 'acknowledgement', hint: 'Thanks your guide, department and institution.', rows: 4 }]

},
{
  group: 'Chapter 1 — Introduction',
  entries: [
  { key: 'ch1.overview', title: 'Project Overview', section: '1.1', task: 'introduction', hint: 'What the system is and who uses it.' },
  { key: 'ch1.background', title: 'Background', section: '1.2', task: 'background', hint: 'The context the project was undertaken in. Needs a problem statement.' }]

},
{
  group: 'Chapter 2 — System Analysis',
  entries: [
  { key: 'ch2.existing', title: 'Existing System', section: '2.1', task: 'existingSystem', hint: 'How the task is done today.' },
  { key: 'ch2.problems', title: 'Problems in Existing System', section: '2.2', task: 'problemsExisting', hint: 'Why the existing approach falls short.' },
  { key: 'ch2.proposed', title: 'Proposed System', section: '2.3', task: 'proposedSystem', hint: 'What your system does instead. Needs modules.' },
  { key: 'ch2.advantages', title: 'Advantages', section: '2.4', task: 'advantages', hint: 'Generated from your objectives.' },
  { key: 'ch2.limitations', title: 'Limitations', section: '2.5', task: 'limitations', hint: 'Generated from your scope statement.' }]

},
{
  group: 'Chapter 9 — Results',
  entries: [
  { key: 'ch9.results', title: 'Project Results', section: '9.1', task: 'results', hint: 'What was actually delivered.' },
  { key: 'ch9.performance', title: 'Performance', section: '9.2', task: 'performance', hint: 'Needs a performance non-functional requirement.' },
  { key: 'ch9.achievements', title: 'Achievements', section: '9.3', task: 'achievements', hint: 'Generated from your modules and objectives.' }]

},
{
  group: 'Chapter 10 — Conclusion',
  entries: [
  { key: 'ch10.conclusion', title: 'Conclusion', section: '10.1', task: 'conclusion', hint: 'Closes the report against the objectives.', rows: 5 },
  { key: 'ch10.future', title: 'Future Scope', section: '10.2', task: 'futureScope', hint: 'Work left for a future version.' }]

}];


export function DocumentationStep({ project, update, goTo }: StepProps) {
  const setContent = (key: string, value: string) => update((p) => ({ ...p, content: { ...p.content, [key]: value } }));

  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_300px] gap-5 items-start">
      <div className="flex flex-col gap-5">
        <header>
          <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-ink">Documentation content</h2>
          <p className="text-[13.5px] text-ink2 mt-1">
            The written sections of the report. Everything else — requirements, modules, figures, tables — is generated
            from the data you already entered.
          </p>
        </header>

        {GROUPS.map((group) =>
        <Panel key={group.group} title={group.group}>
            <div className="flex flex-col gap-5">
              {group.entries.map((entry) =>
            <div key={entry.key}>
                  <div className="flex items-baseline justify-between gap-3 mb-1.5">
                    <label htmlFor={`c-${entry.key}`} className="text-[13px] font-medium text-ink">
                      {entry.section !== 'Front matter' && <span className="text-ink3 mr-1.5">{entry.section}</span>}
                      {entry.title}
                    </label>
                    <span className="text-[11.5px] text-ink3">
                      {(project.content[entry.key] ?? '').trim() ? `${(project.content[entry.key] ?? '').split(/\s+/).length} words` : 'Empty'}
                    </span>
                  </div>
                  <Textarea
                id={`c-${entry.key}`}
                rows={entry.rows ?? 4}
                value={project.content[entry.key] ?? ''}
                placeholder={entry.hint}
                onChange={(e) => setContent(entry.key, e.target.value)} />
              
                  <div className="mt-2">
                    <AIAssist
                  task={entry.task}
                  project={project}
                  current={project.content[entry.key] ?? ''}
                  label="Generate"
                  onAccept={(text) => setContent(entry.key, text)} />
                
                  </div>
                </div>
            )}
            </div>
          </Panel>
        )}

        <Panel title="References" description="One reference per line. Written into the References section as a numbered list.">
          <Textarea
            rows={5}
            value={project.content.references ?? ''}
            aria-label="References"
            placeholder={'React Documentation, https://react.dev\nFirebase Documentation, https://firebase.google.com/docs'}
            onChange={(e) => setContent('references', e.target.value)} />
          
        </Panel>

        <Panel title="Appendix" description="Optional supporting material printed at the end of the report.">
          <Textarea
            rows={4}
            value={project.content.appendix ?? ''}
            aria-label="Appendix"
            placeholder="Sample data, source code listings, survey forms…"
            onChange={(e) => setContent('appendix', e.target.value)} />
          
        </Panel>
      </div>

      <div className="lg:sticky lg:top-[120px]">
        <ReadinessPanel project={project} goTo={goTo} />
      </div>
    </div>);

}
import React, { useState } from 'react';
import { FlaskConicalIcon, PlusIcon, SparklesIcon, Trash2Icon } from 'lucide-react';
import type { StepProps } from '../types';
import type { TestCase, TestStatus } from '../../../types/project';
import { Panel } from '../../ui/Panel';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import { Textarea } from '../../ui/Textarea';
import { EmptyState } from '../../ui/EmptyState';
import { Badge } from '../../ui/Badge';
import { AIAssist } from '../AIAssist';
import { generateTestCases } from '../../../utils/ai';
import { pad, uid } from '../../../utils/cn';
import { useToast } from '../../ui/ToastProvider';

const STATUSES: TestStatus[] = ['Pass', 'Fail', 'Blocked', 'Not Run'];

export function TestingStep({ project, update }: StepProps) {
  const [generating, setGenerating] = useState(false);
  const { push } = useToast();
  const cases = project.testing.cases;

  const setCases = (next: TestCase[]) => update((p) => ({ ...p, testing: { ...p.testing, cases: next } }));
  const patch = (id: string, values: Partial<TestCase>) => setCases(cases.map((c) => c.id === id ? { ...c, ...values } : c));

  const addCase = () =>
  setCases([
  ...cases,
  { id: uid('tc'), testId: `TC-${pad(cases.length + 1)}`, module: '', scenario: '', input: '', expected: '', actual: '', status: 'Not Run', remarks: '' }]
  );

  const generate = async () => {
    if (project.modules.length === 0 && project.requirements.functional.length === 0) {
      push({ tone: 'info', title: 'Information required', description: 'Add modules or functional requirements first — test cases are derived from them.' });
      return;
    }
    setGenerating(true);
    const generated = await generateTestCases(project);
    setCases([
    ...cases,
    ...generated.map((g) => ({ id: uid('tc'), ...g, actual: '', status: 'Not Run' as TestStatus, remarks: '' }))]
    );
    setGenerating(false);
    push({ tone: 'success', title: `${generated.length} test cases added`, description: 'Review each one and record the actual result.' });
  };

  const passed = cases.filter((c) => c.status === 'Pass').length;

  return (
    <div className="flex flex-col gap-5">
      <header>
        <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-ink">Testing</h2>
        <p className="text-[13.5px] text-ink2 mt-1">
          The strategy fills Section 8.1 and the cases below become the test case table in Section 8.2.
        </p>
      </header>

      <Panel title="Testing strategy">
        <Textarea
          rows={4}
          value={project.testing.strategy}
          aria-label="Testing strategy"
          placeholder="Describe how the system was tested — unit, module, integration, user acceptance."
          onChange={(e) => update((p) => ({ ...p, testing: { ...p.testing, strategy: e.target.value } }))} />
        
        <div className="mt-2.5">
          <AIAssist
            task="testStrategy"
            project={project}
            current={project.testing.strategy}
            label="Generate strategy"
            onAccept={(text) => update((p) => ({ ...p, testing: { ...p.testing, strategy: text } }))} />
          
        </div>
      </Panel>

      <Panel
        title="Test cases"
        description={cases.length ? `${cases.length} cases · ${passed} passing` : 'Derived from your modules and functional requirements.'}
        actions={
        <>
            <Button size="sm" variant="subtle" loading={generating} icon={<SparklesIcon className="w-3.5 h-3.5" />} onClick={generate}>
              Generate test cases
            </Button>
            <Button size="sm" icon={<PlusIcon className="w-3.5 h-3.5" />} onClick={addCase}>
              Add case
            </Button>
          </>
        }>
        
        {cases.length === 0 ?
        <EmptyState
          icon={<FlaskConicalIcon className="w-5 h-5" />}
          title="No test cases yet"
          description="Generate a starting set from your modules and requirements, then record the actual results."
          action={
          <Button variant="primary" loading={generating} onClick={generate}>
                Generate test cases
              </Button>
          } /> :


        <ul className="flex flex-col gap-3">
            {cases.map((c, i) =>
          <li key={c.id} className="rounded-lg border border-line p-3">
                <div className="grid sm:grid-cols-[96px_1fr_160px_auto] gap-2 items-center">
                  <Input value={c.testId} aria-label={`Test ${i + 1} ID`} onChange={(e) => patch(c.id, { testId: e.target.value })} />
                  <Input value={c.scenario} placeholder="Test scenario" aria-label={`Test ${i + 1} scenario`} onChange={(e) => patch(c.id, { scenario: e.target.value })} />
                  <Select
                options={['—', ...project.modules.map((m) => m.name)]}
                value={c.module || '—'}
                aria-label={`Test ${i + 1} module`}
                onChange={(e) => patch(c.id, { module: e.target.value === '—' ? '' : e.target.value })} />
              
                  <Button
                size="sm"
                variant="ghost"
                aria-label={`Delete test case ${c.testId}`}
                icon={<Trash2Icon className="w-3.5 h-3.5" />}
                onClick={() => setCases(cases.filter((x) => x.id !== c.id))} />
              
                </div>
                <div className="grid sm:grid-cols-4 gap-2 mt-2">
                  <Input value={c.input} placeholder="Input" aria-label={`Test ${i + 1} input`} onChange={(e) => patch(c.id, { input: e.target.value })} />
                  <Input value={c.expected} placeholder="Expected result" aria-label={`Test ${i + 1} expected result`} onChange={(e) => patch(c.id, { expected: e.target.value })} />
                  <Input value={c.actual} placeholder="Actual result" aria-label={`Test ${i + 1} actual result`} onChange={(e) => patch(c.id, { actual: e.target.value })} />
                  <div className="flex items-center gap-2">
                    <Select
                  options={STATUSES}
                  value={c.status}
                  aria-label={`Test ${i + 1} status`}
                  onChange={(e) => patch(c.id, { status: e.target.value as TestStatus })} />
                
                    <Badge tone={c.status === 'Pass' ? 'ok' : c.status === 'Fail' ? 'bad' : c.status === 'Blocked' ? 'warn' : 'neutral'}>
                      {c.status}
                    </Badge>
                  </div>
                </div>
                <Input
              className="mt-2"
              value={c.remarks}
              placeholder="Remarks (optional)"
              aria-label={`Test ${i + 1} remarks`}
              onChange={(e) => patch(c.id, { remarks: e.target.value })} />
            
              </li>
          )}
          </ul>
        }
      </Panel>
    </div>);

}
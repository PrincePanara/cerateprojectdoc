import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2Icon, CircleAlertIcon, DownloadIcon, FileCodeIcon, FileJsonIcon, FileTextIcon, TriangleAlertIcon } from 'lucide-react';
import type { StepProps } from '../types';
import { Panel } from '../../ui/Panel';
import { Button } from '../../ui/Button';
import { ProgressBar } from '../../ui/ProgressBar';
import { Badge } from '../../ui/Badge';
import { ReadinessPanel } from '../ReadinessPanel';
import { buildDocument } from '../../../utils/documentModel';
import { getQualityIssues, getQualityScore, getReadiness } from '../../../utils/validation';
import { buildDocx, docxFileName, downloadBlob } from '../../../utils/docxBuilder';
import { toHtml, toJson, toMarkdown } from '../../../utils/otherExports';
import { useToast } from '../../ui/ToastProvider';

export function ExportStep({ project, update, goTo }: StepProps) {
  const model = useMemo(() => buildDocument(project), [project]);
  const readiness = useMemo(() => getReadiness(project), [project]);
  const issues = useMemo(() => getQualityIssues(project, model), [project, model]);
  const score = getQualityScore(issues);
  const { push } = useToast();

  const [phase, setPhase] = useState<'idle' | 'working' | 'done' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [blob, setBlob] = useState<Blob | null>(null);

  const fileName = docxFileName(project);

  const generate = async () => {
    setPhase('working');
    setProgress(4);
    setStatusText('Validating project data');
    try {
      const result = await buildDocx(project, model, (step, percent) => {
        setStatusText(step);
        setProgress(percent);
      });
      setBlob(result);
      setPhase('done');
      downloadBlob(result, fileName);
      const version = `${project.versions.length + 1}.0`;
      update((p) => ({
        ...p,
        status: 'Completed',
        lastGeneratedAt: new Date().toISOString(),
        versions: [...p.versions, { version, generatedAt: new Date().toISOString(), pages: model.estimatedPages }]
      }));
      push({ tone: 'success', title: 'Word document generated', description: fileName });
    } catch {
      setPhase('error');
      push({ tone: 'error', title: 'Document generation failed', description: 'Something went wrong while creating your Word document.' });
    }
  };

  const exportOther = (kind: 'md' | 'html' | 'json') => {
    const base = fileName.replace(/\.docx$/, '');
    if (kind === 'md') downloadBlob(toMarkdown(project, model), `${base}.md`);
    if (kind === 'html') downloadBlob(toHtml(project, model), `${base}.html`);
    if (kind === 'json') downloadBlob(toJson(project), `${base}.json`);
    push({ tone: 'success', title: `Exported as ${kind.toUpperCase()}` });
  };

  if (phase === 'done') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
        className="max-w-2xl mx-auto text-center py-10">
        
        <span className="w-12 h-12 rounded-xl bg-okSoft text-ok flex items-center justify-center mx-auto">
          <CheckCircle2Icon className="w-6 h-6" aria-hidden />
        </span>
        <h2 className="text-[26px] font-semibold tracking-[-0.02em] text-ink mt-5">Your documentation is ready</h2>
        <p className="text-[14px] text-ink2 mt-2">{project.basicInfo.projectName}</p>

        <dl className="grid grid-cols-2 sm:grid-cols-5 gap-px bg-line rounded-xl overflow-hidden border border-line mt-8 text-left">
          {[
          ['Pages', model.estimatedPages],
          ['Chapters', 10],
          ['Screenshots', project.screenshots.length],
          ['Tables', model.tables.length],
          ['Figures', model.figures.length]].
          map(([label, value]) =>
          <div key={String(label)} className="bg-surface px-4 py-3">
              <dt className="text-[12px] text-ink3">{label}</dt>
              <dd className="text-[20px] font-semibold text-ink tabular-nums">{value}</dd>
            </div>
          )}
        </dl>

        <div className="flex flex-wrap justify-center gap-2 mt-8">
          <Button
            size="lg"
            variant="primary"
            icon={<DownloadIcon className="w-4 h-4" />}
            onClick={() => blob && downloadBlob(blob, fileName)}>
            
            Download Word Document
          </Button>
          <Button size="lg" onClick={() => goTo('preview')}>
            Preview
          </Button>
          <Button size="lg" variant="ghost" onClick={() => goTo('documentation')}>
            Edit documentation
          </Button>
        </div>
        <p className="text-[12.5px] text-ink3 mt-4">{fileName}</p>

        <div className="flex justify-center gap-2 mt-8 pt-6 border-t border-line2">
          <Button size="sm" variant="ghost" icon={<FileTextIcon className="w-3.5 h-3.5" />} onClick={() => exportOther('md')}>
            Markdown
          </Button>
          <Button size="sm" variant="ghost" icon={<FileCodeIcon className="w-3.5 h-3.5" />} onClick={() => exportOther('html')}>
            HTML
          </Button>
          <Button size="sm" variant="ghost" icon={<FileJsonIcon className="w-3.5 h-3.5" />} onClick={() => exportOther('json')}>
            JSON backup
          </Button>
        </div>
      </motion.div>);

  }

  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-5 items-start">
      <div className="flex flex-col gap-5">
        <header>
          <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-ink">Generate the Word document</h2>
          <p className="text-[13.5px] text-ink2 mt-1">
            The report is written from your structured project data, not from raw AI text.
          </p>
        </header>

        <Panel title="Document quality check" description="Concrete completeness and formatting checks — not a subjective writing score.">
          <div className="flex items-center gap-4 mb-4">
            <div className="shrink-0">
              <p className="text-[28px] font-semibold text-ink tabular-nums tracking-[-0.02em] leading-none">{score}</p>
              <p className="text-[11.5px] text-ink3 mt-1">Quality score</p>
            </div>
            <div className="flex-1">
              <ProgressBar value={score} tone={score >= 85 ? 'ok' : score >= 60 ? 'brand' : 'warn'} label="Document quality" />
              <p className="text-[12.5px] text-ink3 mt-2">
                {issues.filter((i) => i.severity === 'error').length} errors ·{' '}
                {issues.filter((i) => i.severity === 'warning').length} warnings
              </p>
            </div>
          </div>

          {issues.length === 0 ?
          <p className="text-[13px] text-ok flex items-center gap-2">
              <CheckCircle2Icon className="w-4 h-4" aria-hidden /> No formatting or completeness problems found.
            </p> :

          <ul className="flex flex-col divide-y divide-line2">
              {issues.slice(0, 12).map((issue) =>
            <li key={issue.id} className="flex items-start justify-between gap-3 py-2.5">
                  <span className="flex items-start gap-2 min-w-0">
                    {issue.severity === 'error' ?
                <CircleAlertIcon className="w-4 h-4 text-bad shrink-0 mt-px" aria-hidden /> :

                <TriangleAlertIcon className="w-4 h-4 text-warn shrink-0 mt-px" aria-hidden />
                }
                    <span className="text-[13px] text-ink2">{issue.message}</span>
                  </span>
                  <Button size="sm" variant="ghost" onClick={() => goTo(issue.step)}>
                    Fix
                  </Button>
                </li>
            )}
            </ul>
          }
        </Panel>

        <Panel title="Export">
          <div className="flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              variant="primary"
              loading={phase === 'working'}
              icon={<DownloadIcon className="w-4 h-4" />}
              onClick={generate}>
              
              Generate DOCX
            </Button>
            <span className="text-[12.5px] text-ink3">{fileName}</span>
          </div>

          {phase === 'working' &&
          <div className="mt-4">
              <ProgressBar value={progress} label="Document generation progress" />
              <p className="text-[12.5px] text-ink2 mt-2">{statusText}…</p>
            </div>
          }

          {phase === 'error' &&
          <div className="mt-4 rounded-lg border border-bad/25 bg-badSoft px-3.5 py-3">
              <p className="text-[13px] font-medium text-bad">Document generation failed</p>
              <p className="text-[12.5px] text-ink2 mt-1">Something went wrong while creating your Word document.</p>
              <div className="flex gap-2 mt-2.5">
                <Button size="sm" variant="primary" onClick={generate}>
                  Try again
                </Button>
                <Button size="sm" onClick={() => goTo('documentation')}>
                  Save draft and edit
                </Button>
              </div>
            </div>
          }

          {readiness.blocking > 0 && phase === 'idle' &&
          <p className="text-[12.5px] text-warn mt-3 flex items-center gap-1.5">
              <TriangleAlertIcon className="w-3.5 h-3.5" aria-hidden />
              {readiness.blocking} required section{readiness.blocking === 1 ? '' : 's'} still incomplete. You can still
              export — missing content is marked in the document.
            </p>
          }
        </Panel>

        <Panel title="Other formats" description="The Word document stays the primary output.">
          <div className="flex flex-wrap gap-2">
            <Button icon={<FileTextIcon className="w-3.5 h-3.5" />} onClick={() => exportOther('md')}>
              Markdown
            </Button>
            <Button icon={<FileCodeIcon className="w-3.5 h-3.5" />} onClick={() => exportOther('html')}>
              HTML
            </Button>
            <Button icon={<FileJsonIcon className="w-3.5 h-3.5" />} onClick={() => exportOther('json')}>
              JSON project backup
            </Button>
          </div>
        </Panel>

        {project.versions.length > 0 &&
        <Panel title="Version history">
            <ul className="divide-y divide-line2">
              {[...project.versions].reverse().map((v) =>
            <li key={v.version} className="flex items-center justify-between py-2.5">
                  <span className="flex items-center gap-2.5">
                    <Badge tone="brand">v{v.version}</Badge>
                    <span className="text-[13px] text-ink2">{v.pages} pages</span>
                  </span>
                  <span className="text-[12.5px] text-ink3">
                    Generated {new Date(v.generatedAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </li>
            )}
            </ul>
          </Panel>
        }
      </div>

      <div className="lg:sticky lg:top-[124px]">
        <ReadinessPanel project={project} goTo={goTo} />
      </div>
    </div>);

}
import React, { useMemo, useState } from 'react';
import { PencilIcon } from 'lucide-react';
import type { StepProps } from '../types';
import type { Formatting } from '../../../types/project';
import { DocumentPreview } from '../../document/DocumentPreview';
import { FormattingPanel } from '../../document/FormattingPanel';
import { buildDocument, countMissingBlocks } from '../../../utils/documentModel';
import { Button } from '../../ui/Button';
import { cn } from '../../../utils/cn';

const STEP_FOR_KEY: {test: (key: string) => boolean;step: string;}[] = [
{ test: (k) => ['cover', 'certificate', 'declaration'].includes(k), step: 'basic' },
{ test: (k) => ['ch1.problem', 'ch1.motivation', 'ch1.objectives', 'ch1.scope', 'ch1.users'].includes(k), step: 'objectives' },
{ test: (k) => k.startsWith('ch2.fr') || k.startsWith('ch2.nfr'), step: 'requirements' },
{ test: (k) => k.startsWith('ch3.'), step: 'architecture' },
{ test: (k) => k.startsWith('ch4.'), step: 'technologies' },
{ test: (k) => k.startsWith('ch5.'), step: 'modules' },
{ test: (k) => k.startsWith('ch6.'), step: 'screenshots' },
{ test: (k) => k.startsWith('ch7.'), step: 'database' },
{ test: (k) => k.startsWith('ch8.'), step: 'testing' }];


function stepForKey(key: string) {
  return STEP_FOR_KEY.find((m) => m.test(key))?.step ?? 'documentation';
}

export function PreviewStep({ project, update, goTo }: StepProps) {
  const model = useMemo(() => buildDocument(project), [project]);
  const [active, setActive] = useState(model.nodes[0]?.key ?? '');
  const missing = countMissingBlocks(model);

  const setFormatting = (values: Partial<Formatting>) =>
  update((p) => ({ ...p, formatting: { ...p.formatting, ...values } }));

  const scrollTo = (key: string) => {
    setActive(key);
    document.getElementById(`sec-${key}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="grid xl:grid-cols-[228px_minmax(0,1fr)_288px] lg:grid-cols-[228px_minmax(0,1fr)] gap-5 items-start">
      <nav className="hidden lg:block sticky top-[124px] max-h-[calc(100vh-180px)] overflow-y-auto scroll-thin rounded-xl border border-line bg-surface p-2" aria-label="Document outline">
        <p className="text-[10.5px] font-semibold tracking-[0.08em] text-ink3 px-2 py-1.5">DOCUMENT</p>
        <ul>
          {model.nodes.map((node) =>
          <li key={node.key}>
              <button
              onClick={() => scrollTo(node.key)}
              className={cn(
                'w-full text-left px-2 py-1.5 rounded-md text-[12.5px] transition-colors duration-150 ease-out truncate',
                node.level === 2 ? 'pl-5 text-ink2' : 'text-ink font-medium',
                active === node.key ? 'bg-brandSoft text-brandInk' : 'hover:bg-surface2'
              )}>
              
                {node.number ? `${node.number} ` : ''}
                {node.title}
              </button>
            </li>
          )}
        </ul>
      </nav>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-ink">Document preview</h2>
            <p className="text-[13px] text-ink2 mt-1">
              {model.estimatedPages} pages · {model.figures.length} figures · {model.tables.length} tables
              {missing > 0 && <span className="text-warn"> · {missing} sections need information</span>}
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" icon={<PencilIcon className="w-3.5 h-3.5" />} onClick={() => goTo(stepForKey(active))}>
              Edit this section
            </Button>
            <Button size="sm" variant="primary" onClick={() => goTo('export')}>
              Generate DOCX
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-line bg-canvas p-4 sm:p-6 overflow-x-auto scroll-thin">
          <div className="origin-top scale-[0.62] sm:scale-75 lg:scale-90 xl:scale-100 w-[794px] mx-auto">
            <DocumentPreview project={project} model={model} />
          </div>
        </div>
      </div>

      <aside className="hidden xl:block sticky top-[124px] max-h-[calc(100vh-180px)] overflow-y-auto scroll-thin rounded-xl border border-line bg-surface p-4">
        <p className="text-[11px] font-semibold tracking-[0.08em] text-ink3 mb-3">FORMATTING</p>
        <FormattingPanel project={project} onChange={setFormatting} />
      </aside>
    </div>);

}